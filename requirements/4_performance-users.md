# Performance Requirements

## Users

### GET /users - Response Time SLA

@performance-users - Performance tests for the users endpoint response time SLA:
- `checks that a single authenticated request responds within the defined SLA` - GET /users responds within SLA (500ms).
- `checks that a paginated request responds within the defined SLA` - GET /users with pagination responds within SLA (500ms, _page=1&_limit=5).
- `checks that a full-text search request responds within the defined SLA` - GET /users with full-text search responds within SLA (800ms).
- `checks that an unauthenticated request still responds within the defined SLA` - GET /users without valid auth responds within SLA (500ms).

### POST /users - Response Time SLA

@performance-users-post - Performance tests for the POST /users endpoint response time SLA:
- `checks that creating a new user responds within the defined SLA` - POST /users with a valid payload returns 201 within SLA (1000ms).
- `checks that a duplicate email rejection responds within the defined SLA` - POST /users with an already-existing email returns 409 within SLA (500ms).
