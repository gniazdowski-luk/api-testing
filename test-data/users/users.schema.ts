export const userSchema = {
  type: 'object',
  required: ['email', 'firstname', 'lastname', 'avatar'],
  properties: {
    id: { oneOf: [{ type: 'number' }, { type: 'string' }] },
    email: { type: 'string' },
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    password: { type: 'string' },
    avatar: { type: 'string' },
  },
};

export const usersSchema = {
  type: 'array',
  items: userSchema,
};