import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCartItems1652583085283 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "cart_items",
        columns: [
          {
            name: "cart_id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "product_id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "quantity",
            type: "integer",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["cart_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "carts",
            onDelete: "CASCADE",
          },
          {
            columnNames: ["product_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "products",
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("cart_items");
  }
}
