import { Exclude, Expose } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
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
  public items: CartItem[];

  @Column({ name: "coupon_id" })
  public couponId?: string;

  @ManyToOne(() => Coupon, { onDelete: "SET NULL" })
  public coupon?: Coupon;

  @Exclude()
  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date;

  @Expose()
  public get subtotal(): number {
    return this.items.reduce((total, item) => total + item.total, 0.0);
  }

  @Expose()
  public get total(): number {
    return this.subtotal - this.subtotal * (this.coupon?.percentage ?? 0 / 100);
  }
}
