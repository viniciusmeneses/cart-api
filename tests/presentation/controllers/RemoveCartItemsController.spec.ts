import { F } from "rambda";

import { RemoveCartItemsUseCase } from "@domain/useCases/cart";
import faker from "@faker-js/faker";
import { CartItemsRepository, CartsRepository, ProductsRepository } from "@infra/database/postgres";
import { RemoveCartItemsController } from "@presentation/controllers/cart";
import { HttpErrorHandler } from "@presentation/helpers";
import { makeFakeCart, makeFakeProduct } from "@tests/domain/fakes";

jest.mock("@domain/useCases/cart");
jest.mock("@infra/database/postgres");

jest.spyOn(HttpErrorHandler, "handleCartError");

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

  it("Should call HttpErrorHandler.handleCartError if use case throws", async () => {
    const { sut, removeCartItemsUseCaseMock } = makeSut();
    const fakeError = new Error();

    jest.spyOn(removeCartItemsUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    await sut.handle(fakeRequest).catch(F);

    expect(HttpErrorHandler.handleCartError).toHaveBeenCalledTimes(1);
    expect(HttpErrorHandler.handleCartError).toHaveBeenCalledWith(fakeError);
  });
});
