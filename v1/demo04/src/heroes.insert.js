const { v4 } = require("uuid");

const Joi = require("@hapi/joi");

const globalEnum = require("./util/globalEnum");
const decoratorValidator = require("./util/decoratorValidator");

class Handler {
  constructor({ dynamoDbSvc }) {
    this.dynamoDbSvc = dynamoDbSvc;
    this.dynamodbTable = process.env.DYNAMODB_TABLE;
  }

  static validator() {
    return Joi.object({
      nome: Joi.string().max(100).min(2).required(),
      poder: Joi.string().max(20).min(2).required(),
    });
  }

  prepareData(data) {
    return {
      TableName: "Heroes",
      Item: { ...data, id: v4(), createdAt: new Date().toISOString() },
    };
  }

  async insertItem(params) {
    return this.dynamoDbSvc.put(params).promise();
  }

  handlerSuccess(data) {
    return { statusCode: 200, body: JSON.stringify(data) };
  }

  handlerError(data) {
    return {
      statusCode: data.statusCode || 500,
      headers: { ContentType: "text/plan" },
      body: "Could not create the item.",
    };
  }

  async main(event) {
    try {
      // Agora o decorator modifica o body e já retorna no formato json
      const data = event.body;

      const dbParams = this.prepareData(data);

      await this.insertItem(dbParams);

      return this.handlerSuccess(dbParams.Item);
    } catch (err) {
      console.error("**ERROR**", err.stack);
      return this.handlerError({ statusCode: 500 });
    }
  }
}

// Factory

const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const handler = new Handler({ dynamoDbSvc: dynamoDB });

module.exports = decoratorValidator(
  handler.main.bind(handler),
  Handler.validator(),
  globalEnum.ARG_TYPE.BODY
);
