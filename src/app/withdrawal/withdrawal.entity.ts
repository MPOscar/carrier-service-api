import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from 'typeorm';
import { Order } from '../order/order.entity';

@Entity()
export class Withdrawal {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ nullable: true })
    admissionCode: string;

    @Column({ nullable: true })
    withdrawalCode: number;

    @Column({ nullable: true })
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @OneToMany(() => Order, order => order.withdrawal)
    orders: Order[];
}
