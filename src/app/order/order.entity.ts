import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    OneToOne,
    ValueTransformer,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Manifest } from '../manifest/manifest.entity';
import { Admission } from '../admission/admission.entity';
import { Withdrawal } from '../withdrawal/withdrawal.entity';

export const bigint: ValueTransformer = {
    to: (entityValue: bigint) => entityValue,
    from: (databaseValue: string): bigint => BigInt(databaseValue),
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'bigint', nullable: true, transformer: bigint })
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

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
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

    @Column('decimal', { precision: 3, scale: 2, nullable: true })
    kg: number;

    @Column('decimal', { precision: 7, scale: 6, nullable: true })
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

    @OneToOne(type => Admission, admission => admission.order)
    admission: Admission;

    @ManyToOne(type => Withdrawal, withdrawal => withdrawal.orders)
    withdrawal: Withdrawal;
}
