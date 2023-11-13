import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Group } from "./";
import { User } from '../../auth/entities/user.entity';

@Entity('members')
export class Member {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => Group,
        (group) => group.members,
        {  onDelete: 'CASCADE' }
    )
    group: Group;

    @ManyToOne(
        () => User,
        (user) => user.groups,
        {  onDelete: 'CASCADE' }
    )
    user: User;
}
