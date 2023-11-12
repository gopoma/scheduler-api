import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

import { Event, Todo } from './entities';
import { User } from '../auth/entities/user.entity';
import { CreateTodoDto, UpdateTodoDto } from './dto';

@Injectable()
export class EventsService {
    private readonly logger = new Logger('EventsService');

    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,

        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,

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
