import { plainToInstance } from "class-transformer";

import { IRemoveCartItemsUseCase } from "@domain/ports/useCases/cart";
import faker from "@faker-js/faker";

import { validateSut } from "../../helpers";

describe("IRemoveCartItemsUseCase.Input", () => {
  const makeSut = (data: IRemoveCartItemsUseCase.Input) => plainToInstance(IRemoveCartItemsUseCase.Input, data);

  describe("id", () => {
    it("Should throw if cart id is not an uuid", async () => {
      const sut = makeSut({ cartId: "" });
      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "cartId" }]);
    });
  });

  it("Should not throw if input is valid", async () => {
    const sut = makeSut({ cartId: faker.datatype.uuid() });
    await expect(validateSut(sut)).resolves.toBeUndefined();
  });
});
