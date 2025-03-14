import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


@InputType()
export class LoginInput {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Field()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 30)
    @Field()
    password: string
}