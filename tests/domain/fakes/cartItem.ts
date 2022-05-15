import { CartItem } from "@domain/entities/CartItem";
import faker from "@faker-js/faker";

export const makeFakeCartItem = ({ cartId, productId }: { cartId: string; productId: string }): CartItem => ({
  cartId,
  productId,
  amount: faker.datatype.number({ min: 0 }),
  createdAt: new Date(),
  updatedAt: new Date(),
  cart: null,
  product: null,
});
