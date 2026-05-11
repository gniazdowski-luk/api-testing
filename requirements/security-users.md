# Security Requirements — Users

## @security-authorization-get-users

- `GET /users` without an Authorization header returns `200`, but email, lastname and password are masked.
- `GET /users` with an empty Bearer token returns `200`, but email, lastname and password are masked.
- `GET /users` with a wrong Bearer token returns `200`, but email, lastname and password are masked.
- `GET /users` with a wrong Basic auth returns `200`, but email, lastname and password are masked.
- `GET /users` with a valid Bearer token but without Cookie returns `200`, but email, lastname and password are masked.

<!-- ## @security-authorization-post-users -->

## @security-authorization-put-users

- `PUT /users` without an Authorization header returns error message "Access token not provided!" and 401 status code.
- `PUT /users` with an empty Bearer token returns error message "Access token not provided!" and 401 status code.
- `PUT /users` with a wrong Bearer token returns error message "Access token not provided!" and 401 status code.
- `PUT /users` with a wrong Basic auth returns error message "Access token not provided!" and 401 status code.
- `PUT /users` with a valid Bearer token but without Cookie returns error message "Access token for given user is invalid!" and 401 status code.

## @security-authorization-patch-users

- `PATCH /users` without an Authorization header returns error message "Access token not provided!" and 401 status code.
- `PATCH /users` with an empty Bearer token returns error message "Access token not provided!" and 401 status code.
- `PATCH /users` with a wrong Bearer token returns error message "Access token not provided!" and 401 status code.
- `PATCH /users` with a wrong Basic auth returns error message "Access token not provided!" and 401 status code.
- `PATCH /users` with a valid Bearer token but without Cookie returns error message "Access token for given user is invalid!" and 401 status code.

## @security-authorization-delete-users

- `DELETE /users` without an Authorization header returns error message "Access token not provided!" and 401 status code.
- `DELETE /users` with an empty Bearer token returns error message "Access token not provided!" and 401 status code.
- `DELETE /users` with a wrong Bearer token returns error message "Access token not provided!" and 401 status code.
- `DELETE /users` with a wrong Basic auth returns error message "Access token not provided!" and 401 status code.
- `DELETE /users` with a valid Bearer token but without Cookie returns error message "Access token for given user is invalid!" and 401 status code.
