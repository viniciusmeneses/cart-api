import { Exclude } from "class-transformer";
import { identity } from "rambda";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public name: string;

  @Column({ type: "integer" })
  public stock: number;

  @Column({
    type: "numeric",
    precision: 8,
    scale: 2,
    transformer: { from: parseFloat, to: identity },
  })
  public price: number;

  @Exclude()
  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date;
}
