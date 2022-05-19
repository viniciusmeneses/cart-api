import { Exclude, Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity("cart_items")
export class CartItem {
  @PrimaryColumn({ name: "cart_id" })
  public cartId: string;

  @PrimaryColumn({ name: "product_id" })
  public productId: string;

  @ManyToOne(() => Cart, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart_id" })
  public cart?: Cart;

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  public product?: Product;

  @Column({ type: "integer" })
  public quantity: number;

  @Exclude()
  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date;

  @Expose()
  public get total(): number {
    return (this.product?.price ?? 0) * this.quantity;
  }
}
