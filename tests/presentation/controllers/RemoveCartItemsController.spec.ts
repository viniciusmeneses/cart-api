import { mergeDeepRight } from "rambda";

import { RemoveCartItemsUseCase } from "@domain/useCases/cart";
import { CartNotExistsError, ProductNotExistsError } from "@domain/useCases/errors";
import { FieldValidationError, ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { CartItemsRepository, CartsRepository, ProductsRepository } from "@infra/database/postgres";
import { RemoveCartItemsController } from "@presentation/controllers/cart";
import { HttpResponse } from "@presentation/helpers";
import { makeFakeCart, makeFakeProduct } from "@tests/domain/fakes";

jest.mock("@domain/useCases/cart");
jest.mock("@infra/database/postgres");

type MockedRemoveCartItemsUseCase = jest.Mocked<RemoveCartItemsUseCase>;

interface ISutTypes {
  sut: RemoveCartItemsController;
  removeCartItemsUseCaseMock: MockedRemoveCartItemsUseCase;
}

const fakeCart = makeFakeCart({ id: faker.datatype.uuid() });
const fakeProduct = makeFakeProduct({ id: faker.datatype.uuid() });

const fakeRequest: RemoveCartItemsController.IRequest = {
  url: { params: { cartId: fakeCart.id, productId: fakeProduct.id }, query: null },
  body: null,
};

const makeRemoveCartItemsUseCaseMock = () =>
  new RemoveCartItemsUseCase(new CartItemsRepository(), new CartsRepository()) as MockedRemoveCartItemsUseCase;

const makeSut = (): ISutTypes => {
  const removeCartItemsUseCaseMock = makeRemoveCartItemsUseCaseMock();
  const sut = new RemoveCartItemsController(removeCartItemsUseCaseMock);
  return { sut, removeCartItemsUseCaseMock };
};

describe("RemoveCartItemsController", () => {
  it("Should call RemoveCartItemsUseCase.execute with dto", async () => {
    const { sut, removeCartItemsUseCaseMock } = makeSut();
    const useCaseSpy = jest.spyOn(removeCartItemsUseCaseMock, "execute");

    await sut.handle(fakeRequest);

    expect(useCaseSpy).toHaveBeenCalledTimes(1);
    expect(useCaseSpy).toHaveBeenCalledWith(fakeRequest.url.params);
  });

  it("Should return not found if RemoveCartItemsUseCase.execute throws CartNotExistsError", async () => {
    const { sut, removeCartItemsUseCaseMock } = makeSut();
    const fakeError = new CartNotExistsError(fakeCart.id);

    jest.spyOn(removeCartItemsUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.notFound(fakeError));
  });

  it("Should return bad request if RemoveCartItemsUseCase.execute throws ValidationErrors", async () => {
    const { sut, removeCartItemsUseCaseMock } = makeSut();
    const validationErrors = new ValidationErrors([new FieldValidationError("anyField", "anyError")]);

    jest.spyOn(removeCartItemsUseCaseMock, "execute").mockRejectedValueOnce(validationErrors);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.badRequest(validationErrors.errors));
  });

  it("Should throw if RemoveCartItemsUseCase.execute throws uncaught error", async () => {
    const { sut, removeCartItemsUseCaseMock } = makeSut();
    const error = new Error();
    jest.spyOn(removeCartItemsUseCaseMock, "execute").mockRejectedValueOnce(error);
    await expect(sut.handle(fakeRequest)).rejects.toThrowError(error);
  });
});
