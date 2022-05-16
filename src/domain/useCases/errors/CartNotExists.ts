export class CartNotExistsError extends Error {
  public constructor(id: string) {
    super(`Cart ${id} not exists`);
    this.name = "CartNotExistsError";
  }
}
