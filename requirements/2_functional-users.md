# Functional Requirements - Users

## GET /users

### GET /users - Core

@functional-users-get-core - Functional tests for core user data retrieval:
- `GET /users specific users are present in the response` - GET /users status code is 200 and response body contains specific known users.

### GET /users - Pagination

@functional-users-get-pagination - Functional tests for users pagination:
- `GET /users pagination returns correct number of users` - GET /users with pagination status code is 200 and returns users count matching the limit parameter.
- `GET /users pagination total count header is included in the response` - GET /users with pagination status code is 200 and includes X-Total-Count header matching the total users in database.
- `GET /users pagination page 2 does not overlap with page 1` - GET /users with pagination page 2 status code is 200 and returns users different than those on page 1.
- `GET /users offset pagination returns correct number of users` - GET /users?_start=n&_limit=size status code is 200 and returns exact number of users.
- `GET /users offset n does not overlap with offset 0` - GET /users?_start=n&_limit=size status code is 200 and returns users different than those from offset 0.
- `GET /users total count header reflects all users` - GET /users?_start=n&_limit=size status code is 200 and includes X-Total-Count header with real total count.
- `GET /users range pagination returns correct number of users` - GET /users?_start=start&_end=end status code is 200 and returns exactly end-start users.

### GET /users - Sorting

@functional-users-get-sorting - Functional tests for users sorting:
- `GET /users sorting by firstname ascending works` - GET /users with sorting by firstname ascending status code is 200 and returns users sorted alphabetically by firstname.
- `GET /users sorting by firstname descending works` - GET /users with sorting by firstname descending status code is 200 and returns users sorted alphabetically in reverse by firstname.
- `GET /users sorting by id ascending works` - GET /users?_sort=id&_order=asc status code is 200 and returns users in numerically ascending id order.
- `GET /users sorting by lastname ascending works` - GET /users?_sort=lastname&_order=asc status code is 200 and returns users sorted alphabetically by lastname.

### GET /users - Filtering

@functional-users-get-filtering - Functional tests for users filtering:
- `GET /users filtering by firstname works` - GET /users?firstname=VALUE status code is 200 and returns only users with matching firstname.
- `GET /users combined filters applies AND logic` - GET /users?firstname=VALUE1&lastname=VALUE2 status code is 200 and applies AND logic.
- `GET /users repeating the same parameter applies OR logic` - GET /users?id=ID1&id=ID2 status code is 200 and returns users matching either id1 or id2.
- `GET /users filtering by inclusive ID range works` - GET /users?id_gte=MIN&id_lte=MAX status code is 200 and returns users within inclusive range.
- `GET /users unrecognized query parameters are ignored` - GET /users with unrecognized param status code is 200 and returns all users.

### GET /users - Search

@functional-users-get-search - Functional tests for users search:
- `GET /users full-text search works` - GET /users?q=TEXT status code is 200 and returns only users matching the search text.
- `GET /users empty search returns all users` - GET /users?q= with empty string status code is 200 and returns all users.
- `GET /users partial firstname matching works` - GET /users?firstname_like=PATTERN status code is 200 and returns users with matching firstname (case-insensitive).
- `GET /users URL-encoded special characters are handled` - GET /users?q=URL_ENCODED_SPECIAL_CHARS status code is 200 and treats decoded value as literal search.

### GET /users - Data

@functional-users-get-data - Functional tests for users data field validation:
- `GET /users avatar paths are correct` - GET /users returns all users; users filtered by non-empty avatar must equal users filtered by avatar path starting with .\data\users\ and status code 200.

### GET /users - Edge cases

@functional-users-get-edge - Functional tests for non-error edge-case scenarios:
- `GET /users zero page number returns successful result` - GET /users?_page=0&_limit=N returns all users and status code 200.
- `GET /users negative page number returns successful result` - GET /users?_page=-1&_limit=N returns all users and status code 200.
- `GET /users negative limit returns successful result` - GET /users?_limit=-1 returns empty list and status code 200.
- `GET /users very large limit returns successful result` - GET /users?_limit=1000000 returns all available users and status code 200.
- `GET /users invalid sort value falls back to ascending order` - GET /users?_sort=firstname&_order=invalid falls back to ascending order by firstname and status code 200.
- `GET /users sorting by non-existent field is handled` - GET /users?_sort=nonexistent&_order=asc returns users in default order and status code 200.

### GET /users - Negative

@functional-users-get-negative - Functional tests for negative and edge-case scenarios:
- `GET /users page beyond total pages returns not found` - GET /users?_page=BEYOND_LAST&_limit=N with a page number exceeding total pages responds with status code 404.
- `GET /users zero limit returns not found` - GET /users?_limit=0 responds with status code 404.
- `GET /users offset beyond total users returns not found` - GET /users?_start=N&_limit=SIZE where _start exceeds the total user count responds with status code 404.
- `GET /users filtering with non-existent value returns not found` - GET /users?firstname=VALUE with no matching user responds with status code 404.
- `GET /users empty ID range returns not found` - GET /users?id_gte=MIN&id_lte=MAX with no users in range responds with status code 404.
- `GET /users inverted ID range returns not found` - GET /users?id_gte=MIN&id_lte=MAX where MIN > MAX responds with status code 404.
- `GET /users non-matching full-text search returns not found` - GET /users?q=TEXT with no matching user responds with status code 404.
- `GET /users no-match partial search returns not found` - GET /users?firstname_like=PATTERN with no matching user responds with status code 404.
- `GET /users filtering with empty string returns not found` - GET /users?firstname= with an empty value returns status code 404.
- `GET /users filtering is case-sensitive` - GET /users?firstname=LOWERCASE_VALUE where the stored value has different casing returns status code 404.

