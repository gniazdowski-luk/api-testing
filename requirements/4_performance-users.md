# Performance Requirements - Users

## GET /users

### GET /users - Response Time SLA

@performance-users-get-sla - Performance tests for the users endpoint response time SLA:
- `GET /users single authenticated request responds within SLA` - GET /users status code is 200 and responds within SLA (500ms).
- `GET /users paginated request responds within SLA` - GET /users with pagination status code is 200 and responds within SLA (500ms, _page=1&_limit=5).
- `GET /users full-text search request responds within SLA` - GET /users with full-text search status code is 200 and responds within SLA (800ms).
- `GET /users sorted request responds within SLA` - GET /users?_sort=firstname&_order=asc status code is 200 and responds within SLA (500ms).
 - `GET /users filtered request responds within SLA` - GET /users?firstname=VALUE status code is 200 and responds within SLA (500ms).
- `GET /users unauthenticated request responds within SLA` - GET /users without valid auth status code is 200 and responds within SLA (500ms).

### GET /users - Concurrent Requests

@performance-users-get-concurrent - Performance tests verifying the /users endpoint remains within SLA under concurrent load:
- `GET /users concurrent requests respond within SLA` - N simultaneous GET /users requests (e.g. 10) all respond with status code 200 within SLA (1000ms each).

## GET /users/{id}

### GET /users/{id} - Response Time SLA

@performance-users_id-get-sla - Performance tests for the GET /users/{id} endpoint response time SLA:
- `GET /users/{id} fetching an existing user responds within SLA` - GET /users/{id} with a valid existing ID status code is 200 and responds within SLA (500ms).
- `GET /users/{id} fetching a non-existent user responds within SLA` - GET /users/{id} with a non-existent ID status code is 404 and responds within SLA (500ms).

### GET /users/{id} - Concurrent Requests

@performance-users_id-get-concurrent - Performance tests verifying the GET /users/{id} endpoint remains within SLA under concurrent load:
- `GET /users/{id} concurrent requests respond within SLA` - N simultaneous GET /users/{id} requests (e.g. 10) all respond with status code 200 within SLA (1000ms each).

## POST /users

### POST /users - Response Time SLA

@performance-users-post-sla - Performance tests for the POST /users endpoint response time SLA:
- `POST /users creating a new user responds within SLA` - POST /users with a valid payload returns status code is 201 and responds within SLA (1000ms).
- `POST /users duplicate email rejection responds within SLA` - POST /users with an already-existing email returns status code is 409 and responds within SLA (500ms).

## PUT /users/{id}

### PUT /users/{id} - Response Time SLA

@performance-users_id-put-sla - Performance tests for the PUT /users/{id} endpoint response time SLA:
- `PUT /users/{id} updating a user responds within SLA` - PUT /users/{id} with a valid payload and valid auth status code is 200 and responds within SLA (1000ms).
- `PUT /users/{id} updating a non-existent user responds within SLA` - PUT /users/{id} with a non-existent numeric ID returns status code 401 and responds within SLA (500ms).
- `PUT /users/{id} invalid payload rejection responds within SLA` - PUT /users/{id} with a missing required field returns status code 422 and responds within SLA (500ms).

### PUT /users/{id} - Concurrent Requests

@performance-users_id-put-concurrent - Performance tests verifying the PUT /users/{id} endpoint remains within SLA under concurrent load:
- `PUT /users/{id} concurrent requests respond within SLA` - N simultaneous PUT /users/{id} requests (e.g. 10) all respond with status code 200 within SLA (1000ms each).

## PATCH /users/{id}

### PATCH /users/{id} - Response Time SLA

@performance-users_id-patch-sla - Performance tests for the PATCH /users/{id} endpoint response time SLA:
- `PATCH /users/{id} partial update responds within SLA` - PATCH /users/{id} with a valid partial payload and valid auth status code is 200 and responds within SLA (1000ms).
- `PATCH /users/{id} updating a non-existent user responds within SLA` - PATCH /users/{id} with a non-existent numeric ID returns status code 401 and responds within SLA (500ms).
- `PATCH /users/{id} invalid payload rejection responds within SLA` - PATCH /users/{id} with an empty required field returns status code 422 and responds within SLA (500ms).

### PATCH /users/{id} - Concurrent Requests

@performance-users_id-patch-concurrent - Performance tests verifying the PATCH /users/{id} endpoint remains within SLA under concurrent load:
- `PATCH /users/{id} concurrent requests respond within SLA` - N simultaneous PATCH /users/{id} requests (e.g. 10) all respond with status code 200 within SLA (1000ms each).

## DELETE /users/{id}

### DELETE /users/{id} - Response Time SLA

@performance-users_id-delete-sla - Performance tests for the DELETE /users/{id} endpoint response time SLA:
- `DELETE /users/{id} deleting a user responds within SLA` - DELETE /users/{id} with valid auth and an existing user ID status code is 200 and responds within SLA (1000ms).
- `DELETE /users/{id} deleting a non-existent user responds within SLA` - DELETE /users/{id} with a non-existent numeric ID returns status code 404 and responds within SLA (500ms).

## HEAD /users

### HEAD /users - Response Time SLA

@performance-users-head-sla - Performance tests for the HEAD /users endpoint response time SLA:
- [x] `HEAD /users single request responds within SLA` - HEAD /users status code is 200 and responds within SLA (500ms).
- [x] `HEAD /users with pagination params responds within SLA` - HEAD /users?_page=1&_limit=5 status code is 200 and responds within SLA (500ms).
- [x] `HEAD /users with filter params responds within SLA` - HEAD /users?firstname=VALUE status code is 200 and responds within SLA (500ms).

### HEAD /users - Concurrent Requests

@performance-users-head-concurrent - Performance tests verifying the HEAD /users endpoint remains within SLA under concurrent load:
- [x] `HEAD /users concurrent requests respond within SLA` - N simultaneous HEAD /users requests (e.g. 10) all respond with status code 200 within SLA (1000ms each).
