import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    sender_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    receiver_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    message_text: string;
}