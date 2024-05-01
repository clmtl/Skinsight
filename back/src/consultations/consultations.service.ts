import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultation } from './entities/consultation.entity';
import { Repository } from 'typeorm';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { SkinImagesService } from 'src/skin-images/skin-images.service';
import { RequestType } from 'src/types/Request.type';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
    private readonly skinService: SkinImagesService
  ) {}

  async findMany(id: number) {
    const consultations = await this.consultationRepository.find({
      where: [{ patient_id: id }, { doctor_id: id }],
      relations: ['patient', 'doctor'],
    });
    return consultations;
  }

  async findManyByPatient(id: number) {
    const consultations = await this.consultationRepository.find({
      where: { patient_id: id },
      relations: ['patient', 'doctor'],
    });
    return consultations;
  }

  async findManyByDoctor(id: number) {
    const consultations = await this.consultationRepository.find({
      where: { doctor_id: id },
      relations: ['patient', 'doctor'],
    });
    return consultations;
  }

  async findOne(id: number) {
    const consultation = await this.consultationRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
    if (!consultation) throw new NotFoundException(`Consultations #${id} not found`);
    const patientId = consultation.patient.id;
    const patientSkinImages = await this.skinService.findSkinImagesByUserId(patientId);
    const patientBadSkinImages = patientSkinImages.filter((skinImage) => {
      return skinImage.ai_analysis.analysis_result_good === false;
    });
    const newConsultation = {
      ...consultation,
      badSkinImages: patientBadSkinImages,
    };

    return newConsultation;
  }

  create(createConsultationDto: CreateConsultationDto) {
    const consultation = this.consultationRepository.create(createConsultationDto);
    return this.consultationRepository.save(consultation);
  }

  async update(id: number, request: RequestType, updateConsultationDto: UpdateConsultationDto) {
    const consultation = await this.consultationRepository.preload({
      id: +id,
      ...updateConsultationDto,
    });
    if (!consultation) {
      throw new NotFoundException(`Consultation #${id} not found`);
    }
    if (
      consultation.patient_id !== request.user.id &&
      consultation.doctor_id !== request.user.id &&
      request.user.role !== 'admin'
    ) {
      throw new NotFoundException(`User not authorized to update consultation #${id}`);
    }
    return this.consultationRepository.save(consultation);
  }

  async remove(id: number, request: RequestType) {
    const consultation = await this.findOne(id);
    if (
      consultation.patient_id !== request.user.id &&
      consultation.doctor_id !== request.user.id &&
      request.user.role !== 'admin'
    ) {
      throw new NotFoundException(`User not authorized to remove consultation #${id}`);
    }
    return this.consultationRepository.remove(consultation);
  }
}
