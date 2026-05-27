---
description: "Use when writing or reviewing Playwright tests. Covers assertion order, test data, tags, and requirements."
applyTo: "**/*.spec.ts"
---
# Playwright Assertion Conventions

- Hard assertion must always be the **last** assertion in a test block.
- All other assertions except the final one must use `expect.soft(...)`.
- Exact equality assertions (`.toBe(...)`) must always be the final hard assertion, not soft.
- Never use less-than or greater-than assertions for status codes. Always assert exact status codes using `.toBe(...)`.
- Never assert multiple possible status codes (e.g. `expect([200, 404]).toContain(...)`). Always assert a single exact status code using `.toBe(...)`.
- Smoke tests (@smoke) must always include a status code hard assertion `.toBe(...)` as the final check.
- Contract tests (@contract) must never include status code assertions, as they focus on schema and headers only.
- Security tests (@security-*) status code is the primary indicator of enforced policies. All response validations (e.g. masked fields, error messages) must use soft assertions and come before the hard status code assertion.
- Functional tests (@functional-*) status code assertions depend on their purpose:
  - If the status code confirms the request was successful before performing further validation (pre-condition), use a soft assertion: `expect.soft(response.status()).toBe(200);`.
  - If the status code is the primary point of validation or the final check in the test, use a hard assertion: `expect(response.status()).toBe(200);`.
- Do not add a status code assertion when the test is verifying something else (e.g. response body structure, contract schema, pagination, sorting). Only assert the status code when it is the point of the test.
- Do not make multiple separate assertions on the same type of data; combine them into a single assertion (e.g. use an array or object matcher).

# Test Data Conventions

- All hardcoded test data (e.g. expected field values, user records, payloads) must be stored in separate files inside the `test-data/` directory.
- Import test data using the `@test-data/*` path alias.
- Do not inline hardcoded data values directly in `*.spec.ts` files.
- Organize test data by endpoint first. For example, all `/users` datasets, payloads, and schemas must live under `test-data/users/`.

# Tagging and Requirements Conventions

- Every test must have at least one tag in its title (e.g. `@smoke`, `@functional-users`, `@contract-users`).
- For every new test introduced (or edited), a corresponding requirement entry must be added (or edited) to the matching numbered file in `requirements/` (e.g. `requirements/0smoke.md`, `requirements/1contract.md`, `requirements/2functional-users.md`, `requirements/3security-users.md`, `requirements/4performance-users.md`).
- Requirement entries must describe the behaviour being verified by the tagged test(s).
- Requirement entries must follow this format — a `### Endpoint - SubCategory` subsection heading, then a tag header line, followed by one bullet per test:
  ```
  ### <Endpoint> - <SubCategory>

  @tag - <Tag group description>:
  - `test1 name as general description` - <test1 testing details with technical details/params>
  - `test2 name as general description` - <test2 testing details with technical details/params>

  ```
- The general description in backticks must not contain specific values (e.g. status codes, error message strings, numeric thresholds); those belong in the technical details after the dash.
- Requirement descriptions (the technical details after the dash) must always specify the exact expected numeric HTTP status code (e.g. 200, 201, 404). Never use generic phrases like "successful status code", "returns not found", or "returns validation error" in this part. Exception: Contract tests (@contract) focus on schema and headers and should not mention status codes.
- Requirement descriptions must describe actual behavior; never use vague phrases like "returns correct response" or "returns successful result". Specify exactly what the response should contain or how the system state changed.
- Backticks must only be used for the test name (the first part before the dash). Never use backticks anywhere in the description part (after the dash).
- Never use HTML tag names (e.g. `<a>`, `<b>`, `<i>`, `<s>`, `<em>`) as placeholder variable names in requirement descriptions — they cause incorrect rendering in markdown preview. Use descriptive names instead (e.g. `<start>`, `<end>`, `<min>`, `<max>`).
- Every requirement file must start with a top-level title (`# <Category> Requirements`) on the first line, followed by `## <Endpoint>` sections (e.g. `## Users`), then `### <HTTP Method> /<endpoint> - <SubCategory>` subsections (e.g. `### GET /users - Pagination`, `### GET /users - Core`), and finally `@tag` entries with their bullet points.
- When a tag group is planned but has no tests yet, reserve its place with an HTML comment: `<!-- @tag-name -->`.

- Tests must appear in the same order within each spec file as their corresponding requirement entries appear in the matching `requirements/` file. This applies both to the order of test sections (e.g. Core, Pagination, Sorting) and to the order of individual tests within each section.

# Response Variable Naming Conventions

- Never use `body` as the variable name for `await response.json()`. Use a name that reflects what the response contains (e.g. `users` for a list, `user` for a single record, `createdUser` for a POST response, `updatedUser` for a PUT response).

# Spec File Naming Conventions

