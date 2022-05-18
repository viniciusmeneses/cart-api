import { plainToInstance } from "class-transformer";

import { ICreateCartUseCase } from "@domain/ports/useCases/cart";
import faker from "@faker-js/faker";

import { validateSut } from "../../helpers";

describe("ICreateCartUseCase.Input", () => {
  const makeSut = (data: ICreateCartUseCase.Input) => plainToInstance(ICreateCartUseCase.Input, data);

  describe("items", () => {
    it("Should throw if productId is not unique", async () => {
      const fakeProductId = faker.datatype.uuid();
      const sut = makeSut({
        items: [
          { productId: fakeProductId, quantity: 1 },
          { productId: fakeProductId, quantity: 1 },
        ],
      });

      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "items", children: [] }]);
    });

    describe("productId", () => {
      it("Should throw if productId is not an uuid", async () => {
        const sut = makeSut({ items: [{ productId: "", quantity: 1 }] });
        await expect(validateSut(sut)).rejects.toMatchObject([
          { property: "items", children: [{ property: "0", children: [{ property: "productId" }] }] },
        ]);
      });
    });

    describe("quantity", () => {
      it("Should throw if quantity is not positive", async () => {
        const sut = makeSut({ items: [{ productId: faker.datatype.uuid(), quantity: 0 }] });
        await expect(validateSut(sut)).rejects.toMatchObject([
          { property: "items", children: [{ property: "0", children: [{ property: "quantity" }] }] },
        ]);
      });
    });
  });

  it("Should not throw if input is valid", async () => {
    const fakeItem = { quantity: faker.datatype.number({ min: 1 }), productId: faker.datatype.uuid() };

    const sut = makeSut({
      items: [fakeItem],
    });
    await expect(validateSut(sut)).resolves.toBeUndefined();
  });
});
