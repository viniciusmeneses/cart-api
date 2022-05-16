import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameAmountFromCartItems1652672762066 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn("cart_items", "amount", "quantity");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn("cart_items", "quantity", "amount");
  }
}
