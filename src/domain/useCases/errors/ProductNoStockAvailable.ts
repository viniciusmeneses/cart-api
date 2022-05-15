import { Product } from "@domain/entities/Product";

export class ProductNoStockAvailable extends Error {
  public constructor(public product: Product) {
    super(`Product ${product.id} no stock available`);
    this.name = "ProductNoStockAvailable";
  }
}
