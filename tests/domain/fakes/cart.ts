import { Cart } from "@domain/entities/Cart";
import { CartItem } from "@domain/entities/CartItem";
import { ICreateCartUseCase } from "@domain/ports/useCases/cart/ICreateCartUseCase";
import faker from "@faker-js/faker";

import { makeFakeCartItem } from "./cartItem";

export const makeFakeCart = ({ id, items }: { id: string; items: CartItem[] }): Cart => ({
  id,
  items,
  createdAt: new Date(),
  updatedAt: new Date(),
});
