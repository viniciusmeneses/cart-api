import { Exclude } from "class-transformer";
import { identity } from "rambda";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("coupons")
export class Coupon {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ length: 5 })
  public code: string;

  @Column({ type: "numeric", precision: 5, scale: 2, transformer: { from: parseFloat, to: identity } })
  public percentage: number;

  @Exclude()
  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date;
}
