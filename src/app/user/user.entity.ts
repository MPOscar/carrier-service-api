import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from '../order/order.entity';

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

    @Column({ nullable: true })
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

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}
