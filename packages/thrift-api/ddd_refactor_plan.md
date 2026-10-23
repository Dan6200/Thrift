# Thrift API — DDD Refactor & Schema/Logic Drift Plan

> Planning document. No code or schema changes are applied yet.
> Reference for the drift analysis:
>
> - Schema: `supabase/migrations/20250702000000_initial_schema.sql`
> - Application logic: `src/logic/`, `src/app-schema/`, `src/types/`
> - Seed: `supabase/seed.sql`

---

## 1. Purpose & Scope

Two interlocking goals:

1. **Refactor `packages/thrift-api` toward DDD** using a functional (non-OOP)
   programming style, while preserving the existing Express middleware pipeline
   during the transition.
2. **Fix the drift** between the consolidated DB schema and the application
   logic. The schema and `seed.sql` have already moved to a new pricing /
   option-value / inventory model; the application logic, Joi schemas, types,
   scripts, and tests still target the old model. This drift is currently a
   latent set of runtime failures (missing columns, mismatched column names,
   money-unit mismatch).

---

## 2. Current State Assessment

### 2.1 Architecture today

The codebase is **Express-middleware pipeline** style, not yet domain logic and
not yet FP-in-the-small:

- `routes/` compose middleware in order:
  `authenticateUser → validate(schema) → hasStoreAccess(roles) → xxxLogic →
validateDbResult(schema) → sendResponse(status)`
- `logic/` functions are middleware `(req, res, next)` that read
  `req.validatedBody`, `req.validatedQueryParams`, `req.userId`, run `knex`
  queries, mutate `req.dbResult`, then call `next()`.
- `app-schema/` = Joi request/response contracts.
- `types/` = plain DB row shapes (largely unused by logic).
- `events/` already has a `DomainEvent` interface + `PaymentSuccessEvent`
  (class-based seed of DDD).
- Business rules (e.g. inventory deduction + price-at-purchase in
  `create-order.ts`, variant/option expansion in `create-product.ts`) are
  embedded imperatively inside middleware with `throw`/`try-catch`.

### 2.2 Drift summary (source of truth = schema + seed)

The schema + `seed.sql` represent the **intended** model. The application logic
still targets the **old** model. See §5 for the full register.

---

## 3. Target Architecture (FP-DDD)

### 3.1 FP ↔ DDD mapping

| DDD concept                    | FP equivalent                                                             |
| ------------------------------ | ------------------------------------------------------------------------- |
| Entity / Value Object          | Discriminated-union type + smart constructor (factory returning `Result`) |
| Aggregate                      | Module: immutable state type + pure invariant-guarding functions          |
| Aggregate root / invariant     | "Make illegal states unrepresentable" via the type + constructor          |
| Repository                     | Port (interface of functions) + a `knex` adapter                          |
| Domain Service                 | Pure function coordinating entities/repos                                 |
| Application Service / Use Case | The orchestration function (current `logic` becomes this)                 |
| Domain Event                   | Plain immutable data record + a `publish(events)` port                    |
| Ubiquitous language            | Function/module naming (not class naming)                                 |
| Error handling                 | `Result<T, DomainError>` (Either) instead of `throw` + `try/catch`        |

The single most important change: **decouple the use case from Express.** A use
case becomes a pure `(input) => Promise<Result<Output>>`, with a thin HTTP
adapter extracting input from `req` and mapping the `Result` to a response.

### 3.2 Bounded contexts

| Context              | Aggregate roots / contents                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| **Catalog**          | `products` (root), `variants` (part of product aggregate), `options`, `media`, `reviews`, `categories` |
| **Sales / Orders**   | `orders` (root), `order_items`, `cart`, `payments`, `transactions`, ledger                             |
| **Identity**         | `profiles`, auth/session                                                                               |
| **Store Management** | `stores`, `store_staff`, `pages`, `locations`                                                          |
| **Fulfillment**      | `delivery-info`, `address`                                                                             |
| **Analytics**        | read-models only (no invariants; query services)                                                       |

