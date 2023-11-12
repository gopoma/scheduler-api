import { IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class AddParticipantDto {
    @IsUUID()
    idUser: string;
}
