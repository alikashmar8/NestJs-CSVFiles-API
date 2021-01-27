import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
import { UsersService } from 'src/users/users.service';

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
        let { name, email, password } = data;

        let errors: { message: string; }[] = [];
        if (!name || !email || !password) {
            errors.push({ message: "Please enter all fields" });
            return errors;
        }

        if (!this.emailIsValid(email)) {
            errors.push({ message: "Please enter a valid email address" })
        }

        if (password.length < 6) {
            errors.push({ message: "Password should be atleast 6 characters" });
        }

        if (errors.length > 0) {
            return errors;
        } else {
            let user = await this.userService.findByEmail(email);
            if (user) {
                return { message: 'Email already registered!' };

            } else {

                const hash = bcrypt.hashSync(password, 10);
                let user: User = {
                    id: uuidv4(),
                    email: email,
                    password: hash,
                    name: name,
                    type: 1,
                }

                await this.userService.store(user);
                return user;

            }
        }
    }

    async login(data) {

        let { email, password } = data;
        let errors: { message: string; }[] = [];

        if (!email || !password) {
            errors.push({ message: "Please enter all fields" });
            return errors;
        }

        if (!this.emailIsValid(email)) {
            errors.push({ message: "Please enter a valid email address" })
        }

        if (password.length < 6) {
            errors.push({ message: "Password should be atleast 6 characters" });
        }

        if (errors.length > 0) {
            return errors;
        } else {
            let user = await this.userService.findByEmail(email);
            if (user) {
                const match = await bcrypt.compare(password, user.password);

                if (match) {

                    const token = jwt.sign({ user }, 'secret', { expiresIn: '1h' });
                    return token;

                } else {
                    return { message: "Password Incorrect" };
                }
            } else {
                return { message: 'no user found' };

            }

        }

    }

    emailIsValid(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

}
