import { plainToInstance } from "class-transformer";

import { Product } from "@domain/entities/Product";
import faker from "@faker-js/faker";

export const makeFakeProduct = ({ id }: { id: string }): Product =>
  plainToInstance(Product, {
    id,
    name: faker.random.word(),
    stock: faker.datatype.number({ min: 100 }),
    price: faker.datatype.number({ min: 0, precision: 0.01 }),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
