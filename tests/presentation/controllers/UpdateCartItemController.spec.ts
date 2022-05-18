import { UpdateCartItemUseCase } from "@domain/useCases/cart";
import { CartItemNotExistsError, ProductStockUnavailable } from "@domain/useCases/errors";
import { FieldValidationError, ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { CartItemsRepository } from "@infra/database/postgres";
import { UpdateCartItemController } from "@presentation/controllers/cart";
import { HttpResponse } from "@presentation/helpers";
import { makeFakeCartItem } from "@tests/domain/fakes";

jest.mock("@domain/useCases/cart");
jest.mock("@infra/database/postgres");

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

  it("Should return not found if UpdateCartItemUseCase.execute throws CartItemNotExistsError", async () => {
    const { sut, updateCartItemUseCaseMock } = makeSut();
    const fakeError = new CartItemNotExistsError(fakeCartItem.cartId, fakeCartItem.productId);

    jest.spyOn(updateCartItemUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.notFound(fakeError));
  });

  it("Should return bad request if UpdateCartItemUseCase.execute throws ProductStockUnavailable", async () => {
    const { sut, updateCartItemUseCaseMock } = makeSut();
    const fakeError = new ProductStockUnavailable(fakeCartItem.product);

    jest.spyOn(updateCartItemUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.badRequest(fakeError));
  });

  it("Should return bad request if UpdateCartItemUseCase.execute throws ValidationErrors", async () => {
    const { sut, updateCartItemUseCaseMock } = makeSut();
    const validationErrors = new ValidationErrors([new FieldValidationError("anyField", "anyError")]);

    jest.spyOn(updateCartItemUseCaseMock, "execute").mockRejectedValueOnce(validationErrors);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.badRequest(validationErrors.errors));
  });

  it("Should throw if UpdateCartItemUseCase.execute throws uncaught error", async () => {
    const { sut, updateCartItemUseCaseMock } = makeSut();
    const error = new Error();
    jest.spyOn(updateCartItemUseCaseMock, "execute").mockRejectedValueOnce(error);
    await expect(sut.handle(fakeRequest)).rejects.toThrowError(error);
  });

  it("Should return updated cart item on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(HttpResponse.ok(fakeCartItem));
  });
});
