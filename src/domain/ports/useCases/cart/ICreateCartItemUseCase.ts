import { IsInt, IsNotEmpty, IsPositive, IsUUID } from "class-validator";

import { CartItem } from "@domain/entities/CartItem";

export interface ICreateCartItemUseCase {
  execute(dto: ICreateCartItemUseCase.Input): Promise<ICreateCartItemUseCase.Result>;
}

export namespace ICreateCartItemUseCase {
  export class Input {
    @IsNotEmpty()
    @IsUUID()
    public cartId: string;

    @IsNotEmpty()
    @IsUUID()
    public productId: string;

    @IsInt()
    @IsPositive()
    public quantity: number;
  }

  export type Result = CartItem;
}
