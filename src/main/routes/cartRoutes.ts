import { Router } from "express";
import { container } from "tsyringe";

import { adaptExpressRoute } from "@main/helpers";
import { CreateCartController } from "@presentation/controllers/cart";

const cartRoutes = Router();

cartRoutes.post("/", adaptExpressRoute(container.resolve(CreateCartController)));

export { cartRoutes };
