import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    description: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    done: boolean;
}
