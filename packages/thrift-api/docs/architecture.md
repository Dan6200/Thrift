# Thrift API — Functional DDD Architecture

This document explains how `packages/thrift-api` is structured and the design
patterns it uses. It is a reference for future work (extracting more bounded
contexts, adding features, reviewing).

The style is **Functional Domain-Driven Design** combined with **Hexagonal
Architecture (Ports & Adapters)**. The essential idea:

> **Functional core, imperative shell.** Business rules are pure functions with
> no I/O. All side effects (HTTP, database) live in a thin outer shell.

---

## 1. Why this shape

The codebase previously embedded business rules directly inside Express
middleware that also ran SQL. That caused drift: the pricing model changed in
the database schema, but the middleware kept using old columns (`list_price` /
`net_price`) and old column names (`value_id`). The rules had no single home.

The refactor separates concerns so that:

- **Domain rules live in one place** (pure, testable, no I/O).
- **Data access lives behind an interface** (swap-able, mock-able).
- **HTTP is a thin mapping layer** (transport shape in, transport shape out).

---

## 2. Directory layout

```
packages/thrift-api/src/
  context/                 # bounded contexts (DDD)
    catalog/               # the products/variants/options domain
      domain/              # pure: aggregates, value objects, invariants
        money.ts           #   Money value object (integer kobo)
        product.ts         #   Product aggregate + createProduct smart constructor
        variant.ts         #   Variant validation + VariantUpdate
      application/         # use cases (orchestration, no I/O)
        create-product.ts
        get-all-products.ts
        get-product.ts
        update-product.ts
        delete-product.ts
        create-variant.ts
        update-variant.ts
        delete-variant.ts
      ports/               # interfaces the domain depends on (ports)
        product-repository.ts
      infra/               # adapters that implement the ports (I/O)
        knex-product-repository.ts
      http/                # Express handlers (adapters between HTTP and app)
        create-product.ts
        ...
    orders/                # (planned) sales/orders context
    identity/              # (planned) profiles/auth
    store-management/      # (planned) stores/staff/pages
    fulfillment/           # (planned) delivery-info
    analytics/             # (planned) read models
  shared/                  # cross-cutting primitives
    result.ts              #   Result / Either
    domain-error.ts        #   DomainError + HTTP status mapping
    event-bus.ts           #   (planned) publish(events) port
  routes/                  # Express routers (wiring only)
  db/                      # knex, pg (infrastructure only)
  errors/                  # HTTP error classes (legacy, used by handlers)
  logic/                   # legacy middleware (being migrated out)
  types/                   # legacy types (being migrated out)
  app-schema/              # legacy Joi schemas (being migrated to http/)
```

Rules:

- `domain/` imports **nothing** from `express` or `knex`.
- `application/` imports `domain/` and `ports/` only.
- `infra/` implements `ports/`; it is the only layer that touches the database.
- `http/` imports `application/` and maps HTTP ⇄ domain.
- `shared/` is dependency-free except for the HTTP status code mapping.

---

## 3. The layers and data flow

```
HTTP request
   │
   ▼
http/        (Express handler)       — "shell"
   │  maps snake_case request → camelCase command
   ▼
application/ (use case)              — "orchestration"
   │  1. call domain smart constructor (validate invariants)
   │  2. if err → return err
   │  3. call repository port (persist)
   │  4. return ok(persisted)
   ▼
domain/      (smart constructor)     — "pure rules"
   │  validates business invariants
   ▼
ports/       (interface)             — "contract"
   │
infra/       (knex adapter)          — "I/O"
   │  camelCase → snake_case, SQL, snake_case result
   ▼
database
```

---

## 4. Design patterns

### 4.1 Result / Either (`shared/result.ts`)

```ts
export type Result<T, E> = { kind: 'ok'; value: T } | { kind: 'err'; error: E }
```

A **discriminated union**. Instead of throwing for expected failures, functions
return a `Result`. The caller branches on `kind` and TypeScript narrows the type
automatically.

