import "express-async-errors";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUI from "swagger-ui-express";

import swaggerDocument from "../../swagger.json";

import { errorHandlerMiddleware } from "./middlewares";
import { routes } from "./routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api", routes);

app.use(errorHandlerMiddleware);

export { app };
