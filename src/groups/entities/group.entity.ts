import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Member } from './';
import { User } from '../../auth/entities/user.entity';

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



    @ManyToOne(
        () => User,
        (user) => user.groups,
        {  onDelete: 'CASCADE' }
    )
    user: User;

    @OneToMany(
        () => Member,
        (member) => member.group,
        { cascade: true, eager: true }
    )
    members: Member[];
}

