import { contractUsersData } from '@test-data/users/users.contract.data';
import { buildUserPayload, postMissingFieldData } from '@test-data/users/users.post.data';
import { usersPayloadsData } from '@test-data/users/users.payloads.data';
import { userSchema, usersSchema } from '@test-data/users/users.schema';
import { expect, test } from '@tests/fixtures';
import { Validator } from 'jsonschema';

const validator = new Validator();

test.describe('GET', () => {
  test('checks that the response matches the expected contract schema @contract-users-get', async ({
    request,
    accessToken,
  }) => {
    const response = await request.get('users', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const body = await response.json();
    const result = validator.validate(body, usersSchema);

    expect(result.errors).toHaveLength(0);
  });

  test('checks that the response includes the correct Content-Type header @contract-users-get', async ({
    request,
    accessToken,
  }) => {
    const response = await request.get('users', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(response.headers()['content-type']).toMatch(/application\/json/);
  });
});

test.describe('GET - Mocked', () => {
  test('verifies that a user object missing required fields is correctly rejected @contract-users-get-mocked', () => {
    const result = validator.validate(contractUsersData.missingRequiredFields, usersSchema);

    expect.soft(result.errors.every((e) => e.name === 'required')).toBe(true);
    expect.soft(result.errors.map((e) => e.argument)).toEqual(expect.arrayContaining(['email', 'avatar']));
    expect(result.errors).toHaveLength(2);
  });

  test('verifies that a user object with incorrect field types is correctly rejected @contract-users-get-mocked', () => {
    const result = validator.validate(contractUsersData.wrongFieldTypes, usersSchema);

    expect.soft(result.errors.every((e) => e.name === 'type')).toBe(true);
    expect
      .soft(result.errors.map((e) => e.property))
      .toEqual(expect.arrayContaining(['instance[0].email', 'instance[0].firstname']));
    expect(result.errors).toHaveLength(2);
  });

  test('verifies that a plain object at the root level is correctly rejected @contract-users-get-mocked', () => {
    const result = validator.validate(contractUsersData.nonArrayRoot, usersSchema);

    expect.soft(result.errors[0].name).toBe('type');
    expect.soft(result.errors[0].property).toBe('instance');
    expect(result.errors).toHaveLength(1);
  });

  test('verifies that an array containing a null item is correctly rejected @contract-users-get-mocked', () => {
    const result = validator.validate(contractUsersData.nullUserEntry, usersSchema);

    expect.soft(result.errors[0].property).toBe('instance[0]');
    expect(result.errors).not.toHaveLength(0);
  });

  test('verifies that a user object with avatar as a number instead of a string is correctly rejected @contract-users-get-mocked', () => {
    const result = validator.validate(contractUsersData.avatarWrongType, usersSchema);

    expect.soft(result.errors[0].name).toBe('type');
    expect.soft(result.errors[0].property).toBe('instance[0].avatar');
    expect(result.errors).toHaveLength(1);
  });

  test('verifies that an empty array is a valid response per the schema @contract-users-get-mocked', () => {
    const result = validator.validate(contractUsersData.emptyArray, usersSchema);

    expect(result.errors).toHaveLength(0);
  });
});

test.describe('POST', () => {
  test('checks that the POST response matches the expected user schema @contract-users-post', async ({ request }) => {
    const response = await request.post('users', {
      data: buildUserPayload(),
    });

    const body = await response.json();
    const result = validator.validate(body, userSchema);

    expect(result.errors).toHaveLength(0);
  });

  test('checks that the POST response includes the correct Content-Type header @contract-users-post', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: buildUserPayload(),
    });

    expect(response.headers()['content-type']).toMatch(/application\/json/);
  });
});

test.describe('Error Responses - Content-Type', () => {
  test('checks that a 422 response includes the correct Content-Type header @contract-error-content-type', async ({
    request,
  }) => {
    const response = await request.post('users', {
      data: postMissingFieldData.missingFirstname,
    });

    expect(response.headers()['content-type']).toMatch(/application\/json/);
  });

  test('checks that a 409 response includes the correct Content-Type header @contract-error-content-type', async ({
    request,
  }) => {
    const payload = buildUserPayload();
    await request.post('users', { data: payload });
    const response = await request.post('users', { data: payload });

    expect(response.headers()['content-type']).toMatch(/application\/json/);
  });

  test('checks that a 401 response includes the correct Content-Type header @contract-error-content-type', async ({
    request,
  }) => {
    const response = await request.put('users', {
      data: usersPayloadsData.put,
    });

    expect(response.headers()['content-type']).toMatch(/application\/json/);
  });
});

test.describe('HEAD', () => {
  test('checks that HEAD /users returns 200 with no response body @contract-head-users', async ({
    request,
    accessToken,
  }) => {
    const response = await request.head('users', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const body = await response.text();

    expect.soft(body).toBe('');
    expect(response.status()).toBe(200);
  });
});
