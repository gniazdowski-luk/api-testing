# Security Requirements

## Users

### GET /users

@security-authorization-get-users - Security tests for GET /users authorization:
- `checks that unauthenticated access returns the correct status code with masked sensitive fields` - GET /users without Authorization header returns 200 with masked email, lastname, and password.
- `checks that an empty Bearer token returns the correct status code with masked sensitive fields` - GET /users with empty Bearer token returns 200 with masked fields.
- `checks that an invalid Bearer token returns the correct status code with masked sensitive fields` - GET /users with wrong Bearer token returns 200 with masked fields.
- `checks that wrong Basic auth returns the correct status code with masked sensitive fields` - GET /users with wrong Basic auth returns 200 with masked fields.
- `checks that a valid token without Cookie returns the correct status code with masked sensitive fields` - GET /users with valid Bearer token but without Cookie returns 200 with masked fields.

### PUT /users

@security-authorization-put-users - Security tests for PUT /users authorization:
- `checks that missing authorization returns the correct status code and error message` - PUT /users without Authorization header returns 401 with "Access token not provided!".
- `checks that an empty Bearer token returns the correct status code and error message` - PUT /users with empty Bearer token returns 401 with "Access token not provided!".
- `checks that an invalid Bearer token returns the correct status code and error message` - PUT /users with wrong Bearer token returns 401 with "Access token not provided!".
- `checks that wrong Basic auth returns the correct status code and error message` - PUT /users with wrong Basic auth returns 401 with "Access token not provided!".
- `checks that a valid token without Cookie returns the correct status code and error message` - PUT /users with valid Bearer token but without Cookie returns 401 with "Access token for given user is invalid!".

### PATCH /users

@security-authorization-patch-users - Security tests for PATCH /users authorization:
- `checks that missing authorization returns the correct status code and error message` - PATCH /users without Authorization header returns 401 with "Access token not provided!".
- `checks that an empty Bearer token returns the correct status code and error message` - PATCH /users with empty Bearer token returns 401 with "Access token not provided!".
- `checks that an invalid Bearer token returns the correct status code and error message` - PATCH /users with wrong Bearer token returns 401 with "Access token not provided!".
- `checks that wrong Basic auth returns the correct status code and error message` - PATCH /users with wrong Basic auth returns 401 with "Access token not provided!".
- `checks that a valid token without Cookie returns the correct status code and error message` - PATCH /users with valid Bearer token but without Cookie returns 401 with "Access token for given user is invalid!".

### DELETE /users

@security-authorization-delete-users - Security tests for DELETE /users authorization:
- `checks that missing authorization returns the correct status code and error message` - DELETE /users without Authorization header returns 401 with "Access token not provided!".
- `checks that an empty Bearer token returns the correct status code and error message` - DELETE /users with empty Bearer token returns 401 with "Access token not provided!".
- `checks that an invalid Bearer token returns the correct status code and error message` - DELETE /users with wrong Bearer token returns 401 with "Access token not provided!".
- `checks that wrong Basic auth returns the correct status code and error message` - DELETE /users with wrong Basic auth returns 401 with "Access token not provided!".
- `checks that a valid token without Cookie returns the correct status code and error message` - DELETE /users with valid Bearer token but without Cookie returns 401 with "Access token for given user is invalid!".

### GET /users - CORS Headers

@security-cors-get-users - Security tests verifying CORS response headers are present on the /users endpoint:
- `checks that the response includes the Access-Control-Allow-Origin header` - GET /users with an Origin header set to the base URL origin returns an Access-Control-Allow-Origin response header matching that origin.
- `checks that an OPTIONS preflight request returns the correct CORS headers` - OPTIONS /users with Origin, Access-Control-Request-Method, and Access-Control-Request-Headers returns Access-Control-Allow-Methods and Access-Control-Allow-Headers in the response (browser preflight scenario from PDF CORS section).

### /users - Disallowed HTTP Methods

@security-methods-users - Security tests verifying that HTTP methods not supported at the /users endpoint are rejected by the server:
- `checks that sending an unsupported HTTP method returns the correct status code` - sending TRACE to /users (unauthenticated) returns 401; TRACE is not in the server's list of CORS-allowed methods (GET, HEAD, PUT, PATCH, POST, DELETE) and the auth middleware rejects it before route handling.
