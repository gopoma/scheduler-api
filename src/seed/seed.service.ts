import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async runSeed() {
        await this.deleteTables();

        await this.insertUsers();

        return 'SEED EXECUTED 🌱🪴';
    }

    private async deleteTables() {
        const queryBuilder = this.userRepository.createQueryBuilder();
        await queryBuilder.delete().where({}).execute();
    }

    private async insertUsers() {
        const seedUsers = initialData.users;

        const users: User[] = [];

        seedUsers.forEach((user) => {
            users.push(this.userRepository.create(user));
        });

        //? Need an admin/superuser to do something?
        const dbUsers = await this.userRepository.save(seedUsers);

        return dbUsers[0];
    }
}
