import { inject, singleton } from "tsyringe";

import { ICartItemsRepository, ICartsRepository } from "@domain/ports/repositories";
import { IRemoveCartItemsUseCase } from "@domain/ports/useCases/cart";
import { ValidateInputs } from "@domain/validator";

import { CartNotExistsError } from "../errors";

@singleton()
export class RemoveCartItemsUseCase implements IRemoveCartItemsUseCase {
  public constructor(
    @inject("CartsRepository") private cartsRepository: ICartsRepository,
    @inject("CartItemsRepository") private cartItemsRepository: ICartItemsRepository
  ) {}

  @ValidateInputs
  public async execute({ cartId }: IRemoveCartItemsUseCase.Input): Promise<void> {
    const cart = await this.cartsRepository.findById(cartId);
    if (cart == null) throw new CartNotExistsError(cartId);
    await this.cartItemsRepository.remove(cart.items);
  }
}
