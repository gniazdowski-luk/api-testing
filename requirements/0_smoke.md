# Smoke Requirements
@smoke - Smoke tests:

## Users

### GET /users

- [x] `checks that the endpoint for retrieving users is accessible and returns a successful response` - GET /users response body is an array (soft) and status code is 200.

### GET /users/{id}

- [x] `checks that the endpoint for retrieving a user by ID is accessible and returns a successful response` - GET /users/{id} with a valid user ID returns status code 200 and response body contains the user object with correct id field (soft).

### POST /users

- [x] `checks that the endpoint for creating a user is accessible and returns a successful response` - POST /users with valid payload returns status code 201 and response body contains the created user object (soft).