### 3.3 Target folder layout

```
src/
  context/
    catalog/
      domain/          # product.ts, variant.ts, money.ts, product-errors.ts, product-events.ts
      application/     # create-product.ts, get-product.ts, ... (use cases)
      ports/           # product-repository.ts (interfaces)
      infra/           # knex-product-repository.ts (adapters)
      http/            # routes.ts, request-schema.ts (Joi lives here, boundary only)
    orders/            # ... same shape
    identity/
    store-management/
    fulfillment/
    analytics/
  shared/
    result.ts          # Result / Either + pipe helpers
    domain-error.ts    # DomainError union + HTTP status mapping
    event-bus.ts       # publish(events) port + in-memory impl
  db/                  # knex, pg (infra only)
  errors/              # HTTP error mapping only
```

Rules:

- Domain must **not** import `express` or `knex`.
- Joi stays at the **boundary** (`http/`), never in `domain/`.
- `db/` is infra only; no domain type imports knex.

---

## 4. Migration Strategy (Strangler Fig, context by context)

1. Add `src/shared/result.ts`, `domain-error.ts`, `event-bus.ts` — zero behavior
   change.
2. Fix schema↔logic drift **first** (or at least the catalog/pricing model),
   because DDD extraction is futile over a broken data model. See §6 ordering.
3. Pick the hardest context first (`orders` or `catalog`) to prove the pattern,
   keeping the old route working in parallel.
4. Move Joi schemas into each context's `http/`; leave the global `app-schema/`
   untouched until a context is fully migrated.
5. Introduce ports + adapters per context; test domain modules with stubs first
   (`tests/unit` exists), then swap routes to call use cases.
6. Delete the old `logic/xxx` middleware only after integrated tests pass
   (`pnpm test:assistant`).

---

## 5. Schema ↔ Logic Drift Register

Legend: `S:` = schema file/line, `L:` = logic/schema/type file/line.

### 5.1 Catalog / pricing model (largest — blocking)

| ID  | Drift                                                                                                                      | Evidence                                                                                                                                                                                                                       | Resolution direction                                                                                                                           |
| --- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | `products` has **no** `list_price`/`net_price` columns                                                                     | `S:` products (356–366); `L:` `create-product.ts:13-24`, `update-product.ts:15-18`, `create-variant.ts:18`, `update-variant.ts:24`                                                                                             | Price lives on variants; product create/update must not set price on `products`.                                                               |
| D2  | `product_variants` uses `base_price bigint` (cents); logic uses `list_price`/`net_price`                                   | `S:` 368–375; `L:` `create-product.ts:74-88`, `create-variant.ts:51-58`, `get-all-products.ts:58-59`, `get-product.ts:49-50`                                                                                                   | Rename to `base_price` (integer minor units). Drop `net_price` concept; effective price = `base_price + modifiers + overrides` (view 620–649). |
| D3  | `product_option_values` PK is `option_value_id` (+`default_price_modifier`,`default_modifier_type`); logic uses `value_id` | `S:` 386–395; `L:` `create-product.ts:56-67`, `create-variant.ts:38-46`, `get-all-products.ts:69-72`, `get-product.ts:60-63`, `update-variant.ts:85-88`, `app-schema/products/variants.ts:7`                                   | Rename `value_id` → `option_value_id`; surface modifier columns if needed.                                                                     |
| D4  | `variant_to_option_values` uses `variant_value_id` (+`price_modifier`,`modifier_type`); logic uses `value_id`              | `S:` 397–405; `L:` `create-product.ts:99-103`, `create-variant.ts:68-72`, `get-*` joins, `update-variant.ts:85`                                                                                                                | Rename `value_id` → `variant_value_id`; default `price_modifier=0`, `modifier_type='absolute'`.                                                |
| D5  | Money unit: schema uses integer minor units (bigint cents/kobo); logic uses float naira                                    | `S:` `base_price`, `total_amount`, `transactions.amount`, `ledger_lines.amount`, `default_price_modifier`, `price_modifier`, `absolute_price`; `L:` `create-order.ts:95-96`, `initialize-payment.ts:63` (`total_amount * 100`) | Standardize on integer minor units throughout; update order creation, payments, response schemas, tests.                                       |
| D6  | `variant_price_overrides` + `product_variant_effective_price` unused by logic                                              | `S:` 408–417, 620–649                                                                                                                                                                                                          | Future promotions domain; not blocking, but design `Money` VO around effective price.                                                          |

