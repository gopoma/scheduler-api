import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Group } from "./";
import { User } from '../../auth/entities/user.entity';

export enum MemberStatus {
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    UNREPLIED = "unreplied",
}

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

    @Column({
        type: "enum",
        enum: MemberStatus,
        default: MemberStatus.UNREPLIED,
    })
    status: MemberStatus;
}
