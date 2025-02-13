import { BaseEntity, BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { encriptAdapter } from "../../../config";
import { Pin, SecurityBox } from "../../../data";


@Entity()
export class Users extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column ('varchar', {
        length: 100,
        nullable: true
    })
    name: string;

    @Column ('varchar', {
        length: 100,
        nullable: true
    })
    surname: string;

    @Column('varchar', { 
        nullable: false,
        length: 150,
        unique: true,
    })
    email: string;

    @Column('varchar', {
        nullable: false,
        length: 20,
        unique: true,
    })
    cellphone: string;

    @Column("varchar", {  
        nullable: false,
        length: 255
    })
    password: string; 

    @Column('varchar', {
        
        default: true        
    })
    status: boolean;

    @OneToMany(() => SecurityBox, (securityBox) => securityBox.users)
    securityBox: SecurityBox[];     

    @OneToMany(() => Pin, (pin) => pin.users)
    pin: Pin[];

    @BeforeInsert()
    encryptedPassword(){
        this.password = encriptAdapter.hash(this.password)
    }

}










