import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import * as  uuidv4 from 'uuid/v4';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService
    ) { }

    logout() {
        var token = jwt.sign({}, 'secret', { expiresIn: '1s' });
        return token
    }

    async register(data) {
        const hash = bcrypt.hashSync(data.password, 10);
        let user: User = {
            id: uuidv4(),
            email: data.email,
            password: hash,
            name: data.name,
            type: 1,
        }
        return await this.userService.store(user).catch((err: any) => {
            switch (err.code) {
                case '23505':
                    throw new HttpException(err.detail, HttpStatus.BAD_REQUEST);
            }
        });
    }

    async login(data) {
        let { email, password } = data;
        let user = await this.userService.findByEmail(email);
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ user }, 'secret', { expiresIn: '1h' });
                return token;
            } else {
                throw new HttpException("Password Incorrect", HttpStatus.UNAUTHORIZED);
            }
        } else {
            throw new HttpException('No user with this email found', HttpStatus.UNAUTHORIZED);
        }
    }

}
