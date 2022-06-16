const resolvers = {
  Query: {
    async getHero(root, args, context, info) {
      return "Hello GraphQL";
    },
  },
  Mutation: {
    async createHero(root, args, context, info) {
      return "Hello GraphQL";
    },
  },
};

module.exports = resolvers;