> **Pricing design rationale:** see [`docs/pricing-model.md`](docs/pricing-model.md)
> — why price lives on the variant, bulk pricing as a frontend UX feature,
> modifiers vs. combinatorial explosion, and time-bound overrides.

### 5.2 Inventory

| ID  | Drift                                                                                                                                               | Evidence                                                                                                                                                       | Resolution                                                                      |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| D7  | `product_variant_inventory` view groups by `(variant_id, location_id)`; logic reads `.first('quantity_available')` (ambiguous once locations exist) | `S:` 598–607; `L:` `create-variant.ts:74-76`, `update-variant.ts:78-80`, `cart/add-item-to-cart.ts:27`, `cart/update-cart-item.ts:37`, `create-order.ts:51-53` | Aggregate stock by `variant_id` (sum across locations) in a single read helper. |

### 5.3 Orders / payments

| ID  | Drift                                                                                                    | Evidence                                                                    | Resolution                                                                                                   |
| --- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| D8  | `orders` has **no** `payment_reference` column; payments logic writes/queries it                         | `S:` 475–485; `L:` `initialize-payment.ts:87`, `process-order-job.ts:62-77` | Use `transactions` table (`gateway_reference`) as source of truth, or add the column. Prefer `transactions`. |
| D9  | `transactions`, `financial_accounts`, `ledger_entries`, `ledger_lines` exist but no logic writes to them | `S:` 556–592 (+triggers/views)                                              | Future Sales/Payments domain (domain events → ledger). Not blocking.                                         |

### 5.4 Payment info

| ID  | Drift                                                            | Evidence                                          | Resolution                                                     |
| --- | ---------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| D10 | `payment_info` insert missing required `payment_type`/`provider` | `S:` 227–241; `L:` `process-order-job.ts:100-111` | Supply `payment_type='card'`, `provider='paystack'` in insert. |

### 5.5 Reviews / store / media / profile (mostly aligned)

| ID  | Area                                       | Status                                                                                                                                                                                                                                    |
| --- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D11 | `product_reviews`                          | Aligned (`order_item_id` PK, `rating`, `customer_id`, `customer_remark`). `vendor_reviews`/`customer_reviews` tables exist but no logic (unimplemented).                                                                                  |
| D12 | `stores`/`pages`/`page_sections`           | Column names aligned. Minor inconsistency: `section_data`/`styles` are `JSON.stringify`-ed before insert while `seo_data`/`global_styles` are not (`create-store.ts:46-49`, `update-store.ts:72-80`). Clean up during context extraction. |
| D13 | `media` / `product_media_links`            | Aligned.                                                                                                                                                                                                                                  |
| D14 | `profiles`, `store_staff`, `delivery_info` | Aligned on column names. Note `delivery_info.recipient_full_name varchar(30)` and profile name checks are stricter than Joi; tighten Joi later.                                                                                           |

### 5.6 Scripts & tests

| ID  | Drift                                                                     | Evidence                                                                                                                                                                 | Resolution                                                             |
| --- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| D15 | `scripts/generate-product-sql.ts` + `import-products.ts` target old model | `generate-product-sql.ts:33` emits `products (... list_price, net_price, ..., quantity_available)`; `import-products.ts:36` maps `quantity_available`                    | Regenerate to `base_price`/`option_value_id`/`variant_value_id` model. |
| D16 | Tests reference old model                                                 | `tests/integrated/products/definitions/index.ts`, `cart/index.ts`, `orders/index.ts`, `analytics/index.ts` (`list_price`, `net_price`, `quantity_available`, `value_id`) | Update fixtures + expected payloads to new model.                      |

