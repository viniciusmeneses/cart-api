import { pick } from "rambda";

import {
  ICartItemsRepository,
  ICartsRepository,
  ICreateCartItemInput,
  IProductsRepository,
} from "@domain/ports/repositories";
import { CreateCartItemUseCase } from "@domain/useCases/cart";
import {
  CartItemAlreadyExistsError,
  CartNotExistsError,
  ProductNotExistsError,
  ProductStockUnavailable,
} from "@domain/useCases/errors";
import { ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { CartItemsRepository, CartsRepository, ProductsRepository } from "@infra/database/postgres";
import { makeFakeCartItem, makeFakeProduct } from "@tests/domain/fakes";
import { makeFakeCart } from "@tests/domain/fakes/cart";

jest.mock("@infra/database/postgres");

type MockedICartItemsRepository = jest.Mocked<ICartItemsRepository>;
type MockedICartsRepository = jest.Mocked<ICartsRepository>;
type MockedIProductsRepository = jest.Mocked<IProductsRepository>;

interface ISutTypes {
  sut: CreateCartItemUseCase;
  cartItemsRepositoryMock: MockedICartItemsRepository;
  cartsRepositoryMock: MockedICartsRepository;
  productsRepositoryMock: MockedIProductsRepository;
}

const fakeCartId = faker.datatype.uuid();
const fakeProductId = faker.datatype.uuid();

const fakeProduct = makeFakeProduct({ id: fakeProductId });
const fakeCartItem = makeFakeCartItem({ cartId: fakeCartId, productId: fakeProductId });
const fakeCart = makeFakeCart({ id: fakeCartId });

const fakeCreateCartItemInput: ICreateCartItemInput = pick(["cartId", "productId", "quantity"], fakeCartItem);

const makeCartItemsRepositoryMock = () => {
  const cartItemsRepositoryMock = jest.mocked(new CartItemsRepository());
  cartItemsRepositoryMock.create.mockResolvedValue(fakeCartItem);
  return cartItemsRepositoryMock;
};

const makeCartsRepositoryMock = () => {
  const cartsRepositoryMock = jest.mocked(new CartsRepository());
  cartsRepositoryMock.findById.mockResolvedValue(fakeCart);
  return cartsRepositoryMock;
};

const makeProductsRepositoryMock = () => {
  const productsRepositoryMock = jest.mocked(new ProductsRepository());
  productsRepositoryMock.findById.mockResolvedValue(fakeProduct);
  return productsRepositoryMock;
};

const makeSut = (): ISutTypes => {
  const cartItemsRepositoryMock = makeCartItemsRepositoryMock();
  const cartsRepositoryMock = makeCartsRepositoryMock();
  const productsRepositoryMock = makeProductsRepositoryMock();

  const sut = new CreateCartItemUseCase(cartItemsRepositoryMock, cartsRepositoryMock, productsRepositoryMock);
  return { sut, cartsRepositoryMock, productsRepositoryMock, cartItemsRepositoryMock };
};

describe("CreateCartItemUseCase", () => {
  it("Should throw ValidationErrors if any param is invalid", async () => {
    const { sut } = makeSut();
    const promise = sut.execute({ cartId: null, productId: null, quantity: null });
    await expect(promise).rejects.toThrowError(ValidationErrors);
  });

  it("Should call CartsRepository.findById with cartId", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    await sut.execute(fakeCreateCartItemInput);

    expect(cartsRepositoryMock.findById).toBeCalledTimes(1);
    expect(cartsRepositoryMock.findById).toBeCalledWith(fakeCreateCartItemInput.cartId);
  });

  it("Should throw if CartsRepository.findById throws", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    cartsRepositoryMock.findById.mockRejectedValueOnce(new Error());
    await expect(sut.execute(fakeCreateCartItemInput)).rejects.toThrow();
  });

  it("Should throw CartNotExistsError if cart does not exists", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    cartsRepositoryMock.findById.mockResolvedValueOnce(null);
    await expect(sut.execute(fakeCreateCartItemInput)).rejects.toThrowError(CartNotExistsError);
  });

  it("Should throw CartItemAlreadyExistsError if product already was added to cart", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    cartsRepositoryMock.findById.mockResolvedValueOnce(makeFakeCart({ id: fakeCart.id, items: [fakeCartItem] }));
    await expect(sut.execute(fakeCreateCartItemInput)).rejects.toThrowError(CartItemAlreadyExistsError);
  });

  it("Should call ProductsRepository.findById with productId", async () => {
    const { sut, productsRepositoryMock } = makeSut();
    await sut.execute(fakeCreateCartItemInput);

    expect(productsRepositoryMock.findById).toBeCalledTimes(1);
    expect(productsRepositoryMock.findById).toBeCalledWith(fakeCreateCartItemInput.productId);
  });

  it("Should throw if ProductsRepository.findById throws", async () => {
    const { sut, productsRepositoryMock } = makeSut();
    productsRepositoryMock.findById.mockRejectedValueOnce(new Error());
    await expect(sut.execute(fakeCreateCartItemInput)).rejects.toThrow();
  });

  it("Should throw ProductNotExistsError if cart does not exists", async () => {
    const { sut, productsRepositoryMock } = makeSut();
    productsRepositoryMock.findById.mockResolvedValueOnce(null);
    await expect(sut.execute(fakeCreateCartItemInput)).rejects.toThrowError(ProductNotExistsError);
  });

  it("Should throw ProductStockUnavailable if quantity is bigger than product stock", async () => {
    const { sut, productsRepositoryMock } = makeSut();
    productsRepositoryMock.findById.mockResolvedValue({ ...fakeProduct, stock: fakeCreateCartItemInput.quantity - 1 });
    await expect(sut.execute(fakeCreateCartItemInput)).rejects.toThrowError(ProductStockUnavailable);
  });

  it("Should call CartItemsRepository.create with dto", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    await sut.execute(fakeCreateCartItemInput);

    expect(cartItemsRepositoryMock.create).toBeCalledTimes(1);
    expect(cartItemsRepositoryMock.create).toBeCalledWith(fakeCreateCartItemInput);
  });

  it("Should throw if CartItemsRepository.create throws", async () => {
    const { sut, cartItemsRepositoryMock } = makeSut();
    cartItemsRepositoryMock.create.mockRejectedValueOnce(new Error());
    await expect(sut.execute(fakeCreateCartItemInput)).rejects.toThrow();
  });

  it("Should return a new cart item on success", async () => {
    const { sut } = makeSut();
    await expect(sut.execute(fakeCreateCartItemInput)).resolves.toEqual(fakeCartItem);
  });
});
