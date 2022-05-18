import { CartItem } from "@domain/entities/CartItem";

import { ICreateCartItemUseCase } from "./ICreateCartItemUseCase";

export interface IUpdateCartItemQuantityUseCase {
  execute(dto?: IUpdateCartItemQuantityUseCase.Input): Promise<IUpdateCartItemQuantityUseCase.Result>;
}

export namespace IUpdateCartItemQuantityUseCase {
  export class Input extends ICreateCartItemUseCase.Input {}
  export type Result = CartItem;
}
