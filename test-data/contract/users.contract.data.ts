export const contractUsersData = {
  missingRequiredFields: [
    { id: 1, firstname: 'John', lastname: 'Doe' }, // missing required 'email' and 'avatar'
  ],
  wrongFieldTypes: [
    { id: 1, email: 123, firstname: true, lastname: 'Doe', avatar: 'url' }, // email and firstname are wrong types
  ],
  nonArrayRoot: { id: 1, email: 'john@example.com', firstname: 'John', lastname: 'Doe', avatar: 'url' }, // object instead of array
  nullUserEntry: [null] as unknown[], // array item is null, not an object
  avatarWrongType: [
    { id: 1, email: 'john@example.com', firstname: 'John', lastname: 'Doe', avatar: 123 }, // avatar is number, not string
  ],
  emptyArray: [] as unknown[],
};
