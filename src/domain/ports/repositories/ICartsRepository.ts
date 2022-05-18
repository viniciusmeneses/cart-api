import { Cart } from "@domain/entities/Cart";

import { ICreateCartItemInput } from "./ICartItemsRepository";

export interface ICreateCartInput {
  items?: Omit<ICreateCartItemInput, "cartId">[];
}

export interface ICartsRepository {
  create(dto?: ICreateCartInput): Promise<Cart>;
  findById(id: string): Promise<Cart>;
  update(cart: Cart): Promise<Cart>;
}
