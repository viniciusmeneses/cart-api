import { singleton } from "tsyringe";
import { EntityTarget, Repository } from "typeorm";

import dataSource from "./dataSource";
import { NotConnectedError } from "./errors";

@singleton()
export class PostgresConnection {
  public async connect(): Promise<void> {
    if (!dataSource.isInitialized) await dataSource.initialize();
  }

  public async disconnect(): Promise<void> {
    if (!dataSource.isInitialized) throw new NotConnectedError();
    await dataSource.destroy();
  }

  public getRepository<Entity>(entity: EntityTarget<Entity>): Repository<Entity> {
    if (!dataSource.isInitialized) throw new NotConnectedError();
    return dataSource.getRepository(entity);
  }
}
