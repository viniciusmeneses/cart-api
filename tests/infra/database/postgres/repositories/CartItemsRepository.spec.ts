import { CartItem } from "@domain/entities/CartItem";
import faker from "@faker-js/faker";
import { CartItemsRepository, PostgresConnection } from "@infra/database/postgres";
import { makeFakeCart } from "@tests/domain/fakes";

PostgresConnection.prototype.getRepository = jest.fn().mockReturnValue({
  delete: jest.fn(),
});

const fakeCart = makeFakeCart({ id: faker.datatype.uuid() });

const connectionMock = new PostgresConnection();
const cartItemsRepositoryMock = jest.mocked(connectionMock.getRepository(CartItem));

const makeSut = () => new CartItemsRepository(connectionMock);

describe("CartItemsRepository", () => {
  describe("removeByCartId", () => {
    it("Should call Repository.delete", async () => {
      const sut = makeSut();
      await sut.removeByCartId(fakeCart.id);
      expect(cartItemsRepositoryMock.delete).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.delete throws", async () => {
      const sut = makeSut();
      jest.spyOn(cartItemsRepositoryMock, "delete").mockRejectedValueOnce(new Error());
      await expect(sut.removeByCartId(fakeCart.id)).rejects.toThrow();
    });
  });
});
