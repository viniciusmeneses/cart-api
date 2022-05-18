import { plainToInstance } from "class-transformer";

import { IRemoveCartItemsUseCase } from "@domain/ports/useCases/cart";
import faker from "@faker-js/faker";

import { validateSut } from "../../helpers";

describe("IRemoveCartItemsUseCase.Input", () => {
  const makeSut = (data: IRemoveCartItemsUseCase.Input) => plainToInstance(IRemoveCartItemsUseCase.Input, data);

  describe("cartId", () => {
    it("Should throw if cartId is not an uuid", async () => {
      const sut = makeSut({ cartId: "" });
      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "cartId" }]);
    });
  });

  describe("productId", () => {
    it("Should throw if productId is not an uuid", async () => {
      const sut = makeSut({ cartId: faker.datatype.uuid(), productId: "" });
      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "productId" }]);
    });

    it("Should not throw if productId is missing", async () => {
      const sut = makeSut({ cartId: faker.datatype.uuid() });
      await expect(validateSut(sut)).resolves.toBeUndefined();
    });
  });

  it("Should not throw if input is valid", async () => {
    const sut = makeSut({ cartId: faker.datatype.uuid() });
    await expect(validateSut(sut)).resolves.toBeUndefined();
  });
});
