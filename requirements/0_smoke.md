# Smoke Requirements
@smoke - Smoke tests:

## Users

### GET /users

- `checks that the endpoint for retrieving users is accessible and returns a successful response` - GET /users response body is an array (soft) and status code is 200.

### POST /users

- `checks that the endpoint for creating a user is accessible and returns a successful response` - POST /users with valid payload returns status code 201 and response body contains the created user object (soft).

