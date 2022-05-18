export class CartItemNotExistsError extends Error {
  public constructor(cartId: string, productId: string) {
    super(`Cart item with product ${productId} from cart ${cartId} does not exist`);
    this.name = "ProductAlreadyAddedToCartError";
  }
}
