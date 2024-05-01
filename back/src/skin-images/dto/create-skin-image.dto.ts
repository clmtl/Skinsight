import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkinImageDto {
  // S3 image id
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  image_path: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  consultation_id: number;
}
