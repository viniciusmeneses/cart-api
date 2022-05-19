import { inject, singleton } from "tsyringe";

import { Cart } from "@domain/entities/Cart";
import { ICartsRepository, ICouponsRepository } from "@domain/ports/repositories";
import { IApplyCouponToCartUseCase } from "@domain/ports/useCases/cart";
import { ValidateInputs } from "@domain/validator";

import { CartNotExistsError, CouponCodeInvalidError } from "../errors";

@singleton()
export class ApplyCouponToCartUseCase implements IApplyCouponToCartUseCase {
  public constructor(
    @inject("CartsRepository") private cartsRepository: ICartsRepository,
    @inject("CouponsRepository") private couponsRepository: ICouponsRepository
  ) {}

  @ValidateInputs
  public async execute({ id, couponCode }: IApplyCouponToCartUseCase.Input): Promise<Cart> {
    const cart = await this.cartsRepository.findById(id, { withItems: false });
    if (cart == null) throw new CartNotExistsError(id);

    const coupon = await this.couponsRepository.findByCode(couponCode);
    if (coupon == null) throw new CouponCodeInvalidError(couponCode);

    cart.coupon = coupon;
    return this.cartsRepository.update(cart);
  }
}
