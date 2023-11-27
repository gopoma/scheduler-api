import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { SearchUserDto } from './dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('search')
    search(@Query() searchUserDto: SearchUserDto) {
        return this.usersService.search(searchUserDto);
    }
}
