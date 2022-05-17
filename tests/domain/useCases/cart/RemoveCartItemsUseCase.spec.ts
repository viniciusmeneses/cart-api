import { ICartItemsRepository, ICartsRepository } from "@domain/ports/repositories";
import { RemoveCartItemsUseCase } from "@domain/useCases/cart";
import { CartNotExistsError } from "@domain/useCases/errors";
import { ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { CartItemsRepository, CartsRepository } from "@infra/database/postgres";
import { makeFakeCartItem } from "@tests/domain/fakes";
import { makeFakeCart } from "@tests/domain/fakes/cart";

jest.mock("@infra/database/postgres");

type MockedICartsRepository = jest.Mocked<ICartsRepository>;
type MockedICartItemsRepository = jest.Mocked<ICartItemsRepository>;

interface ISutTypes {
  sut: RemoveCartItemsUseCase;
  cartsRepositoryMock: MockedICartsRepository;
  cartItemsRepositoryMock: MockedICartItemsRepository;
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

const makeCartItemsRepositoryMock = () => jest.mocked(new CartItemsRepository());

const makeSut = (): ISutTypes => {
  const cartsRepositoryMock = makeCartsRepositoryMock();
  const cartItemsRepositoryMock = makeCartItemsRepositoryMock();
  const sut = new RemoveCartItemsUseCase(cartsRepositoryMock, cartItemsRepositoryMock);
  return { sut, cartsRepositoryMock, cartItemsRepositoryMock };
};

describe("RemoveCartItemsUseCase", () => {
  it("Should throw ValidationErrors if any param is invalid", async () => {
    const { sut } = makeSut();
    const promise = sut.execute({ cartId: null });
    await expect(promise).rejects.toThrowError(ValidationErrors);
  });

  it("Should call CartsRepository.findById with id", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    await sut.execute({ cartId: fakeCart.id });

    expect(cartsRepositoryMock.findById).toBeCalledTimes(1);
    expect(cartsRepositoryMock.findById).toBeCalledWith(fakeCart.id);
  });

  it("Should throw CartNotExistsError if cart id does not exists", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    cartsRepositoryMock.findById.mockResolvedValue(null);
    await expect(sut.execute({ cartId: fakeCart.id })).rejects.toThrowError(CartNotExistsError);
  });

  it("Should throw if CartsRepository.findById throws", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    cartsRepositoryMock.findById.mockRejectedValueOnce(new Error());
    await expect(sut.execute({ cartId: fakeCart.id })).rejects.toThrow();
  });

  it("Should call CartItemsRepository.remove with cart id", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    await sut.execute({ cartId: fakeCart.id });

    expect(cartItemsRepositoryMock.remove).toBeCalledTimes(1);
    expect(cartItemsRepositoryMock.remove).toBeCalledWith(fakeCart.items);
  });

  it("Should throw if CartItemsRepository.remove throws", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    cartItemsRepositoryMock.remove.mockRejectedValueOnce(new Error());
    await expect(sut.execute({ cartId: fakeCart.id })).rejects.toThrow();
  });
});
