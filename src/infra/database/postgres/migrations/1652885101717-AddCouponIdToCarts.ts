import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

const couponForeignKey = new TableForeignKey({
  columnNames: ["coupon_id"],
  referencedColumnNames: ["id"],
  referencedTableName: "coupons",
  onDelete: "SET NULL",
});

export class AddCouponIdToCarts1652885101717 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "carts",
      new TableColumn({
        name: "coupon_id",
        type: "uuid",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey("carts", couponForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("carts", couponForeignKey);
    await queryRunner.dropColumn("carts", "coupon_id");
  }
}
