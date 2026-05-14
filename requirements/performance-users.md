# Performance Requirements — Users

## @performance-users

- `GET /users` must respond within 500 ms (single sequential request).
- `GET /users?_page=1&_limit=5` must respond within 500 ms.
- `GET /users?q=<text>` (full-text search) must respond within 800 ms.
- `GET /users` with an invalid authentication token must still respond within 500 ms (the API returns 200 with masked fields — response time must not degrade compared to authenticated requests).
