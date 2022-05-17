import { IsNotEmpty, IsUUID } from "class-validator";

export interface IRemoveCartItemsUseCase {
  execute(dto?: IRemoveCartItemsUseCase.Input): Promise<IRemoveCartItemsUseCase.Result>;
}

export namespace IRemoveCartItemsUseCase {
  export class Input {
    @IsNotEmpty()
    @IsUUID()
    public cartId: string;
  }

  export type Result = void;
}
