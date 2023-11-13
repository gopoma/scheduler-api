import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Member } from './';

@Entity('groups')
export class Group {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    image: string;

    @OneToMany(
        () => Member,
        (member) => member.group,
        { cascade: true, eager: true }
    )
    members: Member[];
}

