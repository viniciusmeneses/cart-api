import { Cart } from "@domain/entities/Cart";
import faker from "@faker-js/faker";
import { CartsRepository, PostgresConnection } from "@infra/database/postgres";
import { makeFakeCart, makeFakeCartItem } from "@tests/domain/fakes";

const fakeCart = makeFakeCart({ id: faker.datatype.uuid() });

PostgresConnection.prototype.getRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(fakeCart),
  save: jest.fn().mockReturnValue(fakeCart),
  findOne: jest.fn().mockReturnValue(fakeCart),
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
    it("Should call Repository.findOne", async () => {
      const sut = makeSut();
      await sut.findById(fakeCart.id);
      expect(cartsRepositoryMock.findOne).toHaveBeenCalledTimes(1);
    });

    it("Should call Repository.findOne without eager loading cart items", async () => {
      const sut = makeSut();
      await sut.findById(fakeCart.id, { withItems: false });
      expect(cartsRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(cartsRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: fakeCart.id },
        relations: { coupon: true, items: false },
      });
    });

    it("Should throw if Repository.findOne throws", async () => {
      const sut = makeSut();
      jest.spyOn(cartsRepositoryMock, "findOne").mockRejectedValueOnce(new Error());
      await expect(sut.findById(fakeCart.id)).rejects.toThrow();
    });

    it("Should return a cart on success", async () => {
      const sut = makeSut();
      const foundCart = await sut.findById(fakeCart.id);
      expect(foundCart).toEqual(fakeCart);
    });

    it("Should not return a cart if id not exists", async () => {
      const sut = makeSut();
      cartsRepositoryMock.findOne.mockResolvedValueOnce(null);
      const noneCart = await sut.findById(fakeCart.id);
      expect(noneCart).toBeFalsy();
    });
  });

  describe("update", () => {
    it("Should call Repository.save", async () => {
      const sut = makeSut();
      await sut.update(fakeCart);
      expect(cartsRepositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it("Should call findById", async () => {
      const sut = makeSut();
      const findByIdSpy = jest.spyOn(sut, "findById");
      await sut.update(fakeCart);
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.save throws", async () => {
      const sut = makeSut();
      jest.spyOn(cartsRepositoryMock, "save").mockRejectedValueOnce(new Error());
      await expect(sut.update(fakeCart)).rejects.toThrow();
    });

    it("Should return updated cart item on success", async () => {
      const sut = makeSut();
      const foundCartItem = await sut.update(fakeCart);
      expect(foundCartItem).toEqual(fakeCart);
    });
  });
});
