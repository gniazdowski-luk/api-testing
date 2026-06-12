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
- `PUT /users/{id} updated user data is included in the response` - PUT /users/{id} status code is 200, response body contains fields matching the updated payload, and a follow-up GET /users/{id} returns the persisted updated data.
- `PUT /users/{id} updated user can log in with new credentials` - PUT /users/{id} status code is 200 and the updated password allows successful login via POST /login.

### PUT /users/{id} - Negative

@functional-users_id-put-negative - Functional tests for negative and edge-case scenarios for PUT /users/{id}:
- `PUT /users/{id} invalid ID format returns unauthorized` - PUT /users/{id} with a non-numeric string ID responds with status code 401.
- `PUT /users/{id} non-existent user returns unauthorized` - PUT /users/{id} with a non-existent numeric user ID responds with status code 401.
- `PUT /users/{id} missing firstname returns validation error` - PUT /users/{id} with firstname omitted responds with status code 422.
- `PUT /users/{id} missing lastname returns validation error` - PUT /users/{id} with lastname omitted responds with status code 422.
- `PUT /users/{id} missing email returns validation error` - PUT /users/{id} with email omitted responds with status code 422.
- `PUT /users/{id} missing password returns validation error` - PUT /users/{id} with password omitted responds with status code 422.
- `PUT /users/{id} missing avatar returns validation error` - PUT /users/{id} with avatar omitted responds with status code 422.
- `PUT /users/{id} invalid firstname type returns validation error` - PUT /users/{id} with firstname as a number responds with status code 422.
- `PUT /users/{id} invalid lastname type returns validation error` - PUT /users/{id} with lastname as a number responds with status code 422.
- `PUT /users/{id} invalid email type returns validation error` - PUT /users/{id} with email as a number responds with status code 422.
- `PUT /users/{id} invalid password type returns validation error` - PUT /users/{id} with password as a number responds with status code 422.
- `PUT /users/{id} invalid avatar type returns validation error` - PUT /users/{id} with avatar as a number responds with status code 422.
- `PUT /users/{id} email missing at symbol returns validation error` - PUT /users/{id} with email missing @ responds with status code 422.
- `PUT /users/{id} email missing domain returns validation error` - PUT /users/{id} with email missing domain responds with status code 422.
- `PUT /users/{id} email missing local part returns validation error` - PUT /users/{id} with email missing local part responds with status code 422.
- `PUT /users/{id} empty body returns validation error` - PUT /users/{id} with an empty body responds with status code 422.
- `PUT /users/{id} unrecognized extra fields returns validation error` - PUT /users/{id} with additional unknown fields responds with status code 422.
- `PUT /users/{id} empty firstname string returns validation error` - PUT /users/{id} with firstname as an empty string responds with status code 422.
- `PUT /users/{id} empty lastname string returns validation error` - PUT /users/{id} with lastname as an empty string responds with status code 422.
- `PUT /users/{id} empty email string returns validation error` - PUT /users/{id} with email as an empty string responds with status code 422.
- `PUT /users/{id} empty password string returns validation error` - PUT /users/{id} with password as an empty string responds with status code 422.
- `PUT /users/{id} empty avatar string returns validation error` - PUT /users/{id} with avatar as an empty string responds with status code 422.
- `PUT /users/{id} null firstname returns validation error` - PUT /users/{id} with firstname explicitly set to null responds with status code 422.
- `PUT /users/{id} null email returns validation error` - PUT /users/{id} with email explicitly set to null responds with status code 422.

## PATCH /users/{id}

### PATCH /users/{id} - Core

@functional-users_id-patch-core - Functional tests for partially updating a user by ID via PATCH:
- `PATCH /users/{id} updated field is included in the response` - PATCH /users/{id} with a single field in the payload status code is 200, response body contains the updated field value, and a follow-up GET /users/{id} returns the persisted change.
- `PATCH /users/{id} unmodified fields retain their values` - PATCH /users/{id} with a subset of fields status code is 200 and fields not included in the payload are unchanged in the follow-up GET /users/{id} response.

