import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ValidRoles } from '../auth/interfaces';
import { Auth } from '../auth/decorators';

import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) { }

    //! uncomment only before deploy
    // @Get()
    // @Auth(ValidRoles.superUser) //! comment only before deploy
    // executeSeed() {
    //     return this.seedService.runSeed();
    // }
}
