# Contract Requirements

## Users

### GET /users

@contract-users-get - Contract tests to verify that the GET /users endpoint adheres to the defined contract:
- `checks that the response matches the expected contract schema` - GET /users response matches contract schema (validates structure and data types).
- `checks that the response includes the correct Content-Type header` - GET /users response includes a Content-Type header whose value is application/json or application/json; charset=utf-8.

### GET /users - Mocked

@contract-users-get-mocked - Contract tests with mocked data to verify that the GET /users endpoint correctly handles various scenarios:
- `verifies that a user object missing required fields is correctly rejected` - mocked invalid data fails contract schema validation (missing email, avatar).
- `verifies that a user object with incorrect field types is correctly rejected` - mocked data with wrong field types fails schema validation (e.g. email as number, firstname as boolean).
- `verifies that a plain object at the root level is correctly rejected` - mocked data with non-array root fails schema validation.
- `verifies that an array containing a null item is correctly rejected` - mocked data with null user entry fails schema validation.
- `verifies that a user object with avatar as a number instead of a string is correctly rejected` - mocked data with empty string required fields fails schema validation (avatar as number).
- `verifies that an empty array is a valid response per the schema` - mocked empty array passes schema validation (edge case baseline).

### POST /users

@contract-users-post - Contract tests to verify that the POST /users endpoint adheres to the defined contract:
- `checks that the POST response matches the expected user schema` - POST /users 201 response body matches the userSchema contract (validates structure and data types of the created user object).
- `checks that the POST response includes the correct Content-Type header` - POST /users response includes a Content-Type header whose value is application/json or application/json; charset=utf-8.


