export class ProductAlreadyAddedToCartError extends Error {
  public constructor(productId: string, cartId: string) {
    super(`Product ${productId} already added to cart ${cartId}`);
    this.name = "ProductAlreadyAddedToCartError";
  }
}
