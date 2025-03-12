import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { VideoInput } from './inputs/video.input';
import { StorageService } from '../libs/storage/storage.service';
import sharp from 'sharp';
import Ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';

@Injectable()
export class VideoService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  public async create(userId: string, input: VideoInput) {
    const { name, video, description, playlistId } = input;

    const fileName = `/channel/videos/${userId}.mp4`;
    const ext = video.filename.split('.')[1];
    const initResult = await this.storageService.initUpload(
      fileName,
      'video/mp4',
    );

    const uploadId = initResult.UploadId;
    let partNumber = 1;
    let etags: string[] = [];

    for await (const chunk of video.createReadStream()) {
      const passThrough = new PassThrough();

      Ffmpeg()
        .inputOptions('-f', ext)
        .input('pipe')
        .outputOptions('-f', 'mp4')
        .outputOptions('-vcodec', 'libx264')
        .outputOptions('-c:a', 'aac')
        .output(passThrough)
        .on('end', async () => {
          try {
            const buffer = await this.getBufferFromStream(passThrough);
            await this.storageService.uploadChanks(
              fileName,
              partNumber,
              uploadId,
              buffer,
            );
            etags.push(await this.storageService.getEtag(fileName, partNumber));
            partNumber++;
          } catch (error) {
            throw new InternalServerErrorException(
              'Не удалось загрузить фрагмент видео',
            );
          }
        })
        .on('error', (err) => {
          throw new InternalServerErrorException('Не удалось обработать видео');
        })
        .run();
      chunk.pipe(passThrough);
    }

    await this.storageService.completeUpload(fileName, uploadId, etags);

    await this.prismaService.video.create({
      data: {
        name,
        fileName,
        description,
        playlistId,
      },
    });

    return true;
  }

  public async deleteByPlaylistId(playlistId: string) {

    const videos = await this.prismaService.video.findMany({
      where: {
        playlistId
      }
    })

    for(const video of videos) {
      await this.storageService.remove(video.fileName);
    }

    await this.prismaService.video.deleteMany({
      where: {
        playlistId,
      },
    });

    return true;
  }

  public async delete(id: string) {
    const video = await this.prismaService.video.findUnique({
      where: {
        id,
      },
    });

    if (!video) {
      throw new NotFoundException('Видео не найдено');
    }

    await this.prismaService.video.delete({
      where: {
        id,
      },
    });

    await this.storageService.remove(video.fileName);

    return true;
  }

  private async getBufferFromStream(stream: PassThrough): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      stream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });
  }
}
