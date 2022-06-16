const { readdirSync } = require("fs");

const {
  makeExecutableSchema,
  mergeSchemas,
  gql,
} = require("apollo-server-lambda");

console.log(__dirname);

const schemas = readdirSync(__dirname)
  .filter((file) => file !== "index.js")
  .map((folder) => require(`./${folder}`))
  .map(({ schema, resolvers }) =>
    makeExecutableSchema({
      typeDefs: gql(schema),
      resolvers,
    })
  );

module.exports = mergeSchemas({ schemas });
