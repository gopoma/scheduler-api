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

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

import { Event, Participant, Todo } from './entities';
import { User } from '../auth/entities/user.entity';
import { AddParticipantDto, CreateTodoDto, UpdateTodoDto } from './dto';
import { ParticipantStatus } from './entities/participant';
import { ReplyParticipationDto } from './dto/reply-participation';

@Injectable()
export class EventsService {
    private readonly logger = new Logger('EventsService');

    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,

        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,

        @InjectRepository(Participant)
        private readonly participantRepository: Repository<Participant>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly dataSource: DataSource,
    ) { }

    async create(createEventDto: CreateEventDto, user: User) {
        if((new Date(createEventDto.start)) > (new Date(createEventDto.end)))
            throw new BadRequestException(`'start' date doesn't have to be after 'end' date`);

        try {
            const event = this.eventRepository.create({
                ...createEventDto,
                user
            });

            await this.eventRepository.save(event);

            return event;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async findOne(idEvent: string, user: User) {
        await this.checkAuthority(idEvent, user);

        const event = await this.eventRepository.findOneBy({ id: idEvent });

        return event;
    }

    async update(idEvent: string, updateEventDto: UpdateEventDto, user: User) {
        await this.checkAuthority(idEvent, user);

        const event = await this.eventRepository.preload({ id: idEvent, ...updateEventDto });

        if((new Date(event.start)) > (new Date(event.end)))
            throw new BadRequestException(`'start' date doesn't have to be after 'end' date`);

        // Create query runner
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            event.user = user;

            await queryRunner.manager.save(event);

            await queryRunner.commitTransaction();
            await queryRunner.release();

            return event;
        } catch(error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();

            this.handleDBExceptions(error);
        }
    }

    async remove(idEvent: string, user: User) {
        await this.checkAuthority(idEvent, user);

        const event = await this.eventRepository.findOneBy({ id: idEvent });
        await this.eventRepository.remove(event);
    }

    async createTodo(idEvent: string, createTodoDto: CreateTodoDto, user: User) {
        await this.checkAuthority(idEvent, user);

        try {
            const event = await this.eventRepository.findOneBy({ id: idEvent });

            const todo = this.todoRepository.create({
                ...createTodoDto,
                event
            });

            await this.todoRepository.save(todo);

            return todo;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async updateTodo(idEvent: string, idTodo: string, updateTodoDto: UpdateTodoDto, user: User) {
        await this.checkAuthority(idEvent, user);

        const todo = await this.todoRepository.preload({ id: idTodo, ...updateTodoDto });

        if (!todo) throw new NotFoundException(`Todo with 'id' ${idTodo} not found`);

        // Create query runner
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(todo);

            await queryRunner.commitTransaction();
            await queryRunner.release();

            return todo;
        } catch(error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();

            this.handleDBExceptions(error);
        }
    }

    async removeTodo(idEvent: string, idTodo: string, user: User) {
        await this.checkAuthority(idEvent, user);

        const todo = await this.todoRepository.findOneBy({ id: idTodo });

        if (!todo) throw new NotFoundException(`Todo with 'id' ${idTodo} not found`);

        await this.todoRepository.remove(todo);
    }

    async getMyEvents(user: User) {
        const events = await this.eventRepository.find({
            where: {
                user: {
                    id: user.id
                }
            }
        });

        return events;
    }

    async addParticipant(idEvent: string, { idUser }: AddParticipantDto, user: User) {
        await this.checkAuthority(idEvent, user);

        if(idUser === user.id) throw new BadRequestException('You can\'t invite yourself');

        const guest = await this.userRepository.findOneBy({ id: idUser });
        if(!guest) throw new BadRequestException(`User with 'id' ${idUser} not found`);

        const invitation = await this.participantRepository.findOneBy({
            event: {
                id: idEvent
            },
            user: {
                id: idUser
            }
        });

        if(invitation) {
            if(invitation.status === ParticipantStatus.ACCEPTED) {
                throw new BadRequestException('User already invited [Accepted]');
            } else if(invitation.status === ParticipantStatus.REJECTED) {
                await this.participantRepository.remove(invitation);
            } else if(invitation.status === ParticipantStatus.UNREPLIED) {
                throw new BadRequestException('User already invited [Waiting for reply...]');
            }
        }

        const newInvitation = this.participantRepository.create({
            event: { id: idEvent },
            user: { id: idUser }
        });

        await this.participantRepository.save(newInvitation);

        return newInvitation;
    }

    async replyParticipation(idEvent: string, replyParticipationDto: ReplyParticipationDto, user: User) {
        const invitation = await this.participantRepository.findOneBy({
            event: { id: idEvent },
            user: { id: user.id }
        });

        if(!invitation)
            throw new BadRequestException('Invitation not found');

        if(invitation.status !== ParticipantStatus.UNREPLIED)
            throw new NotAcceptableException('You\'ve already replied that invitation');

        invitation.status = replyParticipationDto.status as ParticipantStatus;
        await this.participantRepository.save(invitation);
    }

    private async checkAuthority(idEvent: string, user: User) {
        const event = await this.eventRepository.findOneBy({ id: idEvent });

        if (!event) throw new NotFoundException(`Event with 'id' ${idEvent} not found`);

        if(event.user.id !== user.id) throw new ForbiddenException(`You can't modify an event that isn't under your authority`)
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
