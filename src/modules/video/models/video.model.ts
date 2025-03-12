import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Video } from "@prisma/client";
import { CommentModel } from "../comment/models/comment.model";

@ObjectType()
export class VideoModel implements Video{
    @Field(() => ID)
    public id: string;

    @Field(() => String)
    public name: string

    @Field(() => String)
    public fileName: string

    @Field(() => String)
    public description: string
  
    @Field(() => Number)
    public numberOfLikes: number;

    @Field(() => Number)
    public numberOfDislikes: number;

    @Field(() => Number)
    public numberOfComments: number;
  
    @Field(() => String)
    public playlistId: string;

    @Field(() => [CommentModel])
    public comments: CommentModel[]

    @Field(() => Date)
    public createdAt: Date;

    @Field(() => Date)
    public updatedAt: Date;
}