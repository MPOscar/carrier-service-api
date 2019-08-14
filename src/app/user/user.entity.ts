import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

export enum UserRole {
    SUPER_ADMIN = 'root',
    EXPERT = 'expert',
    ADVISER = 'adviser',
    COMPANY = 'company',
}

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ default: false })
    isDeleted?: boolean;

    @Column()
    email: string;

    @Column({ length: 50 })
    firstName: string;

    @Column()
    language: string;
    
    @Column({nullable: true})
    lastLogin?: Date;
    
    @Column({ length: 50 })
    lastName: string;
    
    @Column()
    password: string;

    @Column()
    phone: string;
    
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.ADVISER,
    })
    role: UserRole;

    @Column({nullable: true})
    verificationCode: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}