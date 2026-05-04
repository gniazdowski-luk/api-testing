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

test('mocked invalid data fails contract schema validation @contract-users-mocked', async () => {
  const invalidData = [
    { id: 1, firstname: 'John', lastname: 'Doe' }, // missing required 'email' and 'avatar'
  ];

  const result = validator.validate(invalidData, usersSchema);

  expect.soft(result.errors.every(e => e.name === 'required')).toBe(true);
  expect.soft(result.errors.map(e => e.argument)).toEqual(expect.arrayContaining(['email', 'avatar']));
  expect(result.errors).toHaveLength(2);
});

test('mocked data with wrong field types fails schema validation @contract-users-mocked', async () => {
  const invalidData = [
    { id: 1, email: 123, firstname: true, lastname: 'Doe', avatar: 'url' }, // email and firstname are wrong types
  ];

  const result = validator.validate(invalidData, usersSchema);

  expect.soft(result.errors.every(e => e.name === 'type')).toBe(true);
  expect.soft(result.errors.map(e => e.property)).toEqual(expect.arrayContaining(['instance[0].email', 'instance[0].firstname']));
  expect(result.errors).toHaveLength(2);
});

test('mocked data with non-array root fails schema validation @contract-users-mocked', async () => {
  const invalidData = { id: 1, email: 'john@example.com', firstname: 'John', lastname: 'Doe', avatar: 'url' }; // object instead of array

  const result = validator.validate(invalidData, usersSchema);

  expect.soft(result.errors[0].name).toBe('type');
  expect.soft(result.errors[0].property).toBe('instance');
  expect(result.errors).toHaveLength(1);
});

test('mocked data with null user entry fails schema validation @contract-users-mocked', async () => {
  const invalidData = [null]; // array item is null, not an object

  const result = validator.validate(invalidData, usersSchema);

  expect.soft(result.errors[0].property).toBe('instance[0]');
  expect(result.errors).not.toHaveLength(0);
});

test('mocked data with empty string required fields fails schema validation @contract-users-mocked', async () => {
  const invalidData = [
    { id: 1, email: 'john@example.com', firstname: 'John', lastname: 'Doe', avatar: 123 }, // avatar is number, not string
  ];

  const result = validator.validate(invalidData, usersSchema);

  expect.soft(result.errors[0].name).toBe('type');
  expect.soft(result.errors[0].property).toBe('instance[0].avatar');
  expect(result.errors).toHaveLength(1);
});

test('mocked empty array passes schema validation @contract-users-mocked', async () => {
  const emptyData: unknown[] = [];

  const result = validator.validate(emptyData, usersSchema);

  expect(result.errors).toHaveLength(0);
});
