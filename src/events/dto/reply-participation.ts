import { ApiProperty } from '@nestjs/swagger';
import { ParticipantStatus } from '../entities';
import { IsIn } from 'class-validator';


export class ReplyParticipationDto {
    @ApiProperty()
    @IsIn([ParticipantStatus.ACCEPTED, ParticipantStatus.REJECTED])
    status: string;
}
