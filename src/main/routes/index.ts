import { Router } from "express";

import { cartRoutes } from "./cartRoutes";

const routes = Router();

routes.use("/carts", cartRoutes);

export { routes };
