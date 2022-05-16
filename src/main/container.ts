import { container } from "tsyringe";

import { IProductsRepository } from "@domain/ports/repositories";
import { ICartsRepository } from "@domain/ports/repositories/ICartsRepository";
import { ICreateCartUseCase } from "@domain/ports/useCases/cart/ICreateCartUseCase";
import { ILoadCartUseCase } from "@domain/ports/useCases/cart/ILoadCartUseCase";
import { CreateCartUseCase, LoadCartUseCase } from "@domain/useCases/cart";
import { CartsRepository, ProductsRepository } from "@infra/database/postgres";

container.registerSingleton<IProductsRepository>("ProductsRepository", ProductsRepository);
container.registerSingleton<ICartsRepository>("CartsRepository", CartsRepository);

container.registerSingleton<ICreateCartUseCase>("CreateCartUseCase", CreateCartUseCase);
container.registerSingleton<ILoadCartUseCase>("LoadCartUseCase", LoadCartUseCase);
