@contract-users - Contract tests for users endpoint.
- `GET /users response matches contract schema` - checks that the response from the endpoint for retrieving users matches the expected contract schema, ensuring that the structure and data types of the response are correct.

@contract-users-mocked - Contract tests using mocked data to verify schema validation catches invalid structures.
- `mocked invalid data fails contract schema validation` - verifies that a user object missing required fields (`email`, `avatar`) is correctly rejected by the schema validator.
- `mocked data with wrong field types fails schema validation` - verifies that a user object with incorrect field types (e.g. `email` as number, `firstname` as boolean) is correctly rejected.
- `mocked data with non-array root fails schema validation` - verifies that a plain object (instead of an array) at the root level is correctly rejected.
- `mocked data with null user entry fails schema validation` - verifies that an array containing a `null` item is correctly rejected.
- `mocked data with empty string required fields fails schema validation` - verifies that a user object with `avatar` as a number instead of a string is correctly rejected.
- `mocked empty array passes schema validation` - verifies that an empty array is a valid response per the schema (edge case baseline).
