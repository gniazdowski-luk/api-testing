import usersData from '@test-data/users/users.data.json';

export const searchUsersData = {
  matchingQuery: {
    q: usersData.user1.firstname,
    expectedIds: [usersData.user1.id],
  },
  noMatchQuery: 'NonExistentXYZ123',
  firstnameLike: {
    pattern: 'Dar',
    expectedIds: [3, 9],
  },
  noMatchFirstnameLike: 'NoMatchXYZ',
  specialCharMatch: '%40', // decoded '@' - present in all email fields
  specialCharNoMatch: '%2B', // decoded '+' - not present in any user field
};
