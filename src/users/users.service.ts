import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');



@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>
    ) { }

    async update(id: any, data: any, currentUser) {
        if (currentUser.id == id) {
            let { name, email, password } = data;

            let errors: { message: string; }[] = [];
            if (!name || !email || !password) {
                errors.push({ message: "Please enter all fields" });
                return errors
                // res.send(errors)
            }

            if (!this.emailIsValid(email)) {
                errors.push({ message: "Please enter a valid email address" })
            }

            if (password.length < 6) {
                errors.push({ message: "Password should be atleast 6 characters" });
            }

            if (errors.length > 0) {
                // res.send(errors);
                return errors;
            } else {
                let emailCheck: User = await this.findByEmail(email);
               
                if (!emailCheck || emailCheck.email == currentUser.email) {
                    const hash = bcrypt.hashSync(password, 10);
                        data.password = hash;   
                        const u = await this.usersRepository.save({
                            id: id,
                            password: data.password,
                            email: data.email,
                            name: data.name
                        })
                        return u;
                        // res.send(u);
                }else{
                    // res.send()
                    return { message: 'Email already in use!'};
                }
            }
        } else {
            throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
        }
    }


    async findById(id: any) {
        return await this.usersRepository.findOne({ where: { id } });
    }


    async findByEmail(email: string): Promise<User> {
        const user: User = await this.usersRepository.findOne({ email: email })
        return user;
    }

    async store(user: User) {
        const u = await this.usersRepository.create(user);
        await this.usersRepository.save(u).then(r => {
            return u;
        });
    }

    async register(data, res) {
        let { name, email, password } = data;

        let errors: { message: string; }[] = [];
        if (!name || !email || !password) {
            errors.push({ message: "Please enter all fields" });
            res.send(errors);
        }

        if (!this.emailIsValid(email)) {
            errors.push({ message: "Please enter a valid email address" })
        }

        if (password.length < 6) {
            errors.push({ message: "Password should be atleast 6 characters" });
        }

        if (errors.length > 0) {
            res.send(errors);
        } else {
            let user = await this.findByEmail(email);
            if (user) {
                res.send({ message: 'Email already registered!' });
            } else {
                let service = this;
                await bcrypt.hash(password, 10, async function (err: any, hash: string) {
                    if (err) {
                        res.send(err);
                    }
                    let user: User = {
                        id: uuidv4(),
                        email: email,
                        password: hash,
                        name: name,
                        type: 1,
                    }

                    await service.store(user).then(r => {
                        res.send(user);
                    });

                });
            }
        }
    }

    async login(data, res) {

        let { email, password } = data;
        let errors: { message: string; }[] = [];

        if (!email || !password) {
            errors.push({ message: "Please enter all fields" });
            res.send(errors);
            return;
        }

        if (!this.emailIsValid(email)) {
            errors.push({ message: "Please enter a valid email address" })
        }

        if (password.length < 6) {
            errors.push({ message: "Password should be atleast 6 characters" });
        }

        if (errors.length > 0) {
            res.send(errors);
        } else {
            let user = await this.findByEmail(email);
            if (user) {
                bcrypt.compare(password, user.password, function (err: any, result: any) {
                    if (result) {
                        var token = jwt.sign({ user }, 'secret', { expiresIn: '1h' });
                        res.send(token);

                    } else {
                        res.send({ message: "Password Incorrect" });
                    }
                });
            } else {
                res.send({ message: 'no user found' });
            }

        }

    }


    emailIsValid(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }


}
