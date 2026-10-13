# Testing Strategy — thrift-api

This document is the source of truth for _how_ and _where_ to test the
application. It is written so it can be handed to a testing agent that is
**blind to the source code** (it may read only `src/tests/` and this document).

---

## 1. Philosophy: the testing pyramid

Prefer many fast, precise tests at the bottom and few slow, coarse tests at the
top:

```
      ▲   adversarial e2e      contract, authz, ownership (few)
      │   integration          adapters + wiring + boundary mapping
      │   unit                 pure domain rules + use-case orchestration (many)
```

The application is **Functional DDD** (see `docs/architecture.md`): business
rules are **pure functions** (`domain/`), orchestration is **curried use cases**
(`application/`), and all I/O is behind **ports** (`infra/` adapters). That shape
is what makes unit testing cheap — the pure core needs no DB, no network, and
no mocks beyond a plain fake object.

> **"More unit, less e2e" is correct.** Unit tests pin the exact rule and run in
> milliseconds; a black-box e2e test tells you only "something returned 4xx/5xx"
> and needs the full stack (DB, Supabase, Paystack, QStash, Cloudinary).

---

## 2. What each layer tests

| Layer                    | Test type        | Targets                                                               | Why                      |
| ------------------------ | ---------------- | --------------------------------------------------------------------- | ------------------------ |
| `shared/` + `domain/`    | unit             | invariants, money arithmetic, state transitions, every boundary value | pure, no I/O             |
| `application/`           | unit (fake repo) | orchestration, error mapping, "invalid input never reaches the repo"  | depends on ports only    |
| `infra/` (knex adapters) | integration      | SQL correctness, camelCase→snake_case, transactions                   | needs the DB             |
| `http/` + `routes/`      | integration      | Joi schemas, route wiring, status codes, boundary mapping             | needs the running server |
| whole app                | adversarial e2e  | contract, authz, ownership, replay/state-machine, query injection     | cross-layer seams        |

**Rule of thumb:** a business rule should be tested once as a unit (in
`domain/`/`application/`) and once as a thin integration check (does the
endpoint surface it with the right status). Do **not** enumerate boundary values
through HTTP — that belongs in unit tests.

---

## 3. Blind-agent unit-test contract

The following pure functions and use cases are the unit-test surface. Their
signatures and invariants are given here so tests can be written against them
**without reading the source**. Import them with the `#src/...` alias; the
existing `src/tests/unit/` files show the exact import + fake-repo pattern.

### 3.1 Shared primitives

- `#src/shared/result.ts`
  - `Result<T, E> = { kind: 'ok'; value: T } | { kind: 'err'; error: E }`
  - `ok`, `err`, `map`, `flatMap`, `mapError`
- `#src/shared/domain-error.ts`
  - `DomainErrorCode = 'INVALID_INPUT' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'UNAUTHENTICATED' | 'CONFLICT' | 'INTERNAL'`
  - `domainError(code, message)`, `domainErrorStatusCode(error)`
- `#src/shared/money.ts`
  - `Money = number` (integer **kobo**); `isNonNegativeMoney(v): v is Money`
    (integer and ≥ 0)
- `#src/shared/to-http-error.ts`
  - `toHttpError(error: DomainError): Error` — maps code → HTTP error class:
    `INVALID_INPUT`→400, `NOT_FOUND`→404, `UNAUTHORIZED`→403,
    `UNAUTHENTICATED`→401, `CONFLICT`→409, `INTERNAL`→500.

### 3.2 Catalog

- `#src/context/catalog/domain/product.ts`
  - `createProduct(draft: ProductDraft): Result<Product, DomainError>`
  - `Product` = `{ title, categoryId, subcategoryId, description: string[], variants: Variant[] }`
  - `Variant` = `{ sku, basePrice: Money, quantityAvailable, options: { optionName, value }[] }`
  - Invariants: title non-empty; `categoryId`/`subcategoryId` positive int;
    ≥1 variant; SKU non-empty + unique within the draft; `basePrice` non-neg int;
    `quantityAvailable` non-neg int; ≥1 option. SKUs are **trimmed** on output.
- `#src/context/catalog/domain/variant.ts`
  - `createVariant(variant): Result<Variant, DomainError>` — same per-variant
    rules as above.
  - `validateVariantUpdate(update): Result<VariantUpdate, DomainError>` where
    `VariantUpdate = { sku?, basePrice?, quantityAvailable?, inventoryChangeReason?, inventoryChangeNotes?, options? }`.
    Invariants: `basePrice` non-neg int; `quantityAvailable` non-neg int;
    **if `quantityAvailable` is present, `inventoryChangeReason` is required.**
- `#src/context/catalog/infra/sort.ts`
  - `handleSortQuery(queryString: string): string` — comma-separated fields,
    `-` prefix = DESC; allowed columns `product_id, title, base_price,
created_at, updated_at, average_rating, review_count, products_sold`;
    invalid columns are ignored; returns `''` if none valid, else `ORDER BY …`.

### 3.3 Cart