Helpers: `ok`, `err`, `map`, `flatMap`, `mapError` (the standard functor/monad
operations; not yet heavily used, available for composition).

### 4.2 DomainError (`shared/domain-error.ts`)

```ts
export type DomainErrorCode =
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'UNAUTHENTICATED'
  | 'CONFLICT'
  | 'INTERNAL'

export type DomainError = { code: DomainErrorCode; message: string }
```

Domain errors are plain data, not `Error` subclasses. `domainErrorStatusCode`
maps each code to an HTTP status. The domain stays free of HTTP concerns while
still being able to communicate _why_ an operation failed.

### 4.3 Smart constructors / aggregate invariants (`domain/product.ts`)

A **smart constructor** is the only way to obtain a valid aggregate:

```ts
export const createProduct = (draft: ProductDraft): Result<Product, DomainError> => {
  if (!nonEmptyString(draft.title)) return err(domainError('INVALID_INPUT', 'Product title is required.'))
  // ... category/subcategory, ≥1 variant, unique SKUs, non-negative basePrice/quantity, ≥1 option
  return ok({ ... })
}
```

This is "make illegal states unrepresentable": you cannot hold a `Product` that
violates the rules, because the constructor refuses to produce one. The function
also **normalizes** (trims SKUs), so downstream code can trust its input.

### 4.4 Value object (`domain/money.ts`)

```ts
export type Money = number // integer minor units (kobo)

export const isNonNegativeMoney = (value: unknown): value is Money =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0
```

`Money` is a type alias for a number with a **semantic**: it is integer kobo,
not naira, not float. The guard `isNonNegativeMoney` enforces the invariant. It
is deliberately a bare `number` (not a branded type) to keep arithmetic simple;
the semantic is carried by naming + the guard.

### 4.5 Currying / partial application (dependency injection)

```ts
// application/create-product.ts
export const createProductUseCase =
  (repository: ProductRepository) =>          // 1. dependency
  async (command: CreateProductCommand): Promise<Result<...>> => { ... }
```

`createProductUseCase` is a **factory**. Call it once with its dependency and it
returns the real function:

```ts
// http/create-product.ts
const useCase = createProductUseCase(knexProductRepository)
```

This is dependency injection via **closures** — no framework, no `new`, no
mutable state. The production code injects the real knex adapter; tests inject
a fake.

### 4.6 Ports & Adapters (hexagonal)

```ts
// ports/product-repository.ts
export type ProductRepository = {
  create(input): Promise<PersistedProduct>
  getAll(query): Promise<unknown>
  getById(query): Promise<unknown>
  update(command): Promise<PersistedProduct>
  remove(command): Promise<void>
  createVariant(input): Promise<PersistedVariant>
  updateVariant(input): Promise<PersistedVariant>
  removeVariant(input): Promise<void>
}
```

The **port** is a plain interface of functions. The domain/application code
depends only on the port. The **adapter** (`infra/knex-product-repository.ts`)
implements it with `knex`. This is the seam that makes the core testable and the
database swap-able.

### 4.7 Application service (use case)

`application/create-product.ts` orchestrates, but does no I/O directly:

1. Validate via the domain smart constructor.
2. Short-circuit on `err`.
3. Persist via the repository port.
4. Wrap the result in `Result`.

The use case knows **what** to do, not **how** the DB works.

### 4.8 HTTP handler (adapter)

`http/create-product.ts` is the shell:

