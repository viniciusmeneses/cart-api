import { CartItem } from "@domain/entities/CartItem";

export class CartItemAlreadyExistsError extends Error {
  public constructor(cartItem: CartItem) {
    super(`Cart item of cart ${cartItem.cartId} with product ${cartItem.productId} already exists`);
    this.name = "CartItemAlreadyExistsError";
  }
}
