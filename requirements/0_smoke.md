# Smoke Requirements

## Users

### GET /users

@smoke-users-get - Smoke tests to verify GET /users:
- `GET /users endpoint is accessible` - GET /users response body is an array and status code is 200.

### GET /users/{id}

@smoke-users_id-get - Smoke tests to verify GET /users/{id}:
- `GET /users/{id} endpoint is accessible` - GET /users/{id} response body contains the user object and status code is 200.

### POST /users

@smoke-users-post - Smoke tests to verify POST /users:
- `POST /users endpoint is accessible` - POST /users response body contains the created user object and status code is 201.

### PUT /users/{id}

@smoke-users-put - Smoke tests to verify PUT /users/{id}:
- `PUT /users/{id} endpoint is accessible` - PUT /users/{id} response body contains the updated user object and status code is 200.

### PATCH /users/{id}

@smoke-users_id-patch - Smoke tests to verify PATCH /users/{id}:
- `PATCH /users/{id} endpoint is accessible` - PATCH /users/{id} response body contains the partially updated user object and status code is 200.

### DELETE /users/{id}

@smoke-users_id-delete - Smoke tests to verify DELETE /users/{id}:
- `DELETE /users/{id} endpoint is accessible` - DELETE /users/{id} response body is empty and status code is 200.

### HEAD /users

@smoke-users-head - Smoke tests to verify HEAD /users:
- `HEAD /users endpoint is accessible` - HEAD /users response body is empty and status code is 200.
