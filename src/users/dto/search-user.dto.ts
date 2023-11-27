import { IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SearchUserDto {
    @ApiProperty({
        example: 'Diego Huamani Luque',
        description: 'New User Name',
        required: false,
    })
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 'dhuamanilu@unsa.edu.pe',
        description: 'New User Email',
        required: false,
    })
    @IsOptional()
    email?: string;
}
