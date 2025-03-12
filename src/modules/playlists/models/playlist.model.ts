import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PlaylistModel {
    public name: string;

    public video: string[];
}