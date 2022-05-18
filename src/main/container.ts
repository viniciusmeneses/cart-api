import { container } from "tsyringe";

import {
  ICartItemsRepository,
  ICartsRepository,
  ICouponsRepository,
  IProductsRepository,
} from "@domain/ports/repositories";
import {
  IAddCouponToCartUseCase,
  ICreateCartItemUseCase,
  ICreateCartUseCase,
  ILoadCartUseCase,
  IRemoveCartItemsUseCase,
  IUpdateCartItemUseCase,
} from "@domain/ports/useCases/cart";
import {
  AddCouponToCartUseCase,
  CreateCartItemUseCase,
  CreateCartUseCase,
  LoadCartUseCase,
  RemoveCartItemsUseCase,
  UpdateCartItemUseCase,
} from "@domain/useCases/cart";
import { CartItemsRepository, CartsRepository, CouponsRepository, ProductsRepository } from "@infra/database/postgres";

container.registerSingleton<IProductsRepository>("ProductsRepository", ProductsRepository);
container.registerSingleton<ICartsRepository>("CartsRepository", CartsRepository);
container.registerSingleton<ICartItemsRepository>("CartItemsRepository", CartItemsRepository);
container.registerSingleton<ICouponsRepository>("CouponsRepository", CouponsRepository);

container.registerSingleton<ICreateCartUseCase>("CreateCartUseCase", CreateCartUseCase);
container.registerSingleton<ILoadCartUseCase>("LoadCartUseCase", LoadCartUseCase);
container.registerSingleton<IAddCouponToCartUseCase>("AddCouponToCartUseCase", AddCouponToCartUseCase);

container.registerSingleton<ICreateCartItemUseCase>("CreateCartItemUseCase", CreateCartItemUseCase);
container.registerSingleton<IUpdateCartItemUseCase>("UpdateCartItemUseCase", UpdateCartItemUseCase);
container.registerSingleton<IRemoveCartItemsUseCase>("RemoveCartItemsUseCase", RemoveCartItemsUseCase);
