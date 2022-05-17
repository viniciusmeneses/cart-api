import { Router } from "express";
import { container } from "tsyringe";

import { adaptExpressRoute } from "@main/helpers";
import { CreateCartController } from "@presentation/controllers/cart";
import { LoadCartController } from "@presentation/controllers/cart/LoadCartController";
import { RemoveCartItemsController } from "@presentation/controllers/cart/RemoveCartItemsController";

const cartRoutes = Router();

cartRoutes.post("/", adaptExpressRoute(container.resolve(CreateCartController)));
cartRoutes.get("/:id", adaptExpressRoute(container.resolve(LoadCartController)));
cartRoutes.delete("/:id/items", adaptExpressRoute(container.resolve(RemoveCartItemsController)));

export { cartRoutes };
