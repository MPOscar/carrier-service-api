import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from "../user/user.entity";

@Entity()
export class Order {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  order_id: number;
  
  @Column()
  status: string;
  
  @Column()
  created_at: Date;
  
  @Column()
  service: string;
  
  @Column()
  updated_at: Date;
  
  @Column()
  tracking_company: string;
  
  @Column()
  shipment_status: string;
  
  @Column()
  location_id: string;
  
  @Column()
  email: string;
  
  @Column()
  tracking_number: string;
  
  @Column()
  tracking_numbers: string;
  
  @Column()
  tracking_url: string;
  
  @Column()
  tracking_urls: string;  
  
  @Column()
  name: string;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;
  
  @ManyToOne(type => User)
  @JoinColumn({ name: "user_id", referencedColumnName: 'id' })
  user: User;

}