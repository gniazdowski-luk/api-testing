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
- `PUT /users wrong Basic auth returns error` - PUT /users with wrong Basic auth returns status code 401 with "Access token not provided!".
- `PUT /users valid token without Cookie returns error` - PUT /users with valid Bearer token but without Cookie returns status code 401 with "Access token for given user is invalid!".

### PUT /users - Expired Token

@security-users-put-expired_token - Security tests verifying that an expired token is rejected on protected endpoints:
- `PUT /users expired token returns error` - PUT /users with a token that has expired returns status code 401.

## PUT /users/{id}

### PUT /users/{id} - Authorization

@security-users_id-put-authorization - Security tests for PUT /users/{id} authorization:
- `PUT /users/{id} unauthenticated access returns error` - PUT /users/{id} without Authorization header returns status code 401 with "Access token not provided!".
- `PUT /users/{id} empty Bearer token returns error` - PUT /users/{id} with empty Bearer token returns status code 401 with "Access token not provided!".
- `PUT /users/{id} invalid Bearer token returns error` - PUT /users/{id} with wrong Bearer token returns status code 401 with "Access token not provided!".
- `PUT /users/{id} wrong Basic auth returns error` - PUT /users/{id} with wrong Basic auth returns status code 401 with "Access token not provided!".
- `PUT /users/{id} valid token without Cookie returns error` - PUT /users/{id} with valid Bearer token but without Cookie returns status code 401 with "Access token for given user is invalid!".

### PUT /users/{id} - Expired Token

@security-users_id-put-expired_token - Security tests verifying that an expired token is rejected on PUT /users/{id}:
- `PUT /users/{id} expired token returns error` - PUT /users/{id} with a token that has expired returns status code 401.

### PUT /users/{id} - CORS Headers

@security-users_id-put-cors - Security tests verifying CORS response headers are present on the PUT /users/{id} endpoint:
- `PUT /users/{id} access control allow origin header is included` - PUT /users/{id} with an Origin header returns status code 200 and Access-Control-Allow-Origin header matching the request origin.
- `OPTIONS /users/{id} preflight request for PUT returns CORS headers` - OPTIONS /users/{id} with Origin and preflight headers for PUT returns status code 204 and includes Access-Control-Allow-Methods (including PUT) and Access-Control-Allow-Headers.

### PUT /users/{id} - Security Response Headers

@security-users_id-put-headers - Security tests verifying that the PUT /users/{id} endpoint returns expected security-related HTTP response headers:
- `PUT /users/{id} response includes X-Content-Type-Options header` - PUT /users/{id} response includes X-Content-Type-Options: nosniff and status code 200.
- `PUT /users/{id} response includes X-Frame-Options header` - PUT /users/{id} response includes X-Frame-Options: SAMEORIGIN and status code 200.
- `PUT /users/{id} response includes Content-Security-Policy header` - PUT /users/{id} response includes a Content-Security-Policy header and status code 200.

## PATCH /users

### PATCH /users - Authorization

@security-users-patch-authorization - Security tests for PATCH /users authorization:
- `PATCH /users unauthenticated access returns error` - PATCH /users without Authorization header returns status code 401 with "Access token not provided!".
- `PATCH /users empty Bearer token returns error` - PATCH /users with empty Bearer token returns status code 401 with "Access token not provided!".
- `PATCH /users invalid Bearer token returns error` - PATCH /users with wrong Bearer token returns status code 401 with "Access token not provided!".
- `PATCH /users wrong Basic auth returns error` - PATCH /users with wrong Basic auth returns status code 401 with "Access token not provided!".
- `PATCH /users valid token without Cookie returns error` - PATCH /users with valid Bearer token but without Cookie returns status code 401 with "Access token for given user is invalid!".

### PATCH /users - Expired Token

@security-users-patch-expired_token - Security tests verifying that an expired token is rejected on protected endpoints:
- `PATCH /users expired token returns error` - PATCH /users with a token that has expired returns status code 401.

### PATCH /users - CORS Headers

