import { plainToInstance } from "class-transformer";

import { Coupon } from "@domain/entities/Coupon";
import faker from "@faker-js/faker";

export const makeFakeCoupon = ({ id }: { id: string }): Coupon =>
  plainToInstance(Coupon, {
    id,
    code: faker.random.alphaNumeric(5).toUpperCase(),
    percentage: faker.datatype.number({ min: 0, max: 100, precision: 0.01 }),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
