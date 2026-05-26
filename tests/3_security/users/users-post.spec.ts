import { buildUserPayload } from '@test-data/users/users.post.data';
import { expect, test } from '@tests/fixtures';

test.describe('CORS', () => {

  test('checks that an OPTIONS preflight request for POST includes the correct CORS headers @security-cors-post-users', async ({
    request,
    baseURL,
  }) => {
    const response = await request.fetch('users', {
      method: 'OPTIONS',
      headers: {
        Origin: new URL(baseURL!).origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });

    expect.soft(response.headers()['access-control-allow-methods']).toBeTruthy();
    expect(response.headers()['access-control-allow-headers']).toBeTruthy();
  });
});
