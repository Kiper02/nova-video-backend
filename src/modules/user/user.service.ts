import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import type { UserInput } from './inputs/user.input';
import { hash } from 'argon2';
import { ChannelService } from '../channel/channel.service';

@Injectable()
export class UserService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly channelService: ChannelService,
    ) {}

    public async create(input: UserInput) {
        const { email, username, password } = input;

        const isExistUser = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    {username},
                    {password}
                ]
            }
        })

        if(isExistUser) {
            throw new ConflictException("Пользователь уже существует");
        }

        const user = await this.prismaService.user.create({
            data: {
                email,
                password: await hash(password),
                username,
                displayName: username
            }
        })
        await this.channelService.create(user.id, user.username);
        return user
    }

    public async getById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })
    }

    public async findAll() {
        return await this.prismaService.user.findMany();
    }
}
