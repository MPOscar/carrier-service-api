import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

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

    @Column({nullable: true})
    language: string;
    
    @Column({nullable: true})
    lastLogin?: Date;
    
    @Column({ length: 50 })
    lastName: string;
    
    @Column()
    password: string;

    @Column()
    phone: string;
  
    @Column({nullable: true})
    verificationCode: string;

    @Column({ length: 50 })
    region: string;
    
    @Column()
    comuna: string;

    @Column()
    address: string;

    @Column()
    zip: string;

    @Column()
    shopUrl: string;

    @Column()
    userApiChile: string;

    @Column()
    passwordApiChile: string;

    @Column()
    idApiChile: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}