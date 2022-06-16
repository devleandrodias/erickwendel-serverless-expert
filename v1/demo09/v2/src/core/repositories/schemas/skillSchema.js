const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const skillSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const model = dynamoose.model(process.env.SKILLS_TABLE, skillSchema);

module.exports = model;
