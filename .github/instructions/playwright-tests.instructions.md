---
description: "Use when writing or reviewing Playwright tests. Covers assertion order, test data, tags, and requirements."
applyTo: "**/*.spec.ts"
---

# Playwright Test & Data Instructions

Use these unified rules when writing or reviewing Playwright API tests and managing test data.

---

## Test Data Layout Conventions

- Organize test data by endpoint first.
- Keep all `/users`-specific data under `test-data/users/`, including payloads, search/filter fixtures, contract fixtures, and schemas.
- Prefer endpoint-local files over top-level behavior folders when the data belongs to one endpoint.
- Reuse canonical endpoint data files instead of duplicating user records across multiple files.
- When the same canonical record repeats within an endpoint fixture file, extract a shared base fixture and compose variants from it instead of repeating inline literals.

---

## Playwright Test Instructions

Use these rules when writing or reviewing Playwright API tests.

## 1) Assertions and status codes

- In a test block, keep exactly one hard assertion at the end.
- Use `expect.soft(...)` for all earlier assertions.
- Status codes must be asserted with exact equality (`toBe(<code>)`), never ranges or multiple allowed values.
- Do not add a status-code assertion unless status code is part of what the test proves.
- Prefer one assertion per data type or object shape; avoid repeated micro-assertions for the same data.

### By test category

- `@smoke`: the final hard assertion must be an exact status-code check.
- `@contract`: do not assert status codes; focus on schema and headers.
- `@functional-*`:
  - use soft status checks when status is only a precondition for deeper validation,
  - use a final hard status check when status itself is the primary expected behavior.
- `@security-*`: treat status code as the primary validation; all other checks must be soft and come before the final hard status assertion.

## 2) Test organization and naming

### Spec file naming

- Use `{endpoint}-{method}.spec.ts` (for example, `users-get.spec.ts`).
- For `/{endpoint}/{id}`, use `{endpoint}_id-{method}.spec.ts` (for example, `users_id-put.spec.ts`).
- For non-method-specific scenarios, use a descriptive suffix (for example, `users_id-methods.spec.ts`).

### Scenario grouping

- Functional specs must be split into:
  - `Core`,
  - feature groups such as `Filtering`, `Sorting`, `Pagination`, `Search`,
  - `Edge cases`,
  - `Negative`.
- If multiple sub-categories exist, wrap each in `test.describe('<SubCategory>')`.
- `Negative` must contain failure behavior only (4xx/5xx or equivalent rejection semantics).

### Section ordering

- In both specs and requirements files, order method-scoped sections as:
`GET -> POST -> PUT -> PATCH -> DELETE -> HEAD -> other`.
- Non-method-specific sections go last.

## 3) Test data and shared code (DRY)

- Keep hardcoded datasets, payloads, and expected values under `test-data/`, organized by endpoint (for example, `test-data/users/`).
- Import test data via `@test-data/*`; do not inline hardcoded fixtures in spec files.
- Do not duplicate shared entities across test-data files; keep one canonical source and import it.
- Extract repeated setup into `tests/fixtures.ts`.
- Extract reusable helpers into `tests/helpers.ts` and import via `@tests/helpers`.
- Do not instantiate shared utilities repeatedly inside individual tests; create once at module scope or via fixtures.

## 4) Tags and requirements traceability

- Every test title must include at least one tag (for example, `@smoke`, `@functional-users`, `@contract-users`).
- Test order in each spec must match the order of corresponding entries in its requirements file (both section order and test order).

### Required requirement-file structure

- Start each file with `# <Category> Requirements`.
- Group by endpoint using `## <Endpoint>`.
- Use sub-sections as `### <HTTP Method> /<endpoint> - <SubCategory>`.
- Under each subsection, use a tag header followed by bullets:
  ```
  ### <HTTP Method> /<endpoint> - <SubCategory>

  @tag - <Tag group description>:
  - `<test name>` - <precise expected behavior and technical details>
  ```
- If a tag group has no tests yet, reserve it with `<!-- @tag-name -->`.

### Requirement entry writing rules

