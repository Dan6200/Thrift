# Pricing Model

This document explains how product pricing works in Thrift and **why** it is
shaped this way. It exists so the decisions below are not lost.

> **Core idea:** a product is a grouping; a **variant is the purchasable SKU**.
> Price is an attribute of the variant, not the product. The final price a
> customer pays is derived from three layers: **base price → modifiers →
> time-bound overrides**.

---

## 1. The vocabulary

| Layer               | Table / column                                                                                                                               | What it means                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Base price**      | `product_variants.base_price`                                                                                                                | The default anchor price of one SKU (integer **kobo**; ₦1 = 100). This is what bulk pricing writes.                    |
| **Modifier**        | `variant_to_option_values.price_modifier` (+ `modifier_type`) and `product_option_values.default_price_modifier` (+ `default_modifier_type`) | A delta attached to an option value (e.g. “1TB costs +₦1,500”). `absolute` = kobo; `percentage` = percent of the base. |
| **Override**        | `variant_price_overrides.absolute_price` + `start_date` / `end_date`                                                                         | A **time-bound** absolute price that supersedes everything while active. Used for flash sales / clearance.             |
| **Effective price** | `product_variant_effective_price` (view)                                                                                                     | The single computed price: `override ?? base_price + Σ absolute modifiers`.                                            |

Money is always stored as an **integer in the minor unit** (kobo for NGN).
Never store floats/naira.

---

## 2. Why the base price lives on the **variant**, not the product

The product-level price is a **display aggregate** (`MIN(variant prices)`,
i.e. “from ₦X”), not the source of truth.

1. **The variant is what is bought.** Orders and carts reference
   `variant_id`; `order_items.price_at_purchase` snapshots that variant's
   price. Putting the price on the product would make the priced entity
   different from the ordered entity.
2. **Variants genuinely cost different amounts.** Storage, RAM, size and
   material change the cost. A single product price cannot represent that.
3. **Per-variant sales are normal.** You often discount one configuration and
   leave the others at full price. Overrides are keyed by `variant_id`.
4. **Commercial attributes stay together.** `product_variants` already holds
   `sku` and `quantity_available`; `base_price` belongs with them.

Consequence: a product with no variants has no price — which is correct,
because it cannot be bought.

---

## 3. Bulk pricing is a **frontend UX feature**, not a product column

> **Decision:** do **not** add a `bulk_price` (or similar) column to
> `products`. Bulk pricing is an interaction, not stored data.

**Why a product-level “bulk price” column is an antipattern**

- **Normalization / single source of truth.** A price on `products` would be a
  second place price lives. It would immediately drift from
  `product_variants.base_price`, and every read would need a rule for “which
  one wins”.
- **It cannot represent variant differences.** One column cannot hold the
  prices of 256GB / 512GB / 1TB (or S / M / L / XL).
- **Stale and ambiguous after partial edits.** If a vendor edits one variant,
  the product-level column is instantly wrong.
- **It duplicates the modifier system.** Attribute deltas already exist; a
  product-level price would be a competing mechanism.

**How bulk pricing actually works instead**

Bulk pricing is a UI affordance that **writes per-variant `base_price`**:

1. The vendor enters one price for a product.
2. The UI applies it to **every variant** of that product (a set of
   `base_price` writes — one row per SKU).
3. Attribute deltas (modifiers) are configured **once per option value**, not
   per variant.
4. A vendor can **single out any special variant** and set its own
   `base_price`, breaking it out of the bulk default.

So “bulk price” is a convenience over a matrix of variant rows; the database
still has exactly one authoritative price per SKU.

---

## 4. Modifiers solve the **combinatorial explosion**

Consider a product with 3 colours × 4 sizes × 3 storage options = **36
variants**.

- Without modifiers, changing “1TB costs +₦1,500” means editing **12 variant
  base prices** (one per colour × size for 1TB) — and again for every future
  price change. This is the combinatorial explosion.
- With modifiers, the rule is expressed **once** on the option value
  (`default_price_modifier = 150000`, `absolute`), or overridden on a single
  `variant_to_option_values` row when one variant must differ.

Resolution order used by `product_variant_effective_price`:

```
if an active override exists:      effective = override.absolute_price
else:                              effective = GREATEST(0, base_price + Σ absolute modifiers)
```

