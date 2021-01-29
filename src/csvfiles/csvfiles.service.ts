import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as  uuidv4 from 'uuid/v4';
import * as fs from 'fs';
import * as  csvParser from 'csv-parser';
import { UserType } from 'src/users/user.entity';
import { CSVFile } from './csvfile.entity';

@Injectable()
export class CsvfilesService {

    constructor(
        @InjectRepository(CSVFile) private csvFileRepository: Repository<CSVFile>
    ) { }

    async create(file: any, currentUser) {
        let results: any;
        try {
            results = await this.getCsvFileFromFileName(file.originalname);
            let csv_file: CSVFile = {
                id: uuidv4(),
                name: file.originalname,
                date: Date.now(),
                records: results,
                creatorId: currentUser.id
            };
            const f = await this.csvFileRepository.create(csv_file);
            return this.csvFileRepository.save(f);
        } catch (err) {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        }
    }

    async delete(id: any, currentUser) {
        let file = await this.findById(id, currentUser);
        if (file) {
            await this.csvFileRepository.delete(id);
            return { message: 'Deleted successfully!' };
        } else {
            throw new HttpException('Error Deleting File!', HttpStatus.NOT_FOUND)
        }
    }

    async findById(id: any, currentUser) {
        if (currentUser.type == UserType.admin) {
            return await this.csvFileRepository.findOne({ where: { id } });
        } else {
            const file = await this.csvFileRepository.findOne({ where: { id: id, creatorId: currentUser.id } });
            if (file) {
                return file;
            } else {
                throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN)
            }
        }
    }

    async findCurrentUserFiles(currentUser) {
        if (currentUser.type == UserType.admin) {
            return await this.csvFileRepository.find();
        } else {
            return await this.csvFileRepository.find({ where: { creatorId: currentUser.id } });
        }
    }

    async getCsvFileFromFileName(fileName) {
        return new Promise(function (resolve, reject) {
            var results = [];
            fs.createReadStream(fileName)
                .pipe(csvParser())
                .on('data', (row) => {
                    results.push(row);
                })
                .on('end', () => {
                    resolve(results);
                })
                .on('error', reject);
        })
    }
}

