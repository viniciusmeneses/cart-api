export class ProductNotExistsError extends Error {
  public constructor(id: string) {
    super(`Product ${id} not exists`);
    this.name = "ProductNotExistsError";
  }
}
