# Functional Requirements

## GET /users

### GET /users - Core

@functional-users - Functional tests for core user data retrieval:
- [x] `checks that the response includes two specific users with correct fields` - GET /users contains specific users (matched by ID, with correct firstname, lastname, email, avatar, password).

### GET /users - Pagination

@functional-users-pagination - Functional tests for users pagination:
- [x] `checks that requesting a page with a limit returns the correct number of users` - GET /users with pagination returns correct page size (_page=1&_limit=5).
- [x] `checks that the X-Total-Count header is present and equals the actual total number of users` - GET /users with pagination includes X-Total-Count header with real value (_page=1&_limit=5).
- [x] `checks that page 2 results do not overlap with page 1 results` - GET /users with pagination page 2 returns non-overlapping users with page 1 (_page=2&_limit=5).
- [x] `checks that offset-based pagination returns the correct number of users` - GET /users?_start=<n>&_limit=<size> returns exactly <size> users.
- [x] `checks that users at offset n do not overlap with users at offset 0` - GET /users?_start=<n>&_limit=<size> returns non-overlapping users with _start=0.
- [x] `checks that the X-Total-Count header reflects the total number of all users` - GET /users?_start=<n>&_limit=<size> includes X-Total-Count header with real total count.
- [x] `checks that range-based pagination returns exactly b-a users` - GET /users?_start=<start>&_end=<end> returns exactly end-start users starting from index start.

### GET /users - Sorting

@functional-users-sorting - Functional tests for users sorting:
- [x] `checks that users are sorted by firstname in ascending alphabetical order` - GET /users with sorting by firstname ascending returns users in correct order (_sort=firstname&_order=asc).
- [x] `checks that users are sorted by firstname in descending alphabetical order` - GET /users with sorting by firstname descending returns users in correct order (_sort=firstname&_order=desc).
- [x] `checks that users are sorted by id in ascending order` - GET /users?_sort=id&_order=asc returns users in numerically ascending id order.
- [x] `checks that users are sorted by lastname in ascending alphabetical order` - GET /users?_sort=lastname&_order=asc returns users sorted alphabetically by lastname.
- [x] `checks that sorting by a non-existent field name does not cause a server error` - GET /users?_sort=nonexistent&_order=asc responds without a 5xx server error (responds with 200 and any stable ordering).

### GET /users - Filtering

@functional-users-filtering - Functional tests for users filtering:
- [x] `checks that filtering by firstname returns only exact matches` - GET /users?firstname=<value> returns only users with matching firstname.
- [x] `checks that multiple filters are combined with AND logic` - GET /users?firstname=<value>&lastname=<value> applies AND logic.
- [x] `checks that repeating the same parameter applies OR logic` - GET /users?id=<id1>&id=<id2> applies OR logic.
- [x] `checks that range filtering returns only users within the inclusive ID range` - GET /users?id_gte=<min>&id_lte=<max> returns users within inclusive range.
- [x] `checks that unrecognized query parameters are ignored and all users are returned` - GET /users with unrecognized param returns all users.
- [x] `checks that filtering with an empty string value returns all users` - GET /users?firstname= with an empty value returns 404 (empty string is treated as a literal filter value; since no users have an empty firstname, the response is 404).
- [x] `checks that field filtering is case-sensitive` - GET /users?firstname=<lowercase-value> where the stored value has different casing returns 404 (field filtering is exact-match case-sensitive).

### GET /users - Search

@functional-users-search - Functional tests for users search:
- [x] `checks that full-text search returns only users where at least one field matches` - GET /users?q=<text> returns only users matching the search text.
- [x] `checks that an empty search string returns all users` - GET /users?q= with empty string returns all users.
- [x] `checks that partial firstname matching returns the correct users` - GET /users?firstname_like=<pattern> returns users with matching firstname (case-insensitive).
- [x] `checks that URL-encoded special characters are treated as literal search values` - GET /users?q=<url-encoded-special-chars> treats decoded value as literal search (no server errors).

### GET /users - Data

@functional-users-data - Functional tests for users data field validation:
- [x] `checks that all users with a non-empty avatar have a correct avatar path` - GET /users returns all users; users filtered by non-empty avatar must equal users filtered by avatar path starting with .\data\users\.

### GET /users - Negative

@functional-users-negative - Functional tests for negative and edge-case scenarios:
- [x] `checks that requesting a page beyond the total number of pages returns the correct status code` - GET /users?_page=<beyond-last>&_limit=<n> with a page number exceeding total pages responds with 404.
- [x] `checks that requesting with a zero limit returns the correct status code` - GET /users?_limit=0 responds with 404.
- [x] `checks that requesting with a zero page number returns the correct status code` - GET /users?_page=0&_limit=<n> with page number 0 responds with 200 (zero page is not rejected; the API returns results).
- [x] `checks that requesting with a negative page number returns the correct status code` - GET /users?_page=-1&_limit=<n> with a negative page number responds with 200 (negative page is not rejected; the API returns results).
- [x] `checks that requesting with a negative limit returns the correct status code` - GET /users?_limit=-1 with a negative limit responds with 200 (negative limit is not rejected; the API returns results).
- [x] `checks that an offset beyond the total number of users returns the correct status code` - GET /users?_start=<n>&_limit=<size> where _start exceeds the total user count responds with 404.
- [x] `checks that requesting with a very large limit returns all users without a server error` - GET /users?_limit=1000000 responds with 200 and returns all available users without error.
- [x] `checks that an invalid sort order value falls back to ascending alphabetical order` - GET /users?_sort=firstname&_order=invalid with an unrecognised _order value falls back to ascending order.
- [x] `checks that filtering with a non-existent value returns the correct status code` - GET /users?firstname=<value> with no matching user responds with 404.
- [x] `checks that an empty ID range returns the correct status code` - GET /users?id_gte=<min>&id_lte=<max> with no users in range responds with 404.
- [x] `checks that an inverted ID range returns the correct status code` - GET /users?id_gte=<min>&id_lte=<max> where min > max so no user can satisfy both conditions, responds with 404.
- [x] `checks that a non-matching full-text search returns the correct status code` - GET /users?q=<text> with no matching user responds with 404.
- [x] `checks that a no-match partial firstname search returns the correct status code` - GET /users?firstname_like=<pattern> with no matching user responds with 404.

