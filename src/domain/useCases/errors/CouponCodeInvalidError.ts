export class CouponCodeInvalidError extends Error {
  public constructor(public code: string) {
    super(`Coupon ${code} is invalid`);
    this.name = "CouponCodeInvalidError";
  }
}
