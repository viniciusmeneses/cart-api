import { container } from "tsyringe";

import { ICartItemsRepository, ICartsRepository, IProductsRepository } from "@domain/ports/repositories";
import { ICreateCartUseCase, ILoadCartUseCase, IRemoveCartItemsUseCase } from "@domain/ports/useCases/cart";
import { CreateCartUseCase, LoadCartUseCase, RemoveCartItemsUseCase } from "@domain/useCases/cart";
import { CartItemsRepository, CartsRepository, ProductsRepository } from "@infra/database/postgres";

container.registerSingleton<IProductsRepository>("ProductsRepository", ProductsRepository);
container.registerSingleton<ICartsRepository>("CartsRepository", CartsRepository);
container.registerSingleton<ICartItemsRepository>("CartItemsRepository", CartItemsRepository);

container.registerSingleton<ICreateCartUseCase>("CreateCartUseCase", CreateCartUseCase);
container.registerSingleton<ILoadCartUseCase>("LoadCartUseCase", LoadCartUseCase);
container.registerSingleton<IRemoveCartItemsUseCase>("RemoveCartItemsUseCase", RemoveCartItemsUseCase);
