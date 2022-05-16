import { singleton } from "tsyringe";
import { Repository as OrmRepository } from "typeorm";

import { CartItem } from "@domain/entities/CartItem";
import { ICartItemsRepository } from "@domain/ports/repositories";

import { Repository } from "../Repository";

@singleton()
export class CartItemsRepository extends Repository implements ICartItemsRepository {
  public async removeByCartId(cartId: string): Promise<void> {
    await this.repository.delete({ cartId });
  }

  private get repository(): OrmRepository<CartItem> {
    return this.connection.getRepository(CartItem);
  }
}
