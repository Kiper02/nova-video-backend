import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, Length } from "class-validator";

@InputType()
export class PlaylistInput {
    
    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    @Field(() => String)
    public name: string;

    @IsNotEmpty()
    @IsString()
    public channelId: string;
}