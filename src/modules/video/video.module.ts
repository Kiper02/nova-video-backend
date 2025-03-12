import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoResolver } from './video.resolver';
import { CommentModule } from './comment/comment.module';

@Module({
  providers: [VideoResolver, VideoService],
  imports: [CommentModule],
  exports: [VideoService]
})
export class VideoModule {}
