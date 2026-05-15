# Contract Requirements

## Users

### Users - Contract

@contract-users - Contract tests for users endpoint:
- `checks that the response matches the expected contract schema` - GET /users response matches contract schema (validates structure and data types).

### Users - Mocked

@contract-users-mocked - Contract tests using mocked data to verify schema validation catches invalid structures:
- `verifies that a user object missing required fields is correctly rejected` - mocked invalid data fails contract schema validation (missing email, avatar).
- `verifies that a user object with incorrect field types is correctly rejected` - mocked data with wrong field types fails schema validation (e.g. email as number, firstname as boolean).
- `verifies that a plain object at the root level is correctly rejected` - mocked data with non-array root fails schema validation.
- `verifies that an array containing a null item is correctly rejected` - mocked data with null user entry fails schema validation.
- `verifies that a user object with avatar as a number instead of a string is correctly rejected` - mocked data with empty string required fields fails schema validation (avatar as number).
- `verifies that an empty array is a valid response per the schema` - mocked empty array passes schema validation (edge case baseline).
