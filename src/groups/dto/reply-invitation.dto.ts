import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MemberStatus } from '../entities';

export class ReplyInvitationDto {
    @ApiProperty({
        enum: [MemberStatus.ACCEPTED, MemberStatus.REJECTED],
        description: 'Possible replies',
    })
    @IsIn([MemberStatus.ACCEPTED, MemberStatus.REJECTED])
    status: string;
}
