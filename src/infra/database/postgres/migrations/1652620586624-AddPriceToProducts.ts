import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPriceToProducts1652620586624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "products",
      new TableColumn({
        name: "price",
        type: "decimal(8, 2)",
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("products", "price");
  }
}
