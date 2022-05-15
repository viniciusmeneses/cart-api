import { Product } from "@domain/entities/Product";
import { PostgresConnection, ProductsRepository } from "@infra/database/postgres";
import { makeFakeProduct } from "@tests/domain/fakes";

PostgresConnection.prototype.getRepository = jest.fn().mockReturnValue({ findOneBy: jest.fn() });

const fakeProduct = makeFakeProduct();

const connectionMock = new PostgresConnection();
const productsRepositoryMock = jest.mocked(connectionMock.getRepository(Product));

const makeSut = () => new ProductsRepository(connectionMock);

describe("ProductsRepository", () => {
  describe("findById", () => {
    it("Should call Repository.findOneBy", async () => {
      const sut = makeSut();
      await sut.findById(fakeProduct.id);
      expect(productsRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.findOneBy throws", async () => {
      const sut = makeSut();
      jest.spyOn(productsRepositoryMock, "findOneBy").mockRejectedValueOnce(new Error());
      await expect(sut.findById(fakeProduct.id)).rejects.toThrow();
    });

    it("Should return an product if id exists", async () => {
      const sut = makeSut();

      jest.spyOn(productsRepositoryMock, "findOneBy").mockResolvedValueOnce(fakeProduct);
      const foundProduct = await sut.findById(fakeProduct.id);

      expect(foundProduct).toMatchObject(fakeProduct);
    });

    it("Should not return a product if id not exists", async () => {
      const sut = makeSut();
      const noneProduct = await sut.findById(fakeProduct.id);
      expect(noneProduct).toBeFalsy();
    });
  });
});
