import { plainToInstance } from "class-transformer";

import { IUpdateCartItemUseCase } from "@domain/ports/useCases/cart";
import faker from "@faker-js/faker";

import { validateSut } from "../../helpers";

describe("IUpdateCartItemUseCase.Input", () => {
  const makeSut = (data: IUpdateCartItemUseCase.Input) => plainToInstance(IUpdateCartItemUseCase.Input, data);

  describe("cartId", () => {
    it("Should throw if cartId is not an uuid", async () => {
      const sut = makeSut({
        quantity: faker.datatype.number({ min: 1 }),
        productId: faker.datatype.uuid(),
        cartId: "",
      });

      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "cartId" }]);
    });
  });

  describe("productId", () => {
    it("Should throw if productId is not an uuid", async () => {
      const sut = makeSut({
        quantity: faker.datatype.number({ min: 1 }),
        cartId: faker.datatype.uuid(),
        productId: "",
      });
      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "productId" }]);
    });
  });

  describe("quantity", () => {
    it("Should throw if quantity is not positive", async () => {
      const sut = makeSut({
        quantity: 0,
        productId: faker.datatype.uuid(),
        cartId: faker.datatype.uuid(),
      });
      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "quantity" }]);
    });
  });

  it("Should not throw if input is valid", async () => {
    const fakeItem = {
      quantity: faker.datatype.number({ min: 1 }),
      productId: faker.datatype.uuid(),
      cartId: faker.datatype.uuid(),
    };

    const sut = makeSut(fakeItem);
    await expect(validateSut(sut)).resolves.toBeUndefined();
  });
});
