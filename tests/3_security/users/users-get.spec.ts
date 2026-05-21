import expectedUsersData from '@test-data/users/users.data.json';
import { securityUsersData } from '@test-data/users/users.security.data';
import { expect, test } from '@tests/fixtures';

const maskedUser = {
  email: securityUsersData.maskedEmail,
  lastname: securityUsersData.maskedLastname,
  password: securityUsersData.maskedPassword,
};

function assertMaskedFields(
  users: { id: number; email: string; lastname: string; password: string }[],
  response: { status: () => number }
) {
  const user1 = users.find((u) => u.id === expectedUsersData.user1.id);
  const user2 = users.find((u) => u.id === expectedUsersData.user2.id);

  expect.soft(response.status()).toBe(200);
  expect([
    { email: user1!.email, lastname: user1!.lastname, password: user1!.password },
    { email: user2!.email, lastname: user2!.lastname, password: user2!.password },
  ]).toEqual([maskedUser, maskedUser]);
}

test.describe('Authorization', () => {
  test('checks that unauthenticated access returns the correct status code with masked sensitive fields @security-authorization-get-users', async ({
    request,
  }) => {
    const response = await request.get('users');
    const users = await response.json();

    assertMaskedFields(users, response);
  });

  test('checks that an empty Bearer token returns the correct status code with masked sensitive fields @security-authorization-get-users', async ({
    request,
  }) => {
    const response = await request.get('users', {
      headers: { Authorization: securityUsersData.emptyBearerToken },
    });
    const users = await response.json();

    assertMaskedFields(users, response);
  });

  test('checks that an invalid Bearer token returns the correct status code with masked sensitive fields @security-authorization-get-users', async ({
    request,
  }) => {
    const response = await request.get('users', {
      headers: { Authorization: securityUsersData.wrongBearerToken },
    });
    const users = await response.json();

    assertMaskedFields(users, response);
  });

  test('checks that wrong Basic auth returns the correct status code with masked sensitive fields @security-authorization-get-users', async ({
    request,
  }) => {
    const response = await request.get('users', {
      headers: { Authorization: securityUsersData.wrongBasicAuth },
    });
    const users = await response.json();

    assertMaskedFields(users, response);
  });

  test('checks that a valid token without Cookie returns the correct status code with masked sensitive fields @security-authorization-get-users', async ({
    request,
    accessToken,
  }) => {
    const response = await request.get('users', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const users = await response.json();

    assertMaskedFields(users, response);
  });
});

test.describe('CORS', () => {
  test('checks that the response includes the Access-Control-Allow-Origin header @security-cors-get-users', async ({
    request,
    baseURL,
  }) => {
    const response = await request.get('users', {
      headers: { Origin: new URL(baseURL!).origin },
    });

    expect(response.headers()['access-control-allow-origin']).toBeTruthy();
  });

  test('checks that an OPTIONS preflight request returns the correct CORS headers @security-cors-get-users', async ({
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
    expect(response.headers()['access-control-allow-headers']).toBeTruthy();
  });
});
