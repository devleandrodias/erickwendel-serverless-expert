const env = require("env-var");

const settings = {
  NODE_ENV: env.get("NODE_ENV").required().asString(),
  dbTableName: env.get("DbTableName").required().asString(),
  commitMessageUrl: env.get("APICommitMessagesURL").required().asUrlString(),
};

module.exports = settings;
