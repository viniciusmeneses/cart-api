import { Cart } from "@domain/entities/Cart";
import { ICreateCartUseCase } from "@domain/ports/useCases/cart/ICreateCartUseCase";
import faker from "@faker-js/faker";

import { makeFakeCartItem } from "./cartItem";

export const makeFakeCart = (): Cart => {
  const id = faker.datatype.uuid();
  return {
    id,
    items: [{ ...makeFakeCartItem(), cartId: id }],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const makeFakeCreateCartInput = (): ICreateCartUseCase.Input => ({
  items: [{ productId: faker.datatype.uuid(), amount: faker.datatype.number({ min: 0 }) }],
});
