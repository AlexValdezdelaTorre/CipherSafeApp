import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pin, SecurityBox } from "../../../data";


@Entity()
export class Credentials extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column ('varchar', {
        length: 100,
        nullable: false
    })
    account: string;

    @Column ('varchar', {
        length: 100, 
        nullable: false
    })
    password: string;

    @Column('text')
    description: string; 

    @Column('varchar', {
        length: 20        
    })
    code_1: string;

    @Column('varchar', {
        length: 20        
    })
    code_2: string;

    @ManyToOne(() => SecurityBox,  (box) => box.credentials)
    @JoinColumn({ name: "security_box_id" })
    securityBox: SecurityBox;

    @ManyToOne(() => Pin,  (pin) => pin.credentials)
    @JoinColumn({ name: "pin_id" })
    pin: Pin;

}