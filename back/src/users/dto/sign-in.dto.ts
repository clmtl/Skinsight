import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}