import "./src/main/container";

import { createDatabase, dropDatabase } from "typeorm-extension";

import dataSource from "./src/infra/database/postgres/dataSource";

beforeAll(() =>
  createDatabase({
    options: dataSource.options,
  })
);

afterAll(() =>
  dropDatabase({
    options: dataSource.options,
  })
);
