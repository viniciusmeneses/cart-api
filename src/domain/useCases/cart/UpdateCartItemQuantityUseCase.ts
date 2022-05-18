import { inject, singleton } from "tsyringe";

import { CartItem } from "@domain/entities/CartItem";
import { ICartItemsRepository } from "@domain/ports/repositories";
import { IUpdateCartItemQuantityUseCase } from "@domain/ports/useCases/cart";
import { ValidateInputs } from "@domain/validator";

import { CartItemNotExistsError, ProductStockUnavailable } from "../errors";

@singleton()
export class UpdateCartItemQuantityUseCase implements IUpdateCartItemQuantityUseCase {
  public constructor(@inject("CartItemsRepository") private cartItemsRepository: ICartItemsRepository) {}

  @ValidateInputs
  public async execute({ cartId, productId, quantity }: IUpdateCartItemQuantityUseCase.Input): Promise<CartItem> {
    const cartItem = await this.cartItemsRepository.findById(cartId, productId);

    if (cartItem == null) throw new CartItemNotExistsError(cartId, productId);
    if (quantity > cartItem.product.stock) throw new ProductStockUnavailable(cartItem.product);

    cartItem.quantity = quantity;
    return this.cartItemsRepository.update(cartItem);
  }
}