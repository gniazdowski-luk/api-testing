---
description: "Use when writing or reviewing Playwright tests. Covers assertion order, test data, tags, and requirements."
applyTo: "**/*.spec.ts"
---
# Playwright Assertion Conventions

- Hard assertion must always be the **last** assertion in a test block.
- All other assertions except the final one must use `expect.soft(...)`.

# Test Data Conventions

- All hardcoded test data (e.g. expected field values, user records, payloads) must be stored in separate files inside the `test-data/` directory.
- Import test data using the `@test-data/*` path alias.
- Do not inline hardcoded data values directly in `*.spec.ts` files.

# Tagging and Requirements Conventions

- Every test must have at least one tag in its title (e.g. `@smoke`, `@functional-users`, `@contract-users`).
- For every new test introduced (or edited), a corresponding requirement entry must be added (or edited) to the matching file in `requirements/` (e.g. `requirements/functional-users.md`, `requirements/smoke.md`, `requirements/contract.md`).
- Requirement entries must describe the behaviour being verified by the tagged test(s).

# DRY Conventions

- Do not repeat test data structures across tests; store all test payloads and mock data in the `test-data/` directory and import them via the `@test-data/*` alias.
- Do not repeat setup logic across tests; extract shared setup into Playwright fixtures in `tests/fixtures.ts`.
- Do not instantiate shared utilities (e.g. `Validator`) inside individual test blocks; declare them once at module scope or inside a shared fixture.
