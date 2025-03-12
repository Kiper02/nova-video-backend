import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { VideoService } from './video.service';
import { VideoInput } from './inputs/video.input';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import { Authorization } from 'src/shared/decorators/auth.decorator';

@Resolver('Video')
export class VideoResolver {
  constructor(private readonly videoService: VideoService) {}

  @Authorization()
  @Mutation(() => Boolean, {name: 'addVideo'})
  public async create(
    @Authorized('id') userId: string,
    @Args('data') input: VideoInput 
  ) {
    return await this.videoService.create(userId, input)
  }

  @Mutation(() => Boolean, {name: 'deleteVideo'})
  public async delete(
    @Args('data') videoId: string
  ) {
    return await this.videoService.delete(videoId);
  }


  @Mutation(() => Boolean, {name: 'deleteVideoByPlaylistId'})
  public async deleteByPlaylistId(
    @Args('data') playlistId: string
  ) {
    return await this.videoService.deleteByPlaylistId(playlistId)
  }
}
