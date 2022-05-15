import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCarts1652552856969 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "carts",
        columns: [
          {
            name: "id",
            type: "uuid",
            default: "gen_random_uuid()",
            isPrimary: true,
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
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("carts");
  }
}
