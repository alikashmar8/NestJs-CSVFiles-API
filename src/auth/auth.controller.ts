import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserDto } from 'src/users/userDto';
import { UserLoginDto } from 'src/users/userLoginDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() data: UserLoginDto) {
        return await this.authService.login(data)
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    async register(@Body() data: UserDto) {
        return await this.authService.register(data)
    }

}
