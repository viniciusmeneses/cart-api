import { plainToClass } from "class-transformer";
import { pick } from "rambda";

import { CartItem } from "@domain/entities/CartItem";
import {
  ICartItemsRepository,
  ICartsRepository,
  ICreateCartItemInput,
  IProductsRepository,
} from "@domain/ports/repositories";
import { IUpdateCartItemQuantityUseCase } from "@domain/ports/useCases/cart";
import { UpdateCartItemQuantityUseCase } from "@domain/useCases/cart";
import { CartItemNotExistsError, ProductStockUnavailable } from "@domain/useCases/errors";
import { ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { CartItemsRepository } from "@infra/database/postgres";
import { makeFakeCartItem, makeFakeProduct } from "@tests/domain/fakes";
import { makeFakeCart } from "@tests/domain/fakes/cart";

jest.mock("@infra/database/postgres");

type MockedICartItemsRepository = jest.Mocked<ICartItemsRepository>;

interface ISutTypes {
  sut: UpdateCartItemQuantityUseCase;
  cartItemsRepositoryMock: MockedICartItemsRepository;
}

const fakeCartId = faker.datatype.uuid();
const fakeProductId = faker.datatype.uuid();

const fakeProduct = makeFakeProduct({ id: fakeProductId });
const fakeCartItem = makeFakeCartItem({ cartId: fakeCartId, productId: fakeProductId });
const fakeCart = makeFakeCart({ id: fakeCartId });

const fakeUpdateCartItemQuantityInput: IUpdateCartItemQuantityUseCase.Input = pick(
  ["cartId", "productId", "quantity"],
  fakeCartItem
);

const makeCartItemsRepositoryMock = () => {
  const cartItemsRepositoryMock = jest.mocked(new CartItemsRepository());
  cartItemsRepositoryMock.findById.mockResolvedValue(fakeCartItem);
  cartItemsRepositoryMock.update.mockResolvedValue(fakeCartItem);
  return cartItemsRepositoryMock;
};

const makeSut = (): ISutTypes => {
  const cartItemsRepositoryMock = makeCartItemsRepositoryMock();
  const sut = new UpdateCartItemQuantityUseCase(cartItemsRepositoryMock);
  return { sut, cartItemsRepositoryMock };
};

describe("UpdateCartItemQuantityUseCase", () => {
  it("Should throw ValidationErrors if any param is invalid", async () => {
    const { sut } = makeSut();
    const promise = sut.execute({ cartId: null, productId: null, quantity: null });
    await expect(promise).rejects.toThrowError(ValidationErrors);
  });

  it("Should call CartItemsRepository.findById with cartId and productId", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    await sut.execute(fakeUpdateCartItemQuantityInput);

    expect(cartItemsRepositoryMock.findById).toBeCalledTimes(1);
    expect(cartItemsRepositoryMock.findById).toBeCalledWith(
      fakeUpdateCartItemQuantityInput.cartId,
      fakeUpdateCartItemQuantityInput.productId
    );
  });

  it("Should throw if CartsRepository.findById throws", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    cartItemsRepositoryMock.findById.mockRejectedValueOnce(new Error());
    await expect(sut.execute(fakeUpdateCartItemQuantityInput)).rejects.toThrow();
  });

  it("Should throw CartItemNotExistsError if cart does not exists", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    cartItemsRepositoryMock.findById.mockResolvedValueOnce(null);
    await expect(sut.execute(fakeUpdateCartItemQuantityInput)).rejects.toThrowError(CartItemNotExistsError);
  });

  it("Should throw ProductStockUnavailable if quantity is bigger than product stock", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    cartItemsRepositoryMock.findById.mockResolvedValueOnce(
      plainToClass(CartItem, {
        ...fakeCartItem,
        product: { ...fakeCartItem.product, stock: fakeUpdateCartItemQuantityInput.quantity - 1 },
      })
    );
    await expect(sut.execute(fakeUpdateCartItemQuantityInput)).rejects.toThrowError(ProductStockUnavailable);
  });

  it("Should call CartItemsRepository.update with cart item", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    await sut.execute(fakeUpdateCartItemQuantityInput);

    expect(cartItemsRepositoryMock.update).toBeCalledTimes(1);
    expect(cartItemsRepositoryMock.update).toBeCalledWith(fakeCartItem);
  });

  it("Should throw if CartItemsRepository.update throws", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    cartItemsRepositoryMock.update.mockRejectedValueOnce(new Error());
    await expect(sut.execute(fakeUpdateCartItemQuantityInput)).rejects.toThrow();
  });

  it("Should return the cart item on success", async () => {
    const { sut } = makeSut();
    await expect(sut.execute(fakeUpdateCartItemQuantityInput)).resolves.toEqual(fakeCartItem);
  });
});
