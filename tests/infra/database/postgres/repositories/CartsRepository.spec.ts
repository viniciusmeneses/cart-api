import { Cart } from "@domain/entities/Cart";
import { CartsRepository, PostgresConnection } from "@infra/database/postgres";
import { makeFakeCart } from "@tests/domain/fakes";

PostgresConnection.prototype.getRepository = jest.fn().mockReturnValue({ create: jest.fn(), save: jest.fn() });

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

    it("Should throw if Repository.save throws", async () => {
      const sut = makeSut();
      jest.spyOn(cartsRepositoryMock, "save").mockRejectedValueOnce(new Error());
      await expect(sut.create()).rejects.toThrow();
    });

    it("Should return a new cart on success", async () => {
      const sut = makeSut();
      const fakeCart = { ...makeFakeCart(), items: [] };

      jest.spyOn(cartsRepositoryMock, "save").mockResolvedValueOnce(fakeCart);
      const createdCart = await sut.create();

      expect(createdCart).toEqual(fakeCart);
    });

    it("Should return a new cart with items on success", async () => {
      const sut = makeSut();
      const fakeCart = makeFakeCart();

      jest.spyOn(cartsRepositoryMock, "save").mockResolvedValueOnce(fakeCart);
      const createdCart = await sut.create({ items: fakeCart.items });

      expect(createdCart).toEqual(fakeCart);
    });
  });
});
