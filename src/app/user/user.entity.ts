import { Order } from './../order/order.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    accessToken: string;

    @Column({ default: false })
    isDeleted?: boolean;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    language: string;

    @Column({ nullable: true })
    lastLogin?: Date;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    verificationCode: string;

    @Column({ nullable: true })
    region: string;

    @Column({ nullable: true })
    comuna: string;

    @Column({ nullable: true, length: 30 })
    address: string;

    @Column({ nullable: true })
    zip: string;

    @Column({ nullable: true })
    shopUrl: string;

    @Column({ nullable: true })
    userApiChile: string;

    @Column({ nullable: true })
    passwordApiChile: string;

    @Column({ nullable: true })
    idApiChile: string;

    @Column({ nullable: true })
    profile?: boolean;

    @Column({ nullable: false, default: 0 })
    correlativeNumber?: number;

    @Column({ nullable: true })
    rut?: string;

    @Column({ nullable: true })
    labelFormat?: string;

    @Column({ nullable: true })
    recharge?: number;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @OneToMany(() => Order, order => order.user, {
        cascade: true,
    })
    orders: Order[];
}
