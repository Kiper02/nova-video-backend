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
import { v4 } from 'uuid';
import { MailService } from '../libs/mail/mail.service';
import generateToken from 'src/shared/utils/generate-token.util';
import { TokenType } from '@prisma/client';
import { VerificationService } from './verification/verification.service';

@Injectable()
export class AuthService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly verificationService: VerificationService,

    ) {}


    public async register(input: RegisterInput) {
        const user = await this.userService.create(input);
        await this.verificationService.sendVerificationToken(user);
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

        if(!user.isEmailVerified) {
            throw new BadRequestException("Аккаунт не верифицирован. Пожалуйста, проверьте свою почту для подтверждения");
        }
    
        await saveSession(req, user);
        return true;
    }
    
    public async logout(req: Request, res: Response) {
        await destroySession(req, res, this.configService);
        return true;
    }
}
