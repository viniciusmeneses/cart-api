import { CartItem } from "@domain/entities/CartItem";

export class CartItemAlreadyExistsError extends Error {
  public constructor(public cartItem: CartItem) {
    super(`Cart item from cart ${cartItem.cartId} with product ${cartItem.productId} already exists`);
    this.name = "CartItemAlreadyExistsError";
  }
}
