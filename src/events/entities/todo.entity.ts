import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Event } from './';

@Entity('todos')
export class Todo {
    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Todo ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column('text')
    description: string;

    @ApiProperty()
    @Column('bool', {
        default: false,
    })
    done: boolean;



    @ManyToOne(
        () => Event,
        (event) => event.todos,
        {  onDelete: 'CASCADE' }
    )
    event: Event;
}
