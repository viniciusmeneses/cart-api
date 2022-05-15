import { RequestHandler } from "express";

import { IController } from "@presentation/protocols";

export const adaptExpressRoute = (controller: IController): RequestHandler => {
  return async (req, res) => {
    const { body, params, query } = req;
    const response = await controller.handle({ body, url: { params, query } });
    res.status(response.status).json(response.body);
  };
};
