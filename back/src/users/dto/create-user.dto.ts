import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({ enum: ['patient', 'doctor', 'dermatologist', 'admin'] })
  @IsNotEmpty()
  @IsEnum(['patient', 'doctor', 'dermatologist', 'admin'])
  readonly role: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly gender: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly last_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly phone_number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  birth_date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  doctor_adeli?: string; // This field is optional
}
