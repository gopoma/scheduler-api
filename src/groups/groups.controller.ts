import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { GroupsService } from './groups.service';

import { CreateGroupDto, UpdateGroupDto, AddMemberDto, ReplyInvitationDto } from './dto';

import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @Post()
    @Auth(ValidRoles.user)
    create(
        @Body() createGroupDto: CreateGroupDto,
        @GetUser() user: User
    ) {
        return this.groupsService.create(createGroupDto, user);
    }

    @Get(':idGroup')
    @Auth(ValidRoles.user)
    findOne(
        @Param('idGroup', ParseUUIDPipe) idGroup: string,
        @GetUser() user: User
    ) {
        return this.groupsService.findOne(idGroup, user);
    }

    @Patch(':idGroup')
    @Auth(ValidRoles.user)
    update(
        @Param('idGroup', ParseUUIDPipe) idGroup: string,
        @Body() updateGroupDto: UpdateGroupDto,
        @GetUser() user: User
    ) {
        return this.groupsService.update(idGroup, updateGroupDto, user);
    }

    @Delete(':idGroup')
    @Auth(ValidRoles.user)
    remove(
        @Param('idGroup', ParseUUIDPipe) idGroup: string,
        @GetUser() user: User
    ) {
        return this.groupsService.remove(idGroup, user);
    }

    @Post(':idGroup/members')
    @Auth(ValidRoles.user)
    addMember(
        @Param('idGroup', ParseUUIDPipe) idGroup: string,
        @Body() addMemberDto: AddMemberDto,
        @GetUser() user: User
    ) {
        return this.groupsService.addMember(idGroup, addMemberDto, user);
    }

    @Post(':idGroup/members/replies')
    @Auth(ValidRoles.user)
    replyParticipation(
        @Param('idGroup', ParseUUIDPipe) idGroup: string,
        @Body() replyInvitationDto: ReplyInvitationDto,
        @GetUser() user: User
    ) {
        // return this.groupsService.replyInvitation(idGroup, replyInvitationDto, user);
    }

    @Get('events/invitations/me')
    @Auth(ValidRoles.user)
    getMyInvitations(@GetUser() user: User) {
        // return this.groupsService.getMyInvitations(user);
    }
}
