import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Comment } from '@prisma/client';
import { UserModel } from './../../../user/models/user.model'

@ObjectType()
export class CommentModel implements Comment {
    @Field(() => ID)
    public id: string;

    @Field(() => String)
    public content: string;

    @Field(() => String)
    public userId: string;

    @Field(() => UserModel)
    public user: UserModel;

    @Field(() => String)
    public videoId: string;

    @Field(() => Date)
    public createdAt: Date;

    @Field(() => Date)
    public updatedAt: Date;
}