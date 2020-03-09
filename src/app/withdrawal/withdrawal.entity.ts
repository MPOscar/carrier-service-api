import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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
    contact: String;

    @Column({ nullable: true })
    contactPhone: string;

    @Column({ nullable: true })
    date: Date;

    @Column({ type: 'timetz', nullable: true })
    horaDesde: Date;

    @Column({ type: 'timetz', nullable: true })
    horaHasta: Date;

    @Column({ nullable: true })
    rut?: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    comuna?: string;

    @Column({ nullable: true })
    region?: string;

    @Column({ nullable: true })
    zip?: string;

    @Column({ nullable: true })
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @OneToMany(() => Order, order => order.withdrawal, { cascade: true })
    orders: Order[];
}
