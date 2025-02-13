import { BaseEntity, BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Credentials, Users } from "../../../data";
import { encriptAdapter } from "../../../config";


@Entity()
export class Pin extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column ('varchar', {
        
        nullable: false,
        unique: true
    })
    code: string;

    @OneToMany(() => Credentials, (credentials) => credentials.pin)
    credentials: Credentials[];

    @ManyToOne(() => Users, (users) => users.pin)
    @JoinColumn({ name: "userId" })
    users: Users;

    @BeforeInsert()
        encryptedPassword(){
            this.code = encriptAdapter.hash(this.code)
    };

    
}