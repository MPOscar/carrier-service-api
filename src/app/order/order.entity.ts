import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from "../user/user.entity";

@Entity()
export class Order {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  order_id: number;

  @Column()
  email: string;

  @Column()
  number: number;

  note: string;

  @Column()
  token: string;

  @Column()
  gateway: string;

  @Column()
  test: boolean;

  @Column()
  total_price: string;

  @Column()
  subtotal_price: string;

  @Column()
  total_weight: number;

  @Column()
  total_tax: string;

  @Column()
  taxes_included: boolean;

  @Column()
  currency: string;

  @Column()
  financial_status: string;

  @Column()
  confirmed: boolean;

  @Column()
  total_discounts: string;

  @Column()
  total_line_items_price: string;

  @Column()
  cart_token: string;

  @Column()
  buyer_accepts_marketing: boolean;

  @Column()
  name: string;

  @Column()
  referring_site: string;

  @Column()
  closed_at: Date;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @ManyToOne(type => User)
  @JoinColumn({ name: "user_id", referencedColumnName: 'id' })
  user: User;

}