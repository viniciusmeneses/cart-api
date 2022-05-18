import { Product } from "@domain/entities/Product";

export class ProductStockUnavailable extends Error {
  public constructor(product: Product) {
    super(`Product ${product.id} hasn't stock available`);
    this.name = "ProductStockUnavailable";
  }
}
