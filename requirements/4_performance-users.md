# Performance Requirements

## Users

### GET /users - Response Time SLA

@performance-users - Performance tests for the users endpoint response time SLA:
- [x] `checks that a single authenticated request responds within the defined SLA` - GET /users responds within SLA (500ms).
- [x] `checks that a paginated request responds within the defined SLA` - GET /users with pagination responds within SLA (500ms, _page=1&_limit=5).
- [x] `checks that a full-text search request responds within the defined SLA` - GET /users with full-text search responds within SLA (800ms).
- [x] `checks that a sorted request responds within the defined SLA` - GET /users?_sort=firstname&_order=asc responds within SLA (500ms).
- [x] `checks that a filtered request responds within the defined SLA` - GET /users?firstname=<value> responds within SLA (500ms).
- [x] `checks that an unauthenticated request still responds within the defined SLA` - GET /users without valid auth responds within SLA (500ms).

### POST /users - Response Time SLA

@performance-users-post - Performance tests for the POST /users endpoint response time SLA:
- [x] `checks that creating a new user responds within the defined SLA` - POST /users with a valid payload returns 201 within SLA (1000ms).
- [x] `checks that a duplicate email rejection responds within the defined SLA` - POST /users with an already-existing email returns 409 within SLA (500ms).

### GET /users - Concurrent Requests

@performance-users-concurrent - Performance tests verifying the /users endpoint remains within SLA under concurrent load:
- [x] `checks that concurrent GET requests all respond within the defined SLA` - N simultaneous GET /users requests (e.g. 10) all respond with 200 within SLA (1000ms each) and no request returns a 5xx error.

### GET /users/{id} - Response Time SLA

@performance-users-id - Performance tests for the GET /users/{id} endpoint response time SLA:
- [x] `checks that fetching an existing user by ID responds within the defined SLA` - GET /users/{id} with a valid existing ID responds with 200 within SLA (500ms).
- [x] `checks that fetching a non-existent user by ID responds within the defined SLA` - GET /users/{id} with a non-existent ID responds with 404 within SLA (500ms).

### GET /users/{id} - Concurrent Requests

@performance-users-id-concurrent - Performance tests verifying the GET /users/{id} endpoint remains within SLA under concurrent load:
- [x] `checks that concurrent GET requests for a single user by ID all respond within the defined SLA` - N simultaneous GET /users/{id} requests (e.g. 10) all respond with 200 within SLA (1000ms each) and no request returns a 5xx error.
