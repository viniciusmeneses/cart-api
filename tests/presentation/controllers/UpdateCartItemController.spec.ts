import { F } from "rambda";

import { UpdateCartItemUseCase } from "@domain/useCases/cart";
import faker from "@faker-js/faker";
import { CartItemsRepository } from "@infra/database/postgres";
import { UpdateCartItemController } from "@presentation/controllers/cart";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
import { makeFakeCartItem } from "@tests/domain/fakes";

jest.mock("@domain/useCases/cart");
jest.mock("@infra/database/postgres");

jest.spyOn(HttpErrorHandler, "handleCartError");

type MockedUpdateCartItemUseCase = jest.Mocked<UpdateCartItemUseCase>;

interface ISutTypes {
  sut: UpdateCartItemController;
  updateCartItemUseCaseMock: MockedUpdateCartItemUseCase;
}

const fakeCartItem = makeFakeCartItem({ cartId: faker.datatype.uuid(), productId: faker.datatype.uuid() });
const fakeRequest: UpdateCartItemController.IRequest = {
  body: { quantity: fakeCartItem.quantity },
  url: { params: { cartId: fakeCartItem.cartId, productId: fakeCartItem.productId }, query: null },
};

const makeUpdateCartItemUseCaseMock = () => {
  const updateCartItemUseCaseMock = new UpdateCartItemUseCase(new CartItemsRepository()) as MockedUpdateCartItemUseCase;
  updateCartItemUseCaseMock.execute.mockResolvedValue(fakeCartItem);
  return updateCartItemUseCaseMock;
};

const makeSut = (): ISutTypes => {
  const updateCartItemUseCaseMock = makeUpdateCartItemUseCaseMock();
  const sut = new UpdateCartItemController(updateCartItemUseCaseMock);
  return { sut, updateCartItemUseCaseMock };
};

describe("UpdateCartItemController", () => {
  it("Should call UpdateCartItemUseCase.execute with dto", async () => {
    const { sut, updateCartItemUseCaseMock } = makeSut();
    const useCaseSpy = jest.spyOn(updateCartItemUseCaseMock, "execute");

    await sut.handle(fakeRequest);

    expect(useCaseSpy).toHaveBeenCalledTimes(1);
    expect(useCaseSpy).toHaveBeenCalledWith({ ...fakeRequest.body, ...fakeRequest.url.params });
  });

  it("Should call HttpErrorHandler.handleCartError if use case throws", async () => {
    const { sut, updateCartItemUseCaseMock } = makeSut();
    const fakeError = new Error();

    jest.spyOn(updateCartItemUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    await sut.handle(fakeRequest).catch(F);

    expect(HttpErrorHandler.handleCartError).toHaveBeenCalledTimes(1);
    expect(HttpErrorHandler.handleCartError).toHaveBeenCalledWith(fakeError);
  });

  it("Should return updated cart item on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(HttpResponse.ok(fakeCartItem));
  });
});
