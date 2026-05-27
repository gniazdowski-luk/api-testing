import expectedUsersData from '@test-data/users/users.data.json';
import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';

const maskedUser = {
  email: securityUsersData.maskedEmail,
  lastname: securityUsersData.maskedLastname,
  password: securityUsersData.maskedPassword,
};

function assertMaskedFields(
  user: { id: number; email: string; lastname: string; password: string },
  response: { status: () => number }
) {
  expect
    .soft({
      email: user.email,
      lastname: user.lastname,
      password: user.password,
    })
    .toEqual(maskedUser);
  expect(response.status()).toBe(200);
}

test.describe('Authorization', () => {
  test('GET /users/{id} unauthenticated access returns masked sensitive fields @security-users_id-get-authorization', async ({
    request,
  }) => {
    const response = await request.get(`users/${expectedUsersData.user1.id}`);
    const user = await response.json();

    assertMaskedFields(user, response);
  });

  test('GET /users/{id} empty Bearer token returns masked sensitive fields @security-users_id-get-authorization', async ({
    request,
  }) => {
    const response = await request.get(`users/${expectedUsersData.user1.id}`, {
      headers: { Authorization: securityUsersData.emptyBearerToken },
    });
    const user = await response.json();

    assertMaskedFields(user, response);
  });

  test('GET /users/{id} invalid Bearer token returns masked sensitive fields @security-users_id-get-authorization', async ({
    request,
  }) => {
    const response = await request.get(`users/${expectedUsersData.user1.id}`, {
      headers: { Authorization: securityUsersData.wrongBearerToken },
    });
    const user = await response.json();

    assertMaskedFields(user, response);
  });

  test('GET /users/{id} wrong Basic auth returns masked sensitive fields @security-users_id-get-authorization', async ({
    request,
  }) => {
    const response = await request.get(`users/${expectedUsersData.user1.id}`, {
      headers: { Authorization: securityUsersData.wrongBasicAuth },
    });
    const user = await response.json();

    assertMaskedFields(user, response);
  });

  test('GET /users/{id} valid token without Cookie returns masked sensitive fields @security-users_id-get-authorization', async ({
    request,
    accessToken,
  }) => {
    const response = await request.get(`users/${expectedUsersData.user1.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await response.json();

    assertMaskedFields(user, response);
  });
});

test.describe('CORS Headers', () => {
  test('GET /users/{id} access control allow origin header is included @security-users_id-get-cors', async ({
    request,
    baseURL,
  }) => {
    const origin = new URL(baseURL!).origin;
    const response = await request.get(`users/${expectedUsersData.user1.id}`, {
      headers: { Origin: origin },
    });

    expect.soft(response.headers()['access-control-allow-origin']).toBe(origin);
    expect(response.status()).toBe(200);
  });

  test('OPTIONS /users/{id} preflight request returns CORS headers @security-users_id-get-cors', async ({
    request,
    baseURL,
  }) => {
    const response = await request.fetch(`users/${expectedUsersData.user1.id}`, {
      method: 'OPTIONS',
      headers: {
        Origin: new URL(baseURL!).origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization',
      },
    });

    expect.soft(response.headers()['access-control-allow-methods']).toBeTruthy();
    expect.soft(response.headers()['access-control-allow-headers']).toBeTruthy();
    expect(response.status()).toBe(204);
  });
});

test.describe('Security Response Headers', () => {
  test('GET /users/{id} response includes X-Content-Type-Options header @security-users_id-get-headers', async ({
    request,
  }) => {
    const response = await request.get(`users/${expectedUsersData.user1.id}`);

    expect.soft(response.headers()['x-content-type-options']).toBe('nosniff');
    expect(response.status()).toBe(200);
  });

  test('GET /users/{id} response includes X-Frame-Options header @security-users_id-get-headers', async ({
    request,
  }) => {
    const response = await request.get(`users/${expectedUsersData.user1.id}`);

    expect.soft(response.headers()['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.status()).toBe(200);
  });

  test('GET /users/{id} response includes Content-Security-Policy header @security-users_id-get-headers', async ({
    request,
  }) => {
    const response = await request.get(`users/${expectedUsersData.user1.id}`);

    expect.soft(response.headers()['content-security-policy']).toBeTruthy();
    expect(response.status()).toBe(200);
  });
});
