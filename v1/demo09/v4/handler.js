"use strict";

const { ApolloServer } = require("apollo-server-lambda");

const setupDynamoDbClient = require("./src/core/util/setupDynamoDb");

setupDynamoDbClient();

const HeroFactory = require("./src/core/factories/heroFactory");
const SkillFactory = require("./src/core/factories/skillFactory");

const schema = require("./src/graphql");

const isLocal = process.env.IS_LOCAL;

const server = new ApolloServer({
  schema,
  context: async () => ({
    Hero: await HeroFactory.createInstance(),
    Skill: await SkillFactory.createInstance(),
  }),
  playground: isLocal,
  introspection: isLocal,
  formatError(error) {
    console.error("[Global error logger]", error);
    return error;
  },
  formatResponse(response) {
    console.log("[Global logger]", response);
    return response;
  },
});

exports.handler = server.createHandler({ cors: { origin: "*" } });
