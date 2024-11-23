import { Sequelize } from "sequelize-typescript";
import config from "./config";
import path from "path";

const sequelize = new Sequelize({
  ...config.getDataBaseConfig(),
  dialect: "mysql",
  // dialectModule: require('mysql2'),
  models: [path.join(__dirname, "../models")],
});

export default sequelize;
