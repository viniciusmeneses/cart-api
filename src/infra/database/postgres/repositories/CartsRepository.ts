import { singleton } from "tsyringe";

import { Cart } from "@domain/entities/Cart";
import { ICartsRepository, ICreateCartInput } from "@domain/ports/repositories/ICartsRepository";

import { Repository } from "../Repository";

@singleton()
export class CartsRepository extends Repository implements ICartsRepository {
  public async create(dto?: ICreateCartInput): Promise<Cart> {
    const repository = this.connection.getRepository(Cart);
    const cart = repository.create(dto);
    return repository.save(cart);
  }
}
