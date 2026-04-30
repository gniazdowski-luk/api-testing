# api-testing

GAD application API testing project using Playwright with TypeScript.

## Setup

Install project dependencies: `npm install`

Install Playwright framework: `npx playwright install`

## Requirements

- [Smoke tests](./requirements/smoke) - basic API tests to check if the endpoints are working.

- [Contract tests](./requirements/contract) - tests to check if the API responses match the expected contract.

- [Functional tests](./requirements/functional) - tests to check the functionality of the API endpoints.

## Tests execution

Setup

- [Authentication](./setup/authentication) - steps to obtain authentication token for tests: `npm run setup`

Tests 

- [Smoke tests](./tests/smoke/): `npm run tests:smoke`
- [Contract tests](./tests/contract/): `npm run tests:contract`
- [Functional tests](./tests/functional/): `npm run tests:functional`

or run tests for specific requirement using tags, for example: `npx playwright test --grep @smoke`
