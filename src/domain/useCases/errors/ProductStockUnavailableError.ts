import { Product } from "@domain/entities/Product";

export class ProductStockUnavailableError extends Error {
  public constructor(public product: Product) {
    super(`Product ${product.id} does not have enough stock`);
    this.name = "ProductStockUnavailableError";
  }
}
