import {
    IsEmail,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'Diego Huamani Luque',
        description: 'New User Name',
    })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({
        example: 'dhuamanilu@unsa.edu.pe',
        description: 'New User Email',
        uniqueItems: true,
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Xyz123',
        description: 'New User Password',
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number',
    })
    password: string;
}
