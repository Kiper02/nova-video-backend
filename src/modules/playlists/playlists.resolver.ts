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
  @Mutation(() => Boolean, {name: 'createPlaylist'})
  public async create(
    @Args('data') input: PlaylistInput,
    @Authorized('id') userId: string,
  ) {
    return await this.playlistsService.create(userId, input);
  }

  @Authorization()
  @Query(() => [PlaylistModel], {name: 'findByUser'})
  public async findByUser(
    @Authorized('id') userId: string
  ) {
    return await this.playlistsService.findByUser(userId);
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
