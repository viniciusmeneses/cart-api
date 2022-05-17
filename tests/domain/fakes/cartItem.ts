import { plainToInstance } from "class-transformer";

import { CartItem } from "@domain/entities/CartItem";
import faker from "@faker-js/faker";

import { makeFakeProduct } from "./product";

export const makeFakeCartItem = ({ cartId, productId }: { cartId: string; productId: string }): CartItem =>
  plainToInstance(CartItem, {
    cartId,
    productId,
    product: makeFakeProduct({ id: productId }),
    quantity: faker.datatype.number({ min: 1, max: 10 }),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
