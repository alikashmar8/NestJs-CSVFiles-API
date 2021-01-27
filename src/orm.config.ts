import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const config: TypeOrmModuleOptions = {
    type: 'postgres',
    database: 'CSVFiles',
    host: 'localhost',
    username: 'postgres',
    password: 'root',
    port: 5432,
    synchronize: true,
    entities : ['dist/**/*.entity{.ts,.js}']
}