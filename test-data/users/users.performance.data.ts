export const performanceData = {
  slaMs: {
    getList: 500,
    getPaginated: 500,
    getSearch: 800,
    getSorted: 500,
    getFiltered: 500,
    getUnauthenticated: 500,
    getConcurrent: 1000,
    getById: 500,
    getByIdNotFound: 500,
    getByIdConcurrent: 1000,
    postCreate: 1000,
    postDuplicateRejection: 500,
    putById: 1000,
  },
  pagination: {
    page: 1,
    limit: 5,
  },
  concurrentRequests: 10,
};
