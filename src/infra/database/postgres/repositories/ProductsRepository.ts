import { singleton } from "tsyringe";
import { In, Repository as OrmRepository } from "typeorm";

import { Product } from "@domain/entities/Product";
import { IProductsRepository } from "@domain/ports/repositories";

import { Repository } from "../Repository";

@singleton()
export class ProductsRepository extends Repository implements IProductsRepository {
  public findById(id: string): Promise<Product> {
    return this.repository.findOneBy({ id });
  }

  public findByIds(ids: string[]): Promise<Product[]> {
    return this.repository.findBy({ id: In(ids) });
  }

  private get repository(): OrmRepository<Product> {
    return this.connection.getRepository(Product);
  }
}
