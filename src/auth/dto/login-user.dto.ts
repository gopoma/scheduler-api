import {
    IsEmail,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({
        example: 'dhuamanilu@unsa.edu.pe',
        description: 'User Email',
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Xyz123',
        description: 'User Password',
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number',
    })
    password: string;
}
