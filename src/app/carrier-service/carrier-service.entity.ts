import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    OneToOne,
} from 'typeorm';

@Entity()
export class Carrier {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    name?: string;

    @Column()
    phone?: string;

    @Column()
    email?: string;

    @Column()
    address?: string;

    @Column()
    city?: string;

    @Column()
    state?: string;

    @Column()
    language?: string;

    @Column()
    driverAssignRadius?: number;

    @Column()
    zip?: number;

    @Column()
    createdAt?: Date;

    @Column()
    updatedAt?: Date;
}
