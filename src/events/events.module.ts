import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from './entities';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [EventsController],
    providers: [EventsService],
    imports: [TypeOrmModule.forFeature([Event]), AuthModule],
    exports: [EventsService, TypeOrmModule],
})
export class EventsModule { }
