# Testing Methods Review — thrift-api

> Strict review of the thrift-api test suite against industry standards.
> Scope: `packages/thrift-api/src/tests/`. Last updated: 2026-10-12.

## Verdict

The suite is **below current industry standard** for a production API in several
concrete ways — mostly in _isolation, determinism, and test-harness correctness_,
not in _coverage breadth_. Coverage is decent after the adversarial suite; the
weaknesses are structural and would show up as CI flakiness, slow feedback, and
tests that pass while silently not testing what they claim.

## What's actually good

- **Response-schema validation via Joi** (`helpers/test-validators/*`,
  `app-schema`) — validating _response_ shapes, not just status codes, is
  genuinely above-average and catches contract drift.
- **Centralized HTTP harness** (`test-request/index.ts`) with status + req/res
  validation — good intent, but see defects below.
- **Ports-and-adapters unit tests** (`unit/catalog`, `unit/orders`) with
  hand-rolled fakes — right architectural direction.
- **Helper reuse** (`create-user`, `signin-user`, `create-store`, …) rather than
  copy-pasted setup.

## Critical gaps vs. industry standard

### 1. Test pyramid is inverted

Coverage is ~95% end-to-end HTTP against a live server + Supabase + Cloudinary +
Paystack, with a thin unit-test layer. Industry standard is the opposite: many
fast unit tests, fewer integration, fewest E2E. The E2E suite takes ~4 minutes,
hits real external services, and any failure is expensive to localize. Most of
the business rules (money arithmetic, stock decrement, role checks, uniqueness)
belong in unit tests against fakes — `unit/orders/create-order.ts` already proves
the pattern works, but only ~5 edge cases are covered there.

### 2. Isolation & determinism (the biggest problem)

- **Order-dependent tests**: `integrated/cart/index.ts` mutates `cartItems` /
  `cartItemIds` across `it` blocks and relies on prior tests having run
  (`toSpliced` reconstruction at the end). `products`/`stores` tests do the same
  with shared `productIds`/`storeIds` arrays. Violates the FIRST "Independent"
  property.
- **No transaction-per-test / no DB reset**: cleanup is manual
  `deleteUserForTesting` in `after` hooks. A run that dies mid-way leaves stale
  rows that pollute the next run.
- **Fixed identities**: fixture users use hardcoded emails/phones
  (`ebukachibueze5489@gmail.com`, `aliyumustapha@gmail.com`, …). Non-parallelizable
  and collision-prone.
- **Observed flake**: one full run failed `cart` with `variant_id 598 vs 595`
  (`cart/definitions/index.ts`) but passed in isolation and the next full run —
  the classic order/load-dependent signature.
- **`describe` used for side effects**: `integrated/index.ts` runs
  `describe('Media Asset Cleanup', async () => Promise.all([bulkDeleteImages(...)]))`.
  `describe` callbacks must be synchronous and side-effect-free; this cleanup
  executes at _registration_ time, not as a proper hook.

### 3. The test harness is defective

`integrated/test-request/index.ts` **accepts `params` and `headers` in its type
but never forwards them** to chai:

```ts
const request = chai
  .request(server)
  [verb](path)
  .query(query)
  .send(<object>body)
if (token) request.auth(token, { type: 'bearer' })
```

This is why the four payments webhook tests can never pass — they pass
`headers: { 'x-paystack-signature': ... }` that are silently dropped.

Also: the `validateTestReqData` requirement (`throw` when a body is sent without
it) forces adversarial invalid-input tests to pass `() => true`, defeating its
own purpose. It conflates "well-formed test" with "satisfies the app schema".

### 4. Mocking strategy is fragile

- `integrated/payments/index.ts` monkey-patches a real module
  (`paystack.transaction.verify = () => …`) and restores it _after_ the
  assertions. If an assertion throws, the restore never runs and the patch leaks.
  Use a proper DI/stub seam or `sinon` with automatic `restore()`.
- Tests depend on **live Cloudinary** and **live Supabase** rather than test
  doubles or Testcontainers.

### 5. Assertion quality is inconsistent

- **Exact-status-code assertions where the spec is ambiguous** (e.g.
  `should.have.status(FORBIDDEN)` for cross-store reads). The adversarial suite
  introduces `expectRejected(res, [400, 403, 404])` to express "rejected" rather
  than one code — the right fix, but the base suite hard-codes single codes and
  breaks on any legitimate status refinement.
- **Deep-equality including timestamps** — the flaky 2-second windows have been
  replaced with `assert-timestamp.ts` (parseable ISO + ±1 min window), but the
  habit of asserting full object equality on mutable/derived fields is fragile.
- **Floats in test money**: `integrated/data/users/vendors/user-aliyu/stores.yml`
  embeds `list_price: 59.99` / `net_price: 59.99` in section data while the rest
  of the suite treats money as integer kobo. Inconsistent money representation
  in fixtures is a landmine.

### 6. Naming & structure

Existing names are mostly "should do X" with no rule/behavior specificity ("it
should Add a couple products to each store"), mixing tense and case
inconsistently. Standard practice (BDD / Roy Osherove) is
`verb + condition + outcome`, e.g. `rejects a negative base price` (the
adversarial suite follows this; the legacy suite does not). Few tests state
_why_ the expectation matters.

## Missing practices entirely

- **Contract testing** (Pact) — an OpenAPI/`app-schema` exists, but there are no
  consumer-driven contract tests.
- **Property-based testing** (fast-check) — a natural fit for the money/stock/
  review invariants.
- **Mutation testing** (Stryker) — to prove the suite actually catches bugs, not
  just runs.
- **Coverage gates** — no enforced thresholds in CI.
- **Flake quarantine / retry policy** — nothing tags or retries the known-flaky
  cart/payments tests.
- **Performance budgets** — 4-minute runtime with no parallelization/sharding.

## Prioritized recommendations

1. **Fix the harness first** — forward `headers`/`params`, and drop the
   `validateTestReqData` throw in favor of an explicit opt-in. Unblocks the
   payments tests and removes a silent-failure class.
2. **Kill the side-effect `describe`** and move cleanup to `after` hooks; add a
   global DB reset/truncate before the suite.
3. **Make tests order-independent** — each `it` seeds its own data (as the
   adversarial suite does) instead of mutating shared arrays.
4. **Move business rules into unit tests** (money math, stock, uniqueness, roles)
   against fakes; shrink E2E to a thin happy path + a few cross-cutting
   auth/ownership cases.
5. **Introduce Testcontainers or fakes** for Supabase/Cloudinary/Paystack so the
   suite is deterministic and CI-friendly.
6. **Add CI gates** — coverage threshold, flake detection/retry with quarantine,
   and parallel sharding.

## Summary

The suite has the hardest 20% right (schema-validated responses, a reusable
harness, clean unit-test seams). The gaps are the boring 80% — isolation,
determinism, harness correctness, and mocking hygiene — and those are what a
reviewer or CI pipeline rejects first.
