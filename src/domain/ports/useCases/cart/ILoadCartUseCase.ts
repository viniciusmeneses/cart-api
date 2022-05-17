import { IsNotEmpty, IsUUID } from "class-validator";

import { Cart } from "@domain/entities/Cart";

export interface ILoadCartUseCase {
  execute(dto?: ILoadCartUseCase.Input): Promise<ILoadCartUseCase.Result>;
}

export namespace ILoadCartUseCase {
  export class Input {
    @IsNotEmpty()
    @IsUUID()
    public id: string;
  }

  export type Result = Cart;
}
