import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';

test.describe('Authorization', () => {
  test('HEAD /users unauthenticated access returns ok @security-users-head-authorization', async ({ request }) => {
    const response = await request.head('users');

    expect(response.status()).toBe(200);
  });

  test('HEAD /users empty Bearer token returns ok @security-users-head-authorization', async ({ request }) => {
    const response = await request.head('users', {
      headers: { Authorization: securityUsersData.emptyBearerToken },
    });

    expect(response.status()).toBe(200);
  });

  test('HEAD /users invalid Bearer token returns ok @security-users-head-authorization', async ({ request }) => {
    const response = await request.head('users', {
      headers: { Authorization: securityUsersData.wrongBearerToken },
    });

    expect(response.status()).toBe(200);
  });

  test('HEAD /users wrong Basic auth returns ok @security-users-head-authorization', async ({ request }) => {
    const response = await request.head('users', {
      headers: { Authorization: securityUsersData.wrongBasicAuth },
    });

    expect(response.status()).toBe(200);
  });

  test('HEAD /users valid token without Cookie returns ok @security-users-head-authorization', async ({
    request,
    accessToken,
  }) => {
    const response = await request.head('users', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(response.status()).toBe(200);
  });
});

test.describe('CORS Headers', () => {
  test('HEAD /users access control allow origin header is included @security-users-head-cors', async ({
    request,
    baseURL,
  }) => {
    const origin = new URL(baseURL!).origin;
    const response = await request.head('users', {
      headers: { Origin: origin },
    });

    expect.soft(response.headers()['access-control-allow-origin']).toBe(origin);
    expect(response.status()).toBe(200);
  });

  test('OPTIONS /users preflight request for HEAD returns CORS headers @security-users-head-cors', async ({
    request,
    baseURL,
  }) => {
    const response = await request.fetch('users', {
      method: 'OPTIONS',
      headers: {
        Origin: new URL(baseURL!).origin,
        'Access-Control-Request-Method': 'HEAD',
        'Access-Control-Request-Headers': 'Authorization',
      },
    });

    expect.soft(response.headers()['access-control-allow-methods']).toBeTruthy();
    expect.soft(response.headers()['access-control-allow-headers']).toBeTruthy();
    expect(response.status()).toBe(204);
  });
});

test.describe('Security Response Headers', () => {
  test('HEAD /users response includes X-Content-Type-Options header @security-users-head-headers', async ({
    request,
  }) => {
    const response = await request.head('users');

    expect.soft(response.headers()['x-content-type-options']).toBe('nosniff');
    expect(response.status()).toBe(200);
  });

  test('HEAD /users response includes X-Frame-Options header @security-users-head-headers', async ({ request }) => {
    const response = await request.head('users');

    expect.soft(response.headers()['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.status()).toBe(200);
  });

  test('HEAD /users response includes Content-Security-Policy header @security-users-head-headers', async ({
    request,
  }) => {
    const response = await request.head('users');

    expect.soft(response.headers()['content-security-policy']).toBeTruthy();
    expect(response.status()).toBe(200);
  });
});
