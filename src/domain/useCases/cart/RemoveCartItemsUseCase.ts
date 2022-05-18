import { propEq } from "rambda";
import { inject, singleton } from "tsyringe";

import { ICartItemsRepository, ICartsRepository, IProductsRepository } from "@domain/ports/repositories";
import { IRemoveCartItemsUseCase } from "@domain/ports/useCases/cart";
import { ValidateInputs } from "@domain/validator";

import { CartNotExistsError, ProductNotExistsError } from "../errors";

@singleton()
export class RemoveCartItemsUseCase implements IRemoveCartItemsUseCase {
  public constructor(
    @inject("CartItemsRepository") private cartItemsRepository: ICartItemsRepository,
    @inject("CartsRepository") private cartsRepository: ICartsRepository,
    @inject("ProductsRepository") private productsRepository: IProductsRepository
  ) {}

  @ValidateInputs
  public async execute({ cartId, productId }: IRemoveCartItemsUseCase.Input): Promise<void> {
    const cart = await this.cartsRepository.findById(cartId);
    if (cart == null) throw new CartNotExistsError(cartId);

    if (productId != null) {
      const product = await this.productsRepository.findById(productId);
      if (product == null) throw new ProductNotExistsError(productId);
    }

    const items = productId != null ? cart.items.filter(propEq("productId", productId)) : cart.items;
    return this.cartItemsRepository.remove(items);
  }
}
