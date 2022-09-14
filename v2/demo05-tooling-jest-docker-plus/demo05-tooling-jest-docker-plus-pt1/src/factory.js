const AWS = require("aws-sdk");

const s3Config = {
  s3ForcePathStyle: true,
};

const isLocal = process.env.IS_OFFLINE;

if (isLocal) {
  AWS.config.update({
    credentials: {
      accessKeyId: "test",
      secretAccessKey: "test",
    },
  });

  const host = "localhost";

  s3Config.endpoint = new AWS.Endpoint(`http://${host}:4566`);
}

const S3 = new AWS.S3(s3Config);

module.exports = { S3 };
