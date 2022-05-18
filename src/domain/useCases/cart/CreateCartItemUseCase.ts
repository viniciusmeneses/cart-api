import { propEq } from "rambda";
import { inject, singleton } from "tsyringe";

import { CartItem } from "@domain/entities/CartItem";
import { ICartItemsRepository, ICartsRepository, IProductsRepository } from "@domain/ports/repositories";
import { ICreateCartItemUseCase } from "@domain/ports/useCases/cart";
import { ValidateInputs } from "@domain/validator";

import {
  CartItemAlreadyExistsError,
  CartNotExistsError,
  ProductNotExistsError,
  ProductStockUnavailableError,
} from "../errors";

@singleton()
export class CreateCartItemUseCase implements ICreateCartItemUseCase {
  public constructor(
    @inject("CartItemsRepository") private cartItemsRepository: ICartItemsRepository,
    @inject("CartsRepository") private cartsRepository: ICartsRepository,
    @inject("ProductsRepository") private productsRepository: IProductsRepository
  ) {}

  @ValidateInputs
  public async execute({ cartId, productId, quantity }: ICreateCartItemUseCase.Input): Promise<CartItem> {
    const cart = await this.cartsRepository.findById(cartId);
    if (cart == null) throw new CartNotExistsError(cartId);

    const cartItem = cart.items.find(propEq("productId", productId));
    if (cartItem != null) throw new CartItemAlreadyExistsError(cartItem);

    const product = await this.productsRepository.findById(productId);
    if (product == null) throw new ProductNotExistsError(productId);
    if (quantity > product.stock) throw new ProductStockUnavailableError(product);

    return this.cartItemsRepository.create({ cartId, productId, quantity });
  }
}
