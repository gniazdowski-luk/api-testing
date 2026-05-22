import { faker } from '@faker-js/faker';

export function buildUserPayload() {
  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  return {
    firstname,
    lastname,
    email: faker.internet.email({ firstName: firstname, lastName: lastname }),
    password: faker.internet.password({ length: 12 }),
    avatar: '.\\data\\users\\e122918b-a4cc-4746-8664-b359177b705c.jpg',
  };
}

export function buildUserPayloadWithBirthDate() {
  const base = buildUserPayload();
  const date = faker.date.birthdate({ min: 18, max: 70, mode: 'age' });
  const pad = (n: number) => String(n).padStart(2, '0');
  const birthDate = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T01:00:00+01:00`;
  return { ...base, birthDate };
}

function buildPayloadWithout<K extends keyof ReturnType<typeof buildUserPayload>>(field: K) {
  const { [field]: _, ...rest } = buildUserPayload();
  return rest;
}

export const postNegativeData = {
  duplicateEmailBase: buildUserPayload(),
  emptyBody: {},
  extraFields: { ...buildUserPayload(), unknownField: 'extra' },
};

export const postInvalidTypeData = {
  invalidFirstname: { ...buildUserPayload(), firstname: 12345 },
  invalidLastname: { ...buildUserPayload(), lastname: 12345 },
  invalidEmail: { ...buildUserPayload(), email: 12345 },
  invalidPassword: { ...buildUserPayload(), password: 12345 },
  invalidAvatar: { ...buildUserPayload(), avatar: 12345 },
};

export const postInvalidEmailFormatData = {
  missingAt: { ...buildUserPayload(), email: 'userdomain.com' },
  missingDomain: { ...buildUserPayload(), email: 'user@' },
  missingLocalPart: { ...buildUserPayload(), email: '@domain.com' },
};

export const postMissingFieldData = {
  missingFirstname: buildPayloadWithout('firstname'),
  missingLastname: buildPayloadWithout('lastname'),
  missingEmail: buildPayloadWithout('email'),
  missingPassword: buildPayloadWithout('password'),
  missingAvatar: buildPayloadWithout('avatar'),
};

export const postEmptyFieldData = {
  emptyFirstname: { ...buildUserPayload(), firstname: '' },
  emptyLastname: { ...buildUserPayload(), lastname: '' },
  emptyEmail: { ...buildUserPayload(), email: '' },
  emptyPassword: { ...buildUserPayload(), password: '' },
  emptyAvatar: { ...buildUserPayload(), avatar: '' },
};

export const postNullFieldData = {
  nullFirstname: { ...buildUserPayload(), firstname: null },
  nullEmail: { ...buildUserPayload(), email: null },
};

export const postInvalidBirthDateData = {
  nonIso8601: { ...buildUserPayload(), birthDate: '2000-01-01' },
};
