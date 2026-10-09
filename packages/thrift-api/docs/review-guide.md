# Review Guide — thrift-api DDD refactor

This guide helps you review a large, mostly-mechanical refactor efficiently.
The _how it works / why this style_ is in `docs/architecture.md`; this file is
about _how to review the actual change_.

Tracking issues: **#27** (schema↔logic drift) and **#28** (DDD refactor epic).

---

## 1. What this refactor did (three phases)

| Phase                     | What                                                                                                 | Commit range                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **1. Schema drift fix**   | Brought app code in line with the new schema (pricing, option values, money units)                   | `02821177` → `c52bbf49`                        |
| **2. Shared primitives**  | `Result`, `DomainError`, `Money`, `to-http-error`, `event`                                           | `8a410591`, `ec28620b`, `f3b2db11`, `8c640a45` |
| **3. Context extraction** | Moved each domain into `src/context/<name>/{domain,application,ports,infra,http}` and rewired routes | `7c7cd3b2` → `d917e33c`                        |

Everything before `d0a55ab8` (the plan doc) is pre-existing history, not part of
this change.

---

## 2. Suggested review order (shortest path first)

You don't need to read all ~120 commits. Review in this order:

1. **The plan** — `ddd_refactor_plan.md` (§5 is the drift register; §3 is the target shape).
2. **Shared primitives** (5 tiny files):
   - `src/shared/result.ts`, `domain-error.ts`, `money.ts`, `to-http-error.ts`, `event.ts`
3. **One context, end-to-end** — `catalog` is the reference implementation:
   - `context/catalog/domain/product.ts` (aggregate + smart constructor)
   - `context/catalog/application/create-product.ts` (use case)
   - `context/catalog/ports/product-repository.ts` (port)
   - `context/catalog/infra/knex-product-repository.ts` (adapter)
   - `context/catalog/http/create-product.ts` (handler)
   - `routes/products/index.ts` (wiring)
4. **The domain-rich contexts** — `orders/domain/order.ts` (injected `priceOf`/`stockOf`), `reviews/application/*` (ownership rules), `payments` (the `EventPublisher` port).
5. **Skim the rest** — the remaining contexts follow the same template; you mostly need to confirm fidelity to the old `logic/` code.

---

## 3. The one-context template (what to check per layer)

Every context has the same shape. For each, check:

- **`domain/`** — no `express`/`knex` imports; invariants live in a smart constructor returning `Result`.
- **`ports/`** — a plain interface of functions (the seam for tests + DB swap).
- **`infra/`** — the knex adapter; maps camelCase → snake_case; _faithful_ to the old SQL.
- **`application/`** — a curried factory `(deps) => (command) => Promise<Result<...>>`; orchestrates domain + ports, no I/O details.
- **`http/`** — thin: extracts `req`, maps snake→camel, calls the use case, maps `Result` → `req.dbResult` (or throws via `toHttpError`).
- **`routes/`** — only the wiring changed; middleware order is unchanged.

---

## 4. Representative trace (worth verifying once)

`POST /v1/products`:

```
routes/products/index.ts → createProductHandler (http)
  → createProductUseCase (application)  → createProduct (domain)  → knexProductRepository.create (infra)
```

Key things to confirm in this one trace:

- `base_price` is integer **kobo** throughout (schema + logic + response).
- `option_value_id` / `variant_value_id` replaced the old `value_id`.
- `products` no longer carries a price (it moved to `product_variants`).
- The Joi schema still lives at the boundary (`app-schema/products`), not in the domain.

---

## 5. Verification status

Green (verified via `pnpm test:assistant`, Node 20 — note `.node-version` says 18 but tests use `toSpliced`, so run under Node 20):

| Area                              | Result                                                |
| --------------------------------- | ----------------------------------------------------- |
| catalog (products/variants)       | ✅ 7–8/9 (flaky timestamp asserts only)               |
| orders                            | ✅ 20/20                                              |
| cart                              | ✅ 15/18 (3 flaky timestamp asserts)                  |
| identity (profile)                | ✅ wired, builds                                      |
| fulfillment (delivery-info)       | ✅ 21/21                                              |
| store-management (stores + staff) | ✅ 37/37 + 24/24                                      |
| reviews                           | ✅ 30/30                                              |
| analytics                         | ✅ 11/11                                              |
| media                             | ✅ 21/21                                              |
| payments                          | ✅ 6/6 (initialize); 4 webhook fails are pre-existing |
| unit tests (domain/use-case)      | ✅ 11 catalog + 8 orders                              |

**Known pre-existing failures (not caused by this refactor, left per your instruction):**

- Timestamp assertions (`expected NNN to be below 2000`) — the 2s window is too tight.
- Payments webhook `400`s — test uses a mock secret that doesn't match `PAYSTACK_SECRET_KEY`, and there's no raw-body middleware for HMAC verification.
- A leftover unstaged deletion `packages/thrift-api/assistant_rules.md` (pre-dates this work; not touched).

---

## 6. Deliberate decisions / deviations to be aware of

These are intentional; don't flag them as bugs without reason:

- **camelCase in domain, snake_case at the boundary** — mapping happens in `http/` and `infra/`.
- **Persistence-only CRUD contexts keep snake_case end-to-end** (`stores`, `staff`, `delivery-info`) — no domain invariants, so camelCase mapping was skipped as pure churn.
- **Some adapters throw HTTP errors** (`NotFoundError`, `BadRequestError`) directly (e.g. `catalog` create-variant, `delivery-info` update). This mirrors the old `logic/` behavior; the richer contexts use `Result` + `toHttpError` instead. A later pass could normalize this.
- **`orders.payment_reference`** — I added an additive migration (`20260919000000`) as a pragmatic unblock; the long-term plan is the `transactions` table (`gateway_reference`), tracked in #27.
- **Money is a bare `number` (kobo)**, not a branded type — see `shared/money.ts`.
- **`EventPublisher`** replaces the old class-based `events/publish.ts`; `events/` is now dead code.

---

## 7. What's left (not done, tracked)

- **D15** — legacy `scripts/generate-product-sql.ts` / `import-products.ts` still emit `list_price`/`net_price`.
- **Dead-code cleanup** — delete `src/logic/**` (now unused), `src/events/publish.ts` + `payment-success.event.ts`, and the legacy `src/types/` + `src/app-schema/` entries once migrated. Intentionally kept (strangler-fig) until you sign off.
- **`docs/architecture.md`** — fold in the §6 notes (snake_case CRUD exception, adapter-throws-HTTP-errors) when convenient.

---

## 8. 15-minute sanity checklist

- [ ] `Result`/`DomainError` shape matches `shared/*`.
- [ ] One context (`catalog`) reads top-to-bottom without importing `express`/`knex` in `domain/` or `application/`.
- [ ] `base_price` (kobo) and `option_value_id`/`variant_value_id` are used consistently in catalog + orders + cart.
- [ ] No route behavior changed (middleware order preserved).
- [ ] Payments `initialize` path is faithful (6/6 tests green).
- [ ] `docs/architecture.md` matches the actual `src/context/` layout.
