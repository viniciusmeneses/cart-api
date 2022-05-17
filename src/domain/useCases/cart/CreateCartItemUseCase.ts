import { propEq } from "rambda";
import { inject, singleton } from "tsyringe";

import { CartItem } from "@domain/entities/CartItem";
import { ICartItemsRepository, ICartsRepository, IProductsRepository } from "@domain/ports/repositories";
import { ICreateCartItemUseCase } from "@domain/ports/useCases/cart";
import { ValidateInputs } from "@domain/validator";

import {
  CartNotExistsError,
  ProductAlreadyAddedToCartError,
  ProductNotExistsError,
  ProductStockUnavailable,
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
    if (cart.items.some(propEq("productId", productId))) throw new ProductAlreadyAddedToCartError(productId, cartId);

    const product = await this.productsRepository.findById(productId);
    if (product == null) throw new ProductNotExistsError(productId);
    if (quantity > product.stock) throw new ProductStockUnavailable(product);

    return this.cartItemsRepository.create({ cartId, productId, quantity });
  }
}
