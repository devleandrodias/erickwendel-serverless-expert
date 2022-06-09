const faker = require("faker");

const { HeroSchema, sequelize } = require("./database");

const handler = async (event) => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.stack);
    return {
      statusCode: 500,
      body: "ERRO",
    };
  }

  await HeroSchema.sync();

  const result = await HeroSchema.create({
    name: faker.name.title(),
    power: faker.name.jobTitle(),
  });

  const all = await HeroSchema.findAll({
    raw: true,
    attributes: ["id", "name", "power"],
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      result,
      all,
    }),
  };
};

exports.handler = handler;
