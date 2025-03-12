import { Field, ObjectType } from "@nestjs/graphql";
import { PlaylistModel } from "src/modules/playlists/models/playlist.model";

@ObjectType()
export class ChannelModel {
    @Field(() => String)
    public name: string;

    @Field(() => String)
    public banner: string;

    @Field(() => [PlaylistModel])
    public playlists: PlaylistModel[];
}