const Sequelize = require("sequelize");
require("dotenv").config({ path: ".env" });

const db = new Sequelize(
  process.env.DB_NOMBRE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    define: {
      timestamps: false,
    },
  }
);

module.exports = db;
