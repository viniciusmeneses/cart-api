import { Cart } from "@domain/entities/Cart";
import faker from "@faker-js/faker";
import { CartsRepository, PostgresConnection } from "@infra/database/postgres";
import { makeFakeCart, makeFakeCartItem } from "@tests/domain/fakes";

const fakeCart = makeFakeCart({ id: faker.datatype.uuid(), items: [] });

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

    it("Should call Repository.findOne", async () => {
      const sut = makeSut();
      await sut.create();
      expect(cartsRepositoryMock.findOne).toHaveBeenCalledTimes(1);
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
      const fakeCartWithItems = {
        ...fakeCart,
        items: [makeFakeCartItem({ cartId: fakeCart.id, productId: faker.datatype.uuid() })],
      };

      jest.spyOn(cartsRepositoryMock, "findOne").mockResolvedValueOnce(fakeCartWithItems);
      const createdCart = await sut.create({ items: fakeCartWithItems.items });

      expect(createdCart).toEqual(fakeCartWithItems);
    });
  });
});
