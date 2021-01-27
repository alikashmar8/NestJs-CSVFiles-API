import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        private usersService: UsersService
    ){}

    @Get(':id')
    @UseGuards(new AuthGuard())
    findById(@Param('id') id){
        return this.usersService.findById(id);
    }

    @Patch(':id')
    @UseGuards(new AuthGuard())
    update(@Body() data: any, @Param('id') id,@Req() req){
        return this.usersService.update(id, data, req.token.user);
    }


    // @Post('register')
    // async register(@Body() data,@Res() res) {
    //      await this.usersService.register(data,res)
    // }

    // @Post('login')
    // async login(@Body() data,@Res() res) {
    //      await this.usersService.login(data,res)
    // }
}
