import { Controller, Param, Post, Request } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { Request as RequestType } from 'express';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Post('code/:code')
  public async code(
    @Param("code") code: string,
    @Request() req: RequestType
  ) {
    return await this.oauthService.code(code, req)
  }


}
