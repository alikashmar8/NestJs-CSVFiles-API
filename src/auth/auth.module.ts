import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    // imports:[UsersService],
    imports:[
        TypeOrmModule.forFeature([User])
      ],
    providers: [AuthService, UsersService],
    controllers: [AuthController]
})
export class AuthModule {

}
