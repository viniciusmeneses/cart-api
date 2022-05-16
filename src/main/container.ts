import { container } from "tsyringe";

import { ICartsRepository, IProductsRepository } from "@domain/ports/repositories";
import { ICreateCartUseCase, ILoadCartUseCase } from "@domain/ports/useCases/cart";
import { CreateCartUseCase, LoadCartUseCase } from "@domain/useCases/cart";
import { CartsRepository, ProductsRepository } from "@infra/database/postgres";

container.registerSingleton<IProductsRepository>("ProductsRepository", ProductsRepository);
container.registerSingleton<ICartsRepository>("CartsRepository", CartsRepository);

container.registerSingleton<ICreateCartUseCase>("CreateCartUseCase", CreateCartUseCase);
container.registerSingleton<ILoadCartUseCase>("LoadCartUseCase", LoadCartUseCase);