## POST /users

### POST /users - Create

@functional-users-post - Functional tests for creating a new user:
- [x] `checks that a newly created user appears in the users list with correct data` - POST /users to create a user, then GET /users: soft-asserts the created user is present in the list with matching id, firstname, lastname, and avatar (email and password are masked as **** in the list response); hard-asserts GET status 200 last.
- [x] `checks that a newly created user can log in with the correct credentials` - POST /users to create a user, then POST /login with the same email and password: soft-asserts login response includes a token; hard-asserts login status 200 last.
- [x] `checks that creating a user with a birthdate returns the correct status code and a well-formed response body` - POST /users with a valid payload including birthDate in ISO 8601 format with timezone offset (e.g. YYYY-MM-DDT01:00:00+01:00): soft-asserts response body includes id, firstname, lastname, email, avatar, and password fields matching the submitted payload (birthDate is accepted but not returned in the response); hard-asserts status 201 last.
- [x] `checks that a newly created user with a birthdate appears in the users list with correct data` - POST /users with a payload including birthDate, then GET /users: soft-asserts the created user is present in the list with matching id, firstname, lastname, and avatar (birthDate is not exposed in the list response); hard-asserts GET status 200 last.
- [x] `checks that a newly created user with a birthdate can log in with the correct credentials` - POST /users with a payload including birthDate, then POST /login with the same email and password: soft-asserts login response includes a token; hard-asserts login status 200 last.

### POST /users - Negative

@functional-users-post-negative - Functional tests for POST negative and edge-case scenarios:
- [x] `checks that creating a user with a duplicate email returns the correct status code` - POST /users with an email that already exists responds with 409.
- [x] `checks that creating a user without firstname returns the correct status code` - POST /users with firstname omitted responds with 422.
- [x] `checks that creating a user without lastname returns the correct status code` - POST /users with lastname omitted responds with 422.
- [x] `checks that creating a user without email returns the correct status code` - POST /users with email omitted responds with 422.
- [x] `checks that creating a user without password returns the correct status code` - POST /users with password omitted responds with 422.
- [x] `checks that creating a user without avatar returns the correct status code` - POST /users with avatar omitted responds with 422.
- [x] `checks that creating a user with firstname as a non-string type returns the correct status code` - POST /users with firstname as a number responds with 422.
- [x] `checks that creating a user with lastname as a non-string type returns the correct status code` - POST /users with lastname as a number responds with 422.
- [x] `checks that creating a user with email as a non-string type returns the correct status code` - POST /users with email as a number responds with 422.
- [x] `checks that creating a user with password as a non-string type returns the correct status code` - POST /users with password as a number responds with 422.
- [x] `checks that creating a user with avatar as a non-string type returns the correct status code` - POST /users with avatar as a number responds with 422.
- [x] `checks that creating a user with an email missing the @ symbol returns the correct status code` - POST /users with email value containing no @ (e.g. userdomain.com) responds with 422.
- [x] `checks that creating a user with an email missing the domain returns the correct status code` - POST /users with email value ending in @ and no domain (e.g. user@) responds with 422.
- [x] `checks that creating a user with an email missing the local part returns the correct status code` - POST /users with email value starting with @ and no local part (e.g. @domain.com) responds with 422.
- [x] `checks that creating a user with an empty body returns the correct status code` - POST /users with an empty body responds with 422.
- [x] `checks that extra unrecognized fields in the payload return the correct status code` - POST /users with additional unknown fields is rejected and responds with 422.
- [x] `checks that creating a user with an empty firstname string returns the correct status code` - POST /users with firstname as an empty string responds with 422.
- [x] `checks that creating a user with an empty lastname string returns the correct status code` - POST /users with lastname as an empty string responds with 422.
- [x] `checks that creating a user with an empty email string returns the correct status code` - POST /users with email as an empty string responds with 422.
- [x] `checks that creating a user with an empty password string returns the correct status code` - POST /users with password as an empty string responds with 422.
- [x] `checks that creating a user with an empty avatar string returns the correct status code` - POST /users with avatar as an empty string responds with 422.
- [x] `checks that creating a user with a null firstname returns the correct status code` - POST /users with firstname explicitly set to null responds with 422.
- [x] `checks that creating a user with a null email returns the correct status code` - POST /users with email explicitly set to null responds with 422.
- [x] `checks that creating a user with an invalid birthDate format returns the correct status code` - POST /users with birthDate in a non-ISO-8601 format (e.g. "2000-01-01" without time or offset) responds with 201 (birthDate format is not validated; any string value is accepted and the user is created).


