# Functional Requirements — Users

## @functional-users

- `GET /users` must return a list that includes two specific users matched by `id`. Each matched user must contain the correct `firstname`, `lastname`, a non-empty `email` string, a non-empty `avatar` string, and a non-empty `password` string.

## @functional-users-pagination

- `GET /users?_page=1&_limit=5` must return exactly 5 users in the response body.
- `GET /users?_page=2&_limit=5` must return users whose IDs do not overlap with those returned from page 1 with the same limit.
- `GET /users?_page=1&_limit=5` must include the `X-Total-Count` header with real value.
- `GET /users?_start=<n>&_limit=<size>` must return exactly `<size>` users in the response body.
- `GET /users?_start=<n>&_limit=<size>` must return users whose IDs do not overlap with those returned from `_start=0` with the same limit.
- `GET /users?_start=<n>&_limit=<size>` must include the `X-Total-Count` header with the real total count of all users.
- `GET /users?_start=<a>&_end=<b>` must return exactly `b-a` users starting from index `a`.

## @functional-users-sorting

- `GET /users?_sort=firstname&_order=asc` must return users sorted by `firstname` in ascending order.
- `GET /users?_sort=firstname&_order=desc` must return users sorted by `firstname` in descending order.

## @functional-users-filtering

- `GET /users?firstname=<value>` must return only users whose `firstname` exactly matches the given value and respond with status 200.
- `GET /users?firstname=<value>` with a value that matches no user must respond with status 404.
- `GET /users?firstname=<value>&lastname=<value>` must apply both filters with AND logic — returning only users that satisfy both conditions simultaneously, with status 200.
- `GET /users?id=<id1>&id=<id2>` must apply OR logic — returning all users whose `id` matches any of the repeated values, with status 200.
- `GET /users?id_gte=<min>&id_lte=<max>` must return only users whose `id` falls within the inclusive range `[min, max]`, with status 200.
- `GET /users?id_gte=<min>&id_lte=<max>` where the range contains no users must respond with status 404.
- `GET /users?unknownparam=<value>` (unrecognized parameter) must be ignored — all users are returned with status 200.

## @functional-users-search

- `GET /users?q=<text>` must return only users where at least one field contains the search text, with status 200.
- `GET /users?q=<text>` with a value that matches no user must respond with status 404.
- `GET /users?q=` (empty string) must return all users with status 200.
- `GET /users?firstname_like=<pattern>` must return users whose `firstname` contains the pattern (case-insensitive partial match), with status 200.
- `GET /users?firstname_like=<pattern>` that matches no user must respond with status 404.
- `GET /users?q=<url-encoded-special-chars>` (e.g. `%40`, `%2B`) must treat the decoded value as a literal string search — matching users if found, or responding with status 404 if not found. Must not cause a server error (5xx).
