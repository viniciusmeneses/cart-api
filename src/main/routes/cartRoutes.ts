import { Router } from "express";
import { container } from "tsyringe";

import { adaptExpressRoute } from "@main/helpers";
import { CreateCartController, LoadCartController, RemoveCartItemsController } from "@presentation/controllers/cart";

const cartRoutes = Router();

cartRoutes.post("/", adaptExpressRoute(container.resolve(CreateCartController)));
cartRoutes.get("/:cartId", adaptExpressRoute(container.resolve(LoadCartController)));

cartRoutes.delete("/:cartId/items", adaptExpressRoute(container.resolve(RemoveCartItemsController)));
cartRoutes.delete("/:cartId/items/:productId", adaptExpressRoute(container.resolve(RemoveCartItemsController)));

export { cartRoutes };
