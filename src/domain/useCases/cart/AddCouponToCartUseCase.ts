import { inject, singleton } from "tsyringe";

import { Cart } from "@domain/entities/Cart";
import { ICartsRepository, ICouponsRepository } from "@domain/ports/repositories";
import { IAddCouponToCartUseCase } from "@domain/ports/useCases/cart";
import { ValidateInputs } from "@domain/validator";

import { CartNotExistsError, CouponCodeInvalidError } from "../errors";

@singleton()
export class AddCouponToCartUseCase implements IAddCouponToCartUseCase {
  public constructor(
    @inject("CartsRepository") private cartsRepository: ICartsRepository,
    @inject("CouponsRepository") private couponsRepository: ICouponsRepository
  ) {}

  @ValidateInputs
  public async execute({ id, couponCode }: IAddCouponToCartUseCase.Input): Promise<Cart> {
    const cart = await this.cartsRepository.findById(id);
    if (cart == null) throw new CartNotExistsError(id);

    const coupon = await this.couponsRepository.findByCode(couponCode);
    if (coupon == null) throw new CouponCodeInvalidError(couponCode);

    cart.coupon = coupon;
    return this.cartsRepository.update(cart);
  }
}
