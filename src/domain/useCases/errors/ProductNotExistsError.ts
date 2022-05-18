export class ProductNotExistsError extends Error {
  public constructor(public productId: string) {
    super(`Product ${productId} does not exist`);
    this.name = "ProductNotExistsError";
  }
}
