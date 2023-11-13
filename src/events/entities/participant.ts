import {
    Column,
    Entity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Event } from './';
import { User } from '../../auth/entities/user.entity';

export enum ParticipantStatus {
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    UNREPLIED = "unreplied",
}

@Entity('participants')
export class Participant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: () => Event })
    @ManyToOne(
        () => Event,
        (event) => event.participants,
        {  onDelete: 'CASCADE' }
    )
    event: Event;

    @ManyToOne(
        () => User,
        (user) => user.events,
        {  onDelete: 'CASCADE' }
    )
    user: User;

    @ApiProperty({
        enum: ParticipantStatus,
        description: "Invitation Status"
    })
    @Column({
        type: "enum",
        enum: ParticipantStatus,
        default: ParticipantStatus.UNREPLIED,
    })
    status: ParticipantStatus;
}
