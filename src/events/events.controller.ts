import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Event } from './entities/event.entity';
import { EventsService } from './events.service';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces';

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
}
