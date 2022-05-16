import { Cart } from "@domain/entities/Cart";

export interface ICreateCartItemInput {
  productId: string;
  quantity: number;
}

export interface ICreateCartInput {
  items?: ICreateCartItemInput[];
}

export interface ICartsRepository {
  create(dto?: ICreateCartInput): Promise<Cart>;
  findById(id: string): Promise<Cart>;
}
