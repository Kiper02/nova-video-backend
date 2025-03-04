
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly prismaService: PrismaService) {}
  
    public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    if(typeof request.session?.userId === 'undefined') {
        throw new UnauthorizedException("Пользователь не авторизован")
    }

    const user = await this.prismaService.user.findUnique({
        where: {
            id: request.session.userId
        }
    })
    if(!user) {
        throw new UnauthorizedException("Пользователь не авторизован")
    }

    request.user = user;

    return true;
  }
}
