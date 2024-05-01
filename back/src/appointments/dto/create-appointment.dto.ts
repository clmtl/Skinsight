import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  appointment_time: string;

  @ApiProperty({ enum: ['scheduled', 'completed', 'cancelled'] })
  @IsNotEmpty()
  @IsEnum(['scheduled', 'completed', 'cancelled'])
  status: string;
}

export class CreateAppointmentV2Dto {
  @ApiProperty()
  @IsNotEmpty()
  doctor_id: number;

  @ApiProperty()
  @IsDateString()
  appointment_time: string;
}
