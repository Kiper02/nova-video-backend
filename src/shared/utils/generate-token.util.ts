import { TokenType, User } from "@prisma/client";
import { PrismaService } from "src/core/prisma/prisma.service";
import { v4 } from "uuid";

export default async function generateToken(
    prismaService: PrismaService,
    user: User,
    type: TokenType,
    isUUID: boolean = false
) {
    let token: string;

    if(isUUID) {
        token = v4();
    } else {
        token = Math.floor(Math.random() * (1000000 - 100000) + 10000).toString()
    }

    const expiresAt = new Date(new Date().getTime() + 300000);
    const existingToken = await prismaService.token.findFirst({
        where: {
            type,
            user: {
                id: user.id
            }
        }
    })

    if(existingToken) {
        await prismaService.token.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const newToken = await prismaService.token.create({
        data: {
            token,
            expiresAt,
            type,
            user: {
                connect: {
                    id: user.id
                }
            }
        }
    })

    return newToken;
}