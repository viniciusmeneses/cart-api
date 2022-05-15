import { indexBy, prop } from "rambda";
import { inject, singleton } from "tsyringe";

import { Cart } from "@domain/entities/Cart";
import { IProductsRepository } from "@domain/ports/repositories";
import { ICartsRepository } from "@domain/ports/repositories/ICartsRepository";
import { ICreateCartUseCase } from "@domain/ports/useCases/cart/ICreateCartUseCase";
import { ValidateInputs } from "@domain/validator";

import { ProductNoStockAvailable, ProductNotExistsError } from "../errors";

@singleton()
export class CreateCartUseCase implements ICreateCartUseCase {
  public constructor(
    @inject("CartsRepository") private cartsRepository: ICartsRepository,
    @inject("ProductsRepository") private productsRepository: IProductsRepository
  ) {}

  @ValidateInputs
  public async execute(dto?: ICreateCartUseCase.Input): Promise<Cart> {
    if (dto?.items?.length > 0) {
      const { items } = dto;

      const products = await this.productsRepository.findByIds(items.map(prop("productId")));
      const productsById = indexBy(prop("id"), products);

      for (const { productId, amount } of items) {
        const product = productsById[productId];
        if (product == null) throw new ProductNotExistsError(productId);
        if (product.stock < amount) throw new ProductNoStockAvailable(product);
      }
    }

    return this.cartsRepository.create(dto);
  }
}
