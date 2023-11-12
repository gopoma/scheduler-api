import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Event, Todo } from './entities';
import { EventsService } from './events.service';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces';
import { CreateTodoDto, UpdateTodoDto } from './dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @Auth(ValidRoles.user)
    @ApiResponse({
        status: 201,
        description: 'Event was created',
        type: Event,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
    create(
        @Body() createEventDto: CreateEventDto,
        @GetUser() user: User
    ) {
        return this.eventsService.create(createEventDto, user);
    }

    @Get(':idEvent')
    @Auth(ValidRoles.user)
    findOne(
        @Param('idEvent', ParseUUIDPipe) idEvent: string,
        @GetUser() user: User
    ) {
        return this.eventsService.findOne(idEvent, user);
    }

    @Patch(':idEvent')
    @Auth(ValidRoles.user)
    update(
        @Param('idEvent', ParseUUIDPipe) idEvent: string,
        @Body() updateEventDto: UpdateEventDto,
        @GetUser() user: User
    ) {
        return this.eventsService.update(idEvent, updateEventDto, user);
    }

    @Delete(':idEvent')
    @Auth(ValidRoles.user)
    remove(
        @Param('idEvent', ParseUUIDPipe) idEvent: string,
        @GetUser() user: User
    ) {
        return this.eventsService.remove(idEvent, user);
    }

    @Post(':idEvent/todos')
    @Auth(ValidRoles.user)
    @ApiResponse({
        status: 201,
        description: 'Todo was created',
        type: Todo,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
    createTodo(
        @Param('idEvent', ParseUUIDPipe) idEvent: string,
        @Body() createTodoDto: CreateTodoDto,
        @GetUser() user: User
    ) {
        return this.eventsService.createTodo(idEvent, createTodoDto, user);
    }

    @Patch(':idEvent/todos/:idTodo')
    @Auth(ValidRoles.user)
    updateTodo(
        @Param('idEvent', ParseUUIDPipe) idEvent: string,
        @Param('idTodo', ParseUUIDPipe) idTodo: string,
        @Body() updateTodoDto: UpdateTodoDto,
        @GetUser() user: User
    ) {
        return this.eventsService.updateTodo(idEvent, idTodo, updateTodoDto, user);
    }

    @Delete(':idEvent/todos/:idTodo')
    @Auth(ValidRoles.user)
    removeTodo(
        @Param('idEvent', ParseUUIDPipe) idEvent: string,
        @Param('idTodo', ParseUUIDPipe) idTodo: string,
        @GetUser() user: User
    ) {
        return this.eventsService.removeTodo(idEvent, idTodo, user);
    }
}
