import { indexBy, prop } from "rambda";
import { inject, singleton } from "tsyringe";

import { Cart } from "@domain/entities/Cart";
import { ICartsRepository, IProductsRepository } from "@domain/ports/repositories";
import { ICreateCartUseCase } from "@domain/ports/useCases/cart";
import { ValidateInputs } from "@domain/validator";

import { ProductNotExistsError, ProductStockUnavailableError } from "../errors";

@singleton()
export class CreateCartUseCase implements ICreateCartUseCase {
  public constructor(
    @inject("CartsRepository") private cartsRepository: ICartsRepository,
    @inject("ProductsRepository") private productsRepository: IProductsRepository
  ) {}

  @ValidateInputs
  public async execute({ items }: ICreateCartUseCase.Input = {}): Promise<Cart> {
    if (items?.length > 0) {
      const products = await this.productsRepository.findByIds(items.map(prop("productId")));
      const productsById = indexBy(prop("id"), products);

      for (const { productId, quantity } of items) {
        const product = productsById[productId];
        if (product == null) throw new ProductNotExistsError(productId);
        if (product.stock < quantity) throw new ProductStockUnavailableError(product);
      }
    }

    return this.cartsRepository.create({ items });
  }
}
