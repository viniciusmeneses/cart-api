import { IsNotEmpty, IsUUID, MaxLength } from "class-validator";

import { Cart } from "@domain/entities/Cart";

export interface IAddCouponToCartUseCase {
  execute(dto?: IAddCouponToCartUseCase.Input): Promise<IAddCouponToCartUseCase.Result>;
}

export namespace IAddCouponToCartUseCase {
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
