import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
