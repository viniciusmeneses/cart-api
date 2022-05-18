export class CartItemNotExistsError extends Error {
  public constructor(public cartId: string, public productId: string) {
    super(`Cart item from cart ${cartId} with product ${productId} does not exist`);
    this.name = "ProductAlreadyAddedToCartError";
  }
}
