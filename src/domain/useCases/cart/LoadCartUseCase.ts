import { indexBy, prop } from "rambda";
import { inject, singleton } from "tsyringe";

import { Cart } from "@domain/entities/Cart";
import { ICartsRepository } from "@domain/ports/repositories/ICartsRepository";
import { ILoadCartUseCase } from "@domain/ports/useCases/cart/ILoadCartUseCase";
import { ValidateInputs } from "@domain/validator";

@singleton()
export class LoadCartUseCase implements ILoadCartUseCase {
  public constructor(@inject("CartsRepository") private cartsRepository: ICartsRepository) {}

  @ValidateInputs
  public async execute({ id }: ILoadCartUseCase.Input): Promise<Cart> {
    return this.cartsRepository.findById(id);
  }
}
