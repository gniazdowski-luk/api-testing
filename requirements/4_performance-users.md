# Performance Requirements

## Users

### Users - Response Time SLA

@performance-users - Performance tests for the users endpoint response time SLA:
- `checks that a single authenticated request responds within the defined SLA` - GET /users responds within SLA (500ms).
- `checks that a paginated request responds within the defined SLA` - GET /users with pagination responds within SLA (500ms, _page=1&_limit=5).
- `checks that a full-text search request responds within the defined SLA` - GET /users with full-text search responds within SLA (800ms).
- `checks that an unauthenticated request still responds within the defined SLA` - GET /users without valid auth responds within SLA (500ms).