- `#src/context/cart/domain/cart.ts`
  - `validateQuantity(quantity, availableStock): Result<number, DomainError>`
    — quantity must be a positive integer and ≤ availableStock.

### 3.4 Orders

- `#src/context/orders/domain/order.ts`
  - `createOrder(draft, priceOf, stockOf): Result<Order, DomainError>`
  - `draft.items` = `{ variantId, quantity }[]`
  - `priceOf: (variantId) => Money | undefined` (injected price lookup)
  - `stockOf: (variantId) => number` (injected stock lookup)
  - Invariants: ≥1 item; quantity positive int; `priceOf` defined (variant
    exists); `stockOf ≥ quantity`; `totalAmount = Σ(price × quantity)`; status
    `'pending'`.

### 3.5 Application use cases (unit-test with a fake repository)

The fake is a plain object implementing the port. See the templates:
`src/tests/unit/catalog/create-product.ts` and
`src/tests/unit/orders/create-order.ts`. For each use case, assert the **error
mapping** (a rule violation returns the right `DomainError` code and _does not_
call the write method) and the **happy path** (valid input reaches the repo).

- `createProductUseCase(repo)(command)` — validates via `createProduct`, then
  rejects any variant whose SKU already exists globally (`repo.getVariantBySku`
  → `CONFLICT`), then `repo.create`.
- `createVariantUseCase(repo)(command)` — validates via `createVariant`, rejects
  duplicate SKU (`getVariantBySku` → `CONFLICT`), then `repo.createVariant`.
- `updateVariantUseCase(repo)(input)` — validates via `validateVariantUpdate`,
  then `repo.updateVariant`.
- `createOrderUseCase(repo)(command)` — `repo.storeExists` → `NOT_FOUND`;
  `repo.deliveryInfoBelongsTo` → `INVALID_INPUT`; then `createOrder` with
  prices/stock from the repo; then `repo.create`.
- `createReviewUseCase(repo)(command)` — `getOrderItemOwner` → `NOT_FOUND` /
  `UNAUTHORIZED`; `getById` (existing review) → `CONFLICT`; then `repo.create`.
- `updateReviewUseCase` / `deleteReviewUseCase` — `getById` → `NOT_FOUND`;
  ownership mismatch → `UNAUTHORIZED`.
- `addItemUseCase` / `updateItemUseCase` / `removeItemUseCase` (cart) — stock
  check (`validateQuantity`) and not-found mapping.

> The port method names above (`getVariantBySku`, `getOrderItemOwner`, etc.) are
> the **contract** — the fake must expose exactly these names; the real adapter
> implements them. When unsure of a signature, mirror the existing unit-test
> fake rather than guessing.

---

## 4. Integration & adversarial coverage (already present)

These already exist and should be **maintained, not duplicated**:

- `src/tests/integrated/**` — the per-endpoint happy-path + negative tests.
- `src/tests/integrated/adversarial/**` — the strict contract suite
  (validation bypass, boundary/precision, uniqueness, authorization, ownership,
  state-machine, query injection, param coercion).

A blind agent adding integration coverage should:

- Assert **behavior** (rejected / accepted) and use the "one of several 4xx"
  tolerance helper rather than over-pinning exact codes where the app is
  legitimately flexible (see `adversarial/helpers.ts` `expectRejected`).
- Verify **money is integer kobo** and **arithmetic** (`total_amount`,
  `total_price`) exactly.
- Not re-seed data that the main fixtures already create — prefer self-contained
  seeding (see `adversarial/helpers.ts`).

---

## 5. Conventions

- **Run**: `pnpm test:assistant` from `packages/thrift-api`, under **Node 20**
  (tests use `Array.prototype.toSpliced`).
- **Imports**: use the `#src/...` alias; snake_case in HTTP payloads/DB,
  camelCase in domain/application.
- **Fakes**: plain objects implementing the port; no mocking framework.
- **Isolation**: each test seeds and tears down its own data (reuse the helpers
  in `src/tests/integrated/helpers/`).
- **Naming**: `it('rejects a …')` / `it('returns … for …')` — name the rule, not
  the mechanics.

---

## 6. Current coverage & gaps

Covered (unit): `createProduct` (domain + use case), `createOrder` (domain +
use case), `handleSortQuery`.

**Primary gaps** (add unit tests here first):

1. `variant.ts` — `createVariant` and `validateVariantUpdate`
   (especially the "quantity change requires reason" rule).
2. `cart.ts` — `validateQuantity`.
3. `order.ts` — edge cases beyond the current few (multi-item arithmetic,
   per-item stock, unknown variant).
4. `createVariantUseCase`, `updateVariantUseCase`, `updateVariant` mapping.
5. `createReviewUseCase` / `updateReviewUseCase` / `deleteReviewUseCase`
   (ownership + duplicate).
6. Cart `addItemUseCase` / `updateItemUseCase` / `removeItemUseCase`.
7. `toHttpError` code→status/class mapping.
8. `shared/result.ts`, `shared/money.ts` guards (cheap to pin).
