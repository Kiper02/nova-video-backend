import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core/core.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser'
import * as expressSession from 'express-session'
import { ValidationPipe } from '@nestjs/common';
import { ms } from './shared/utils/ms.util';
import { parseBoolean } from './shared/utils/parse-boolean.util';
import { RedisStore } from 'connect-redis';
import { RedisService } from './core/redis/redis.service';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);
  const config = app.get(ConfigService);
  const redis = app.get(RedisService)
  
  app.use(cookieParser(config.getOrThrow<string>("COOKIE_SECRET")))

  app.useGlobalPipes(new ValidationPipe({transform: true}))
  
  app.use(config.getOrThrow<string>("GRAPHQL_PREFIX"), graphqlUploadExpress())

  app.enableCors({
    origin: config.getOrThrow<string>("ALLOWED_ORIGIN"),
    credentials: true,
    exposedHeaders: ['set-cookie']
  })


  app.use(expressSession({
    secret: config.getOrThrow<string>("SESSION_SECRET"),
    name: config.getOrThrow<string>("SESSION_NAME"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: config.getOrThrow<string>("SESSION_DOMAIN"),
      maxAge: ms(config.getOrThrow<string>("SESSION_MAX_AGE")),
      httpOnly: parseBoolean(config.getOrThrow<string>("SESSION_HTTP_ONLY")),
      secure: parseBoolean(config.getOrThrow<string>("SESSION_SECURE")),
      sameSite: 'lax'
    },
    store: new RedisStore({
      client: redis,
      prefix: config.getOrThrow<string>("SESSION_FOLDER")
    })
  }))

  await app.listen(config.getOrThrow<string>('APPLICATION_PORT'));
}
bootstrap();
