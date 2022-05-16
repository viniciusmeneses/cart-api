import { singleton } from "tsyringe";
import { Repository as OrmRepository } from "typeorm";

import { Cart } from "@domain/entities/Cart";
import { ICartsRepository, ICreateCartInput } from "@domain/ports/repositories/ICartsRepository";

import { Repository } from "../Repository";

@singleton()
export class CartsRepository extends Repository implements ICartsRepository {
  public async create(dto?: ICreateCartInput): Promise<Cart> {
    const cart = this.repository.create({ items: dto?.items ?? [] });
    await this.repository.save(cart);
    return this.findById(cart.id);
  }

  public async findById(id: string): Promise<Cart> {
    return this.repository.findOne({ where: { id }, relations: { items: { product: true } } });
  }

  private get repository(): OrmRepository<Cart> {
    return this.connection.getRepository(Cart);
  }
}
