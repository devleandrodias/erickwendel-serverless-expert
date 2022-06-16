const dynamoose = require("dynamoose");

function setupDynamoDbClient() {
  if (!process.env.IS_LOCAL) return;

  const host = process.env.LOCALSTACK_HOST;
  const port = process.env.DYNAMODB_PORT;

  console.log("Running locally, connecting to DynamoDB on", host, port);

  dynamoose.local(`http://${host}:${port}`);
}

module.exports = setupDynamoDbClient;
