import { test, expect } from '@tests/fixtures';
import { securityUsersData } from '@test-data/security/users.security.data';

test('PUT /users without Authorization header returns 401 with error message @security-authorization-put-users', async ({ request }) => {
  const response = await request.put('users', {
    data: securityUsersData.putUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PUT /users with empty Bearer token returns 401 with error message @security-authorization-put-users', async ({ request }) => {
  const response = await request.put('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
    data: securityUsersData.putUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PUT /users with wrong Bearer token returns 401 with error message @security-authorization-put-users', async ({ request }) => {
  const response = await request.put('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
    data: securityUsersData.putUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PUT /users with wrong Basic auth returns 401 with error message @security-authorization-put-users', async ({ request }) => {
  const response = await request.put('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
    data: securityUsersData.putUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PUT /users with valid Bearer token but without Cookie returns 401 with error message @security-authorization-put-users', async ({ request, accessToken }) => {
  const response = await request.put('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
    data: securityUsersData.putUserPayload,
  });
  const body = await response.json();

  expect.soft(body.error.message).toBe(securityUsersData.accessTokenInvalid);
  expect(response.status()).toBe(401);
});
