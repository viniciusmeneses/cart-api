import { Cart } from "@domain/entities/Cart";
import faker from "@faker-js/faker";
import { CartsRepository, PostgresConnection } from "@infra/database/postgres";
import { makeFakeCart, makeFakeCartItem } from "@tests/domain/fakes";

const fakeCart = makeFakeCart({ id: faker.datatype.uuid() });

PostgresConnection.prototype.getRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(fakeCart),
  save: jest.fn().mockReturnValue(fakeCart),
  findOneBy: jest.fn().mockReturnValue(fakeCart),
});

const connectionMock = new PostgresConnection();
const cartsRepositoryMock = jest.mocked(connectionMock.getRepository(Cart));

const makeSut = () => new CartsRepository(connectionMock);

describe("CartsRepository", () => {
  describe("create", () => {
    it("Should call Repository.create", async () => {
      const sut = makeSut();
      await sut.create();
      expect(cartsRepositoryMock.create).toHaveBeenCalledTimes(1);
    });

    it("Should call Repository.save", async () => {
      const sut = makeSut();
      await sut.create();
      expect(cartsRepositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it("Should call findById", async () => {
      const sut = makeSut();
      const findByIdSpy = jest.spyOn(sut, "findById");
      await sut.create();
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.save throws", async () => {
      const sut = makeSut();
      jest.spyOn(cartsRepositoryMock, "save").mockRejectedValueOnce(new Error());
      await expect(sut.create()).rejects.toThrow();
    });

    it("Should return a new cart on success", async () => {
      const sut = makeSut();
      const createdCart = await sut.create();
      expect(createdCart).toEqual(fakeCart);
    });

    it("Should return a new cart with items on success", async () => {
      const sut = makeSut();
      const fakeCartWithItems = makeFakeCart({
        id: fakeCart.id,
        items: [makeFakeCartItem({ cartId: fakeCart.id, productId: faker.datatype.uuid() })],
      });

      jest.spyOn(sut, "findById").mockResolvedValueOnce(fakeCartWithItems);
      const createdCart = await sut.create({ items: fakeCartWithItems.items });

      expect(createdCart).toEqual(fakeCartWithItems);
    });
  });

  describe("findById", () => {
    it("Should call Repository.findOneBy", async () => {
      const sut = makeSut();
      await sut.findById(fakeCart.id);
      expect(cartsRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.findOneBy throws", async () => {
      const sut = makeSut();
      jest.spyOn(cartsRepositoryMock, "findOneBy").mockRejectedValueOnce(new Error());
      await expect(sut.findById(fakeCart.id)).rejects.toThrow();
    });

    it("Should return a cart on success", async () => {
      const sut = makeSut();
      const foundCart = await sut.findById(fakeCart.id);
      expect(foundCart).toEqual(fakeCart);
    });

    it("Should not return a cart if id not exists", async () => {
      const sut = makeSut();
      cartsRepositoryMock.findOneBy.mockResolvedValueOnce(null);
      const noneCart = await sut.findById(fakeCart.id);
      expect(noneCart).toBeFalsy();
    });
  });
});
