import { F } from "rambda";

import { LoadCartUseCase } from "@domain/useCases/cart";
import faker from "@faker-js/faker";
import { CartsRepository } from "@infra/database/postgres";
import { LoadCartController } from "@presentation/controllers/cart";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
import { makeFakeCart } from "@tests/domain/fakes";

jest.mock("@domain/useCases/cart");
jest.mock("@infra/database/postgres");

jest.spyOn(HttpErrorHandler, "handleCartError");

type MockedLoadCartUseCase = jest.Mocked<LoadCartUseCase>;

interface ISutTypes {
  sut: LoadCartController;
  loadCartUseCaseMock: MockedLoadCartUseCase;
}

const fakeCart = makeFakeCart({ id: faker.datatype.uuid() });
const fakeRequest: LoadCartController.IRequest = {
  url: { params: { cartId: fakeCart.id }, query: null },
  body: null,
};

const makeLoadCartUseCaseMock = () => {
  const loadCartUseCaseMock = new LoadCartUseCase(new CartsRepository()) as MockedLoadCartUseCase;
  loadCartUseCaseMock.execute.mockResolvedValue(fakeCart);
  return loadCartUseCaseMock;
};

const makeSut = (): ISutTypes => {
  const loadCartUseCaseMock = makeLoadCartUseCaseMock();
  const sut = new LoadCartController(loadCartUseCaseMock);
  return { sut, loadCartUseCaseMock };
};

describe("LoadCartController", () => {
  it("Should call LoadCartUseCase.execute with dto", async () => {
    const { sut, loadCartUseCaseMock } = makeSut();
    const useCaseSpy = jest.spyOn(loadCartUseCaseMock, "execute");

    await sut.handle(fakeRequest);

    expect(useCaseSpy).toHaveBeenCalledTimes(1);
    expect(useCaseSpy).toHaveBeenCalledWith({ id: fakeRequest.url.params.cartId });
  });

  it("Should call HttpErrorHandler.handleCartError if use case throws", async () => {
    const { sut, loadCartUseCaseMock } = makeSut();
    const fakeError = new Error();

    jest.spyOn(loadCartUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    await sut.handle(fakeRequest).catch(F);

    expect(HttpErrorHandler.handleCartError).toHaveBeenCalledTimes(1);
    expect(HttpErrorHandler.handleCartError).toHaveBeenCalledWith(fakeError);
  });

  it("Should return cart on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(HttpResponse.ok(fakeCart));
  });
});
