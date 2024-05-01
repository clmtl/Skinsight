import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkinImage } from './entities/skin-image.entity';
import { SkinImagesController } from './skin-images.controller';
import { SkinImagesService } from './skin-images.service';
import { AiAnalysisService } from 'src/ai-analysis/ai-analysis.service';
import { AiAnalysis } from 'src/ai-analysis/entities/ai-analysis.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([SkinImage, AiAnalysis])],
  controllers: [SkinImagesController],
  providers: [SkinImagesService, AiAnalysisService, JwtService],
  exports: [SkinImagesService],
})
export class SkinImagesModule {}
