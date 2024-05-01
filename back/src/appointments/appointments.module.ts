import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointments.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { ConsultationsModule } from 'src/consultations/consultations.module';
import { SkinImagesModule } from 'src/skin-images/skin-images.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), ConsultationsModule, SkinImagesModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
