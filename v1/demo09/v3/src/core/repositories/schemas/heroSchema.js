const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const heroSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  skills: [
    {
      type: String,
      required: true,
    },
  ],
});

const model = dynamoose.model(process.env.HEROES_TABLE, heroSchema);

module.exports = model;
