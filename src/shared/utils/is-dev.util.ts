import { ConfigService } from "@nestjs/config";
import 'dotenv/config'

export const isDev = (convigService: ConfigService) => {
    return convigService.getOrThrow<string>("NODE_ENV") === 'development'
}

export const IS_DEV = process.env.NODE_ENV === 'development'; 