@security-users-patch-cors - Security tests verifying CORS response headers are present on the PATCH /users endpoint:
- `PATCH /users access control allow origin header is included` - PATCH /users with an Origin header returns status code 401 and Access-Control-Allow-Origin header matching the request origin.
- `OPTIONS /users preflight request for PATCH returns CORS headers` - OPTIONS /users with Origin and preflight headers for PATCH returns status code 204 and includes Access-Control-Allow-Methods (including PATCH) and Access-Control-Allow-Headers.

## PATCH /users/{id}

### PATCH /users/{id} - Authorization

@security-users_id-patch-authorization - Security tests for PATCH /users/{id} authorization:
- `PATCH /users/{id} unauthenticated access returns error` - PATCH /users/{id} without Authorization header returns status code 401 with "Access token not provided!".
- `PATCH /users/{id} empty Bearer token returns error` - PATCH /users/{id} with empty Bearer token returns status code 401 with "Access token not provided!".
- `PATCH /users/{id} invalid Bearer token returns error` - PATCH /users/{id} with wrong Bearer token returns status code 401 with "Access token not provided!".
- `PATCH /users/{id} wrong Basic auth returns error` - PATCH /users/{id} with wrong Basic auth returns status code 401 with "Access token not provided!".
- `PATCH /users/{id} valid token without Cookie returns error` - PATCH /users/{id} with valid Bearer token but without Cookie returns status code 401 with "Access token for given user is invalid!".

### PATCH /users/{id} - Expired Token

@security-users_id-patch-expired_token - Security tests verifying that an expired token is rejected on PATCH /users/{id}:
- `PATCH /users/{id} expired token returns error` - PATCH /users/{id} with a token that has expired returns status code 401.

### PATCH /users/{id} - CORS Headers

@security-users_id-patch-cors - Security tests verifying CORS response headers are present on the PATCH /users/{id} endpoint:
- `PATCH /users/{id} access control allow origin header is included` - PATCH /users/{id} with an Origin header returns status code 200 and Access-Control-Allow-Origin header matching the request origin.
- `OPTIONS /users/{id} preflight request for PATCH returns CORS headers` - OPTIONS /users/{id} with Origin and preflight headers for PATCH returns status code 204 and includes Access-Control-Allow-Methods (including PATCH) and Access-Control-Allow-Headers.

### PATCH /users/{id} - Security Response Headers

@security-users_id-patch-headers - Security tests verifying that the PATCH /users/{id} endpoint returns expected security-related HTTP response headers:
- `PATCH /users/{id} response includes X-Content-Type-Options header` - PATCH /users/{id} response includes X-Content-Type-Options: nosniff and status code 200.
- `PATCH /users/{id} response includes X-Frame-Options header` - PATCH /users/{id} response includes X-Frame-Options: SAMEORIGIN and status code 200.
- `PATCH /users/{id} response includes Content-Security-Policy header` - PATCH /users/{id} response includes a Content-Security-Policy header and status code 200.

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

### DELETE /users - CORS Headers

@security-users-delete-cors - Security tests verifying CORS response headers are present on the DELETE /users endpoint:
- `DELETE /users access control allow origin header is included` - DELETE /users with an Origin header returns status code 401 and Access-Control-Allow-Origin header matching the request origin.
- `OPTIONS /users preflight request for DELETE returns CORS headers` - OPTIONS /users with Origin and preflight headers for DELETE returns status code 204 and includes Access-Control-Allow-Methods (including DELETE) and Access-Control-Allow-Headers.

## DELETE /users/{id}

### DELETE /users/{id} - Authorization

@security-users_id-delete-authorization - Security tests for DELETE /users/{id} authorization:
- `DELETE /users/{id} unauthenticated access returns error` - DELETE /users/{id} without Authorization header returns status code 401 with "Access token not provided!".
- `DELETE /users/{id} empty Bearer token returns error` - DELETE /users/{id} with empty Bearer token returns status code 401 with "Access token not provided!".
- `DELETE /users/{id} invalid Bearer token returns error` - DELETE /users/{id} with wrong Bearer token returns status code 401 with "Access token not provided!".
- `DELETE /users/{id} wrong Basic auth returns error` - DELETE /users/{id} with wrong Basic auth returns status code 401 with "Access token not provided!".
- `DELETE /users/{id} valid token without Cookie returns error` - DELETE /users/{id} with valid Bearer token but without Cookie returns status code 401 with "Access token for given user is invalid!".

