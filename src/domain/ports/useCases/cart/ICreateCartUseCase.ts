import { Type } from "class-transformer";
import { ArrayUnique, IsInt, IsOptional, IsPositive, IsUUID, ValidateNested } from "class-validator";

import { Cart } from "@domain/entities/Cart";

export interface ICreateCartUseCase {
  execute(dto?: ICreateCartUseCase.Input): Promise<ICreateCartUseCase.Result>;
}

export namespace ICreateCartUseCase {
  class CartItemInput {
    @IsUUID()
    public productId: string;

    @IsInt()
    @IsPositive()
    public quantity: number;
  }

  export class Input {
    @IsOptional()
    @ArrayUnique<CartItemInput>((item) => item.productId)
    @ValidateNested({ each: true })
    @Type(() => CartItemInput)
    public items?: CartItemInput[];
  }

  export type Result = Cart;
}
