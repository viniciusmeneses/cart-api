import { Coupon } from "@domain/entities/Coupon";

export interface ICouponsRepository {
  findByCode(code: string): Promise<Coupon>;
}
