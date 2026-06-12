# api-testing

GAD application API testing project using Playwright with TypeScript.

## GAD Application setup

Before running tests locally, you need to have the GAD application running. Clone and start the backend server:

1. Clone repository: `git clone https://github.com/jaktestowac/gad-gui-api-demo`
2. Install dependencies and run the server: `npm install` and `npm start`

## Project setup

Install project dependencies: `npm install`

Install Playwright framework: `npx playwright install`

## Requirements

- [Smoke tests](./requirements/0_smoke.md) - basic API tests to check if the endpoints are working.

- [Contract tests](./requirements/1_contract.md) - tests to check if the API responses match the expected contract.

- [Functional tests](./requirements/2_functional-users.md) - tests to check the functionality of the API endpoints.

- [Security tests](./requirements/3_security-users.md) - tests to check that sensitive fields are masked for unauthenticated or improperly authenticated requests.

- [Performance tests](./requirements/4_performance-users.md) - tests to check that endpoints respond within defined SLA thresholds.

## Tests execution

### Authentication

- [Authentication](./setup/authentication) - steps to obtain authentication token for tests: `npm run setup`

### Tests

- [Smoke tests](./tests/0_smoke/): `npm run tests:smoke`
- [Contract tests](./tests/1_contract/): `npm run tests:contract`
- [Functional tests](./tests/2_functional/): `npm run tests:functional`
- [Security tests](./tests/3_security/): `npm run tests:security`
- [Performance tests](./tests/4_performance/): `npm run tests:performance`

or run tests for specific requirement using tags, for example: `npx playwright test --grep @smoke`

### Restore DB

- [Restore db](./setup/restore-db) - step to restore the database to a clean state after (or before) running tests: `npm run restore-db`

## Reporting

After running tests with command `npx playwright test`, Playwright generates an HTML report. To open the report, run: `npx playwright show-report`

## Code Formatting and Linting

This project uses [Biome](https://biomejs.dev/) for code formatting and linting. Biome ensures consistent code style and helps catch common issues.

- Check for issues: `npm run biome:check`
- Automatically fix issues: `npm run biome:fix`

## Continuous Integration (CI)

This project uses a CI pipeline to ensure code quality and reliability. The pipeline is triggered on every pull request targeting `main`, and can also be triggered manually.

### Pull Request pipeline

The following jobs run automatically on every pull request:

1. **Requirements Traceability Check** — validates that all requirements are covered by tests using `npm run check:requirements-traceability`.
2. **Detect Changed Tests** — identifies which spec files were modified in the PR (functional / security / performance) so only relevant tests are run.
3. **Quality Check** — runs Biome formatting and linting (`npm run biome:check`). Requires the traceability check to pass first.
4. **Smoke Tests** — runs the full smoke suite after quality and traceability checks pass.
5. **Contract Tests** — runs the full contract suite after smoke tests pass.
6. **PR Functional Tests** — runs only the changed functional spec files (skipped if no functional files changed). Requires contract tests to pass.
7. **PR Security Tests** — runs only the changed security spec files (skipped if no security files changed). Runs after PR functional tests.
8. **PR Performance Tests** — runs only the changed performance spec files (skipped if no performance files changed). Runs after PR security tests.
9. **PR Gate** — final blocking check that fails the PR if any of the above jobs failed or were cancelled.

Playwright HTML reports for each test job are uploaded as artifacts (retained for 7 days).

### Manual Trigger

The pipeline can also be triggered manually (`workflow_dispatch`) with the following options:

| Input | Description | Default |
|---|---|---|
| `environment` | Target environment (`qa` \| `staging`) | `qa` |
| `run_functional` | Run full functional test suite | `false` |
| `run_security` | Run full security test suite | `false` |
| `run_performance` | Run full performance test suite | `false` |

On a manual run, smoke and contract tests always execute. Functional, security, and performance suites run only when their respective options are enabled, and each suite depends on the previous one passing. After all test jobs complete, the merged HTML report is published to **GitHub Pages**.

## Application coverage

The tests in this project cover the following API endpoints of the GAD application:
- /users
- /users/{id}

### Backlog

The following are not covered by tests yet and are planned for future implementation:
- other endpoints (e.g. /articles, /comments, /authentication)
- JWT token detailed scenarios
- E2E tests covering more complex scenarios and interactions between multiple endpoints
