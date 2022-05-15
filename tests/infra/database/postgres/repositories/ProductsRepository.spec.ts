import { Product } from "@domain/entities/Product";
import faker from "@faker-js/faker";
import { PostgresConnection, ProductsRepository } from "@infra/database/postgres";
import { makeFakeProduct } from "@tests/domain/fakes";

PostgresConnection.prototype.getRepository = jest.fn().mockReturnValue({ findOneBy: jest.fn(), findBy: jest.fn() });

const fakeProduct = makeFakeProduct({ id: faker.datatype.uuid() });

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

  describe("findByIds", () => {
    it("Should call Repository.findBy", async () => {
      const sut = makeSut();
      await sut.findByIds([fakeProduct.id]);
      expect(productsRepositoryMock.findBy).toHaveBeenCalledTimes(1);
    });

    it("Should throw if Repository.findBy throws", async () => {
      const sut = makeSut();
      jest.spyOn(productsRepositoryMock, "findBy").mockRejectedValueOnce(new Error());
      await expect(sut.findByIds([fakeProduct.id])).rejects.toThrow();
    });

    it("Should return products if ids exists", async () => {
      const sut = makeSut();

      jest.spyOn(productsRepositoryMock, "findBy").mockResolvedValueOnce([fakeProduct]);
      const foundProduct = await sut.findByIds([fakeProduct.id]);

      expect(foundProduct).toEqual([fakeProduct]);
    });

    it("Should not return products if ids not exists", async () => {
      const sut = makeSut();
      const noneProduct = await sut.findByIds([fakeProduct.id]);
      expect(noneProduct).toBeFalsy();
    });
  });
});
