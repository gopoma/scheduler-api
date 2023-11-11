import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsDateString()
    @MinLength(1)
    start: string;

    @ApiProperty()
    @IsDateString()
    @MinLength(1)
    end: string;
}
