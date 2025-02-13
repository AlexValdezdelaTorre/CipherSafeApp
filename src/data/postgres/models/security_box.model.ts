import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Credentials, Users } from "../../../data";


export enum Sec_status {
    ACTIVE = "ACTIVE",
    DELETED = "DELETED"
  }

@Entity()
export class SecurityBox extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column ('varchar', {
        length: 100,
        nullable: true
    })
    name: string;

    @Column ('varchar',{ 
        default: true
    })
    favorite: boolean;

    @Column('varchar', { 
        nullable: false,
        length: 20,
    })
    icon: string; 

    @Column('enum', {
        enum: Sec_status,
        default: Sec_status.ACTIVE        
    })
    sec_status: Sec_status;

    @CreateDateColumn({
    type: 'timestamp', default: () =>'CURRENT_TIMESTAMP'})
    createdAt: Date;
    
    @Column({ default: 0 })
    credentialsCount: number;

    
    @OneToMany(() => Credentials, (credentials) => credentials.securityBox)
    credentials: Credentials[];
    
    @ManyToOne(() => Users, (users) => users.securityBox)
    @JoinColumn({ name: "user_id" })
    users: Users;
}