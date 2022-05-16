import { CreateCartUseCase } from "@domain/useCases/cart";
import { ProductNotExistsError, ProductStockUnavailable } from "@domain/useCases/errors";
import { FieldValidationError, ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { CartsRepository, ProductsRepository } from "@infra/database/postgres";
import { CreateCartController } from "@presentation/controllers/cart";
import { HttpResponse } from "@presentation/helpers";
import { makeFakeCart, makeFakeProduct } from "@tests/domain/fakes";

jest.mock("@domain/useCases/cart");
jest.mock("@infra/database/postgres");

type MockedCreateCartUseCase = jest.Mocked<CreateCartUseCase>;

interface ISutTypes {
  sut: CreateCartController;
  createCartUseCaseMock: MockedCreateCartUseCase;
}

const fakeCart = makeFakeCart({ id: faker.datatype.uuid(), items: [] });
const fakeRequest: CreateCartController.IRequest = {
  body: { items: fakeCart.items },
};

const makeCreateCartUseCaseMock = () => {
  const createCartUseCaseMock = new CreateCartUseCase(
    new CartsRepository(),
    new ProductsRepository()
  ) as MockedCreateCartUseCase;
  createCartUseCaseMock.execute.mockResolvedValue(fakeCart);
  return createCartUseCaseMock;
};

const makeSut = (): ISutTypes => {
  const createCartUseCaseMock = makeCreateCartUseCaseMock();
  const sut = new CreateCartController(createCartUseCaseMock);
  return { sut, createCartUseCaseMock };
};

describe("CreateCartController", () => {
  it("Should call CreateCartUseCase.execute with dto", async () => {
    const { sut, createCartUseCaseMock } = makeSut();
    const useCaseSpy = jest.spyOn(createCartUseCaseMock, "execute");

    await sut.handle(fakeRequest);

    expect(useCaseSpy).toHaveBeenCalledTimes(1);
    expect(useCaseSpy).toHaveBeenCalledWith(fakeRequest.body);
  });

  it("Should return not found if CreateCartUseCase.execute throws ProductNotExistsError", async () => {
    const { sut, createCartUseCaseMock } = makeSut();
    const fakeError = new ProductNotExistsError(fakeCart.id);

    jest.spyOn(createCartUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.notFound(fakeError));
  });

  it("Should return bad request if CreateCartUseCase.execute throws ProductStockUnavailable", async () => {
    const { sut, createCartUseCaseMock } = makeSut();
    const fakeError = new ProductStockUnavailable(makeFakeProduct({ id: faker.datatype.uuid() }));

    jest.spyOn(createCartUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.badRequest(fakeError));
  });

  it("Should return bad request if CreateCartUseCase.execute throws ValidationErrors", async () => {
    const { sut, createCartUseCaseMock } = makeSut();
    const validationErrors = new ValidationErrors([new FieldValidationError("anyField", "anyError")]);

    jest.spyOn(createCartUseCaseMock, "execute").mockRejectedValueOnce(validationErrors);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.badRequest(validationErrors.errors));
  });

  it("Should throw if CreateCartUseCase.execute throws uncaught error", async () => {
    const { sut, createCartUseCaseMock } = makeSut();
    const error = new Error();
    jest.spyOn(createCartUseCaseMock, "execute").mockRejectedValueOnce(error);
    await expect(sut.handle(fakeRequest)).rejects.toThrowError(error);
  });

  it("Should return created cart on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(HttpResponse.created(fakeCart));
  });
});
