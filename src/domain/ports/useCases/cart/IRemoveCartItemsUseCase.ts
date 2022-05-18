import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export interface IRemoveCartItemsUseCase {
  execute(dto?: IRemoveCartItemsUseCase.Input): Promise<IRemoveCartItemsUseCase.Result>;
}

export namespace IRemoveCartItemsUseCase {
  export class Input {
    @IsNotEmpty()
    @IsUUID()
    public cartId: string;

    @IsOptional()
    @IsUUID()
    public productId?: string;
  }

  export type Result = void;
}
