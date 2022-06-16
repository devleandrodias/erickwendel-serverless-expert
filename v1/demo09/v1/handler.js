"use strict";

const AWS = require("aws-sdk");

function setupDynamoDB() {
  if (!process.env.IS_LOCAL) return new AWS.DynamoDB.DocumentClient();

  const host = process.env.LOCALSTACK_HOST;
  const port = process.env.DYNAMODB_PORT;

  console.log("Running in localstack, connecting to", host, port);

  return new AWS.DynamoDB.DocumentClient({
    region: "localhost",
    accessKeyId: "DEFAULT_ACCESS_KEY",
    secretAccessKey: "DEFAULT_SECRET",
    endpoint: `http://${host}:${port}`,
  });
}

module.exports.hello = async (event) => {
  const dynamodb = setupDynamoDB();

  const heroes = await dynamodb
    .scan({
      TableName: process.env.HEROES_TABLE,
    })
    .promise();

  const skills = await dynamodb
    .scan({
      TableName: process.env.SKILLS_TABLE,
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ heroes, skills }, null, 2),
  };
};
