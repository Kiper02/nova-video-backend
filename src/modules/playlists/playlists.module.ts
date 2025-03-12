import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsResolver } from './playlists.resolver';
import { VideoModule } from '../video/video.module';

@Module({
  providers: [PlaylistsResolver, PlaylistsService],
  imports: [VideoModule]
})
export class PlaylistsModule {}
