import { IsInt, IsNotEmpty, IsPositive, IsUUID } from "class-validator";

import { CartItem } from "@domain/entities/CartItem";

import { ICreateCartUseCase } from "./ICreateCartUseCase";

export interface ICreateCartItemUseCase {
  execute(dto: ICreateCartItemUseCase.Input): Promise<ICreateCartItemUseCase.Result>;
}

export namespace ICreateCartItemUseCase {
  export class Input extends ICreateCartUseCase.CartItemInput {
    @IsNotEmpty()
    @IsUUID()
    public cartId: string;
  }

  export type Result = CartItem;
}
