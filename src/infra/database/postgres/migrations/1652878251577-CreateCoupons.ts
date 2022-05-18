import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCoupons1652878251577 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "coupons",
        columns: [
          {
            name: "id",
            type: "uuid",
            default: "gen_random_uuid()",
            isPrimary: true,
          },
          {
            name: "code",
            type: "varchar",
            length: "5",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "percentage",
            type: "numeric(5, 2)",
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
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("coupons");
  }
}
