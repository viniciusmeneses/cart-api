import { CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { CartItem } from "./CartItem";

@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  public items: CartItem[];

  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date;
}
