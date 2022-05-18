import { singleton } from "tsyringe";
import { Repository as OrmRepository } from "typeorm";

import { Coupon } from "@domain/entities/Coupon";
import { ICouponsRepository } from "@domain/ports/repositories";

import { Repository } from "../Repository";

@singleton()
export class CouponsRepository extends Repository implements ICouponsRepository {
  public async findByCode(code: string): Promise<Coupon> {
    return this.repository.findOneBy({ code });
  }

  private get repository(): OrmRepository<Coupon> {
    return this.connection.getRepository(Coupon);
  }
}
