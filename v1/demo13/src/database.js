const Sequelize = require("sequelize");

const connection = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DATABASE,
};

const sequelize = new Sequelize(
  connection.database,
  connection.user,
  connection.password,
  {
    dialect: "mysql",
    host: connection.host,
    quoteIdentifiers: false,
    operatorsAliases: false,
  }
);

const Heroes = sequelize.define(
  "heroes",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      required: true,
    },
    power: {
      type: Sequelize.STRING,
      required: true,
    },
  },
  {
    tableName: "TB_HEROES",
    freezeTableName: false,
    timestamp: false,
  }
);

module.exports = {
  HeroSchema: Heroes,
  sequelize,
};
