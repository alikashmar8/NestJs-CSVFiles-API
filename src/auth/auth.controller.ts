import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {


    constructor(
        private authService: AuthService,
    ) { }

    

    @Post('login')
    async login(@Body() data){
        return await this.authService.login(data)
    }

    @Post('register')
    async register(@Body() data){
        return await this.authService.register(data)
    }



}