### PATCH /users/{id} - Edge cases

@functional-users_id-patch-edge - Functional tests for PATCH edge-case scenarios:
- `PATCH /users/{id} updating with the same values is accepted` - PATCH /users/{id} with all current field values repeated in the payload responds with status code 200.
- `PATCH /users/{id} updating birthDate field is accepted` - PATCH /users/{id} with only birthDate in the payload responds with status code 200.

### PATCH /users/{id} - Negative

@functional-users_id-patch-negative - Functional tests for negative and edge-case scenarios for PATCH /users/{id}:
- `PATCH /users/{id} invalid ID format returns unauthorized` - PATCH /users/{id} with a non-numeric string ID responds with status code 401.
- `PATCH /users/{id} non-existent user returns unauthorized` - PATCH /users/{id} with a non-existent numeric user ID responds with status code 401.
- `PATCH /users/{id} empty firstname string returns validation error` - PATCH /users/{id} with firstname as an empty string responds with status code 422.
- `PATCH /users/{id} empty lastname string returns validation error` - PATCH /users/{id} with lastname as an empty string responds with status code 422.
- `PATCH /users/{id} empty email string returns validation error` - PATCH /users/{id} with email as an empty string responds with status code 422.
- `PATCH /users/{id} empty password string returns validation error` - PATCH /users/{id} with password as an empty string responds with status code 422.
- `PATCH /users/{id} empty avatar string returns validation error` - PATCH /users/{id} with avatar as an empty string responds with status code 422.

## DELETE /users/{id}

### DELETE /users/{id} - Core

@functional-users_id-delete-core - Functional tests for deleting a user by ID via DELETE:
- `DELETE /users/{id} deleted user is no longer accessible` - DELETE /users/{id} status code is 200 and a follow-up GET /users/{id} returns status code 404.
- `DELETE /users/{id} deleted user is no longer present in the users list` - DELETE /users/{id} status code is 200 and the deleted user is absent from the list returned by GET /users.

### DELETE /users/{id} - Negative

@functional-users_id-delete-negative - Functional tests for negative and edge-case scenarios for DELETE /users/{id}:
- `DELETE /users/{id} invalid ID format returns not found` - DELETE /users/{id} with a non-numeric string ID responds with status code 404.
- `DELETE /users/{id} non-existent user returns not found` - DELETE /users/{id} with a non-existent numeric user ID responds with status code 404.

## HEAD /users

### HEAD /users - Core

@functional-users-head-core - Functional tests for core HEAD /users behaviour:
- [x] `HEAD /users response body is empty` - HEAD /users status code is 200 and response body is empty.
- [x] `HEAD /users response headers match GET /users response headers` - HEAD /users status code is 200 and Content-Type header matches the one returned by GET /users.
- [x] `HEAD /users X-Total-Count header reflects total user count` - HEAD /users?_page=1&_limit=N status code is 200 and X-Total-Count header value equals the total number of users in the database.

### HEAD /users - Pagination

@functional-users-head-pagination - Functional tests for HEAD /users with pagination parameters:
- [x] `HEAD /users pagination X-Total-Count reflects total count with page limit` - HEAD /users?_page=1&_limit=N status code is 200 and X-Total-Count header matches the total count returned by GET /users?_page=1&_limit=N.
- [x] `HEAD /users offset pagination X-Total-Count reflects total user count` - HEAD /users?_start=N&_limit=SIZE status code is 200 and X-Total-Count header equals the total number of users.

### HEAD /users - Filtering

@functional-users-head-filtering - Functional tests for HEAD /users with filter parameters:
- [x] `HEAD /users filtering X-Total-Count reflects filtered count` - HEAD /users?firstname=VALUE status code is 200 and X-Total-Count header matches the count returned by GET /users?firstname=VALUE.

