import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointments.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentV2Dto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { RequestType } from 'src/types/Request.type';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from 'src/s3';
import { randomImageName } from 'src/utils/images';
import { ConsultationsService } from 'src/consultations/consultations.service';
import { SkinImagesService } from 'src/skin-images/skin-images.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly consultationsService: ConsultationsService,
    private readonly skinImagesService: SkinImagesService
  ) {}

  async findMany(id: number) {
    const appointments = await this.appointmentRepository.find({
      where: [{ patient_id: id }, { doctor_id: id }],
      relations: ['patient', 'doctor'],
    });
    return appointments;
  }

  async findManyByDoctor(id: string) {
    const appointments = await this.appointmentRepository.find({
      where: { doctor_id: Number(id) },
      relations: ['patient', 'doctor', 'consultation'],
    });
    return appointments;
  }

  async findManyByPatient(id: string) {
    const appointments = await this.appointmentRepository.find({
      where: { patient_id: Number(id) },
      relations: ['patient', 'doctor'],
    });
    return appointments;
  }

  async findOne(id: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
    return appointment;
  }

  async create(
    userId: number,
    image: Express.Multer.File,
    createAppointmentDto: CreateAppointmentV2Dto
  ) {
    // Create appointment
    const appointmentData = {
      ...createAppointmentDto,
      patient_id: userId,
      doctor_id: Number(createAppointmentDto.doctor_id),
      appointment_time: new Date(createAppointmentDto.appointment_time),
      status: 'scheduled',
    };
    const appointment = this.appointmentRepository.create(appointmentData);
    const dbAppointment = await this.appointmentRepository.save(appointment).catch((error) => {
      throw new Error(error);
    });

    // Create consultation
    const consultationData = {
      patient_id: userId,
      doctor_id: Number(createAppointmentDto.doctor_id),
      appointment_id: dbAppointment.id,
      pre_consultation: true,
    };
    const consultation = await this.consultationsService.create(consultationData).catch((error) => {
      throw new Error(error);
    });

    const imageName = randomImageName();

    // Save image to s3
    const putParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    const putCommand = new PutObjectCommand(putParams);

    await s3.send(putCommand).catch((error) => {
      throw new Error(error);
    });

    // Save image to db
    const skinImageData = {
      image_path: imageName,
      consultation_id: consultation.id,
    };

    await this.skinImagesService.create(userId, skinImageData).catch((error) => {
      throw new Error(error);
    });

    return { appointmentData, consultationData, skinImageData };
  }

  async update(id: number, request: RequestType, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.appointmentRepository.preload({
      id: +id,
      ...updateAppointmentDto,
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }
    if (
      appointment.patient_id !== request.user.id &&
      appointment.doctor_id !== request.user.id &&
      request.user.role !== 'admin'
    ) {
      throw new NotFoundException(`User not authorized to update appointment #${id}`);
    }
    return this.appointmentRepository.save(appointment);
  }

  async remove(id: number, request: RequestType) {
    const appointment = await this.findOne(id);
    if (
      appointment.patient_id !== request.user.id &&
      appointment.doctor_id !== request.user.id &&
      request.user.role !== 'admin'
    ) {
      throw new NotFoundException(`User not authorized to delete appointment #${id}`);
    }
    return this.appointmentRepository.remove(appointment);
  }
}
