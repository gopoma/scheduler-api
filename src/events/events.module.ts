import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event, Todo, Participant } from './entities';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [EventsController],
    providers: [EventsService],
    imports: [TypeOrmModule.forFeature([Event, Todo, Participant]), AuthModule],
    exports: [EventsService, TypeOrmModule],
})
export class EventsModule { }
