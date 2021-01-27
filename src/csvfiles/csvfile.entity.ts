import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity('csv_files')
export class CSVFile {
    @PrimaryColumn({ type: 'text' })
    id: string;

    @Column({ type:'text', nullable: false })
    name: string;

    @Column({ type: 'bigint', nullable: false })
    date: number;

    @Column({ type: 'text', nullable: false })
    records: string;

    @Column({ type:'text', nullable: false })
    creator_id: string;

}
