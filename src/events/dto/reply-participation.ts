import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ParticipantStatus } from '../entities';

export class ReplyParticipationDto {
    @ApiProperty({
        enum: [ParticipantStatus.ACCEPTED, ParticipantStatus.REJECTED],
        description: 'Possible replies',
    })
    @IsIn([ParticipantStatus.ACCEPTED, ParticipantStatus.REJECTED])
    status: string;
}
