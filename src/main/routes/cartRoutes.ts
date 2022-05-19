import { Router } from "express";

import { adaptExpressRoute } from "@main/helpers";
import {
  ApplyCouponToCartController,
  CreateCartController,
  CreateCartItemController,
  LoadCartController,
  RemoveCartItemsController,
  UpdateCartItemController,
} from "@presentation/controllers/cart";

const cartRoutes = Router();

cartRoutes.post("/", adaptExpressRoute(CreateCartController));
cartRoutes.get("/:cartId", adaptExpressRoute(LoadCartController));

cartRoutes.post("/:cartId/apply-coupon", adaptExpressRoute(ApplyCouponToCartController));

cartRoutes.post("/:cartId/items", adaptExpressRoute(CreateCartItemController));
cartRoutes.delete("/:cartId/items", adaptExpressRoute(RemoveCartItemsController));

cartRoutes.put("/:cartId/items/:productId", adaptExpressRoute(UpdateCartItemController));
cartRoutes.delete("/:cartId/items/:productId", adaptExpressRoute(RemoveCartItemsController));

export { cartRoutes };
