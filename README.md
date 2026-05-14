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

- [Smoke tests](./requirements/smoke) - basic API tests to check if the endpoints are working.

- [Contract tests](./requirements/contract) - tests to check if the API responses match the expected contract.

- [Functional tests](./requirements/functional-users.md) - tests to check the functionality of the API endpoints.

- [Security tests](./requirements/security-users.md) - tests to check that sensitive fields are masked for unauthenticated or improperly authenticated requests.

- [Performance tests](./requirements/performance-users.md) - tests to check that endpoints respond within defined SLA thresholds.

## Tests execution

Setup

- [Authentication](./setup/authentication) - steps to obtain authentication token for tests: `npm run setup`

Tests

- [Smoke tests](./tests/smoke/): `npm run tests:smoke`
- [Contract tests](./tests/contract/): `npm run tests:contract`
- [Functional tests](./tests/functional/): `npm run tests:functional`
- [Security tests](./tests/security/): `npm run tests:security`
- [Performance tests](./tests/performance/): `npm run tests:performance`

or run tests for specific requirement using tags, for example: `npx playwright test --grep @smoke`
