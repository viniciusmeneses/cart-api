import "dotenv/config";

import { resolve } from "path";
import { DataSource } from "typeorm";

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, NODE_ENV } = process.env;

export default new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME + (NODE_ENV === "test" ? "_test" : ""),
  migrations: [resolve(__dirname, "migrations", "*.{js,ts}")],
  entities: [resolve(__dirname, "..", "..", "..", "domain", "entities", "*.{js,ts}")],
  synchronize: NODE_ENV !== "production",
});
