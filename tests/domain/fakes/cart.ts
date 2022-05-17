import { plainToInstance } from "class-transformer";

import { Cart } from "@domain/entities/Cart";
import { CartItem } from "@domain/entities/CartItem";

export const makeFakeCart = ({ id, items = [] }: { id: string; items?: CartItem[] }): Cart =>
  plainToInstance(Cart, {
    id,
    items,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
