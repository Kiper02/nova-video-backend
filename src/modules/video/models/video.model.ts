import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Comment, Video } from "@prisma/client";

@ObjectType()
export class VideoModel implements Video{
    @Field(() => ID)
    public id: string;

    @Field(() => String)
    public name: string

    @Field(() => String)
    public url: string

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

    @Field(() => [Comment])
    public comments: Comment[]

    @Field(() => Date)
    public createdAt: Date;

    @Field(() => Date)
    public updatedAt: Date;
}