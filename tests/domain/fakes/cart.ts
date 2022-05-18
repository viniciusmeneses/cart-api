import { plainToInstance } from "class-transformer";

import { Cart } from "@domain/entities/Cart";
import { CartItem } from "@domain/entities/CartItem";
import { Coupon } from "@domain/entities/Coupon";

export const makeFakeCart = ({ id, items = [], coupon }: { id: string; items?: CartItem[]; coupon?: Coupon }): Cart =>
  plainToInstance(Cart, {
    id,
    items,
    coupon,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
