const AWS = require("aws-sdk");
const csvtojson = require("csvtojson");
const { Writable, pipeline } = require("stream");

class Handler {
  constructor({ s3Svc, sqsSvc }) {
    this.s3Svc = s3Svc;
    this.sqsSvc = sqsSvc;
    this.queueName = process.env.SQS_QUEUE;
  }

  static getSdks() {
    const host = process.env.LOCALSTACK_HOST || "localhost";
    const s3port = process.env.S3_PORT || "4572";
    const sqsPort = process.env.SQS_PORT || "4576";
    const isLocal = process.env.IS_LOCAL;
    const s3endpoint = new AWS.Endpoint(`http://${host}:${s3port}`);
    const s3config = {
      endpoint: s3endpoint,
      s3ForcePathStyle: true,
    };

    const sqsEndpoint = new AWS.Endpoint(`http://${host}:${sqsPort}`);
    const sqsConfig = {
      endpoint: sqsEndpoint,
    };

    if (!isLocal) {
      delete s3config.endpoint;
      delete sqsConfig.endpoint;
    }

    return {
      s3: new AWS.S3(),
      sqs: new AWS.SQS(),
    };
  }

  async getQueueUrl() {
    const { QueueUrl } = await this.sqsSvc
      .getQueueUrl({ QueueName: this.queueName })
      .promise();

    return QueueUrl;
  }

  processDataOnDemand(queueUrl) {
    const writableStream = new Writable({
      write: (chunk, _, done) => {
        const item = chunk.toString();

        console.log("sending message...", item, "at", new Date().toISOString());

        this.sqsSvc.sendMessage(
          {
            QueueUrl: queueUrl,
            MessageBody: item,
          },
          done
        );
      },
    });

    return writableStream;
  }

  async pipefyStreams(...args) {
    return new Promise((resolve, reject) => {
      pipeline(...args, (error) => (error ? reject(error) : resolve()));
    });
  }

  async main(event) {
    console.log(JSON.stringify(event, null, 2));

    const [
      {
        s3: {
          bucket: { name },
          object: { key },
        },
      },
    ] = event.Records;

    console.log("Processing", name, key);

    try {
      const queueUrl = await this.getQueueUrl();

      const params = {
        Bucket: name,
        Key: key,
      };

      await this.pipefyStreams(
        this.s3Svc.getObject(params).createReadStream(),
        csvtojson(),
        this.processDataOnDemand(queueUrl)
      );

      console.log("process completed...", new Date().toISOString());

      return {
        statusCode: 200,
        body: "Process finish with success!",
      };
    } catch (err) {
      console.log("***ERROR***", err);
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
}

const { s3, sqs } = Handler.getSdks();

const handler = new Handler({
  s3Svc: s3,
  sqsSvc: sqs,
});

module.exports = handler.main.bind(handler);
