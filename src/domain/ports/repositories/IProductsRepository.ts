import { Product } from "@domain/entities/Product";

export interface IProductsRepository {
  findById(id: string): Promise<Product>;
  findByIds(ids: string[]): Promise<Product[]>;
}
