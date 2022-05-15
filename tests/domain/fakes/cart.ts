import { ICreateCartUseCase } from "@domain/ports/useCases/cart/ICreateCartUseCase";
import faker from "@faker-js/faker";

export const makeFakeCreateCartInput = (): ICreateCartUseCase.Input => ({
  items: [{ productId: faker.datatype.uuid(), amount: faker.datatype.number({ min: 0 }) }],
});
