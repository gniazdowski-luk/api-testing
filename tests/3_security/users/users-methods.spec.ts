import { expect, test } from '@tests/fixtures';

test('checks that sending an unsupported HTTP method returns the correct status code @security-methods-users', async ({
  request,
}) => {
  const response = await request.fetch('users', { method: 'TRACE' });

  expect(response.status()).toBe(401);
});
