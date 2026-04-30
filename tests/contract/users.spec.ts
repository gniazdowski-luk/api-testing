import { test, expect } from '@tests/fixtures';
import { Validator } from 'jsonschema';
import { usersSchema } from '@test-data/schemas/users.schema';

const validator = new Validator();

test('GET /users response matches contract schema @contract-users', async ({ request, accessToken }) => {
  const response = await request.get('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const body = await response.json();
  const result = validator.validate(body, usersSchema);

  expect(result.errors).toHaveLength(0);
});
