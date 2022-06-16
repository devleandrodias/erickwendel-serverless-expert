const resolvers = {
  Query: {
    async getSkill(root, args, context, info) {
      return "Hello GraphQL";
    },
  },
  Mutation: {
    async createSkill(root, args, context, info) {
      return "Hello GraphQL";
    },
  },
};

module.exports = resolvers;
