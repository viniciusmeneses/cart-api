import { F } from "rambda";

import { CreateCartUseCase } from "@domain/useCases/cart";
import faker from "@faker-js/faker";
import { CartsRepository, ProductsRepository } from "@infra/database/postgres";
import { CreateCartController } from "@presentation/controllers/cart";
import { HttpErrorHandler, HttpResponse } from "@presentation/helpers";
import { makeFakeCart } from "@tests/domain/fakes";

jest.mock("@domain/useCases/cart");
jest.mock("@infra/database/postgres");

jest.spyOn(HttpErrorHandler, "handleCartError");

type MockedCreateCartUseCase = jest.Mocked<CreateCartUseCase>;

interface ISutTypes {
  sut: CreateCartController;
  createCartUseCaseMock: MockedCreateCartUseCase;
}

const fakeCart = makeFakeCart({ id: faker.datatype.uuid() });
const fakeRequest: CreateCartController.IRequest = {
  body: { items: fakeCart.items },
  url: { params: null, query: null },
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

  it("Should call HttpErrorHandler.handleCartError if use case throws", async () => {
    const { sut, createCartUseCaseMock } = makeSut();
    const fakeError = new Error();

    jest.spyOn(createCartUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    await sut.handle(fakeRequest).catch(F);

    expect(HttpErrorHandler.handleCartError).toHaveBeenCalledTimes(1);
    expect(HttpErrorHandler.handleCartError).toHaveBeenCalledWith(fakeError);
  });

  it("Should return created cart on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(HttpResponse.created(fakeCart));
  });
});
