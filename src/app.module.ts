import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { EventsModule } from './events/events.module';
import { GroupsModule } from './groups/groups.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [EnvConfiguration],
            validationSchema: JoiValidationSchema,
        }),

        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            autoLoadEntities: true,
            synchronize: true,
        }),

        AuthModule,

        SeedModule,

        EventsModule,

        GroupsModule,

        UsersModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
