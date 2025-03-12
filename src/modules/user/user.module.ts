import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { ChannelModule } from '../channel/channel.module';

@Module({
  imports: [ChannelModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
