import { F } from "rambda";

import { CreateCartItemUseCase } from "@domain/useCases/cart";
import faker from "@faker-js/faker";
import { CartItemsRepository, CartsRepository, ProductsRepository } from "@infra/database/postgres";
import { CreateCartItemController } from "@presentation/controllers/cart";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
import { makeFakeCartItem } from "@tests/domain/fakes";

jest.mock("@domain/useCases/cart");
jest.mock("@infra/database/postgres");

jest.spyOn(HttpErrorHandler, "handleCartError");

type MockedCreateCartItemUseCase = jest.Mocked<CreateCartItemUseCase>;

interface ISutTypes {
  sut: CreateCartItemController;
  createCartItemUseCaseMock: MockedCreateCartItemUseCase;
}

const fakeCartItem = makeFakeCartItem({ cartId: faker.datatype.uuid(), productId: faker.datatype.uuid() });
const fakeRequest: CreateCartItemController.IRequest = {
  body: { productId: fakeCartItem.productId, quantity: fakeCartItem.quantity },
  url: { params: { cartId: fakeCartItem.cartId }, query: null },
};

const makeCreateCartItemUseCaseMock = () => {
  const createCartItemUseCaseMock = new CreateCartItemUseCase(
    new CartItemsRepository(),
    new CartsRepository(),
    new ProductsRepository()
  ) as MockedCreateCartItemUseCase;
  createCartItemUseCaseMock.execute.mockResolvedValue(fakeCartItem);
  return createCartItemUseCaseMock;
};

const makeSut = (): ISutTypes => {
  const createCartItemUseCaseMock = makeCreateCartItemUseCaseMock();
  const sut = new CreateCartItemController(createCartItemUseCaseMock);
  return { sut, createCartItemUseCaseMock };
};

describe("CreateCartItemController", () => {
  it("Should call CreateCartItemUseCase.execute with dto", async () => {
    const { sut, createCartItemUseCaseMock } = makeSut();
    const useCaseSpy = jest.spyOn(createCartItemUseCaseMock, "execute");

    await sut.handle(fakeRequest);

    expect(useCaseSpy).toHaveBeenCalledTimes(1);
    expect(useCaseSpy).toHaveBeenCalledWith({ ...fakeRequest.body, ...fakeRequest.url.params });
  });

  it("Should call HttpErrorHandler.handleCartError if use case throws", async () => {
    const { sut, createCartItemUseCaseMock } = makeSut();
    const fakeError = new Error();

    jest.spyOn(createCartItemUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    await sut.handle(fakeRequest).catch(F);

    expect(HttpErrorHandler.handleCartError).toHaveBeenCalledTimes(1);
    expect(HttpErrorHandler.handleCartError).toHaveBeenCalledWith(fakeError);
  });

  it("Should return created cart item on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(HttpResponse.created(fakeCartItem));
  });
});
