import { singleton } from "tsyringe";
import { In } from "typeorm";

import { Product } from "@domain/entities/Product";
import { IProductsRepository } from "@domain/ports/repositories";

import { Repository } from "../Repository";

@singleton()
export class ProductsRepository extends Repository implements IProductsRepository {
  public findById(id: string): Promise<Product> {
    const repository = this.connection.getRepository(Product);
    return repository.findOneBy({ id });
  }

  public findByIds(ids: string[]): Promise<Product[]> {
    const repository = this.connection.getRepository(Product);
    return repository.findBy({ id: In(ids) });
  }
}
