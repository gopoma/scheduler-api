import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../auth/entities/user.entity';

@Entity('events')
export class Event {
    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Event ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Codeforces workout',
        description: 'Event Title',
    })
    @Column('text')
    title: string;

    @ApiProperty()
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @ApiProperty({
        example: '2023-11-11T02:10:25.954Z',
        description: 'When the Event starts',
    })
    @Column('timestamptz')
    start: Date;

    @ApiProperty({
        example: '2023-11-11T02:16:25.954Z',
        description: 'When the Event ends',
    })
    @Column('timestamptz')
    end: Date;

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.event, { eager: true })
    user: User;
}
