import { Field, ObjectType } from "@nestjs/graphql";
import { VideoModel } from "src/modules/video/models/video.model";

@ObjectType()
export class PlaylistModel {
    @Field(() => String)
    public id: string;

    @Field(() => String)
    public name: string;

    @Field(() => [VideoModel])
    public video: VideoModel[];
}