import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";

@InputType()
export class VideoInput {
    

    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    @Field(() => String)
    public name: string;

    @IsNotEmpty()
    @IsString()
    @Field(() => GraphQLUpload)
    public video: FileUpload;

    @IsOptional()
    @IsString()
    @Length(3, 500)
    @Field(() => String)
    public description?: string;

    @IsNotEmpty()
    @IsString()
    @Field(() => String)
    public playlistId: string;
}