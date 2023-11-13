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
import { DataSource, Repository } from 'typeorm';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

import { Group } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class GroupsService {
    private readonly logger = new Logger('GroupsService');

    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,

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
        await this.checkAuthority(idGroup, user);

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
