import { singleton } from "tsyringe";
import { Repository as OrmRepository } from "typeorm";

import { CartItem } from "@domain/entities/CartItem";
import { ICartItemsRepository, ICreateCartItemInput } from "@domain/ports/repositories";

import { Repository } from "../Repository";

@singleton()
export class CartItemsRepository extends Repository implements ICartItemsRepository {
  public async create({ cartId, productId, quantity }: ICreateCartItemInput): Promise<CartItem> {
    const cartItem = this.repository.create({ cartId, productId, quantity });
    await this.repository.save(cartItem);
    return this.findById(cartId, productId);
  }

  public async findById(cartId: string, productId: string): Promise<CartItem> {
    return this.repository.findOneBy({ cartId, productId });
  }

  public async update(cartItem: CartItem): Promise<CartItem> {
    const { cartId, productId } = await this.repository.save(cartItem);
    return this.findById(cartId, productId);
  }

  public async remove(cartItems: CartItem[]): Promise<void> {
    await this.repository.remove(cartItems);
  }

  private get repository(): OrmRepository<CartItem> {
    return this.connection.getRepository(CartItem);
  }
}
