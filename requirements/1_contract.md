# Contract Requirements

## Users

### GET /users

@contract-users-get - Contract tests to verify that the GET /users endpoint adheres to the defined contract:
- `GET /users response matches the users contract schema` - GET /users response matches users contract schema.
- `GET /users response includes the correct Content-Type header` - GET /users response includes Content-Type header.

### GET /users/{id}

@contract-users_id-get - Contract tests to verify that the GET /users/{id} endpoint adheres to the defined contract:
- `GET /users/{id} response matches the user contract schema` - GET /users/{id} response matches user contract schema.
- `GET /users/{id} response includes the correct Content-Type header` - GET /users/{id} response includes Content-Type header.

### POST /users

@contract-users-post - Contract tests to verify that the POST /users endpoint adheres to the defined contract:
- `POST /users response matches the user contract schema` - POST /users response matches user contract schema.
- `POST /users response includes the correct Content-Type header` - POST /users response includes Content-Type header.

### PUT /users/{id}

@contract-users_id-put - Contract tests to verify that the PUT /users/{id} endpoint adheres to the defined contract:
- `PUT /users/{id} response matches the user contract schema` - PUT /users/{id} response matches user contract schema.
