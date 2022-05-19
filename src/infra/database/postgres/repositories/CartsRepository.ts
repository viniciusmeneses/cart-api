import { singleton } from "tsyringe";
import { Repository as OrmRepository } from "typeorm";

import { Cart } from "@domain/entities/Cart";
import { ICartsRepository, ICreateCartInput, IFindCartByIdOptions } from "@domain/ports/repositories";

import { Repository } from "../Repository";

@singleton()
export class CartsRepository extends Repository implements ICartsRepository {
  public async create(dto?: ICreateCartInput): Promise<Cart> {
    const cart = this.repository.create({ items: dto?.items ?? [] });
    await this.repository.save(cart);
    return this.findById(cart.id);
  }

  public async findById(id: string, options: IFindCartByIdOptions = { withItems: true }): Promise<Cart> {
    return this.repository.findOne({
      where: { id },
      relations: { coupon: true, items: options.withItems ? { product: true } : false },
    });
  }

  public async update(cart: Cart): Promise<Cart> {
    const { id } = await this.repository.save(cart);
    return this.findById(id);
  }

  private get repository(): OrmRepository<Cart> {
    return this.connection.getRepository(Cart);
  }
}
