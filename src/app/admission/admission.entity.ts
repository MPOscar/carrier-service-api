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

    @Column()
    extensionData: string;

    @Column()
    cuartel: string;

    @Column()
    sector: string;

    @Column()
    SDP: string;

    @Column()
    abreviaturaCentro: string;

    @Column()
    codigoDelegacionDestino: string;

    @Column()
    nombreDelegacionDestino: string;

    @Column()
    direccionDestino: string;

    @Column()
    codigoEncaminamiento: string;

    @Column()
    grabarEnvio: string;

    @Column()
    numeroEnvio: string;

    @Column()
    comunaDestino: string;

    @Column()
    abreviaturaServicio: string;

    @Column()
    codigoAdmision: string;

    @Column({ nullable: true })
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @OneToOne(() => Order, order => order.admission)
    @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
    order: Order;
}
