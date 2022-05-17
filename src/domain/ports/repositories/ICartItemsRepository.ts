import { CartItem } from "@domain/entities/CartItem";

export interface ICreateCartItemInput {
  cartId: string;
  productId: string;
  quantity: number;
}

export interface ICartItemsRepository {
  create(dto: ICreateCartItemInput): Promise<CartItem>;
  findById(cartId: string, productId: string): Promise<CartItem>;
  update(cartItem: CartItem): Promise<CartItem>;
  remove(cartItems: CartItem[]): Promise<void>;
}
