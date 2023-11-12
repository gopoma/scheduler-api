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

    @ApiProperty({
        example: '2023-11-11T02:10:25.954Z',
        description: 'When the Event starts',
    })
    @IsDateString()
    @MinLength(1)
    start: string;

    @ApiProperty({
        example: '2023-11-11T02:16:25.954Z',
        description: 'When the Event ends',
    })
    @IsDateString()
    @MinLength(1)
    end: string;
}
