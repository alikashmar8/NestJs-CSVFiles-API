import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CSVFile } from './csvfile.entity';
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser')


@Injectable()
export class CsvfilesService {
    constructor(
        @InjectRepository(CSVFile) private csvFileRepository: Repository<CSVFile>
    ) {}

    async create(file: any, currentUser, res) {
        let results = [];
        try {
            await fs.createReadStream(file.originalname).pipe(csvParser({}))
                .on('data', (data: any) => results.push(data))
                .on('end', async () => {

                    let csv_file: CSVFile = {
                        id: uuidv4(),
                        name: file.originalname,
                        date: Date.now(),
                        records: JSON.stringify(results),
                        creator_id: currentUser.id
                    };

                    const f = await this.csvFileRepository.create(csv_file);
                    await this.csvFileRepository.save(f);
                    res.send(csv_file);
                })
        } catch (err) {
            return err;
        }
    }

    async delete(id: any, currentUser) {
        let file = await this.findById(id,currentUser);
        if(file){
            await this.csvFileRepository.delete(id);
            return { message: 'Deleted successfully!' };
        }else{
            return { message: 'Error Deleting File!' };
        }
    }
    async findById(id: any, currentUser) {
        if(currentUser.type == 0){
            return await this.csvFileRepository.findOne({ where: { id } });
        }else{
            const file = await this.csvFileRepository.findOne({ where: { id: id, creator_id: currentUser.id } });
            if(file){
                return file;
            }else{
                throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN)
            }
        }
    }
    async findCurrentUserFiles(currentUser) {
        if(currentUser.type == 0){
            return await this.csvFileRepository.find();
        }else{
            return await this.csvFileRepository.find({ where : {creator_id: currentUser.id}});
        }
    }
}

