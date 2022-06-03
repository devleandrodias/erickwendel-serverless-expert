"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk");
const axios = require("axios");
const cheerio = require("cheerio");
const settings = require("./config/settings");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

class Handler {
  static async main(event) {
    console.log("at", new Date().toISOString(), JSON.stringify(event, null, 2));

    const { data } = await axios.get(settings.commitMessageUrl);

    const $ = cheerio.load(data);

    const [commitMessage] = $("#content").text().trim().split("\n");

    await dynamoDb
      .put({
        TableName: settings.dbTableName,
        Item: {
          commitMessage,
          id: uuid.v4(),
          createdAt: new Date().toISOString(),
        },
      })
      .promise();

    console.log("Process finished at", new Date().toISOString());
    return {
      statusCode: 200,
      body: "Executou...",
    };
  }
}

module.exports = { scheduler: Handler.main };
