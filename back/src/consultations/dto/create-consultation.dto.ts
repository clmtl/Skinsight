import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConsultationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  appointment_id: number;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsDate()
  // consultation_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  pre_consultation: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
