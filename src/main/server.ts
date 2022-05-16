import "reflect-metadata";
import "dotenv/config";
import "./container";

import { container } from "tsyringe";

import { PostgresConnection } from "@infra/database/postgres";

import { app } from "./app";

const PORT = process.env.PORT;

container
  .resolve(PostgresConnection)
  .connect()
  .then(() => app.listen(PORT, () => console.log(`API listening at port ${PORT}`)));
