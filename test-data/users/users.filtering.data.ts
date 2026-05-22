import usersData from '@test-data/users/users.data.json';

export const filteringUsersData = {
  singleFirstname: {
    value: usersData.user1.firstname,
    expectedId: usersData.user1.id,
  },
  noMatchFirstname: 'NonExistentXYZ',
  andFilter: {
    firstname: usersData.user3.firstname,
    lastname: usersData.user3.lastname,
    expectedId: usersData.user3.id,
  },
  orFilter: {
    ids: [usersData.user1.id, usersData.user2.id],
  },
  idRange: {
    min: 1,
    max: 3,
    expectedIds: [1, 2, 3],
  },
  emptyIdRange: {
    min: 1000,
    max: 1010,
  },
  caseSensitiveFirstname: usersData.user1.firstname.toLowerCase(),
};