- Spec files must be named after the endpoint and HTTP method they test, using the pattern `{endpoint}-{method}.spec.ts` (e.g. `users-get.spec.ts`, `users-post.spec.ts`).
- For `/{endpoint}/{id}` routes, use an underscore before `id`: `{endpoint}_id-{method}.spec.ts` (e.g. `users_id-get.spec.ts`, `users_id-put.spec.ts`).
- Special-purpose files (e.g. unsupported method checks) use a descriptive suffix instead of a method name (e.g. `users_id-methods.spec.ts`).

# Test Structure Conventions

- Functional tests (@functional-*) must be divided into the following sub-categories:
  - `Core`: Primary positive scenarios and basic data retrieval/manipulation.
  - Special cases (e.g., `Filtering`, `Sorting`, `Pagination`, `Search`): Specific feature-based behavioral scenarios.
  - `Edge cases`: Other positive scenarios, boundary values, and fallback behaviors that do not result in an error.
  - `Negative`: Failure behaviors (4xx/5xx responses).
- When a spec file contains tests from multiple distinct sub-categories (identified by different tag suffixes, e.g. `@tag-name-pagination`, `@tag-name-negative`), wrap each sub-category's tests in a `test.describe` block. Name each block after the sub-category (e.g. `'Core'`, `'Pagination'`, `'Negative'`).
- `Negative` blocks must verify failure behavior only (4xx/5xx or equivalent rejection semantics). Do not place successful outcomes (2xx, accepted fallbacks, permissive edge behavior) in `Negative`; put those in `Core` or a dedicated `Edge cases` block/tag instead.

# Test Documentation Conventions

- Do not repeat test data structures across tests; store all test payloads and mock data in the `test-data/` directory and import them via the `@test-data/*` alias.
- Do not repeat setup logic across tests; extract shared setup into Playwright fixtures in `tests/fixtures.ts`.
- Do not create per-spec utility helper functions (e.g. request measurement wrappers); extract them to `tests/helpers.ts` and import via `@tests/helpers`.
- Do not instantiate shared utilities (e.g. `Validator`) inside individual test blocks; declare them once at module scope or inside a shared fixture.
- Do not duplicate shared entities (e.g. user records, IDs, names) across multiple test-data files. Define them once in a canonical file (e.g. `test-data/users/users.data.json`) and import that file wherever the same values are needed.
- Test names (the text before the tag suffix) must be unique across all spec files in the project, and the corresponding requirement entry names (the text in backticks) must also be unique across all requirement files. When writing tests for a new endpoint or variant that is similar to an existing one, differentiate the name to reflect the specific resource or context (e.g. add "for a single user" or "on /endpoint/{id}").
- Never include numeric HTTP status codes (e.g. `200`, `401`, `422`) in test names or requirement entry names. Use readable behavior-focused wording instead (e.g. "returns unauthorized response", "returns validation error", "returns successful response with no body").
- Functional test names and requirement entry names must always start with the HTTP method and endpoint being tested (e.g., `POST /users`). They must never reference other HTTP methods or endpoints; use generic descriptions instead (e.g., `POST /users created user is present in the existing users response` instead of `The newly created user is present in the GET /users response`).

# Section Ordering Convention

- Endpoint sections within each requirements file and each spec file must be ordered by HTTP method in the sequence: GET → POST → PUT → PATCH → DELETE → HEAD → other. This applies to top-level endpoint groupings (e.g. `## GET /users`, `## POST /users`, `## PUT /users/{id}`) as well as method-scoped describe blocks within the same spec file. Sections that are not method-specific (e.g. error response content-type checks, mocked data validations) are treated as "other" and appear last.

# Concurrency Conventions

- When a test needs to compare results from two separate API calls that must reflect the same data state (e.g. fetching all users as a baseline and then fetching a filtered/paginated subset), always fire both requests concurrently using `Promise.all`. Never fetch a baseline sequentially before making the measured request — other tests running in parallel may mutate shared state between the two calls.

# Test Validation Principles

- Validate application behavior against requirements after implementing tests. Do not create tests that will not work - ensure that the application actually fulfills the requirements
- Do not modify existing lines in test files unless explicitly asked to. Only add new code or change the lines directly related to the requested task.

# Smoke vs Functional Test Patterns

- **Smoke tests**: Assert both the status code and the response body returned directly from the triggering request (e.g. POST response body, PUT response body). This confirms the endpoint is reachable and returns a well-formed response.
- **Functional tests**: Do not rely on the triggering response body to verify correctness. Instead, follow up with a separate GET request and assert against that response. This confirms the change actually persisted in the system (e.g. after PUT, fetch the resource by ID and assert the fields match the sent payload).

# README Update Conventions

- Whenever adding new tests, always check if the `README.md` (especially the Tests section) needs updating to reflect the new tests. Update it if necessary.
