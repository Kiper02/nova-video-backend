import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { IUserData } from './types/user-data.type';
import { saveSession } from 'src/shared/utils/session.util';
import { Request } from 'express';

@Injectable()
export class OauthService {
    public constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
    ){} 

    public async findProviderUrl(){
        const url = `${this.configService.getOrThrow<string>("NOVA_OAUTH_CLIENT")}/oauth?client_id=${this.configService.getOrThrow<string>("NOVA_OAUTH_CLIENT_ID")}`
        return url;
    }

    public async code(code: string, req: Request) {
        const url = `${this.configService.getOrThrow<string>("NOVA_OAUTH_API")}/auth/token`
        const urlResourse = `${this.configService.getOrThrow<string>("NOVA_RESOURSE_API")}/user/info`
        const response = await axios.post(url, {code});
        if(!response) {
            throw new InternalServerErrorException("Не удалось обенять код на токены");
        }

        const {accessToken} = response.data;

        const userData: IUserData = await axios.get(urlResourse, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if(!userData) {
            throw new InternalServerErrorException("Не удалось получить информацию о пользователе");
        }

        const user = await this.prismaService.user.create({
            data: {
                email: userData.email,
                password: null,
                avatar: userData.avatar,
                displayName: userData.displayName,
                username: userData.username,
            }
        })
        await saveSession(req, user);
        return true;
    }
}
