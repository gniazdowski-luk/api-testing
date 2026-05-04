import { test, expect } from '@tests/fixtures';
import { Validator } from 'jsonschema';
import { usersSchema } from '@test-data/schemas/users.schema';
import { contractUsersData } from '@test-data/contract/users.contract.data';

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
  const result = validator.validate(contractUsersData.missingRequiredFields, usersSchema);

  expect.soft(result.errors.every(e => e.name === 'required')).toBe(true);
  expect.soft(result.errors.map(e => e.argument)).toEqual(expect.arrayContaining(['email', 'avatar']));
  expect(result.errors).toHaveLength(2);
});

test('mocked data with wrong field types fails schema validation @contract-users-mocked', async () => {
  const result = validator.validate(contractUsersData.wrongFieldTypes, usersSchema);

  expect.soft(result.errors.every(e => e.name === 'type')).toBe(true);
  expect.soft(result.errors.map(e => e.property)).toEqual(expect.arrayContaining(['instance[0].email', 'instance[0].firstname']));
  expect(result.errors).toHaveLength(2);
});

test('mocked data with non-array root fails schema validation @contract-users-mocked', async () => {
  const result = validator.validate(contractUsersData.nonArrayRoot, usersSchema);

  expect.soft(result.errors[0].name).toBe('type');
  expect.soft(result.errors[0].property).toBe('instance');
  expect(result.errors).toHaveLength(1);
});

test('mocked data with null user entry fails schema validation @contract-users-mocked', async () => {
  const result = validator.validate(contractUsersData.nullUserEntry, usersSchema);

  expect.soft(result.errors[0].property).toBe('instance[0]');
  expect(result.errors).not.toHaveLength(0);
});

test('mocked data with empty string required fields fails schema validation @contract-users-mocked', async () => {
  const result = validator.validate(contractUsersData.avatarWrongType, usersSchema);

  expect.soft(result.errors[0].name).toBe('type');
  expect.soft(result.errors[0].property).toBe('instance[0].avatar');
  expect(result.errors).toHaveLength(1);
});

test('mocked empty array passes schema validation @contract-users-mocked', async () => {
  const result = validator.validate(contractUsersData.emptyArray, usersSchema);

  expect(result.errors).toHaveLength(0);
});
