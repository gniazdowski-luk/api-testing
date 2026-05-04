# Functional Requirements — Users

## @functional-users

- `GET /users` must return a list that includes two specific users matched by `id`. Each matched user must contain the correct `firstname`, `lastname`, a non-empty `email` string, a non-empty `avatar` string, and a non-empty `password` string.

## @functional-users-negative

- `GET /users` without the `Cookie: id` header must return users whose `lastname` field is masked as `"****"` (four asterisks).
