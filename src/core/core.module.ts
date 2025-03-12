import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { getGraphqlConfig } from './config/graphql.config';
import { RedisModule } from './redis/redis.module';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ChannelModule } from 'src/modules/channel/channel.module';
import { StorageModule } from 'src/modules/libs/storage/storage.module'
import { MailModule } from 'src/modules/libs/mail/mail.module';
import { VerificationModule } from 'src/modules/auth/verification/verification.module';
import { OauthModule } from 'src/modules/auth/oauth/oauth.module';
import { PlaylistsModule } from 'src/modules/playlists/playlists.module';
import { CommentModule } from 'src/modules/video/comment/comment.module';
import { VideoModule } from 'src/modules/video/video.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: getGraphqlConfig,
      inject: [ConfigService]
    }),
    PrismaModule,
    RedisModule,
    UserModule,
    AuthModule,
    OauthModule,
    ChannelModule,
    PlaylistsModule,
    VideoModule,
    CommentModule,
    StorageModule,
    MailModule,
    VerificationModule,
  ],
})
export class CoreModule {}
