import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { Consultation } from './entities/consultation.entity';
import { SkinImagesService } from 'src/skin-images/skin-images.service';
import { SkinImage } from 'src/skin-images/entities/skin-image.entity';
import { AiAnalysisService } from 'src/ai-analysis/ai-analysis.service';
import { AiAnalysis } from 'src/ai-analysis/entities/ai-analysis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consultation, SkinImage, AiAnalysis])],
  controllers: [ConsultationsController],
  providers: [ConsultationsService, SkinImagesService, AiAnalysisService],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}
