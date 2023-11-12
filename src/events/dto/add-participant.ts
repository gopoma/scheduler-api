import { IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class AddParticipantDto {
    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'User ID',
    })
    @IsUUID()
    idUser: string;
}
