import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ChannelModel } from './models/channel.model';
import { StorageService } from '../libs/storage/storage.service';
import { ChannelInput } from './inputs/channel.input';
import { User } from '@prisma/client';
import * as sharp from 'sharp';

@Injectable()
export class ChannelService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly storageService: StorageService,
    ) {}

    public async create(userId: string, name: string) {

        const isExistChannel = await this.prismaService.channel.findFirst({
            where: {
                userId
            }
        })

        if(isExistChannel) {
            throw new ConflictException("Канал уже существует");
        }

        const channel = await this.prismaService.channel.create({
            data: {
                name, 
                userId
            }
        })
        return channel;
    }

    public async findByUser(userId: string) {
        return await this.prismaService.channel.findFirst({
            where: {
                userId
            }
        })
    }


    public async update(userId: string, input: ChannelInput) {
        const { name, banner } = input;
        const channel = await this.prismaService.channel.findFirst({
            where: {
                userId: userId
            }
        })
        if(!channel) {
            throw new NotFoundException("Канал не найден")
        }
        if(channel.banner) {
            await this.storageService.remove(channel.banner); 
        }
        const chunks: Buffer[] = [];

        for await (const chunk of banner.createReadStream()) {
            chunks.push(chunk)
        }

        const buffer = Buffer.concat(chunks);
        const fileName = `/channels/${userId}.webp`;
        
        if(banner.filename && banner.filename.endsWith(".gif")) {
            const processedBuffer = await sharp(buffer, {animated: true}).resize(512, 512).webp().toBuffer();

            await this.storageService.upload(processedBuffer, fileName, `image/webp`);
        } else {
            const processedBuffer = await sharp(buffer).resize(512, 512).webp().toBuffer();

            await this.storageService.upload(processedBuffer, fileName, `image/webp`);
        }

        await this.prismaService.channel.update({
            where: {
                id: channel.id
            },
            data: {
                name,
                banner: fileName
            }
        })

        return true;
    }
}
