import { CartItem } from "@domain/entities/CartItem";
import faker from "@faker-js/faker";

export const makeFakeCartItem = (): CartItem => ({
  cartId: faker.datatype.uuid(),
  productId: faker.datatype.uuid(),
  amount: faker.datatype.number({ min: 0 }),
  createdAt: new Date(),
  updatedAt: new Date(),
  cart: null,
  product: null,
});
