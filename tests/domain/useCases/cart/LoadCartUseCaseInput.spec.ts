import { plainToInstance } from "class-transformer";

import { ILoadCartUseCase } from "@domain/ports/useCases/cart";
import faker from "@faker-js/faker";

import { validateSut } from "../../helpers";

describe("ILoadCartUseCase.Input", () => {
  const makeSut = (data: ILoadCartUseCase.Input) => plainToInstance(ILoadCartUseCase.Input, data);

  describe("id", () => {
    it("Should throw if id is not an uuid", async () => {
      const sut = makeSut({ id: "" });
      await expect(validateSut(sut)).rejects.toMatchObject([{ property: "id" }]);
    });
  });

  it("Should not throw if input is valid", async () => {
    const sut = makeSut({ id: faker.datatype.uuid() });
    await expect(validateSut(sut)).resolves.toBeUndefined();
  });
});
