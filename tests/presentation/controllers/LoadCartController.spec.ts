import { LoadCartUseCase } from "@domain/useCases/cart";
import { CartNotExistsError } from "@domain/useCases/errors";
import { FieldValidationError, ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { CartsRepository } from "@infra/database/postgres";
import { LoadCartController } from "@presentation/controllers/cart";
import { HttpResponse } from "@presentation/helpers";
import { makeFakeCart } from "@tests/domain/fakes";

jest.mock("@domain/useCases/cart");
jest.mock("@infra/database/postgres");

type MockedLoadCartUseCase = jest.Mocked<LoadCartUseCase>;

interface ISutTypes {
  sut: LoadCartController;
  loadCartUseCaseMock: MockedLoadCartUseCase;
}

const fakeCart = makeFakeCart({ id: faker.datatype.uuid(), items: [] });
const fakeRequest: LoadCartController.IRequest = {
  url: { params: { id: fakeCart.id }, query: null },
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
    expect(useCaseSpy).toHaveBeenCalledWith(fakeRequest.url.params);
  });

  it("Should return not found if LoadCartUseCase.execute throws CartNotExistsError", async () => {
    const { sut, loadCartUseCaseMock } = makeSut();
    const fakeError = new CartNotExistsError(fakeCart.id);

    jest.spyOn(loadCartUseCaseMock, "execute").mockRejectedValueOnce(fakeError);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.notFound(fakeError));
  });

  it("Should return bad request if LoadCartUseCase.execute throws ValidationErrors", async () => {
    const { sut, loadCartUseCaseMock } = makeSut();
    const validationErrors = new ValidationErrors([new FieldValidationError("anyField", "anyError")]);

    jest.spyOn(loadCartUseCaseMock, "execute").mockRejectedValueOnce(validationErrors);
    const response = await sut.handle(fakeRequest);

    expect(response).toEqual(HttpResponse.badRequest(validationErrors.errors));
  });

  it("Should throw if LoadCartUseCase.execute throws uncaught error", async () => {
    const { sut, loadCartUseCaseMock } = makeSut();
    const error = new Error();
    jest.spyOn(loadCartUseCaseMock, "execute").mockRejectedValueOnce(error);
    await expect(sut.handle(fakeRequest)).rejects.toThrowError(error);
  });

  it("Should return cart on success", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(HttpResponse.ok(fakeCart));
  });
});
