import request from "supertest";

import { app } from "@main/app";
import { errorHandlerMiddleware } from "@main/middlewares";

const fakeError = new Error("message");

describe("Error Handler Middleware", () => {
  beforeAll(() => {
    app.get("/tests/error-handler", () => {
      throw fakeError;
    });

    app.use(errorHandlerMiddleware);
  });

  it("Should return status code 500 and stacktrace on uncaught error", async () => {
    const response = await request(app).get("/tests/error-handler");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: fakeError.stack });
  });
});
