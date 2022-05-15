import { container } from "tsyringe";

import { IProductsRepository } from "@domain/ports/repositories";
import { ProductsRepository } from "@infra/database/postgres";

container.registerSingleton<IProductsRepository>("ProductsRepository", ProductsRepository);
