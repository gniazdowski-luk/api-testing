---
description: "Use when writing or reviewing Playwright tests. Covers assertion order, test data, tags, and requirements."
applyTo: "**/*.spec.ts"
---
# Playwright Assertion Conventions

- Hard assertion must always be the **last** assertion in a test block.
- All other assertions except the final one must use `expect.soft(...)`.
- Exact equality assertions (`.toBe(...)`) must always be the final hard assertion, not soft.
- Never use less-than or greater-than assertions for status codes. Always assert exact status codes using `.toBe(...)`.
- Status code assertions are more important than response body assertions. The status code `.toBe(...)` must always be the final hard assertion in that cases. Response body/message assertions must use `expect.soft(...)` and appear before the status code assertion.
- Do not add a status code assertion when the test is verifying something else (e.g. response body structure, pagination, sorting). Only assert the status code when it is the point of the test.
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
- Backticks must only be used for the test name (the first part before the dash). Never use backticks anywhere in the description part (after the dash).
- Never use HTML tag names (e.g. `<a>`, `<b>`, `<i>`, `<s>`, `<em>`) as placeholder variable names in requirement descriptions — they cause incorrect rendering in markdown preview. Use descriptive names instead (e.g. `<start>`, `<end>`, `<min>`, `<max>`).
- Every requirement file must start with a top-level title (`# <Category> Requirements`) on the first line, followed by `## <Endpoint>` sections (e.g. `## Users`), then `### <HTTP Method> /<endpoint> - <SubCategory>` subsections (e.g. `### GET /users - Pagination`, `### GET /users - Core`), and finally `@tag` entries with their bullet points.
- When a tag group is planned but has no tests yet, reserve its place with an HTML comment: `<!-- @tag-name -->`.
- Tests must appear in the same order within each spec file as their corresponding requirement entries appear in the matching `requirements/` file. This applies both to the order of test sections (e.g. Core, Pagination, Sorting) and to the order of individual tests within each section.

# Test Structure Conventions

- When a spec file contains tests from multiple distinct sub-categories (identified by different tag suffixes, e.g. `@tag-name-pagination`, `@tag-name-negative`), wrap each sub-category's tests in a `test.describe` block. Name each block after the sub-category (e.g. `'Core'`, `'Pagination'`, `'Negative'`).

# Test Documentation Conventions

- Do not repeat test data structures across tests; store all test payloads and mock data in the `test-data/` directory and import them via the `@test-data/*` alias.
- Do not repeat setup logic across tests; extract shared setup into Playwright fixtures in `tests/fixtures.ts`.
- Do not create per-spec utility helper functions (e.g. request measurement wrappers); extract them to `tests/helpers.ts` and import via `@tests/helpers`.
- Do not instantiate shared utilities (e.g. `Validator`) inside individual test blocks; declare them once at module scope or inside a shared fixture.
- Do not duplicate shared entities (e.g. user records, IDs, names) across multiple test-data files. Define them once in a canonical file (e.g. `test-data/users/users.data.json`) and import that file wherever the same values are needed.

# Test Validation Principles

- Validate application behavior against requirements after implementing tests. Do not create tests that will not work - ensure that the application actually fulfills the requirements
- Do not modify existing lines in test files unless explicitly asked to. Only add new code or change the lines directly related to the requested task.

# README Update Conventions

- Whenever adding new tests, always check if the `README.md` (especially the Tests section) needs updating to reflect the new tests. Update it if necessary.
