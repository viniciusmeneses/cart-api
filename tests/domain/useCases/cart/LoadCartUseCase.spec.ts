import { ICartsRepository } from "@domain/ports/repositories/ICartsRepository";
import { LoadCartUseCase } from "@domain/useCases/cart";
import { CartNotExistsError } from "@domain/useCases/errors/CartNotExists";
import { ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { CartsRepository } from "@infra/database/postgres";
import { makeFakeCartItem } from "@tests/domain/fakes";
import { makeFakeCart } from "@tests/domain/fakes/cart";

jest.mock("@infra/database/postgres");

type MockedICartsRepository = jest.Mocked<ICartsRepository>;

interface ISutTypes {
  sut: LoadCartUseCase;
  cartsRepositoryMock: MockedICartsRepository;
}

const fakeCartId = faker.datatype.uuid();

const fakeCart = makeFakeCart({
  id: fakeCartId,
  items: [makeFakeCartItem({ cartId: fakeCartId, productId: faker.datatype.uuid() })],
});

const makeCartsRepositoryMock = () => {
  const cartsRepositoryMock = jest.mocked(new CartsRepository());
  cartsRepositoryMock.findById.mockResolvedValue(fakeCart);
  return cartsRepositoryMock;
};

const makeSut = (): ISutTypes => {
  const cartsRepositoryMock = makeCartsRepositoryMock();
  const sut = new LoadCartUseCase(cartsRepositoryMock);
  return { sut, cartsRepositoryMock };
};

describe("LoadCartUseCase", () => {
  it("Should throw ValidationErrors if any param is invalid", async () => {
    const { sut } = makeSut();
    const promise = sut.execute({ id: null });
    await expect(promise).rejects.toThrowError(ValidationErrors);
  });

  it("Should call CartsRepository.findById with id", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    await sut.execute(fakeCart);

    expect(cartsRepositoryMock.findById).toBeCalledTimes(1);
    expect(cartsRepositoryMock.findById).toBeCalledWith(fakeCart.id);
  });

  it("Should throw CartNotExistsError if cart id does not exists", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    cartsRepositoryMock.findById.mockResolvedValue(null);
    await expect(sut.execute(fakeCart)).rejects.toThrowError(CartNotExistsError);
  });

  it("Should throw if CartsRepository.findById throws", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    cartsRepositoryMock.findById.mockRejectedValueOnce(new Error());
    await expect(sut.execute(fakeCart)).rejects.toThrow();
  });

  it("Should return a new cart on success", async () => {
    const { sut } = makeSut();
    await expect(sut.execute(fakeCart)).resolves.toEqual(fakeCart);
  });
});