---

## 6. Drift-Fix Strategy

### 6.1 Decision: schema is the source of truth

The migration + seed encode the intended pricing/inventory model. The app
logic, Joi schemas, types, scripts, and tests must be brought in line with it,
not the reverse. Exceptions are reviewed case-by-case in §6.4.

### 6.2 Ordering (must precede DDD extraction)

1. **Catalog data model first** (D1–D6, D7) — this is the foundation everything
   else reads. Introduce a `Money` value object (integer minor units) and an
   `effective price` read helper on top of the existing view.
2. **Payments/orders** (D8, D9, D10) — align `orders` + `transactions` +
   `payment_info`.
3. **Scripts & tests** (D15, D16) — re-sync fixtures so `pnpm test:assistant`
   is green again.
4. Then begin DDD extraction context-by-context (strangler fig).

### 6.3 How to fix without breaking the DB

- Add a **new migration** (never edit the consolidated
  `20250702000000_initial_schema.sql` in place; it is the historical baseline).
- Renames like `value_id → option_value_id` require column renames + index/FK
  updates, or short-lived compatibility. Because `seed.sql` already uses the new
  names, the schema is already correct; only the **application code** needs to
  change in most cases. Where the schema itself needs a change (e.g. deciding
  whether to add `orders.payment_reference`), do it as a new migration.
- Use `supabase db reset` + re-run seed to validate against a clean DB.

### 6.4 Open decisions (need owner)

- **D5 money unit**: confirm integer minor units (kobo) is the target across
  `orders.total_amount`, `order_items.price_at_purchase`, and payment amounts.
- **D8**: `orders.payment_reference` column vs. `transactions.gateway_reference`
  as source of truth.
- **D2**: whether to expose `net_price` as a derived concept or drop it entirely
  in favor of `base_price` + `effective_price`.
- **D7**: canonical stock definition (sum across locations vs. per-location).

---

## 7. Execution Phases (checkpoints)

| Phase | Work                                                                 | Exit criterion                               |
| ----- | -------------------------------------------------------------------- | -------------------------------------------- |
| P0    | Shared primitives (`result.ts`, `domain-error.ts`, `event-bus.ts`)   | Compiles, existing tests unaffected          |
| P1    | Catalog drift fix (D1–D7) + `Money` VO                               | Product/variant endpoints green on new model |
| P2    | Payments/orders drift fix (D8–D10)                                   | Order + payment flow green                   |
| P3    | Scripts + tests re-sync (D15–D16)                                    | `pnpm test:assistant` green                  |
| P4    | Extract `catalog` context (domain/application/ports/infra/http)      | Catalog routes served from new modules       |
| P5    | Extract `sales/orders` + `payments` context; introduce domain events | Order→payment decoupled                      |
| P6    | Extract `identity`, `store-management`, `fulfillment`, `analytics`   | All routes on contexts; delete old `logic/`  |
| P7    | Delete `app-schema/` global + legacy middleware                      | Single source of truth per context           |

---

## 8. Risks / Pitfalls

- Don't let domain import `express` or `knex` — that single constraint is the
  decoupling win.
- Don't put Joi in `domain/` — boundary validation vs. invariants are different
  jobs.
- Keep `db/` infra-only.
- `Result` only for operations that can legitimately fail on a domain rule;
  reads stay `Promise<T | null>`.
- `orders` ↔ `payments` is the first real **domain event** candidate
  (`OrderPlaced` → payment subscribes), replacing the current webhook-callback
  coupling.
- Editing `20250702000000_initial_schema.sql` in place would invalidate
  existing deployed DBs — always additive migrations for schema changes.
