const canonicalContractUser = {
  id: 1,
  email: 'john@example.com',
  firstname: 'John',
  lastname: 'Doe',
  avatar: 'url',
};

export const contractUsersData = {
  missingRequiredFields: [
    { id: canonicalContractUser.id, firstname: canonicalContractUser.firstname, lastname: canonicalContractUser.lastname }, // missing required 'email' and 'avatar'
  ],
  wrongFieldTypes: [
    { ...canonicalContractUser, email: 123, firstname: true }, // email and firstname are wrong types
  ],
  nonArrayRoot: { ...canonicalContractUser }, // object instead of array
  nullUserEntry: [null] as unknown[], // array item is null, not an object
  avatarWrongType: [
    { ...canonicalContractUser, avatar: 123 }, // avatar is number, not string
  ],
  emptyArray: [] as unknown[],
};