import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

@InputType()
export class RegisterInput {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Field()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 30)
    @Field()
    username: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 30)
    @Field()
    password: string;
}