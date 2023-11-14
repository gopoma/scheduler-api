import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotAcceptableException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

import { Group, Member, MemberStatus } from './entities';
import { User } from '../auth/entities/user.entity';
import { AddMemberDto, ReplyInvitationDto } from './dto';

@Injectable()
export class GroupsService {
    private readonly logger = new Logger('GroupsService');

    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,

        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly dataSource: DataSource,
    ) { }

    async create(createGroupDto: CreateGroupDto, user: User) {
        try {
            const group = this.groupRepository.create({
                ...createGroupDto,
                user
            });

            await this.groupRepository.save(group);

            return group;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async findOne(idGroup: string, user: User) {
        const group = await this.groupRepository.findOne({
            relations: {
                members: {
                    user: true
                },
                user: true
            },
            where: {
                id: idGroup
            }
        });

        if (!group) throw new NotFoundException(`Group with 'id' ${idGroup} not found`);

        const group_invitation = await this.memberRepository.findOneBy({
            group: {
                id: idGroup,
            },
            user: {
                id: user.id
            },
            status: In([MemberStatus.ACCEPTED, MemberStatus.UNREPLIED])
        });

        const isAuthor = group.user.id === user.id;
        const hasInvitation = !!group_invitation;

        if(!isAuthor && !hasInvitation)
            throw new ForbiddenException(`To access the group, you need to be a member of it.`);

        return group;
    }

    async update(idGroup: string, updateGroupDto: UpdateGroupDto, user: User) {
        await this.checkAuthority(idGroup, user);

        const group = await this.groupRepository.preload({ id: idGroup, ...updateGroupDto });

        // Create query runner
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            group.user = user;

            await queryRunner.manager.save(group);

            await queryRunner.commitTransaction();
            await queryRunner.release();

            return group;
        } catch(error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();

            this.handleDBExceptions(error);
        }
    }

    async remove(idGroup: string, user: User) {
        await this.checkAuthority(idGroup, user);

        const group = await this.groupRepository.findOneBy({ id: idGroup });
        await this.groupRepository.remove(group);
    }

    async addMember(idGroup: string, { idUser }: AddMemberDto, user: User) {
        await this.checkAuthority(idGroup, user);

        if(idUser === user.id) throw new BadRequestException('You can\'t invite yourself');

        const guest = await this.userRepository.findOneBy({ id: idUser });
        if(!guest) throw new BadRequestException(`User with 'id' ${idUser} not found`);

        const invitation = await this.memberRepository.findOneBy({
            group: {
                id: idGroup
            },
            user: {
                id: idUser
            }
        });

        if(invitation) {
            if(invitation.status === MemberStatus.ACCEPTED) {
                throw new BadRequestException('User already invited [Accepted]');
            } else if(invitation.status === MemberStatus.REJECTED) {
                await this.memberRepository.remove(invitation);
            } else if(invitation.status === MemberStatus.UNREPLIED) {
                throw new BadRequestException('User already invited [Waiting for reply...]');
            }
        }

        const newInvitation = this.memberRepository.create({
            group: { id: idGroup },
            user: { id: idUser }
        });

        await this.memberRepository.save(newInvitation);

        return newInvitation;
    }

    async replyInvitation(idGroup: string, replyInvitationDto: ReplyInvitationDto, user: User) {
        const invitation = await this.memberRepository.findOneBy({
            group: { id: idGroup },
            user: { id: user.id }
        });

        if(!invitation)
            throw new BadRequestException('Invitation not found');

        if(invitation.status !== MemberStatus.UNREPLIED)
            throw new NotAcceptableException('You\'ve already replied that invitation');

        invitation.status = replyInvitationDto.status as MemberStatus;
        await this.memberRepository.save(invitation);
    }

    async getMyInvitations(user: User) {
        const invitations = await this.memberRepository.find({
            relations: {
                group: true,
            },
            where: {
                user: { id: user.id }
            }
        });

        return invitations;
    }

    async getMyGroups(user: User) {
        let groups = await this.groupRepository.find({
            relations: {
                members: {
                    user: true
                },
                user: true
            },
            where: {
                user: {
                    id: user.id
                }
            }
        });

        const group_invitations = await this.memberRepository.find({
            relations: {
                group: {
                    members: {
                        user: true
                    },
                    user: true
                }
            },
            where: {
                user: {
                    id: user.id
                },
                status: MemberStatus.ACCEPTED
            }
        });

        groups = [
            ...groups,
            ...group_invitations.map(invitation => invitation.group)
        ];

        return groups;
    }

    private async checkAuthority(idGroup: string, user: User) {
        const group = await this.groupRepository.findOne({
            relations: {
                user: true
            },
            where: {
                id: idGroup
            }
        });

        if (!group) throw new NotFoundException(`Group with 'id' ${idGroup} not found`);

        if(group.user.id !== user.id) throw new ForbiddenException(`You can't modify an group that isn't under your authority`)
    }

    private handleDBExceptions(error: any) {
        if (error.code === '23505') throw new BadRequestException(error.detail);

        this.logger.error(error);
        // console.log(error)
        throw new InternalServerErrorException(
            'Unexpected error, check server logs',
        );
    }
}
