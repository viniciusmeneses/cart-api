import { Exclude, Expose } from "class-transformer";
import { CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { CartItem } from "./CartItem";

@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true, eager: true })
  public items: CartItem[];

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
    return this.subtotal;
  }
}
