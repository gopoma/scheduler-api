import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { SearchUserDto } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('search')
    @Auth(ValidRoles.user)
    @ApiResponse({
        status: 200,
        isArray: true,
        type: User,
    })
    search(@Query() searchUserDto: SearchUserDto) {
        return this.usersService.search(searchUserDto);
    }
}
