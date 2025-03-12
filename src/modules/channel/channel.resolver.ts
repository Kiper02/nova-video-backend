import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChannelService } from './channel.service';
import { Authorization } from 'src/shared/decorators/auth.decorator';
import { ChannelModel } from './models/channel.model';
import { Authorized } from 'src/shared/decorators/authorized.decorator';
import { ChannelInput } from './inputs/channel.input';

@Resolver('Channel')
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Authorization()
  @Query(() => ChannelModel, {name: 'findChannelByUser'})
  public async findByUser(
    @Authorized('id') userId: string
  ) {
    return await this.channelService.findByUser(userId);
  }

  @Mutation(() => ChannelModel, {name: 'updateChannel'})
  public async update(
    @Authorized('id') userId: string,
    @Args('data') channelInput: ChannelInput
  ) {
    return await this.channelService.update(userId, channelInput);
  }
}
