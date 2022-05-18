import { MigrationInterface, QueryRunner } from "typeorm";

import { Product } from "@domain/entities/Product";

export class SeedProducts1652843704937 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(Product, [
      { id: "779d7f21-05b7-4a74-82e5-68b43c7d42d4", name: "Camiseta", price: 45.0, stock: 10 },
      { id: "a5d66c1a-b540-45ec-aab7-1e7dc932c38f", name: "Calça", price: 90.0, stock: 10 },
      { id: "c2f6dd0e-763e-4600-ad6f-0699be6ba5ae", name: "Tênis", price: 199.99, stock: 3 },
      { id: "c98b3118-677d-4aec-9b06-d20f0015a5ac", name: "Moletom", price: 149.99, stock: 5 },
      { id: "9450ea85-ab39-4d06-ae9f-8cd7f20ed4e6", name: "Boné", price: 20.0, stock: 4 },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(Product, {});
  }
}
