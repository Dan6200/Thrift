# Review — Adversarial test suite: coding style vs. project FP-DDD conventions

Scope: the test agent's additions under `src/tests/integrated/adversarial/`
(commit `8d3e9054`) and the flaky-timestamp fix (`1027f8c5`).

---

## Verdict

**Functionally excellent; stylistically a partial match.** The suite correctly
treats the application as a black box, respects the snake_case boundary, and is
well organized — all consistent with the FP-DDD ethos. Where it drifts is in
**type safety** (liberal `any`), **test-infrastructure reuse** (it reinvents a
lightweight HTTP wrapper instead of the existing `test-request` harness), and a
handful of smaller smells.

---

## What aligns with the project's FP-DDD style

1. **Black-box, public-interface testing.** The suite drives the application
   through `chai.request(SERVER)` over the HTTP API — it depends only on the
   public contract, never on internal functions. This is exactly the
   ports-and-adapters philosophy: tests are a consumer of the port, not of the
   internals.
2. **snake_case at the boundary.** Payloads use `base_price`,
   `quantity_available`, `store_id`, `variant_id`, etc. — matching the API (and
   the "camelCase domain / snake_case API" convention) precisely. There is even
   an explicit test asserting camelCase is _rejected_ (`catalog.ts:131`).
3. **Self-contained and ordered-independent.** Each area seeds and tears down its
   own data (`seedVendorCatalog`, `seedUser`, and `deleteUserForTesting` in
   `after`), so the suite is repeatable.
4. **Reuses existing seed helpers.** It uses `createUserForTesting`,
   `deleteUserForTesting`, `signInForTesting`, `loadUserData` — not reinventing
   user/store seeding.
5. **Descriptive, rule-named tests.** `it('rejects a non-integer base price')`
   names the attack; `describe` groups map to the contract axes (validation
   bypass / boundary & precision / uniqueness / authorization / param coercion).
   No magic numbers in intent.
6. **DRY helpers.** `request()`, `expectRejected()`, `expectErrorMessage()`,
   `seedVendorCatalog()`, `productPayload()` remove repetition across areas.
7. **Good type inference where it counts.** `orders.ts`/`payments.ts` use
   `Awaited<ReturnType<typeof seedVendorCatalog>>` rather than hand-written
   types — idiomatic modern TS.
8. **The timestamp fix is a genuine improvement.** `assert-timestamp.ts`
   replaces the flaky 2-second window with
   present-string / parseable-ISO / ±1-minute-window checks — correct, robust,
   and extracted into a reusable helper.

---

## Deviations / concerns

### 1. Liberal `any` (highest-priority style drift)

Concentrated in `adversarial/helpers.ts`:

- `request()` — `opts.query as any`, `opts.body as any` (`helpers.ts:24-25`)
- `expectRejected(response: any, …)` (`helpers.ts:36`)
- `expectErrorMessage(response: any, …)` (`helpers.ts:57`)
- `uniqueUser(base: any, …)` (`helpers.ts:78`)
- `seedUser(userInfo: any)` (`helpers.ts:97`)
- plus `chai.request(SERVER)[verb]` returning an untyped superagent response.

The project's domain/application layers are deliberately `any`-free
(discriminated unions and `unknown` at boundaries). The test suite reintroduces
`any` at its seam. This loses:

- compiler feedback when a test references a field that doesn't exist;
- the ability to catch contract drift at compile time (a key benefit of the FP-DDD
  type discipline).

**Recommendation:** type the HTTP response minimally (e.g. a small
`ApiResponse` shape or `{ status: number; body: unknown }`), replace `any` with
`unknown` + narrowing, and give `seedUser`/`uniqueUser` real input types.

### 2. Reinvented HTTP wrapper instead of the existing `test-request` harness

The main suite routes HTTP through `integrated/test-request/`. The adversarial
suite bypasses it and talks to `chai-http` directly via `chai.request(SERVER)`
(`helpers.ts:23`). The prompt explicitly said to reuse the harness.

This is a _defensible_ adaptation — the harness asserts a single status code,
whereas adversarial tests need "rejected with one of `[400, 409]`" tolerance — but
it means two HTTP layers now coexist with different conventions.

**Recommendation (optional):** either extend `test-request` to support an
"allowed status set" and route the adversarial tests through it, or document why
a parallel wrapper is the right call.

### 3. Empty `it.skip(...)` placeholders

`payments.ts:90-91`:

```ts
it.skip('rejects a replayed webhook event id (replay protection)', () => {})
it.skip('does not re-transition a processing order (idempotent webhook)', () => {})
```

The intent (record environment-limited invariants rather than delete them) is
correct and matches the brief, but empty `it.skip` bodies are a placeholder
smell — the `describe` comment above them is what actually carries the reason.

**Recommendation:** keep the explanatory comment, drop the empty `it.skip`s (or
replace them with a single clearly-marked `describe.skip`/`it` once the raw-body
hmac mock is available).

### 4. `Math.random` for a uniqueness guarantee

`helpers.ts:87` generates phone via `Math.floor(10000000 + Math.random() * 90000000)`,
while email uses `randomUUID()`. `Math.random` is not cryptographically secure
and can in principle collide; for "globally unique" seed data that must never
collide, this is weaker than it should be.

**Recommendation:** derive the phone from `randomUUID()` too (e.g.
`parseInt(randomUUID().replaceAll('-', '').slice(0, 9), 10)`).

### 5. Direct `knex` reach for one state check (minor, acceptable)

`orders.ts:14` imports `knex` from `#src/db/index.js` and reads `orders.status`
directly to verify the order starts `pending`. This is a white-box peek, but it is
the only correct way to assert a state transition the API doesn't always surface,
and the prompt allowed it. No action needed; just note it's the single
white-box dependency in the suite.

---

## FP-DDD alignment summary

| Property                             | Aligned?                                    |
| ------------------------------------ | ------------------------------------------- |
| Black-box / public-interface only    | ✅ yes                                      |
| snake_case boundary honored          | ✅ yes                                      |
| Type safety (no `any`)               | ❌ no — liberal `any` in helpers            |
| Reuse of existing seed helpers       | ✅ yes                                      |
| Reuse of the HTTP harness            | ⚠️ partial — reinvented `chai-http` wrapper |
| Self-contained / ordered-independent | ✅ yes                                      |
| Descriptive, rule-named tests        | ✅ yes                                      |
| DRY via shared helpers               | ✅ yes                                      |

**Overall:** the _contract-testing_ design is on-target and materially
strengthens the suite; the _style_ lags the project's type discipline mainly via
`any`, and duplicates one piece of infrastructure. Nothing is blocking — these are
hardening cleanups, not correctness defects.
