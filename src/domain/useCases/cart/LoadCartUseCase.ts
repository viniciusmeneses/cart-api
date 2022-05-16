import { inject, singleton } from "tsyringe";

import { Cart } from "@domain/entities/Cart";
import { ICartsRepository } from "@domain/ports/repositories";
import { ILoadCartUseCase } from "@domain/ports/useCases/cart";
import { ValidateInputs } from "@domain/validator";

import { CartNotExistsError } from "../errors";

@singleton()
export class LoadCartUseCase implements ILoadCartUseCase {
  public constructor(@inject("CartsRepository") private cartsRepository: ICartsRepository) {}

  @ValidateInputs
  public async execute({ id }: ILoadCartUseCase.Input): Promise<Cart> {
    const cart = await this.cartsRepository.findById(id);
    if (cart == null) throw new CartNotExistsError(id);
    return cart;
  }
}
