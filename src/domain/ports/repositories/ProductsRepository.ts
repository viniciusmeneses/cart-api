import { Product } from "@domain/entities/Product";

export interface ProductsRepository {
  findById(id: string): Promise<Product>;
}
