import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserInput } from '../user/inputs/user.input';
import { UserService } from '../user/user.service';
import type { Request, Response } from 'express';
import { destroySession, saveSession } from 'src/shared/utils/session.util';
import { LoginInput } from './inputs/login.input';
import { ConfigService } from '@nestjs/config';
import { RegisterInput } from './inputs/register.input';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly configService: ConfigService
    ) {}


    public async register(req: Request, input: RegisterInput) {
        const user = await this.userService.create(input);
        await saveSession(req, user);
        return true;
    }

    public async login(req: Request, input: LoginInput) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: input.email
            }
        })
    
        if (!user) {
            throw new NotFoundException("Пользователя не существует");
        }
    
        const isValidPassword = await verify(user.password, input.password);
        if (!isValidPassword) {
            throw new BadRequestException("Неверный пароль");
        }
    
        await saveSession(req, user);
        return true;
    }
    
    public async logout(req: Request, res: Response) {
        await destroySession(req, res, this.configService);
        return true;
    }
}
