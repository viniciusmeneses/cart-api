import { plainToInstance } from "class-transformer";

import { IApplyCouponToCartUseCase } from "@domain/ports/useCases/cart";
import faker from "@faker-js/faker";

import { validateSut } from "../../helpers";

describe("ApplyCouponToCartUseCase.Input", () => {
  const makeSut = (data: IApplyCouponToCartUseCase.Input) => plainToInstance(IApplyCouponToCartUseCase.Input, data);

  describe("id", () => {
    it("Should throw if id is not an uuid", async () => {
      const sut = makeSut({ id: "", couponCode: faker.random.alphaNumeric() });
      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "id" }]);
    });
  });

  describe("couponCode", () => {
    it("Should throw if couponCode has more than 5 characters", async () => {
      const sut = makeSut({ id: faker.datatype.uuid(), couponCode: faker.random.alphaNumeric(6) });
      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "couponCode" }]);
    });

    it("Should throw if couponCode is blank", async () => {
      const sut = makeSut({ id: faker.datatype.uuid(), couponCode: "" });
      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "couponCode" }]);
    });
  });

  it("Should not throw if input is valid", async () => {
    const sut = makeSut({ id: faker.datatype.uuid(), couponCode: faker.random.alphaNumeric() });
    await expect(validateSut(sut)).resolves.toBeUndefined();
  });
});
