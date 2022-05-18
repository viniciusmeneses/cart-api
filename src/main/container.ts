import { container } from "tsyringe";

import { ICartItemsRepository, ICartsRepository, IProductsRepository } from "@domain/ports/repositories";
import {
  ICreateCartItemUseCase,
  ICreateCartUseCase,
  ILoadCartUseCase,
  IRemoveCartItemsUseCase,
  IUpdateCartItemUseCase,
} from "@domain/ports/useCases/cart";
import {
  CreateCartItemUseCase,
  CreateCartUseCase,
  LoadCartUseCase,
  RemoveCartItemsUseCase,
  UpdateCartItemUseCase,
} from "@domain/useCases/cart";
import { CartItemsRepository, CartsRepository, ProductsRepository } from "@infra/database/postgres";

container.registerSingleton<IProductsRepository>("ProductsRepository", ProductsRepository);
container.registerSingleton<ICartsRepository>("CartsRepository", CartsRepository);
container.registerSingleton<ICartItemsRepository>("CartItemsRepository", CartItemsRepository);

container.registerSingleton<ICreateCartUseCase>("CreateCartUseCase", CreateCartUseCase);
container.registerSingleton<ILoadCartUseCase>("LoadCartUseCase", LoadCartUseCase);
container.registerSingleton<IRemoveCartItemsUseCase>("RemoveCartItemsUseCase", RemoveCartItemsUseCase);

container.registerSingleton<ICreateCartItemUseCase>("CreateCartItemUseCase", CreateCartItemUseCase);
container.registerSingleton<IUpdateCartItemUseCase>("UpdateCartItemUseCase", UpdateCartItemUseCase);
