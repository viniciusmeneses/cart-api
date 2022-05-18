import { CartItem } from "@domain/entities/CartItem";
import faker from "@faker-js/faker";
import { CartItemsRepository, PostgresConnection } from "@infra/database/postgres";
import { makeFakeCartItem } from "@tests/domain/fakes";

const fakeCartItem = makeFakeCartItem({ cartId: faker.datatype.uuid(), productId: faker.datatype.uuid() });

PostgresConnection.prototype.getRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(fakeCartItem),
  save: jest.fn().mockReturnValue(fakeCartItem),
  findOne: jest.fn().mockResolvedValue(fakeCartItem),
  remove: jest.fn(),
});

const connectionMock = new PostgresConnection();
const cartItemsRepositoryMock = jest.mocked(connectionMock.getRepository(CartItem));

const makeSut = () => new CartItemsRepository(connectionMock);

describe("CartItemsRepository", () => {
  describe("create", () => {
    it("Should call Repository.create", async () => {
      const sut = makeSut();
      await sut.create(fakeCartItem);
      expect(cartItemsRepositoryMock.create).toHaveBeenCalledTimes(1);
    });

    it("Should call Repository.save", async () => {
      const sut = makeSut();
      await sut.create(fakeCartItem);
      expect(cartItemsRepositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it("Should call findById", async () => {
      const sut = makeSut();
      const findByIdSpy = jest.spyOn(sut, "findById");
      await sut.create(fakeCartItem);
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.save throws", async () => {
      const sut = makeSut();
      jest.spyOn(cartItemsRepositoryMock, "save").mockRejectedValueOnce(new Error());
      await expect(sut.create(fakeCartItem)).rejects.toThrow();
    });

    it("Should return a cart item on success", async () => {
      const sut = makeSut();
      const foundCartItem = await sut.create(fakeCartItem);
      expect(foundCartItem).toEqual(fakeCartItem);
    });
  });

  describe("findById", () => {
    it("Should call Repository.findOne", async () => {
      const sut = makeSut();
      await sut.findById(fakeCartItem.cartId, fakeCartItem.productId);
      expect(cartItemsRepositoryMock.findOne).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.findOne throws", async () => {
      const sut = makeSut();
      jest.spyOn(cartItemsRepositoryMock, "findOne").mockRejectedValueOnce(new Error());
      await expect(sut.findById(fakeCartItem.cartId, fakeCartItem.productId)).rejects.toThrow();
    });

    it("Should return a cart item on success", async () => {
      const sut = makeSut();
      const foundCartItem = await sut.findById(fakeCartItem.cartId, fakeCartItem.productId);
      expect(foundCartItem).toEqual(fakeCartItem);
    });

    it("Should not return a cart item if id not exists", async () => {
      const sut = makeSut();
      cartItemsRepositoryMock.findOne.mockResolvedValueOnce(null);
      const noneCartItem = await sut.findById(fakeCartItem.cartId, fakeCartItem.productId);
      expect(noneCartItem).toBeFalsy();
    });
  });

  describe("update", () => {
    it("Should call Repository.save", async () => {
      const sut = makeSut();
      await sut.update(fakeCartItem);
      expect(cartItemsRepositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it("Should call findById", async () => {
      const sut = makeSut();
      const findByIdSpy = jest.spyOn(sut, "findById");
      await sut.update(fakeCartItem);
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.save throws", async () => {
      const sut = makeSut();
      jest.spyOn(cartItemsRepositoryMock, "save").mockRejectedValueOnce(new Error());
      await expect(sut.update(fakeCartItem)).rejects.toThrow();
    });

    it("Should return updated cart item on success", async () => {
      const sut = makeSut();
      const foundCartItem = await sut.update(fakeCartItem);
      expect(foundCartItem).toEqual(fakeCartItem);
    });
  });

  describe("remove", () => {
    it("Should call Repository.remove", async () => {
      const sut = makeSut();
      await sut.remove([fakeCartItem]);
      expect(cartItemsRepositoryMock.remove).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.remove throws", async () => {
      const sut = makeSut();
      jest.spyOn(cartItemsRepositoryMock, "remove").mockRejectedValueOnce(new Error());
      await expect(sut.remove([fakeCartItem])).rejects.toThrow();
    });
  });
});
