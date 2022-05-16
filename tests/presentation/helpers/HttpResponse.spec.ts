import { FieldValidationError } from "@domain/validator";
import { HttpResponse } from "@presentation/helpers";

const makeSut = () => HttpResponse;

describe("HttpResponse", () => {
  describe("ok", () => {
    it("Should return status code 200", async () => {
      const sut = makeSut();
      const response = sut.ok(null);
      expect(response.status).toBe(200);
    });

    it("Should return data as body", async () => {
      const sut = makeSut();
      const response = sut.ok({ any: "data" });
      expect(response.body).toEqual({ any: "data" });
    });
  });

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

      const validationResponse = sut.badRequest([new FieldValidationError("field", "error")]);
      expect(validationResponse.body).toEqual({
        errors: [{ type: "FieldValidationError", field: "field", message: "error" }],
      });

      const errorResponse = sut.badRequest(new Error("error"));
      expect(errorResponse.body).toEqual({ errors: [{ type: "Error", message: "error" }] });
    });
  });

  describe("notFound", () => {
    it("Should return status code 404", async () => {
      const sut = makeSut();
      const response = sut.notFound(new Error("error"));
      expect(response.status).toBe(404);
    });

    it("Should return array of errors as body", async () => {
      const sut = makeSut();

      const validationResponse = sut.notFound([new FieldValidationError("field", "error")]);
      expect(validationResponse.body).toEqual({
        errors: [{ type: "FieldValidationError", field: "field", message: "error" }],
      });

      const errorResponse = sut.notFound(new Error("error"));
      expect(errorResponse.body).toEqual({ errors: [{ type: "Error", message: "error" }] });
    });
  });
});
