import { prop } from "rambda";

import { ICartsRepository, ICreateCartInput, IProductsRepository } from "@domain/ports/repositories";
import { CreateCartUseCase } from "@domain/useCases/cart";
import { ProductNotExistsError, ProductStockUnavailableError } from "@domain/useCases/errors";
import { ValidationErrors } from "@domain/validator";
import faker from "@faker-js/faker";
import { CartsRepository, ProductsRepository } from "@infra/database/postgres";
import { makeFakeCartItem, makeFakeProduct } from "@tests/domain/fakes";
import { makeFakeCart } from "@tests/domain/fakes/cart";

jest.mock("@infra/database/postgres");

type MockedICartsRepository = jest.Mocked<ICartsRepository>;
type MockedIProductsRepository = jest.Mocked<IProductsRepository>;

interface ISutTypes {
  sut: CreateCartUseCase;
  cartsRepositoryMock: MockedICartsRepository;
  productsRepositoryMock: MockedIProductsRepository;
}

const fakeCartId = faker.datatype.uuid();
const fakeProductId = faker.datatype.uuid();

const fakeCart = makeFakeCart({
  id: fakeCartId,
  items: [makeFakeCartItem({ cartId: fakeCartId, productId: fakeProductId })],
});
const fakeProduct = makeFakeProduct({ id: fakeProductId });

const fakeCreateCartInput: ICreateCartInput = { items: fakeCart.items };

const makeCartsRepositoryMock = () => {
  const cartsRepositoryMock = jest.mocked(new CartsRepository());
  cartsRepositoryMock.create.mockResolvedValue(fakeCart);
  return cartsRepositoryMock;
};

const makeProductsRepositoryMock = () => {
  const productsRepositoryMock = jest.mocked(new ProductsRepository());
  productsRepositoryMock.findByIds.mockResolvedValue([fakeProduct]);
  return productsRepositoryMock;
};

const makeSut = (): ISutTypes => {
  const cartsRepositoryMock = makeCartsRepositoryMock();
  const productsRepositoryMock = makeProductsRepositoryMock();
  const sut = new CreateCartUseCase(cartsRepositoryMock, productsRepositoryMock);
  return { sut, cartsRepositoryMock, productsRepositoryMock };
};

describe("CreateCartUseCase", () => {
  it("Should throw ValidationErrors if any param is invalid", async () => {
    const { sut } = makeSut();
    const promise = sut.execute({ items: [{ productId: null, quantity: null }] });
    await expect(promise).rejects.toThrowError(ValidationErrors);
  });

  it("Should call ProductsRepository.findByIds if any item was supplied", async () => {
    const { sut, productsRepositoryMock } = makeSut();
    await sut.execute(fakeCreateCartInput);

    expect(productsRepositoryMock.findByIds).toBeCalledTimes(1);
    expect(productsRepositoryMock.findByIds).toBeCalledWith(fakeCreateCartInput.items.map(prop("productId")));
  });

  it("Should throw if ProductsRepository.findByIds throws", async () => {
    const { sut, productsRepositoryMock } = makeSut();
    productsRepositoryMock.findByIds.mockRejectedValueOnce(new Error());
    await expect(sut.execute(fakeCreateCartInput)).rejects.toThrow();
  });

  it("Should throw ProductNotExistsError if any product id not exists", async () => {
    const { sut, productsRepositoryMock } = makeSut();
    productsRepositoryMock.findByIds.mockResolvedValueOnce([]);
    await expect(sut.execute(fakeCreateCartInput)).rejects.toThrowError(ProductNotExistsError);
  });

  it("Should throw ProductStockUnavailableError if any product has no stock available", async () => {
    const { sut, productsRepositoryMock } = makeSut();
    productsRepositoryMock.findByIds.mockResolvedValue([{ ...fakeProduct, stock: 0 }]);
    await expect(sut.execute(fakeCreateCartInput)).rejects.toThrowError(ProductStockUnavailableError);
  });

  it("Should call CartsRepository.create with dto", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    await sut.execute(fakeCreateCartInput);

    expect(cartsRepositoryMock.create).toBeCalledTimes(1);
    expect(cartsRepositoryMock.create).toBeCalledWith(fakeCreateCartInput);
  });

  it("Should throw if CartsRepository.create throws", async () => {
    const { sut, cartsRepositoryMock } = makeSut();
    cartsRepositoryMock.create.mockRejectedValueOnce(new Error());
    await expect(sut.execute()).rejects.toThrow();
  });

  it("Should return a new cart on success", async () => {
    const { sut } = makeSut();
    await expect(sut.execute()).resolves.toEqual(fakeCart);
  });
});
