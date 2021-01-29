import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { UserRepository } from 'src/users/userRepositry';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    
    constructor(
        @InjectRepository(UserRepository) private readonly usersRepository: UserRepository
    ) {}

    async update(id: any, data: any, currentUser) {
        if (currentUser.id == id) {
            let emailCheck: User = await this.findByEmail(data.email);
            if (!emailCheck || emailCheck.email == currentUser.email) {
                const hash = bcrypt.hashSync(data.password, 10);
                data.password = hash;
                const u = await this.usersRepository.updateUser(id,data);
                return u;
            } else {
                throw new HttpException('Email already in use!', HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
        }
    }

    async findById(id: any) {
        return await this.usersRepository.findById(id);
    }

    async findByEmail(email: string): Promise<User> {
        const user: User = await this.usersRepository.findByEmail(email)
        return user;
    }

    async store(user: User) {
        return await this.usersRepository.storeNew(user);
    }

}
