import { contractUsersData } from '@test-data/users/users.contract.data';
import { usersSchema } from '@test-data/users/users.schema';
import { expect, test } from '@tests/fixtures';
import { Validator } from 'jsonschema';

const validator = new Validator();

test('checks that the response matches the expected contract schema @contract-users', async ({
  request,
  accessToken,
}) => {
  const response = await request.get('users', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const body = await response.json();
  const result = validator.validate(body, usersSchema);

  expect(result.errors).toHaveLength(0);
});

test('verifies that a user object missing required fields is correctly rejected @contract-users-mocked', () => {
  const result = validator.validate(contractUsersData.missingRequiredFields, usersSchema);

  expect.soft(result.errors.every((e) => e.name === 'required')).toBe(true);
  expect.soft(result.errors.map((e) => e.argument)).toEqual(expect.arrayContaining(['email', 'avatar']));
  expect(result.errors).toHaveLength(2);
});

test('verifies that a user object with incorrect field types is correctly rejected @contract-users-mocked', () => {
  const result = validator.validate(contractUsersData.wrongFieldTypes, usersSchema);

  expect.soft(result.errors.every((e) => e.name === 'type')).toBe(true);
  expect
    .soft(result.errors.map((e) => e.property))
    .toEqual(expect.arrayContaining(['instance[0].email', 'instance[0].firstname']));
  expect(result.errors).toHaveLength(2);
});

test('verifies that a plain object at the root level is correctly rejected @contract-users-mocked', () => {
  const result = validator.validate(contractUsersData.nonArrayRoot, usersSchema);

  expect.soft(result.errors[0].name).toBe('type');
  expect.soft(result.errors[0].property).toBe('instance');
  expect(result.errors).toHaveLength(1);
});

test('verifies that an array containing a null item is correctly rejected @contract-users-mocked', () => {
  const result = validator.validate(contractUsersData.nullUserEntry, usersSchema);

  expect.soft(result.errors[0].property).toBe('instance[0]');
  expect(result.errors).not.toHaveLength(0);
});

test('verifies that a user object with avatar as a number instead of a string is correctly rejected @contract-users-mocked', () => {
  const result = validator.validate(contractUsersData.avatarWrongType, usersSchema);

  expect.soft(result.errors[0].name).toBe('type');
  expect.soft(result.errors[0].property).toBe('instance[0].avatar');
  expect(result.errors).toHaveLength(1);
});

test('verifies that an empty array is a valid response per the schema @contract-users-mocked', () => {
  const result = validator.validate(contractUsersData.emptyArray, usersSchema);

  expect(result.errors).toHaveLength(0);
});