### DELETE /users/{id} - Expired Token

@security-users_id-delete-expired_token - Security tests verifying that an expired token is rejected on DELETE /users/{id}:
- `DELETE /users/{id} expired token returns error` - DELETE /users/{id} with a token that has expired returns status code 401.

### DELETE /users/{id} - CORS Headers

@security-users_id-delete-cors - Security tests verifying CORS response headers are present on the DELETE /users/{id} endpoint:
- `DELETE /users/{id} access control allow origin header is included` - DELETE /users/{id} with an Origin header returns status code 200 and Access-Control-Allow-Origin header matching the request origin.
- `OPTIONS /users/{id} preflight request for DELETE returns CORS headers` - OPTIONS /users/{id} with Origin and preflight headers for DELETE returns status code 204 and includes Access-Control-Allow-Methods (including DELETE) and Access-Control-Allow-Headers.

### DELETE /users/{id} - Security Response Headers

@security-users_id-delete-headers - Security tests verifying that the DELETE /users/{id} endpoint returns expected security-related HTTP response headers:
- `DELETE /users/{id} response includes X-Content-Type-Options header` - DELETE /users/{id} response includes X-Content-Type-Options: nosniff and status code 200.
- `DELETE /users/{id} response includes X-Frame-Options header` - DELETE /users/{id} response includes X-Frame-Options: SAMEORIGIN and status code 200.
- `DELETE /users/{id} response includes Content-Security-Policy header` - DELETE /users/{id} response includes a Content-Security-Policy header and status code 200.

## TRACE /users

### TRACE /users - Disallowed HTTP Methods

@security-users-trace-methods - Security tests verifying that HTTP methods not supported at the /users endpoint are rejected by the server:
- `TRACE /users unsupported method returns error` - sending TRACE to /users (unauthenticated) returns status code 401.

## HEAD /users

### HEAD /users - Authorization

@security-users-head-authorization - Security tests for HEAD /users authorization:
- `HEAD /users unauthenticated access returns ok` - HEAD /users without Authorization header returns status code 200.
- `HEAD /users empty Bearer token returns ok` - HEAD /users with empty Bearer token returns status code 200.
- `HEAD /users invalid Bearer token returns ok` - HEAD /users with wrong Bearer token returns status code 200.
- `HEAD /users wrong Basic auth returns ok` - HEAD /users with wrong Basic auth returns status code 200.
- `HEAD /users valid token without Cookie returns ok` - HEAD /users with valid Bearer token but without Cookie returns status code 200.

### HEAD /users - CORS Headers

@security-users-head-cors - Security tests verifying CORS response headers are present on the HEAD /users endpoint:
- `HEAD /users access control allow origin header is included` - HEAD /users with an Origin header returns status code 200 and Access-Control-Allow-Origin header matching the request origin.
- `OPTIONS /users preflight request for HEAD returns CORS headers` - OPTIONS /users with Origin and preflight headers for HEAD returns status code 204 and includes Access-Control-Allow-Methods (including HEAD) and Access-Control-Allow-Headers.

### HEAD /users - Security Response Headers

@security-users-head-headers - Security tests verifying that the HEAD /users endpoint returns expected security-related HTTP response headers:
- `HEAD /users response includes X-Content-Type-Options header` - HEAD /users response includes X-Content-Type-Options: nosniff and status code 200.
- `HEAD /users response includes X-Frame-Options header` - HEAD /users response includes X-Frame-Options: SAMEORIGIN and status code 200.
- `HEAD /users response includes Content-Security-Policy header` - HEAD /users response includes a Content-Security-Policy header and status code 200.
