import { CreateCartItemUseCase } from "@domain/useCases/cart";
import {
  CartItemAlreadyExistsError,
  CartNotExistsError,
  ProductNotExistsError,
  ProductStockUnavailable,
} from "@domain/useCases/errors";
import { FieldValidationError, ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { CartItemsRepository, CartsRepository, ProductsRepository } from "@infra/database/postgres";
import { CreateCartItemController } from "@presentation/controllers/cart";
import { HttpResponse } from "@presentation/helpers";
import { makeFakeCartItem } from "@tests/domain/fakes";

jest.mock("@domain/useCases/cart");
jest.mock("@infra/database/postgres");

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

  it("Should return not found if CreateCartItemUseCase.execute throws CartNotExistsError", async () => {
    const { sut, createCartItemUseCaseMock } = makeSut();
    const fakeError = new CartNotExistsError(faker.datatype.uuid());

    jest.spyOn(createCartItemUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.notFound(fakeError));
  });

  it("Should return not found if CreateCartItemUseCase.execute throws ProductNotExistsError", async () => {
    const { sut, createCartItemUseCaseMock } = makeSut();
    const fakeError = new ProductNotExistsError(faker.datatype.uuid());

    jest.spyOn(createCartItemUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.notFound(fakeError));
  });

  it("Should return bad request if CreateCartItemUseCase.execute throws ProductStockUnavailable", async () => {
    const { sut, createCartItemUseCaseMock } = makeSut();
    const fakeError = new ProductStockUnavailable(fakeCartItem.product);

    jest.spyOn(createCartItemUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.badRequest(fakeError));
  });

  it("Should return bad request if CreateCartItemUseCase.execute throws CartItemAlreadyExistsError", async () => {
    const { sut, createCartItemUseCaseMock } = makeSut();
    const fakeError = new CartItemAlreadyExistsError(fakeCartItem);

    jest.spyOn(createCartItemUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.badRequest(fakeError));
  });

  it("Should return bad request if CreateCartItemUseCase.execute throws ValidationErrors", async () => {
    const { sut, createCartItemUseCaseMock } = makeSut();
    const validationErrors = new ValidationErrors([new FieldValidationError("anyField", "anyError")]);

    jest.spyOn(createCartItemUseCaseMock, "execute").mockRejectedValueOnce(validationErrors);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.badRequest(validationErrors.errors));
  });

  it("Should throw if CreateCartItemUseCase.execute throws uncaught error", async () => {
    const { sut, createCartItemUseCaseMock } = makeSut();
    const error = new Error();
    jest.spyOn(createCartItemUseCaseMock, "execute").mockRejectedValueOnce(error);
    await expect(sut.handle(fakeRequest)).rejects.toThrowError(error);
  });

  it("Should return created cart item on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(HttpResponse.created(fakeCartItem));
  });
});