- Reads `req.validatedBody` / `req.validatedQueryParams` / `req.userId`.
- Maps **snake_case → camelCase** (the domain's language).
- Calls the use case.
- Maps `Result`: `err` → throws an HTTP error; `ok` → `req.dbResult`.

The legacy pipeline (`validateDbResult` → `sendResponse`) still handles the
response shape and status code, so handlers stay minimal.

### 4.9 Naming convention

- **Domain/application**: camelCase (`basePrice`, `categoryId`, `optionName`).
- **HTTP/DB boundary**: snake_case (`base_price`, `category_id`, `option_name`).

The mapping happens at the two boundaries (http and infra), so the core keeps a
consistent language independent of the schema/API.

---

## 5. Deep dive: the Product aggregate

`domain/product.ts` defines the aggregate:

```ts
export type VariantOption = { optionName: string; value: string }
export type Variant = {
  sku: string
  basePrice: Money
  quantityAvailable: number
  options: VariantOption[]
}
export type Product = {
  title: string
  categoryId: number
  subcategoryId: number
  description: string[]
  variants: Variant[]
}
```

`Product` is the **aggregate root**; `Variant` and `VariantOption` live inside
it. You never mutate a `Product` in place — you build a new one through
`createProduct`.

`createProduct` enforces these invariants:

- title is non-empty
- `categoryId` / `subcategoryId` are positive integers
- at least one variant
- every variant has a non-empty, unique SKU (within the product)
- `basePrice` is non-negative integer kobo
- `quantityAvailable` is a non-negative integer
- every variant has at least one option

Note `domain/variant.ts` has `createVariant` (same per-variant rules for the
standalone variant endpoint) and `validateVariantUpdate` (partial-update rules,
including the rule that a quantity change requires an `inventoryChangeReason`).

---

## 6. Deep dive: the repository adapter

`infra/knex-product-repository.ts` is the only place that talks to the database.
Each method:

1. Maps domain camelCase → DB snake_case.
2. Runs the query (often inside `knex.transaction`).
3. Returns the raw DB row (snake_case) so the Joi response validator stays happy.

`create` mirrors the old `createProductLogic` but takes a validated `Product`:

- insert `products` (title, description, category_id, subcategory_id, vendor_id, store_id)
- for each variant: get-or-create `product_options` and `product_option_values`, insert `product_variants` (base_price), insert `inventory` (initial stock), insert `variant_to_option_values` links
- return the product with its created variants

`updateVariant` is the richest: it applies the inventory delta (reads current
`quantity_change` rows with `FOR UPDATE`, computes the difference, inserts a new
inventory row with a reason) inside a transaction that rolls back on error.

`getAll` / `getById` run the large `JSON_AGG` read queries (moved verbatim from
the old middleware) and return the aggregated read model.

---

## 7. Full request lifecycle (create-product example)

```
POST /v1/products
  → authenticateUser                       (auth; sets req.userId)
  → validate(ProductCreateRequestSchema)   (Joi: transport shape, snake_case)
  → hasStoreAccess(['admin','editor'])     (authorization)
  → createProductHandler                   (http/create-product.ts)
        maps body → CreateProductCommand (camelCase)
        const result = await useCase(command)
        result.kind === 'err'
          ? throw new BadRequestError(result.error.message)
          : req.dbResult = result.value
  → validateDbResult(ProductResponseSchema) (Joi: response shape)
  → sendResponse(CREATED)
```

The domain/application layers are completely oblivious to all of this.

---

## 8. Conventions to preserve

- **Errors**: expected failures are `DomainError` values returned in a `Result`;
  unexpected failures throw and are caught by the global error handler.
- **Layering**: domain never imports express/knex; infra never imports http;
  http never imports infra directly (it goes through application).
- **Boundaries do the mapping**: snake_case ⇄ camelCase happens in http and infra.
- **Small commits**: one logical change per commit.
- **Strangler fig**: keep legacy `logic/` middleware until its context is fully
  extracted and the integrated suite is green, then delete it.

---

## 9. Status

| Context                                                    | Status                                                            |
| ---------------------------------------------------------- | ----------------------------------------------------------------- |
| `catalog`                                                  | ✅ extracted (domain/application/ports/infra/http + routes wired) |
| `shared`                                                   | ✅ `Result`, `DomainError`; `event-bus` planned                   |
| `orders`/`sales`                                           | ⏳ next                                                           |
| `identity`, `store-management`, `fulfillment`, `analytics` | ⏳ planned                                                        |
| `logic/`, `types/`, `app-schema/`                          | legacy, being migrated out                                        |
| `scripts/`                                                 | legacy import utilities (still use old pricing columns)           |
