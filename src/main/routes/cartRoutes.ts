import { Router } from "express";
import { container } from "tsyringe";

import { adaptExpressRoute } from "@main/helpers";
import {
  CreateCartController,
  CreateCartItemController,
  LoadCartController,
  RemoveCartItemsController,
  UpdateCartItemController,
} from "@presentation/controllers/cart";

const cartRoutes = Router();

cartRoutes.post("/", adaptExpressRoute(container.resolve(CreateCartController)));
cartRoutes.get("/:cartId", adaptExpressRoute(container.resolve(LoadCartController)));

cartRoutes.post("/:cartId/items", adaptExpressRoute(container.resolve(CreateCartItemController)));
cartRoutes.delete("/:cartId/items", adaptExpressRoute(container.resolve(RemoveCartItemsController)));

cartRoutes.put("/:cartId/items/:productId", adaptExpressRoute(container.resolve(UpdateCartItemController)));
cartRoutes.delete("/:cartId/items/:productId", adaptExpressRoute(container.resolve(RemoveCartItemsController)));

export { cartRoutes };
