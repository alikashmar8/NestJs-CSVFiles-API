import { Module } from '@nestjs/common';
import { CsvfilesService } from './csvfiles.service';
import { CsvfilesController } from './csvfiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CSVFile } from './csvfile.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([CSVFile])
  ],
  providers: [CsvfilesService],
  controllers: [CsvfilesController]
})
export class CsvfilesModule {}
