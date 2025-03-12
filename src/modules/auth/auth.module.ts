import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { OauthModule } from './oauth/oauth.module';
import { VerificationModule } from './verification/verification.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [OauthModule, VerificationModule, UserModule, VerificationModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
