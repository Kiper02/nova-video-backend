import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlaylistsService } from './playlists.service';
import { PlaylistInput } from './inputs/playlist.input';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import { PlaylistModel } from './models/playlist.model';

@Resolver('Playlist')
export class PlaylistsResolver {
  public constructor(private readonly playlistsService: PlaylistsService) {}

  @Authorization()
  @Mutation(() => Boolean)
  public async create(
    @Args('data') input: PlaylistInput,
    @Authorized('id') userId: string,
  ) {
    return await this.playlistsService.create(userId, input);
  }

  @Query(() => PlaylistModel, {name: 'findByChannel'})
  public async findByChannel(
    @Args('data') channelId: string
  ) {
    return await this.playlistsService.findByChannel(channelId);
  }

  @Authorization()
  @Mutation(() => Boolean, {name: "addPlaylistToUser"})
  public async addToUser(
    @Authorized('id') userId: string,
    @Args('data') playlistId: string
  ) {
    return await this.playlistsService.addToUser(userId, playlistId);
  }
}
