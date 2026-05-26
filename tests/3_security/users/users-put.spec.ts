import { usersPayloadsData } from '@test-data/users/users.payloads.data';
import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';

test('checks that missing authorization on PUT /users returns the correct status code and error message @security-authorization-put-users', async ({
  request,
}) => {
  const response = await request.put('users', {
    data: usersPayloadsData.put,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that an empty Bearer token on PUT /users returns the correct status code and error message @security-authorization-put-users', async ({
  request,
}) => {
  const response = await request.put('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
    data: usersPayloadsData.put,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that an invalid Bearer token on PUT /users returns the correct status code and error message @security-authorization-put-users', async ({
  request,
}) => {
  const response = await request.put('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
    data: usersPayloadsData.put,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that wrong Basic auth on PUT /users returns the correct status code and error message @security-authorization-put-users', async ({
  request,
}) => {
  const response = await request.put('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
    data: usersPayloadsData.put,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('checks that a valid token without Cookie on PUT /users returns the correct status code and error message @security-authorization-put-users', async ({
  request,
  accessToken,
}) => {
  const response = await request.put('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
    data: usersPayloadsData.put,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenInvalid);
  expect(response.status()).toBe(401);
});

test('checks that an expired token on PUT /users returns the correct status code and error message @security-expired-token-users', async ({
  request,
}) => {
  const response = await request.put('users', {
    headers: { Authorization: securityUsersData.expiredToken },
    data: usersPayloadsData.put,
  });

  expect(response.status()).toBe(401);
});
