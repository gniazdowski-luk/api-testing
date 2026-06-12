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

This project uses a CI pipeline to ensure code quality and reliability. The pipeline automatically runs (on QA environment)the following checks on every pull request:

- Code formatting and linting using Biome.
- Smoke and Contract tests.

### Manual Trigger

Functional, Security and Performance tests are not run automatically on pull requests. These tests can be triggered manually for specific branches and environments by enabling the respective options in the CI pipeline.

## Application coverage

The tests in this project cover the following API endpoints of the GAD application:
- /users
- /users/{id}

### Backlog

The following are not covered by tests yet and are planned for future implementation:
- other endpoints (e.g. /articles, /comments, /authentication)
- JWT token detailed scenarios
- E2E tests covering more complex scenarios and interactions between multiple endpoints