> ⚠️ **Known gap:** the view currently sums only `modifier_type = 'absolute'`.
> `percentage` modifiers are accepted by the enum but **ignored** by the view.
> Fix the view (or resolve percentages in the read helper) before relying on
> percentage modifiers.

### Worked example (kobo)

```
Laptop Pro X, Silver/1TB variant
  base_price                              = 151500   (₦1,515.00)
  Storage = 1TB  (default modifier)       = +150000  (₦1,500.00, absolute)
  effective_price                         = 301500   (₦3,015.00)
```

A vendor can override just that one variant:

```
variant_to_option_values (variant = Silver/1TB, value = '1TB')
  price_modifier = 200000   -- ₦2,000 instead of the default ₦1,500
  effective_price = 151500 + 200000 = 351500 (₦3,515.00)
```

---

## 5. Overrides are **time-bound** (flash sales / clearance)

`variant_price_overrides` stores an `absolute_price` with `start_date` and
`end_date`. While an override is active it **wins over** base + modifiers; when
it expires it is automatically ignored.

Why time-bound instead of just editing `base_price`:

- **Flash sales / clearance** need a start and an end. Editing `base_price`
  and “remembering to change it back” is error-prone and loses history.
- **Audit trail.** You can see that a price was a promotion and when it ran.
- **Scheduling.** A future sale can be loaded ahead of time and activates
  itself.
- **No permanent mutation.** The normal price is untouched underneath.

Only the **latest active** override per variant is used (the view uses
`DISTINCT ON (variant_id) … ORDER BY start_date DESC`).

```
Flash sale: Silver/1TB at ₦2,500 for 24 hours
  variant_price_overrides
    variant_id     = <Silver/1TB>
    absolute_price = 250000       -- ₦2,500
    start_date     = now()
    end_date       = now() + 24h
  effective_price during the window = 250000
  effective_price after end_date    = base_price + modifiers (back to normal)
```

---

## 6. Current implementation status (important)

The schema and this model are the **intended** design. The application has not
fully caught up:

- The product, cart and order repositories currently read
  `product_variants.base_price` **directly**. They do **not** read
  `product_variant_effective_price`, so **modifiers and overrides have no
  visible effect yet**.
- The `percentage` modifier type is not handled by the view (§4 gap).
- Therefore, today the UI shows exactly whatever `base_price` is — which is why
  seeding a single `base_price` per product makes every variant look identical.

**To activate the model:**

1. Add an effective-price read helper (e.g. a `Money` value object + query on
   `product_variant_effective_price`) and use it in the catalog, cart and
   order repositories.
2. Fix the view to resolve `percentage` modifiers.
3. Seed `variant_to_option_values.price_modifier` for attribute deltas and
   `variant_price_overrides` for promotions.
4. Only then does “each variant has its own price” come from the model rather
   than from manually varying `base_price`.

---

## 7. Anti-patterns (do not do these)

- ❌ Adding `bulk_price` / `price` / `list_price` / `net_price` columns to
  `products`.
- ❌ Storing a float or naira amount; always integer kobo.
- ❌ Editing `base_price` to run a temporary sale (use an override).
- ❌ Reading `base_price` in new code that shows a _customer-facing_ price —
  read the effective price (once the helper exists).
- ❌ Encoding a per-variant difference in a product-level field.
- ❌ Relying on `percentage` modifiers until the view supports them.

---

## 8. Decision log

| Date       | Decision                                                                                                                                                                                                                                                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| —          | Price lives on `product_variants.base_price`, not `products` (D1/D2 in `ddd_refactor_plan.md`).                                                                                                                                                                                                                               |
| —          | Effective price = `base_price + modifiers + overrides`, resolved by the `product_variant_effective_price` view (D2, D6).                                                                                                                                                                                                      |
| —          | Modifiers/overrides reserved for the “future promotions domain” (D6).                                                                                                                                                                                                                                                         |
| 2026-10-23 | Bulk pricing is a frontend UX interaction that writes per-variant `base_price`; a product-level bulk-price column is an antipattern (normalization/drift). Modifiers are the mechanism for attribute deltas and for overriding individual variants out of a bulk default. Overrides are time-bound for flash sales/clearance. |
