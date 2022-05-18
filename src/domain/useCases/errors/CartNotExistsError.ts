export class CartNotExistsError extends Error {
  public constructor(public cartId: string) {
    super(`Cart ${cartId} does not exist`);
    this.name = "CartNotExistsError";
  }
}
