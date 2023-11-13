import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { GroupsService } from './groups.service';

import { CreateGroupDto, UpdateGroupDto, AddMemberDto, ReplyInvitationDto } from './dto';

import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces';

@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @Post()
    create(@Body() createGroupDto: CreateGroupDto) {
        return this.groupsService.create(createGroupDto);
    }

    @Get()
    findAll() {
        return this.groupsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.groupsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
        return this.groupsService.update(+id, updateGroupDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.groupsService.remove(+id);
    }
}
