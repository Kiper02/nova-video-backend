import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ChannelModel {
    public name: string;

    public banner: string;

    public playlists: string[];
}