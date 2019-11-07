import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Manifest } from '../manifest/manifest.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ nullable: true })
    orderId: number;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    number: number;

    note: string;

    @Column({ nullable: true })
    token: string;

    @Column({ nullable: true })
    gateway: string;

    @Column({ nullable: true })
    test: boolean;

    @Column({ nullable: true })
    totalPrice: string;

    @Column({ nullable: true })
    subtotalPrice: string;

    @Column({ nullable: true })
    totalWeight: number;

    @Column({ nullable: true })
    totalTax: string;

    @Column({ nullable: true })
    taxesIncluded: boolean;

    @Column({ nullable: true })
    currency: string;

    @Column({ nullable: true })
    financialStatus: string;

    @Column({ nullable: true })
    confirmed: boolean;

    @Column({ nullable: true })
    totalDiscounts: string;

    @Column({ nullable: true })
    totalLineItemsPrice: string;

    @Column({ nullable: true })
    cartToken: string;

    @Column({ nullable: true })
    buyerAcceptsMarketing: boolean;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    referringSite: string;

    @Column({ nullable: true })
    receiverName: string;

    @Column({ nullable: true })
    receiverAddress: string;

    @Column({ nullable: true })
    receiverContactName: string;

    @Column({ nullable: true })
    receiverContactPhone: string;

    @Column({ nullable: true })
    serviceCode: string;

    @Column({ nullable: true })
    totalPieces: number;

    @Column({ nullable: true })
    kg: number;

    @Column({ nullable: true })
    volumen: number;

    @Column({ nullable: true, default: false })
    admissionProcessed: boolean;

    @Column({ nullable: true })
    receiverCountry: string;

    @Column({ nullable: true })
    closedAt: Date;

    @Column({ nullable: true })
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @OneToOne(type => Manifest, manifest => manifest.order)
    manifest: Manifest;
}
