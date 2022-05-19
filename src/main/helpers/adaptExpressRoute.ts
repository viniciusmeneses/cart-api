import { RequestHandler } from "express";
import { container } from "tsyringe";

import { IController } from "@presentation/protocols";

export const adaptExpressRoute = <T extends IController>(Controller: new (...args: any[]) => T): RequestHandler => {
  return async (req, res) => {
    const { body, params, query } = req;
    const response = await container.resolve<T>(Controller).handle({ body, url: { params, query } });
    res.status(response.status).json(response.body);
  };
};
