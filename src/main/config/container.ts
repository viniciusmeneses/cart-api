import { container } from "tsyringe";

import { IProductsRepository } from "@domain/ports/repositories";
import { ICartsRepository } from "@domain/ports/repositories/ICartsRepository";
import { CartsRepository, ProductsRepository } from "@infra/database/postgres";

container.registerSingleton<IProductsRepository>("ProductsRepository", ProductsRepository);
container.registerSingleton<ICartsRepository>("CartsRepository", CartsRepository);
