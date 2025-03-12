import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";


@InputType()
export class ChannelInput {
    
    
    @IsOptional()
    @IsString()
    @Field(() => String)
    name?: string;

    @IsOptional()
    @Field(() => GraphQLUpload)
    banner?: FileUpload
}