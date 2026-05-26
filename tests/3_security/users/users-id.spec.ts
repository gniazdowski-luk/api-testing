import expectedUsersData from '@test-data/users/users.data.json';
import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';

const userId = expectedUsersData.user1.id;

const maskedUser = {
  email: securityUsersData.maskedEmail,
  lastname: securityUsersData.maskedLastname,
  password: securityUsersData.maskedPassword,
};

function assertMaskedFields(
  user: { email: string; lastname: string; password: string },
  response: { status: () => number }
) {
  expect.soft(response.status()).toBe(200);
  expect({ email: user.email, lastname: user.lastname, password: user.password }).toEqual(maskedUser);
}

test.describe('Authorization', () => {
  test('checks that unauthenticated access to a single user returns the correct status code with masked sensitive fields @security-authorization-get-users-id', async ({
    request,
  }) => {
    const response = await request.get(`users/${userId}`);
    const user = await response.json();

    assertMaskedFields(user, response);
  });

  test('checks that an empty Bearer token for a single-user request returns the correct status code with masked sensitive fields @security-authorization-get-users-id', async ({
    request,
  }) => {
    const response = await request.get(`users/${userId}`, {
      headers: { Authorization: securityUsersData.emptyBearerToken },
    });
    const user = await response.json();

    assertMaskedFields(user, response);
  });

  test('checks that an invalid Bearer token for a single-user request returns the correct status code with masked sensitive fields @security-authorization-get-users-id', async ({
    request,
  }) => {
    const response = await request.get(`users/${userId}`, {
      headers: { Authorization: securityUsersData.wrongBearerToken },
    });
    const user = await response.json();

    assertMaskedFields(user, response);
  });

  test('checks that wrong Basic auth for a single-user request returns the correct status code with masked sensitive fields @security-authorization-get-users-id', async ({
    request,
  }) => {
    const response = await request.get(`users/${userId}`, {
      headers: { Authorization: securityUsersData.wrongBasicAuth },
    });
    const user = await response.json();

    assertMaskedFields(user, response);
  });

  test('checks that a valid token without Cookie for a single-user request returns the correct status code with masked sensitive fields @security-authorization-get-users-id', async ({
    request,
    accessToken,
  }) => {
    const response = await request.get(`users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await response.json();

    assertMaskedFields(user, response);
  });
});

test.describe('CORS', () => {
  test('checks that the single-user response includes the Access-Control-Allow-Origin header @security-cors-get-users-id', async ({
    request,
    baseURL,
  }) => {
    const response = await request.get(`users/${userId}`, {
      headers: { Origin: new URL(baseURL!).origin },
    });

    expect(response.headers()['access-control-allow-origin']).toBeTruthy();
  });

  test('checks that an OPTIONS preflight request for a single user returns the correct CORS headers @security-cors-get-users-id', async ({
    request,
    baseURL,
  }) => {
    const response = await request.fetch(`users/${userId}`, {
      method: 'OPTIONS',
      headers: {
        Origin: new URL(baseURL!).origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization',
      },
    });

    expect.soft(response.headers()['access-control-allow-methods']).toBeTruthy();
    expect(response.headers()['access-control-allow-headers']).toBeTruthy();
  });
});

test.describe('Security Headers', () => {
  test('checks that the single-user response includes the X-Content-Type-Options header @security-headers-users-id', async ({
    request,
  }) => {
    const response = await request.get(`users/${userId}`);

    expect(response.headers()['x-content-type-options']).toBe('nosniff');
  });

  test('checks that the single-user response includes the X-Frame-Options header @security-headers-users-id', async ({
    request,
  }) => {
    const response = await request.get(`users/${userId}`);

    expect(['DENY', 'SAMEORIGIN']).toContain(response.headers()['x-frame-options']);
  });

  test('checks that the single-user response includes a Content-Security-Policy header @security-headers-users-id', async ({
    request,
  }) => {
    const response = await request.get(`users/${userId}`);

    expect(response.headers()['content-security-policy']).toBeTruthy();
  });
});
