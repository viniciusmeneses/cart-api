import { inject } from "tsyringe";

import { PostgresConnection } from "./PostgresConnection";

export class Repository {
  public constructor(@inject(PostgresConnection) protected connection?: PostgresConnection) {}
}
