import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Item {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    name: string;

    @Column()
    sku: string;

    @Column()
    quantity: number;

    @Column()
    grams: number;

    @Column()
    price: number;

    @Column()
    vendor: string;

    @Column()
    requires_shipping: boolean;

    @Column()
    taxable: boolean;

    @Column()
    fulfillment_service: string;

    @Column()
    properties: string;

    @Column()
    product_id: string;

    @Column()
    variant_id: string;

    @Column()
    createdAt?: Date;

    @Column()
    updatedAt?: Date;
}