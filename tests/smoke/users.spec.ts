import { test, expect } from '@tests/fixtures';

test('GET /users status is OK @smoke', async ({ request, accessToken }) => {
  const response = await request.get('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(response.status()).toBe(200);
});
