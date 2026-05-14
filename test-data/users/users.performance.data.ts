import usersData from '@test-data/users/users.data.json';

export const performanceData = {
  slaMs: {
    listEndpoint: 500,
    paginatedEndpoint: 500,
    searchEndpoint: 800,
    unauthenticated: 500,
  },
  pagination: {
    page: 1,
    limit: 5,
  },
  searchQuery: usersData.user1.firstname,
};