- Keep backticks only around the test name (before the dash), never in the description part.
- Test names and requirement entry names must be globally unique across the project.
- Do not include numeric status codes in test names or requirement entry names.
- Functional names must start with the tested method and endpoint (for example, `POST /users ...`) and should not reference other endpoints as the subject.
- Description text after the dash must be specific and behavior-focused (no vague phrases such as "correct response").
- Include exact numeric status codes in descriptions where status code is part of the behavior.
- Contract descriptions should not mention status codes.
- Avoid HTML tag names like `<a>`, `<b>`, `<i>`, `<s>`, `<em>` as placeholder variables in descriptions.

## 5) Response parsing and variable names

- Do not name `await response.json()` as `body`.
- Use semantic names that reflect content, such as `users`, `user`, `createdUser`, `updatedUser`.

## 6) Concurrency and consistency checks

- When two requests must represent the same data snapshot, run them concurrently with `Promise.all`.
- Do not fetch a baseline sequentially before the measured request when parallel tests could mutate shared state.

## 7) Validation scope and change discipline

- Validate behavior that the application can actually satisfy according to requirements.
- Do not modify unrelated existing lines in tests; change only code needed for the requested task.

## 8) Smoke vs functional validation pattern

- **Smoke tests**: validate status code and response body directly from the triggering request.
- **Functional tests**: validate persistence or side effects with follow-up reads (typically `GET`), rather than relying only on the triggering response body.

## 9) Documentation upkeep

- When adding new tests, check whether `README.md` (especially the tests section) must be updated, and update it when needed.

## 10) Definition of done checklist

- Every new or edited test has at least one valid tag.
- Matching requirement entries are added or updated in the correct requirements file.
- Requirement entry order matches spec order.
- Assertions follow the hard-last rule and category-specific status-code rules.
- No inline hardcoded test fixtures are introduced in spec files.
- Shared setup/helpers are extracted when repetition appears.
- Test and requirement names remain globally unique and behavior-focused.
- `README.md` is updated when test surface or execution guidance changes.

## 11) Flakiness prevention and isolation

- Tests must be runnable independently and in parallel without relying on execution order.
- Do not depend on shared mutable state created by other tests.
- Use deterministic inputs and stable assertions; avoid timing-sensitive checks when possible.
- Prefer explicit polling/waiting for eventual consistency over fixed delays.
- Keep retries as a last resort; fix unstable logic before increasing retry counts.

## 12) Fixture lifecycle and cleanup

- Use `beforeAll` only for immutable/shared setup that is safe across tests.
- Use `beforeEach` when setup can be mutated or must be fully isolated per test.
- Any entity created for a test must be cleaned up by teardown or by isolated test data design.
- Keep fixture responsibilities narrow; avoid large fixture chains that hide test intent.

## 13) Assertion failure diagnostics

- For critical validations, use clear assertion messages or surrounding steps that explain intent.
- Name intermediate variables semantically so failure output is self-explanatory.
- Prefer grouped/object assertions that show full diffs over many tiny assertions.

## 14) Tag taxonomy and naming grammar

- Use tags in the form `@<category>-<resource>[-<subcategory>]`.
- Recommended categories: `smoke`, `contract`, `functional`, `security`, `performance`.
- Keep subcategory suffixes aligned with section names (for example, `core`, `pagination`, `negative`).
- Do not invent one-off tag shapes if an existing project pattern already fits.

## 15) Anti-patterns and preferred alternatives

- Do not assert multiple acceptable status codes; assert one exact expected code.
- Do not put successful fallback behavior inside `Negative`; move it to `Core` or `Edge cases`.
- Do not duplicate payloads or expected entities across files; import canonical data.
- Do not add per-spec helper wrappers for generic operations; move shared logic to `tests/helpers.ts`.
- Do not use vague requirement wording such as "returns correct response"; describe observable behavior.

## 16) Quick test templates

- **Smoke template**: trigger request -> soft body checks -> final hard exact status check.
- **Contract template**: validate schema/headers/content-type only; omit status assertion unless explicitly required by policy.
- **Functional template**: trigger request -> optional soft precondition status -> follow-up `GET` -> behavior assertions -> final hard assertion.
- **Security template**: perform restricted/malformed request -> soft response-detail checks -> final hard status assertion.

