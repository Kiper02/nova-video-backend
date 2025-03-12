import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PlaylistInput } from './inputs/playlist.input';
import { VideoService } from '../video/video.service';

@Injectable()
export class PlaylistsService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly videoService: VideoService,
    ) {} 

    public async create(userId: string, input: PlaylistInput) {
        const { name, channelId } = input;
        const existingPlaylist = await this.prismaService.playlist.findFirst({
            where: {
                name,
                channel: {
                    userId,
                    id: channelId
                }
            }
        })

        if(existingPlaylist) {
            throw new ConflictException("Плэйлист с таким названием уже существует")
        }

        await this.prismaService.playlist.create({
            data: {
                name, 
                channelId
            }
        }) 
        return true;
    }

    public async findByChannel(channelId: string) {
        const playlists = await this.prismaService.playlist.findMany({
            where: {
                channelId
            }
        })

        return playlists
    }

    public async delete(playlistId: string, channelId: string, userId: string) {
        await this.videoService.deleteByPlaylistId(playlistId);
        await this.prismaService.playlist.delete({
            where: {
                id: playlistId,
                channel: {
                    id: channelId,
                    userId
                }
            }
        })
        return true;
    }

    public async addToUser(userId: string, playlistId: string) {
        const existingPlaylist = await this.prismaService.playlist.findUnique({
            where: {
                id: playlistId
            }
        })

        if(!existingPlaylist) {
            throw new NotFoundException("Плэйлист не найден");
        }

        await this.prismaService.userPlaylist.create({
            data: {
                userId,
                playlistId
            }
        })

        return true;
    }
}
