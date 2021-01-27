import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity('users')
export class User {
    @PrimaryColumn({ type: 'text' })
    id: string;

    @Column({ type:'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    email: string;

    @Column({ type: 'text', nullable: false })
    password: string;   

    @Column({ type: 'integer', nullable: false, default: 1 })
    type: number;
}