## GET /users/{id}

### GET /users/{id} - Core

@functional-users_id-get-core - Functional tests for retrieving a single user by ID:
- `GET /users/{id} user data is correct` - GET /users/{id} status code is 200 and response body matches the user data for the specified ID.

### GET /users/{id} - Negative

@functional-users_id-get-negative - Functional tests for negative and edge-case scenarios for retrieving a user by ID:
- `GET /users/{id} non-existent user returns not found` - GET /users/{id} with a non-existent user ID responds with status code 404.
- `GET /users/{id} invalid ID format returns not found` - GET /users/{id} with a non-numeric string ID responds with status code 404.

## POST /users

### POST /users - Core

@functional-users_id-post-core - Functional tests for creating a new user:
- `POST /users created user is present in the existing users response` - POST /users status code is 201 and the newly created user is found in the list returned by GET /users.
- `POST /users created user can log in with correct credentials` - POST /users status code is 201 and the new user can successfully obtain an access token via POST /login.
- `POST /users create user with birthdate includes correct user data in the response` - POST /users with birthDate status code is 201 and response body contains all submitted fields including birthDate.
- `POST /users created user with birthdate is present in the existing users response` - POST /users with birthDate status code is 201 and the new user is found in the list returned by GET /users.
- `POST /users created user with birthdate can log in with correct credentials` - POST /users with birthDate status code is 201 and the new user can successfully obtain an access token via POST /login.

### POST /users - Edge cases

@functional-users_id-post-edge - Functional tests for POST edge-case scenarios:
- `POST /users invalid birthDate format is accepted` - POST /users with birthDate in a non-ISO-8601 format responds with status code 201.

### POST /users - Negative

@functional-users_id-post-negative - Functional tests for POST negative and edge-case scenarios:
- `POST /users duplicate email returns conflict` - POST /users with an email that already exists responds with status code 409.
- `POST /users missing firstname returns validation error` - POST /users with firstname omitted responds with status code 422.
- `POST /users missing lastname returns validation error` - POST /users with lastname omitted responds with status code 422.
- `POST /users missing email returns validation error` - POST /users with email omitted responds with status code 422.
- `POST /users missing password returns validation error` - POST /users with password omitted responds with status code 422.
- `POST /users missing avatar returns validation error` - POST /users with avatar omitted responds with status code 422.
- `POST /users invalid firstname type returns validation error` - POST /users with firstname as a number responds with status code 422.
- `POST /users invalid lastname type returns validation error` - POST /users with lastname as a number responds with status code 422.
- `POST /users invalid email type returns validation error` - POST /users with email as a number responds with status code 422.
- `POST /users invalid password type returns validation error` - POST /users with password as a number responds with status code 422.
- `POST /users invalid avatar type returns validation error` - POST /users with avatar as a number responds with status code 422.
- `POST /users email missing at symbol returns validation error` - POST /users with email missing @ responds with status code 422.
- `POST /users email missing domain returns validation error` - POST /users with email missing domain responds with status code 422.
- `POST /users email missing local part returns validation error` - POST /users with email missing local part responds with status code 422.
- `POST /users empty body returns validation error` - POST /users with an empty body responds with status code 422.
- `POST /users unrecognized extra fields returns validation error` - POST /users with additional unknown fields responds with status code 422.
- `POST /users empty firstname string returns validation error` - POST /users with firstname as an empty string responds with status code 422.
- `POST /users empty lastname string returns validation error` - POST /users with lastname as an empty string responds with status code 422.
- `POST /users empty email string returns validation error` - POST /users with email as an empty string responds with status code 422.
- `POST /users empty password string returns validation error` - POST /users with password as an empty string responds with status code 422.
- `POST /users empty avatar string returns validation error` - POST /users with avatar as an empty string responds with status code 422.
- `POST /users null firstname returns validation error` - POST /users with firstname explicitly set to null responds with status code 422.
- `POST /users null email returns validation error` - POST /users with email explicitly set to null responds with status code 422.

## PUT /users/{id}

### PUT /users/{id} - Core

@functional-users_id-put-core - Functional tests for updating a user by ID via PUT:
- `PUT /users/{id} updated user data is included in the response` - PUT /users/{id} status code is 200 and response body contains fields matching the updated payload.
- `PUT /users/{id} updated user can log in with new credentials` - PUT /users/{id} status code is 200 and the updated password allows successful login via POST /login.

### PUT /users/{id} - Negative

@functional-users_id-put-negative - Functional tests for negative and edge-case scenarios for PUT /users/{id}:
- `PUT /users/{id} invalid ID format returns not found` - PUT /users/{id} with a non-numeric string ID responds with status code 404.
- `PUT /users/{id} non-existent user returns not found` - PUT /users/{id} with a non-existent numeric user ID responds with status code 404.
- `PUT /users/{id} missing firstname returns validation error` - PUT /users/{id} with firstname omitted responds with status code 422.
- `PUT /users/{id} missing lastname returns validation error` - PUT /users/{id} with lastname omitted responds with status code 422.
- `PUT /users/{id} missing email returns validation error` - PUT /users/{id} with email omitted responds with status code 422.
- `PUT /users/{id} missing password returns validation error` - PUT /users/{id} with password omitted responds with status code 422.
- `PUT /users/{id} missing avatar returns validation error` - PUT /users/{id} with avatar omitted responds with status code 422.
