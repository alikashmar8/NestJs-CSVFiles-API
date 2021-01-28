import {Length, IsEmail, IsNotEmpty} from 'class-validator';

export class UserDto{

    @IsNotEmpty()
    name: string;
    
    @IsEmail()
    email: string;
    
    @Length(6)
    password: string;
}
