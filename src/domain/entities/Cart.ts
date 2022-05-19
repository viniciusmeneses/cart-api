import { Exclude, Expose } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { CartItem } from "./CartItem";
import { Coupon } from "./Coupon";

@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  public items?: CartItem[];

  @Exclude()
  @Column({ name: "coupon_id", nullable: true })
  public couponId?: string;

  @ManyToOne(() => Coupon, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "coupon_id" })
  public coupon?: Coupon;

  @Exclude()
  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date;

  @Expose()
  public get subtotal(): number {
    return this.items?.reduce((subtotal, item) => subtotal + item.total, 0) ?? 0;
  }

  @Expose()
  public get total(): number {
    const couponPercentage = this.coupon?.percentage ?? 0;
    return this.subtotal - this.subtotal * (couponPercentage / 100);
  }
}
