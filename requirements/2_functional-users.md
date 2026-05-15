# Functional Requirements

## Users

### Users - Core

@functional-users - Functional tests for core user data retrieval:
- `checks that the response includes two specific users with correct fields` - GET /users contains specific users (matched by ID, with correct firstname, lastname, email, avatar, password).

### Users - Pagination

@functional-users-pagination - Functional tests for users pagination:
- `checks that requesting a page with a limit returns the correct number of users` - GET /users with pagination returns correct page size (_page=1&_limit=5).
- `checks that the X-Total-Count header is present and equals the actual total number of users` - GET /users with pagination includes X-Total-Count header with real value (_page=1&_limit=5).
- `checks that page 2 results do not overlap with page 1 results` - GET /users with pagination page 2 returns non-overlapping users with page 1 (_page=2&_limit=5).
- `checks that offset-based pagination returns the correct number of users` - GET /users?_start=<n>&_limit=<size> returns exactly <size> users.
- `checks that users at offset n do not overlap with users at offset 0` - GET /users?_start=<n>&_limit=<size> returns non-overlapping users with _start=0.
- `checks that the X-Total-Count header reflects the total number of all users` - GET /users?_start=<n>&_limit=<size> includes X-Total-Count header with real total count.
- `checks that range-based pagination returns exactly b-a users` - GET /users?_start=<start>&_end=<end> returns exactly end-start users starting from index start.

### Users - Sorting

@functional-users-sorting - Functional tests for users sorting:
- `checks that users are sorted by firstname in ascending alphabetical order` - GET /users with sorting by firstname ascending returns users in correct order (_sort=firstname&_order=asc).
- `checks that users are sorted by firstname in descending alphabetical order` - GET /users with sorting by firstname descending returns users in correct order (_sort=firstname&_order=desc).

### Users - Filtering

@functional-users-filtering - Functional tests for users filtering:
- `checks that filtering by firstname returns only exact matches` - GET /users?firstname=<value> returns only users with matching firstname.
- `checks that filtering with a non-existent value returns the correct status code` - GET /users?firstname=<value> with no matching user responds with 404.
- `checks that multiple filters are combined with AND logic` - GET /users?firstname=<value>&lastname=<value> applies AND logic.
- `checks that repeating the same parameter applies OR logic` - GET /users?id=<id1>&id=<id2> applies OR logic.
- `checks that range filtering returns only users within the inclusive ID range` - GET /users?id_gte=<min>&id_lte=<max> returns users within inclusive range.
- `checks that an empty ID range returns the correct status code` - GET /users?id_gte=<min>&id_lte=<max> with no users in range responds with 404.
- `checks that unrecognized query parameters are ignored and all users are returned` - GET /users with unrecognized param returns all users.

### Users - Search

@functional-users-search - Functional tests for users search:
- `checks that full-text search returns only users where at least one field matches` - GET /users?q=<text> returns only users matching the search text.
- `checks that a non-matching full-text search returns the correct status code` - GET /users?q=<text> with no matching user responds with 404.
- `checks that an empty search string returns all users` - GET /users?q= with empty string returns all users.
- `checks that partial firstname matching returns the correct users` - GET /users?firstname_like=<pattern> returns users with matching firstname (case-insensitive).
- `checks that a no-match partial firstname search returns the correct status code` - GET /users?firstname_like=<pattern> with no matching user responds with 404.
- `checks that URL-encoded special characters are treated as literal search values` - GET /users?q=<url-encoded-special-chars> treats decoded value as literal search (no server errors).
