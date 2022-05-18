import { CartItem } from "@domain/entities/CartItem";

import { ICreateCartItemUseCase } from "./ICreateCartItemUseCase";

export interface IUpdateCartItemUseCase {
  execute(dto?: IUpdateCartItemUseCase.Input): Promise<IUpdateCartItemUseCase.Result>;
}

export namespace IUpdateCartItemUseCase {
  export class Input extends ICreateCartItemUseCase.Input {}
  export type Result = CartItem;
}
