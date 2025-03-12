import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelResolver } from './channel.resolver';

@Module({
  providers: [ChannelResolver, ChannelService],
  exports: [ChannelService]
})
export class ChannelModule {}
