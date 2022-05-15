import { FieldValidationError } from "@domain/validator";
import { HttpResponse } from "@presentation/helpers";

const makeSut = () => HttpResponse;

describe("HttpResponse", () => {
  describe("created", () => {
    it("Should return status code 201", async () => {
      const sut = makeSut();
      const response = sut.created(null);
      expect(response.status).toBe(201);
    });

    it("Should return data as body", async () => {
      const sut = makeSut();
      const response = sut.created({ any: "data" });
      expect(response.body).toEqual({ any: "data" });
    });
  });

  describe("badRequest", () => {
    it("Should return status code 400", async () => {
      const sut = makeSut();
      const response = sut.badRequest(new Error("error"));
      expect(response.status).toBe(400);
    });

    it("Should return array of errors as body", async () => {
      const sut = makeSut();
      const response = sut.badRequest([new FieldValidationError("field", "error")]);
      expect(response.body).toEqual({ errors: [{ type: "FieldValidationError", field: "field", message: "error" }] });
    });

    it("Should return array of errors as body if input is a single error", async () => {
      const sut = makeSut();
      const response = sut.badRequest(new Error("error"));
      expect(response.body).toEqual({ errors: [{ type: "Error", message: "error" }] });
    });
  });
});
