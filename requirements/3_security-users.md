# Security Requirements - Users

## GET /users

### GET /users - Authorization

@security-users-get-authorization - Security tests for GET /users authorization:
- `GET /users unauthenticated access returns masked sensitive fields` - GET /users without Authorization header returns status code 200 with masked email, lastname, and password.
- `GET /users empty Bearer token returns masked sensitive fields` - GET /users with empty Bearer token returns status code 200 with masked fields.
- `GET /users invalid Bearer token returns masked sensitive fields` - GET /users with wrong Bearer token returns status code 200 with masked fields.
- `GET /users wrong Basic auth returns masked sensitive fields` - GET /users with wrong Basic auth returns status code 200 with masked fields.
- `GET /users valid token without Cookie returns masked sensitive fields` - GET /users with valid Bearer token but without Cookie returns status code 200 with masked fields.

### GET /users - CORS Headers

@security-users-get-cors - Security tests verifying CORS response headers are present on the /users endpoint:
- `GET /users access control allow origin header is included` - GET /users with an Origin header returns status code 200 and Access-Control-Allow-Origin header matching the request origin.
- `OPTIONS /users preflight request returns CORS headers` - OPTIONS /users with Origin and preflight headers returns status code 204 and includes Access-Control-Allow-Methods and Access-Control-Allow-Headers.

### GET /users - Security Response Headers

@security-users-get-headers - Security tests verifying that the /users endpoint returns expected security-related HTTP response headers:
- `GET /users response includes X-Content-Type-Options header` - GET /users response includes X-Content-Type-Options: nosniff and status code 200.
- `GET /users response includes X-Frame-Options header` - GET /users response includes X-Frame-Options: SAMEORIGIN and status code 200.
- `GET /users response includes Content-Security-Policy header` - GET /users response includes a Content-Security-Policy header and status code 200.

## GET /users/{id}

### GET /users/{id} - Authorization

@security-users_id-get-authorization - Security tests for GET /users/{id} authorization:
- `GET /users/{id} unauthenticated access returns masked sensitive fields` - GET /users/{id} without Authorization header returns status code 200 with masked email, lastname, and password.
- `GET /users/{id} empty Bearer token returns masked sensitive fields` - GET /users/{id} with empty Bearer token returns status code 200 with masked fields.
- `GET /users/{id} invalid Bearer token returns masked sensitive fields` - GET /users/{id} with wrong Bearer token returns status code 200 with masked fields.
- `GET /users/{id} wrong Basic auth returns masked sensitive fields` - GET /users/{id} with wrong Basic auth returns status code 200 with masked fields.
- `GET /users/{id} valid token without Cookie returns masked sensitive fields` - GET /users/{id} with valid Bearer token but without Cookie returns status code 200 with masked fields.

### GET /users/{id} - CORS Headers

@security-users_id-get-cors - Security tests verifying CORS response headers are present on the /users/{id} endpoint:
- `GET /users/{id} access control allow origin header is included` - GET /users/{id} with an Origin header returns status code 200 and Access-Control-Allow-Origin matching the request origin.
- `OPTIONS /users/{id} preflight request returns CORS headers` - OPTIONS /users/{id} with Origin and preflight headers returns status code 204 and includes Access-Control-Allow-Methods and Access-Control-Allow-Headers.

### GET /users/{id} - Security Response Headers

@security-users_id-get-headers - Security tests verifying that the /users/{id} endpoint returns expected security-related HTTP response headers:
- `GET /users/{id} response includes X-Content-Type-Options header` - GET /users/{id} response includes X-Content-Type-Options: nosniff and status code 200.
- `GET /users/{id} response includes X-Frame-Options header` - GET /users/{id} response includes X-Frame-Options: SAMEORIGIN and status code 200.
- `GET /users/{id} response includes Content-Security-Policy header` - GET /users/{id} response includes a Content-Security-Policy header and status code 200.

## POST /users

### POST /users - CORS Headers

@security-users-post-cors - Security tests verifying CORS response headers are present on the POST /users endpoint:
- `POST /users access control allow origin header is included` - POST /users with an Origin header returns status code 201 and Access-Control-Allow-Origin header matching the request origin.
- `OPTIONS /users preflight request for POST returns CORS headers` - OPTIONS /users with Origin and preflight headers for POST returns status code 204 and includes Access-Control-Allow-Methods (including POST) and Access-Control-Allow-Headers.

## POST /users/{id}

### POST /users/{id} - Disallowed HTTP Methods

