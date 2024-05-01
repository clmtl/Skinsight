import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    document_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    document_path: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    document_type: string;
}