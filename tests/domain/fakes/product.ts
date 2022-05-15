import { Product } from "@domain/entities/Product";
import faker from "@faker-js/faker";

export const makeFakeProduct = (): Product => ({
  id: faker.datatype.uuid(),
  name: faker.random.word(),
  stock: faker.datatype.number({ min: 0 }),
  price: faker.datatype.number({ min: 0, precision: 0.01 }),
  createdAt: new Date(),
  updatedAt: new Date(),
});
