import { ErrorRequestHandler } from "express";

export const errorHandlerMiddleware: ErrorRequestHandler = (error, _, res, next) => {
  res.status(500).send({ error: error.stack });
  next(error);
};
