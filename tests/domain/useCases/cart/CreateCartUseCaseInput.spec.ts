import { plainToInstance } from "class-transformer";

import { ICreateCartUseCase } from "@domain/ports/useCases/cart/ICreateCartUseCase";
import faker from "@faker-js/faker";
import { makeFakeCreateCartInput } from "@tests/domain/fakes/cart";

import { validateSut } from "../../helpers";

describe("ICreateCartUseCase.Input", () => {
  const makeSut = (data: object) => plainToInstance(ICreateCartUseCase.Input, data);

  describe("items", () => {
    it("Should throw if product id is not an uuid", async () => {
      const sut = makeSut({ items: [{ productId: null, amount: 1 }] });

      await expect(validateSut(sut)).rejects.toMatchObject([
        { property: "items", children: [{ property: "0", children: [{ property: "productId" }] }] },
      ]);
    });

    it("Should throw if amount is not positive", async () => {
      const sut = makeSut({ items: [{ productId: faker.datatype.uuid(), amount: 0 }] });

      await expect(validateSut(sut)).rejects.toMatchObject([
        { property: "items", children: [{ property: "0", children: [{ property: "amount" }] }] },
      ]);
    });
  });

  it("Should not throw if input is valid", async () => {
    const sut = makeSut(makeFakeCreateCartInput());
    await expect(validateSut(sut)).resolves.toBeUndefined();
  });
});
