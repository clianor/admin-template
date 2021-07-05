module.exports = {
  client: {
    includes: ['./**/*.tsx'],
    tagName: 'gql',
    service: {
      name: 'admin-template',
      url: 'http://localhost:3000/graphql',
    },
  },
};
