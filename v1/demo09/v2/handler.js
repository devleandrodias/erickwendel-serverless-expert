"use strict";

const { ApolloServer, gql } = require("apollo-server-lambda");

const setupDynamoDbClient = require("./src/core/util/setupDynamoDb");

setupDynamoDbClient();

const HeroFactory = require("./src/core/factories/heroFactory");
const SkillFactory = require("./src/core/factories/skillFactory");

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      origin: true,
      credentials: true,
    },
  },
});

async function main() {
  console.log("Creating instances of factories...");

  const skillFactory = await SkillFactory.createInstance();
  const heroFactory = await HeroFactory.createInstance();

  console.log("Inserting skill item into DynamoDB...");

  const skillId = `${new Date().getTime()}`;

  await skillFactory.create({
    id: skillId,
    name: "Mage",
    value: 50,
  });

  console.log("Getting skill item from DynamoDB...");

  const skillItem = await skillFactory.findOne(skillId);

  console.log(skillItem);

  console.log("Getting all skill items from DynamoDB...");

  const skillAll = await skillFactory.findAll();

  console.log(skillAll);

  console.log("\n=======================\n");

  console.log("Inserting hero item into DynamoDB...");

  const heroId = `${new Date().getTime()}`;

  await heroFactory.create({
    id: heroId,
    name: "Batman",
    skills: [skillId],
  });

  console.log("Getting a hero from DynamoDB...");

  const hero = await heroFactory.findOne(skillId);

  console.log(hero);

  console.log("Getting all heroes from DynamoDB...");

  const heroAll = await heroFactory.findAll();

  console.log(heroAll);

  console.log("\n=======================\n");

  return {
    statusCode: 200,
    body: JSON.stringify({
      hero: {
        hero,
        heroAll,
      },
      skill: {
        skillItem,
        skillAll,
      },
    }),
  };
}

module.exports.test = main;
