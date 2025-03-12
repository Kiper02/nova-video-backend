import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MailService } from 'src/modules/libs/mail/mail.service';
import { VerificationInput } from './inputs/verification.input';
import { TokenType, User } from '@prisma/client';
import { saveSession } from 'src/shared/utils/session.util';
import generateToken from 'src/shared/utils/generate-token.util';

@Injectable()
export class VerificationService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService
    ) {}

    public async verify(req: Request, input: VerificationInput) {
        const { token } = input;
    
        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.EMAIL_VERIFY
            }
        })

        if(!existingToken) {
            throw new NotFoundException("Токен не найден")
        }

        const hasExpired = existingToken.expiresAt < new Date();

        if(hasExpired) {
            throw new BadRequestException("Токен истёк");
        }

        const user = await this.prismaService.user.update({
            where: {
                id: existingToken.userId
            },
            data: {
                isEmailVerified: true
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.EMAIL_VERIFY
            }
        })
        await saveSession(req, user);
        return true;
    }

    public async sendVerificationToken(user: User) {
        const verificationToken = await generateToken(this.prismaService, user, TokenType.EMAIL_VERIFY, true);
        await this.mailService.sendVerificationToken(user.email, verificationToken.token)
        return true;
    }
}
