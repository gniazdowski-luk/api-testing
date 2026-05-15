# Security Requirements

## Users

### Users - GET

@security-authorization-get-users - Security tests for GET /users authorization:
- `checks that unauthenticated access returns the correct status code with masked sensitive fields` - GET /users without Authorization header returns 200 with masked email, lastname, and password.
- `checks that an empty Bearer token returns the correct status code with masked sensitive fields` - GET /users with empty Bearer token returns 200 with masked fields.
- `checks that an invalid Bearer token returns the correct status code with masked sensitive fields` - GET /users with wrong Bearer token returns 200 with masked fields.
- `checks that wrong Basic auth returns the correct status code with masked sensitive fields` - GET /users with wrong Basic auth returns 200 with masked fields.
- `checks that a valid token without Cookie returns the correct status code with masked sensitive fields` - GET /users with valid Bearer token but without Cookie returns 200 with masked fields.

<!-- @security-authorization-post-users -->

### Users - PUT

@security-authorization-put-users - Security tests for PUT /users authorization:
- `checks that missing authorization returns the correct status code and error message` - PUT /users without Authorization header returns 401 with "Access token not provided!".
- `checks that an empty Bearer token returns the correct status code and error message` - PUT /users with empty Bearer token returns 401 with "Access token not provided!".
- `checks that an invalid Bearer token returns the correct status code and error message` - PUT /users with wrong Bearer token returns 401 with "Access token not provided!".
- `checks that wrong Basic auth returns the correct status code and error message` - PUT /users with wrong Basic auth returns 401 with "Access token not provided!".
- `checks that a valid token without Cookie returns the correct status code and error message` - PUT /users with valid Bearer token but without Cookie returns 401 with "Access token for given user is invalid!".

### Users - PATCH

@security-authorization-patch-users - Security tests for PATCH /users authorization:
- `checks that missing authorization returns the correct status code and error message` - PATCH /users without Authorization header returns 401 with "Access token not provided!".
- `checks that an empty Bearer token returns the correct status code and error message` - PATCH /users with empty Bearer token returns 401 with "Access token not provided!".
- `checks that an invalid Bearer token returns the correct status code and error message` - PATCH /users with wrong Bearer token returns 401 with "Access token not provided!".
- `checks that wrong Basic auth returns the correct status code and error message` - PATCH /users with wrong Basic auth returns 401 with "Access token not provided!".
- `checks that a valid token without Cookie returns the correct status code and error message` - PATCH /users with valid Bearer token but without Cookie returns 401 with "Access token for given user is invalid!".

### Users - DELETE

@security-authorization-delete-users - Security tests for DELETE /users authorization:
- `checks that missing authorization returns the correct status code and error message` - DELETE /users without Authorization header returns 401 with "Access token not provided!".
- `checks that an empty Bearer token returns the correct status code and error message` - DELETE /users with empty Bearer token returns 401 with "Access token not provided!".
- `checks that an invalid Bearer token returns the correct status code and error message` - DELETE /users with wrong Bearer token returns 401 with "Access token not provided!".
- `checks that wrong Basic auth returns the correct status code and error message` - DELETE /users with wrong Basic auth returns 401 with "Access token not provided!".
- `checks that a valid token without Cookie returns the correct status code and error message` - DELETE /users with valid Bearer token but without Cookie returns 401 with "Access token for given user is invalid!".
