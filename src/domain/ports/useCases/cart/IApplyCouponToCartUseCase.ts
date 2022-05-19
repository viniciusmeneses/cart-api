import { IsNotEmpty, IsUUID, MaxLength } from "class-validator";

import { Cart } from "@domain/entities/Cart";

export interface IApplyCouponToCartUseCase {
  execute(dto?: IApplyCouponToCartUseCase.Input): Promise<IApplyCouponToCartUseCase.Result>;
}

export namespace IApplyCouponToCartUseCase {
  export class Input {
    @IsNotEmpty()
    @IsUUID()
    public id: string;

    @IsNotEmpty()
    @MaxLength(5)
    public couponCode: string;
  }

  export type Result = Cart;
}
