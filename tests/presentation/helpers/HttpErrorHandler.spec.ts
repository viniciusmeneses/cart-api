import {
  CartItemAlreadyExistsError,
  CartItemNotExistsError,
  CartNotExistsError,
  CouponCodeInvalidError,
  ProductNotExistsError,
  ProductStockUnavailableError,
} from "@domain/useCases/errors";
import { FieldValidationError, ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
import { makeFakeCartItem, makeFakeProduct } from "@tests/domain/fakes";

const makeSut = () => HttpErrorHandler;

describe("HttpErrorHandler", () => {
  describe("handleCartError", () => {
    it("Should return not found if error is ProductNotExistsError", () => {
      const sut = makeSut();
      const fakeError = new ProductNotExistsError(faker.datatype.uuid());
      const response = sut.handleCartError(fakeError);
      expect(response).toEqual(HttpResponse.notFound(fakeError));
    });

    it("Should return bad request if error is ProductStockUnavailableError", () => {
      const sut = makeSut();
      const fakeError = new ProductStockUnavailableError(makeFakeProduct({ id: faker.datatype.uuid() }));
      const response = sut.handleCartError(fakeError);
      expect(response).toEqual(HttpResponse.badRequest(fakeError));
    });

    it("Should return bad request if error is CartItemAlreadyExistsError", () => {
      const sut = makeSut();
      const fakeError = new CartItemAlreadyExistsError(
        makeFakeCartItem({ cartId: faker.datatype.uuid(), productId: faker.datatype.uuid() })
      );
      const response = sut.handleCartError(fakeError);
      expect(response).toEqual(HttpResponse.badRequest(fakeError));
    });

    it("Should return not found if error is CartNotExistsError", () => {
      const sut = makeSut();
      const fakeError = new CartNotExistsError(faker.datatype.uuid());
      const response = sut.handleCartError(fakeError);
      expect(response).toEqual(HttpResponse.notFound(fakeError));
    });

    it("Should return not found if error is CartItemNotExistsError", () => {
      const sut = makeSut();
      const fakeError = new CartItemNotExistsError(faker.datatype.uuid(), faker.datatype.uuid());
      const response = sut.handleCartError(fakeError);
      expect(response).toEqual(HttpResponse.notFound(fakeError));
    });

    it("Should return bad request if error is CouponCodeInvalidError", () => {
      const sut = makeSut();
      const fakeError = new CouponCodeInvalidError(faker.random.alphaNumeric());
      const response = sut.handleCartError(fakeError);
      expect(response).toEqual(HttpResponse.badRequest(fakeError));
    });

    it("Should return bad request if error is ValidationErrors", () => {
      const sut = makeSut();
      const fakeError = new ValidationErrors([new FieldValidationError("anyField", "anyError")]);
      const response = sut.handleCartError(fakeError);
      expect(response).toEqual(HttpResponse.badRequest(fakeError.errors));
    });

    it("Should throw if error is uncaught error", async () => {
      class UncaughtError extends Error {}
      const sut = makeSut();
      expect(() => sut.handleCartError(new UncaughtError())).toThrowError(UncaughtError);
    });
  });
});
