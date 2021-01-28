import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity('csvFiles')
export class CSVFile {
    
    @PrimaryColumn({ type: 'text' })
    id: string;

    @Column({ type:'text', nullable: false })
    name: string;

    @Column({ type: 'bigint', nullable: false })
    date: number;

    @Column({ type: 'jsonb', nullable: false })
    records: any[];

    @Column({ type:'text', nullable: false })
    creatorId: string;

}
