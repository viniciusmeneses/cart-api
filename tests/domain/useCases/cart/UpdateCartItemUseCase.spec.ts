import { plainToClass } from "class-transformer";
import { pick } from "rambda";

import { CartItem } from "@domain/entities/CartItem";
import { ICartItemsRepository } from "@domain/ports/repositories";
import { IUpdateCartItemUseCase } from "@domain/ports/useCases/cart";
import { UpdateCartItemUseCase } from "@domain/useCases/cart";
import { CartItemNotExistsError, ProductStockUnavailable } from "@domain/useCases/errors";
import { ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { CartItemsRepository } from "@infra/database/postgres";
import { makeFakeCartItem } from "@tests/domain/fakes";

jest.mock("@infra/database/postgres");

type MockedICartItemsRepository = jest.Mocked<ICartItemsRepository>;

interface ISutTypes {
  sut: UpdateCartItemUseCase;
  cartItemsRepositoryMock: MockedICartItemsRepository;
}

const fakeCartId = faker.datatype.uuid();
const fakeProductId = faker.datatype.uuid();

const fakeCartItem = makeFakeCartItem({ cartId: fakeCartId, productId: fakeProductId });

const fakeUpdateCartItemInput: IUpdateCartItemUseCase.Input = pick(["cartId", "productId", "quantity"], fakeCartItem);

const makeCartItemsRepositoryMock = () => {
  const cartItemsRepositoryMock = jest.mocked(new CartItemsRepository());
  cartItemsRepositoryMock.findById.mockResolvedValue(fakeCartItem);
  cartItemsRepositoryMock.update.mockResolvedValue(fakeCartItem);
  return cartItemsRepositoryMock;
};

const makeSut = (): ISutTypes => {
  const cartItemsRepositoryMock = makeCartItemsRepositoryMock();
  const sut = new UpdateCartItemUseCase(cartItemsRepositoryMock);
  return { sut, cartItemsRepositoryMock };
};

describe("UpdateCartItemUseCase", () => {
  it("Should throw ValidationErrors if any param is invalid", async () => {
    const { sut } = makeSut();
    const promise = sut.execute({ cartId: null, productId: null, quantity: null });
    await expect(promise).rejects.toThrowError(ValidationErrors);
  });

  it("Should call CartItemsRepository.findById with cartId and productId", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    await sut.execute(fakeUpdateCartItemInput);

    expect(cartItemsRepositoryMock.findById).toBeCalledTimes(1);
    expect(cartItemsRepositoryMock.findById).toBeCalledWith(
      fakeUpdateCartItemInput.cartId,
      fakeUpdateCartItemInput.productId
    );
  });

  it("Should throw if CartsRepository.findById throws", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    cartItemsRepositoryMock.findById.mockRejectedValueOnce(new Error());
    await expect(sut.execute(fakeUpdateCartItemInput)).rejects.toThrow();
  });

  it("Should throw CartItemNotExistsError if cart does not exists", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    cartItemsRepositoryMock.findById.mockResolvedValueOnce(null);
    await expect(sut.execute(fakeUpdateCartItemInput)).rejects.toThrowError(CartItemNotExistsError);
  });

  it("Should throw ProductStockUnavailable if quantity is bigger than product stock", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    cartItemsRepositoryMock.findById.mockResolvedValueOnce(
      plainToClass(CartItem, {
        ...fakeCartItem,
        product: { ...fakeCartItem.product, stock: fakeUpdateCartItemInput.quantity - 1 },
      })
    );
    await expect(sut.execute(fakeUpdateCartItemInput)).rejects.toThrowError(ProductStockUnavailable);
  });

  it("Should call CartItemsRepository.update with cart item", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    await sut.execute(fakeUpdateCartItemInput);

    expect(cartItemsRepositoryMock.update).toBeCalledTimes(1);
    expect(cartItemsRepositoryMock.update).toBeCalledWith(fakeCartItem);
  });

  it("Should throw if CartItemsRepository.update throws", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    cartItemsRepositoryMock.update.mockRejectedValueOnce(new Error());
    await expect(sut.execute(fakeUpdateCartItemInput)).rejects.toThrow();
  });

  it("Should return the cart item on success", async () => {
    const { sut } = makeSut();
    await expect(sut.execute(fakeUpdateCartItemInput)).resolves.toEqual(fakeCartItem);
  });
});
