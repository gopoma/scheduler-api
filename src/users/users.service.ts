import { User } from 'src/auth/entities/user.entity';
import { SearchUserDto } from './dto/search-user.dto';
import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async search({email, name}: SearchUserDto) {
        const users = await this.userRepository.find({
            where: [
                {email: ILike(`%${email}%`)},
                {name: ILike(`%${name}%`)}
            ]
        });
        return users;
    }
}
