import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { Order } from '../order/order.entity';

@Entity()
export class Admission {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ nullable: true })
    cuartel: string;

    @Column({ nullable: true })
    sector: string;

    @Column({ nullable: true })
    SDP: string;

    @Column({ nullable: true })
    abreviaturaCentro: string;

    @Column({ nullable: true })
    codigoDelegacionDestino: string;

    @Column({ nullable: true })
    nombreDelegacionDestino: string;

    @Column({ nullable: true })
    direccionDestino: string;

    @Column({ nullable: true })
    codigoEncaminamiento: string;

    @Column({ nullable: true })
    grabarEnvio: string;

    @Column({ nullable: true })
    numeroEnvio: string;

    @Column({ nullable: true })
    comunaDestino: string;

    @Column({ nullable: true })
    abreviaturaServicio: string;

    @Column({ nullable: true })
    codigoAdmision: string;

    @Column({ nullable: true })
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @OneToOne(() => Order, order => order.admission)
    @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
    order: Order;
}
