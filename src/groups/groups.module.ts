import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AuthModule } from './../auth/auth.module';

import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

import { Group, Member } from './entities';

@Module({
    controllers: [GroupsController],
    providers: [GroupsService],
    imports: [
        TypeOrmModule.forFeature([Group, Member]),
        AuthModule,
    ],
    exports: [
        GroupsService,
        TypeOrmModule,
    ]
})
export class GroupsModule { }