@security-users_id-post-methods - Security tests verifying that HTTP methods not supported at the /users/{id} endpoint are rejected by the server:
- `POST /users/{id} unsupported method returns not found` - POST /users/{id} with a valid body and an existing ID returns status code 404.
- `POST /users/{id} unsupported method for non-existent user returns not found` - POST /users/{id} with a valid body and a non-existing ID returns status code 404.

## PUT /users

### PUT /users - Authorization

@security-users-put-authorization - Security tests for PUT /users authorization:
- `PUT /users unauthenticated access returns error` - PUT /users without Authorization header returns status code 401 with "Access token not provided!".
- `PUT /users empty Bearer token returns error` - PUT /users with empty Bearer token returns status code 401 with "Access token not provided!".
- `PUT /users invalid Bearer token returns error` - PUT /users with wrong Bearer token returns status code 401 with "Access token not provided!".
- `GET /users inverted ID range returns not found` - PUT /users with wrong Basic auth returns status code 401 with "Access token not provided!".
- `PUT /users valid token without Cookie returns error` - PUT /users with valid Bearer token but without Cookie returns status code 401 with "Access token for given user is invalid!".

### PUT /users - Expired Token

@security-users-put-expired_token - Security tests verifying that an expired token is rejected on protected endpoints:
- `PUT /users expired token returns error` - PUT /users with a token that has expired returns status code 401.

## PUT /users/{id

### PUT /users/{id} - Authorization

@security-users_id-put-authorization - Security tests for PUT /users/{id} authorization:
- `PUT /users/{id} unauthenticated access returns error` - PUT /users/{id} without Authorization header returns status code 401 with "Access token not provided!".
- `PUT /users/{id} empty Bearer token returns error` - PUT /users/{id} with empty Bearer token returns status code 401 with "Access token not provided!".
- `PUT /users/{id} invalid Bearer token returns error` - PUT /users/{id} with wrong Bearer token returns status code 401 with "Access token not provided!".
- `PUT /users/{id} wrong Basic auth returns error` - PUT /users/{id} with wrong Basic auth returns status code 401 with "Access token not provided!".
- `PUT /users/{id} valid token without Cookie returns error` - PUT /users/{id} with valid Bearer token but without Cookie returns status code 401 with "Access token for given user is invalid!".

## PATCH /users

### PATCH /users - Authorization

@security-users-patch-authorization - Security tests for PATCH /users authorization:
- `PATCH /users unauthenticated access returns error` - PATCH /users without Authorization header returns status code 401 with "Access token not provided!".
- `PATCH /users empty Bearer token returns error` - PATCH /users with empty Bearer token returns status code 401 with "Access token not provided!".
- `PATCH /users invalid Bearer token returns error` - PATCH /users with wrong Bearer token returns status code 401 with "Access token not provided!".
- `PATCH /users wrong Basic auth returns error` - PATCH /users with wrong Basic auth returns status code 401 with "Access token not provided!".
- `PATCH /users valid token without Cookie returns error` - PATCH /users with valid Bearer token but without Cookie returns status code 401 with "Access token for given user is invalid!".

## DELETE /users

### DELETE /users - Authorization

@security-users-delete-authorization - Security tests for DELETE /users authorization:
- `DELETE /users unauthenticated access returns error` - DELETE /users without Authorization header returns status code 401 with "Access token not provided!".
- `DELETE /users empty Bearer token returns error` - DELETE /users with empty Bearer token returns status code 401 with "Access token not provided!".
- `DELETE /users invalid Bearer token returns error` - DELETE /users with wrong Bearer token returns status code 401 with "Access token not provided!".
- `DELETE /users wrong Basic auth returns error` - DELETE /users with wrong Basic auth returns status code 401 with "Access token not provided!".
- `DELETE /users valid token without Cookie returns error` - DELETE /users with valid Bearer token but without Cookie returns status code 401 with "Access token for given user is invalid!".

### DELETE /users - Expired Token

@security-users-delete-expired_token - Security tests verifying that an expired token is rejected on protected endpoints:
- `DELETE /users expired token returns error` - DELETE /users with a token that has expired returns status code 401.

## TRACE /users

### TRACE /users - Disallowed HTTP Methods

@security-users-trace-methods - Security tests verifying that HTTP methods not supported at the /users endpoint are rejected by the server:
- `TRACE /users unsupported method returns error` - sending TRACE to /users (unauthenticated) returns status code 401.
