import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Event, Participant } from '../../events/entities';
import { Group, Member } from '../../groups/entities';

@Entity('users')
export class User {
    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'User ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Diego Huamani Luque',
        description: 'User Name',
    })
    @Column('text')
    name: string;

    @ApiProperty({
        example: 'dhuamanilu@unsa.edu.pe',
        description: 'User Email',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    email: string;

    @Column('text', {
        select: false,
    })
    password: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: ['user'],
    })
    roles: string[];



    @OneToMany(
        () => Event,
        (event) => event.user,
    )
    events: Event[];

    @OneToMany(
        () => Participant,
        (participant) => participant.user,
    )
    event_invitations: Participant[];

    @OneToMany(
        () => Group,
        (group) => group.user,
    )
    groups: Group[];

    @OneToMany(
        () => Member,
        (member) => member.user,
    )
    group_invitations: Member[];



    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
