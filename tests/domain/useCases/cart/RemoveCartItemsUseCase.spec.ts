import { propEq } from "rambda";

import { ICartItemsRepository, ICartsRepository } from "@domain/ports/repositories";
import { RemoveCartItemsUseCase } from "@domain/useCases/cart";
import { CartNotExistsError } from "@domain/useCases/errors";
import { ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { CartItemsRepository, CartsRepository, ProductsRepository } from "@infra/database/postgres";
import { makeFakeCartItem } from "@tests/domain/fakes";
import { makeFakeCart } from "@tests/domain/fakes/cart";

jest.mock("@infra/database/postgres");

type MockedICartItemsRepository = jest.Mocked<ICartItemsRepository>;
type MockedICartsRepository = jest.Mocked<ICartsRepository>;

interface ISutTypes {
  sut: RemoveCartItemsUseCase;
  cartItemsRepositoryMock: MockedICartItemsRepository;
  cartsRepositoryMock: MockedICartsRepository;
}

const fakeCartId = faker.datatype.uuid();
const fakeProductId = faker.datatype.uuid();

const fakeCart = makeFakeCart({
  id: fakeCartId,
  items: [makeFakeCartItem({ cartId: fakeCartId, productId: fakeProductId })],
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
  const sut = new RemoveCartItemsUseCase(cartItemsRepositoryMock, cartsRepositoryMock);
  return { sut, cartsRepositoryMock, cartItemsRepositoryMock };
};

describe("RemoveCartItemsUseCase", () => {
  it("Should throw ValidationErrors if any param is invalid", async () => {
    const { sut } = makeSut();
    const promise = sut.execute({ cartId: null });
    await expect(promise).rejects.toThrowError(ValidationErrors);
  });

  it("Should call CartsRepository.findById with cartId", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    await sut.execute({ cartId: fakeCartId });

    expect(cartsRepositoryMock.findById).toBeCalledTimes(1);
    expect(cartsRepositoryMock.findById).toBeCalledWith(fakeCartId);
  });

  it("Should throw CartNotExistsError if cartId does not exists", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    cartsRepositoryMock.findById.mockResolvedValue(null);
    await expect(sut.execute({ cartId: fakeCartId })).rejects.toThrowError(CartNotExistsError);
  });

  it("Should throw if CartsRepository.findById throws", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    cartsRepositoryMock.findById.mockRejectedValueOnce(new Error());
    await expect(sut.execute({ cartId: fakeCartId })).rejects.toThrow();
  });

  it("Should call CartItemsRepository.remove with cart items", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    await sut.execute({ cartId: fakeCartId });
    await sut.execute({ cartId: fakeCartId, productId: fakeProductId });

    expect(cartItemsRepositoryMock.remove).toBeCalledTimes(2);
    expect(cartItemsRepositoryMock.remove).toHaveBeenNthCalledWith(1, fakeCart.items);
    expect(cartItemsRepositoryMock.remove).toHaveBeenNthCalledWith(
      2,
      fakeCart.items.filter(propEq("productId", fakeProductId))
    );
  });

  it("Should throw if CartItemsRepository.remove throws", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    cartItemsRepositoryMock.remove.mockRejectedValueOnce(new Error());
    await expect(sut.execute({ cartId: fakeCartId })).rejects.toThrow();
  });
});
