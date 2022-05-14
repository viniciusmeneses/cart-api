import { singleton } from "tsyringe";

import { Product } from "@domain/entities/Product";
import * as Ports from "@domain/ports/repositories";

import { Repository } from "../Repository";

@singleton()
export class ProductsRepository extends Repository implements Ports.ProductsRepository {
  public findById(id: string): Promise<Product> {
    const repository = this.connection.getRepository(Product);
    return repository.findOneBy({ id });
  }
}
