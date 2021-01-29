import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from 'src/users/userDto';
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
    update(@Body() data: UserDto, @Param('id') id,@Req() req){
        return this.usersService.update(id, data, req.token.user);
    }

}
