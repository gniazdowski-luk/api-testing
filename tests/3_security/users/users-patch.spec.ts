import { usersPayloadsData } from '@test-data/users/users.payloads.data';
import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';

test('PATCH /users unauthenticated access returns error @security-users-patch-authorization', async ({ request }) => {
  const response = await request.patch('users', {
    data: usersPayloadsData.patch,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PATCH /users empty Bearer token returns error @security-users-patch-authorization', async ({ request }) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.emptyBearerToken },
    data: usersPayloadsData.patch,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PATCH /users invalid Bearer token returns error @security-users-patch-authorization', async ({ request }) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.wrongBearerToken },
    data: usersPayloadsData.patch,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PATCH /users wrong Basic auth returns error @security-users-patch-authorization', async ({ request }) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.wrongBasicAuth },
    data: usersPayloadsData.patch,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenNotProvided);
  expect(response.status()).toBe(401);
});

test('PATCH /users valid token without Cookie returns error @security-users-patch-authorization', async ({
  request,
  accessToken,
}) => {
  const response = await request.patch('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
    data: usersPayloadsData.patch,
  });
  const errorResponse = await response.json();

  expect.soft(errorResponse.error.message).toBe(securityUsersData.accessTokenInvalid);
  expect(response.status()).toBe(401);
});

test('PATCH /users expired token returns error @security-users-patch-expired_token', async ({ request }) => {
  const response = await request.patch('users', {
    headers: { Authorization: securityUsersData.expiredToken },
    data: usersPayloadsData.patch,
  });

  expect(response.status()).toBe(401);
});

test('PATCH /users access control allow origin header is included @security-users-patch-cors', async ({
  request,
  baseURL,
}) => {
  const origin = new URL(baseURL!).origin;
  const response = await request.patch('users', {
    headers: { Origin: origin },
    data: usersPayloadsData.patch,
  });

  expect.soft(response.headers()['access-control-allow-origin']).toBe(origin);
  expect(response.status()).toBe(401);
});

test('OPTIONS /users preflight request for PATCH returns CORS headers @security-users-patch-cors', async ({
  request,
  baseURL,
}) => {
  const response = await request.fetch('users', {
    method: 'OPTIONS',
    headers: {
      Origin: new URL(baseURL!).origin,
      'Access-Control-Request-Method': 'PATCH',
      'Access-Control-Request-Headers': 'Authorization',
    },
  });

  expect.soft(response.headers()['access-control-allow-methods']).toContain('PATCH');
  expect.soft(response.headers()['access-control-allow-headers']).toBeTruthy();
  expect(response.status()).toBe(204);
});
