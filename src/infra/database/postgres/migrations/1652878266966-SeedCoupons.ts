import { MigrationInterface, QueryRunner } from "typeorm";

import { Coupon } from "@domain/entities/Coupon";

export class SeedCoupons1652878266966 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(Coupon, [
      { id: "f99458a3-918e-4275-83bc-f62d5a891480", code: "GHW2O", percentage: 10.0 },
      { id: "695ba12a-7b9d-4c5d-8d70-649583590a34", code: "VEFJY", percentage: 5.0 },
      { id: "c4a9f80d-8ecc-4870-82f1-c436ac18581f", code: "D0JNN", percentage: 2.5 },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(Coupon, {});
  }
}
