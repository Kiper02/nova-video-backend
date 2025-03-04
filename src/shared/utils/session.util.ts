import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { User } from '@prisma/client';
import type { Request, Response } from 'express';
export const saveSession = async (req: Request, user: User) => {
  req.session.userId = user.id;
  return new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        reject(new InternalServerErrorException('Не удалось сохранить сессию'));
      } else {
        resolve({ user });
      }
    });
  });
};


export const destroySession = async (
  req: Request,
  res: Response,
  configService: ConfigService,
) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        throw new InternalServerErrorException('Не удалось удалить сессию');
      }
      res.clearCookie(configService.getOrThrow<string>('SESSION_NAME'));
      resolve(true);
    });
  });
};
