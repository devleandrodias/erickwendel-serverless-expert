"use strict";

const AWS = require("aws-sdk");
const moment = require("moment");

const apiGateway = new AWS.APIGateway();

const hello = async (event) => {
  return {
    statusCode: 200,
    body: "Hello API Keys..",
  };
};

const usagePlans = async (event) => {
  const result = await apiGateway.getUsagePlans().promise();

  console.log("***Usage plans***", result);

  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2),
  };
};

const usage = async (event) => {
  const { from, to, usagePlanId, keyId } = event.queryStringParameters;

  const usage = await apiGateway
    .getUsage({
      keyId,
      usagePlanId,
      endDate: moment(to).format("YYYY-MM-DD"),
      startDate: moment(from).format("YYYY-MM-DD"),
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify(usage, null, 2),
  };
};

const addKey = async (event) => {
  const { name, usagePlanId } = event.queryStringParameters;

  console.log("***Adding key***", { name, usagePlanId });

  const planKeys = await apiGateway.getUsagePlanKeys({ usagePlanId }).promise();
  const {
    items: [{ type: keyType }],
  } = planKeys;

  console.log({ planKeys });

  const apiKeyCreated = await apiGateway
    .createApiKey({
      name,
      enabled: true,
    })
    .promise();

  const [apiKeyId, apiKeyToken] = [apiKeyCreated.id, apiKeyCreated.value];

  const linkApiKey = await apiGateway
    .createUsagePlanKey({
      keyId: apiKeyId,
      keyType,
      usagePlanId,
    })
    .promise();

  console.log(`API Key + Usage plan linked`, linkApiKey);

  const message = `Use ${apiKeyId} to check quota and 'x-api-key: ${apiKeyToken}' to make requests`;

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message,
        apiKeyId,
        apiKeyToken,
      },
      null,
      2
    ),
  };
};

module.exports = {
  hello,
  addKey,
  usage,
  usagePlans,
};
