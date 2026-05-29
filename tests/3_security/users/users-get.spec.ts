
import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';
import { assertMaskedFieldsForUsers } from '@tests/helpers';

test.describe('Authorization', () => {
  test('GET /users unauthenticated access returns masked sensitive fields @security-users-get-authorization', async ({
    request,
  }) => {
    const response = await request.get('users');
    const users = await response.json();

    assertMaskedFieldsForUsers(users, response);
  });

  test('GET /users empty Bearer token returns masked sensitive fields @security-users-get-authorization', async ({
    request,
  }) => {
    const response = await request.get('users', {
      headers: { Authorization: securityUsersData.emptyBearerToken },
    });
    const users = await response.json();

    assertMaskedFieldsForUsers(users, response);
  });

  test('GET /users invalid Bearer token returns masked sensitive fields @security-users-get-authorization', async ({
    request,
  }) => {
    const response = await request.get('users', {
      headers: { Authorization: securityUsersData.wrongBearerToken },
    });
    const users = await response.json();

    assertMaskedFieldsForUsers(users, response);
  });

  test('GET /users wrong Basic auth returns masked sensitive fields @security-users-get-authorization', async ({
    request,
  }) => {
    const response = await request.get('users', {
      headers: { Authorization: securityUsersData.wrongBasicAuth },
    });
    const users = await response.json();

    assertMaskedFieldsForUsers(users, response);
  });

  test('GET /users valid token without Cookie returns masked sensitive fields @security-users-get-authorization', async ({
    request,
    accessToken,
  }) => {
    const response = await request.get('users', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const users = await response.json();

    assertMaskedFieldsForUsers(users, response);
  });
});

test.describe('CORS Headers', () => {
  test('GET /users access control allow origin header is included @security-users-get-cors', async ({
    request,
    baseURL,
  }) => {
    const origin = new URL(baseURL!).origin;
    const response = await request.get('users', {
      headers: { Origin: origin },
    });

    expect.soft(response.headers()['access-control-allow-origin']).toBe(origin);
    expect(response.status()).toBe(200);
  });

  test('OPTIONS /users preflight request returns CORS headers @security-users-get-cors', async ({
    request,
    baseURL,
  }) => {
    const response = await request.fetch('users', {
      method: 'OPTIONS',
      headers: {
        Origin: new URL(baseURL!).origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Authorization',
      },
    });

    expect.soft(response.headers()['access-control-allow-methods']).toBeTruthy();
    expect.soft(response.headers()['access-control-allow-headers']).toBeTruthy();
    expect(response.status()).toBe(204);
  });
});

test.describe('Security Response Headers', () => {
  test('GET /users response includes X-Content-Type-Options header @security-users-get-headers', async ({
    request,
  }) => {
    const response = await request.get('users');

    expect.soft(response.headers()['x-content-type-options']).toBe('nosniff');
    expect(response.status()).toBe(200);
  });

  test('GET /users response includes X-Frame-Options header @security-users-get-headers', async ({ request }) => {
    const response = await request.get('users');

    expect.soft(response.headers()['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.status()).toBe(200);
  });

  test('GET /users response includes Content-Security-Policy header @security-users-get-headers', async ({
    request,
  }) => {
    const response = await request.get('users');

    expect.soft(response.headers()['content-security-policy']).toBeTruthy();
    expect(response.status()).toBe(200);
  });
});
