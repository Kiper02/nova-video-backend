import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserService } from '../user/user.service';
import { OuathModule } from './ouath/ouath.module';
import { OauthModule } from './oauth/oauth.module';

@Module({
  providers: [AuthResolver, AuthService, UserService],
  imports: [OuathModule, OauthModule],
})
export class AuthModule {}
