import { Router } from "express";
import { container } from "tsyringe";

import { adaptExpressRoute } from "@main/helpers";
import {
  AddCouponToCartController,
  CreateCartController,
  CreateCartItemController,
  LoadCartController,
  RemoveCartItemsController,
  UpdateCartItemController,
} from "@presentation/controllers/cart";

const cartRoutes = Router();

cartRoutes.post("/", adaptExpressRoute(container.resolve(CreateCartController)));
cartRoutes.post("/:cartId/items", adaptExpressRoute(container.resolve(CreateCartItemController)));

cartRoutes.get("/:cartId", adaptExpressRoute(container.resolve(LoadCartController)));

cartRoutes.delete("/:cartId/items", adaptExpressRoute(container.resolve(RemoveCartItemsController)));
cartRoutes.delete("/:cartId/items/:productId", adaptExpressRoute(container.resolve(RemoveCartItemsController)));

cartRoutes.patch("/:cartId/items/:productId", adaptExpressRoute(container.resolve(UpdateCartItemController)));
cartRoutes.patch("/:cartId", adaptExpressRoute(container.resolve(AddCouponToCartController)));

export { cartRoutes };
