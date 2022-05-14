import { Product } from "@domain/entities/Product";
import faker from "@faker-js/faker";

export const makeFakeProduct = (): Product => ({
  id: faker.datatype.uuid(),
  name: faker.random.word(),
  stock: faker.datatype.number({ min: 0 }),
  createdAt: new Date(),
  updatedAt: new Date(),
});
