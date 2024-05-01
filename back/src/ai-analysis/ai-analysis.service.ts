import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AiAnalysis } from './entities/ai-analysis.entity';
import { Repository } from 'typeorm';
import { CreateAiAnalysisDto } from './dto/create-ai-analysis.sto';

@Injectable()
export class AiAnalysisService {
    constructor(
        @InjectRepository(AiAnalysis)
        private readonly aiAnalysisRepository: Repository<AiAnalysis>
      ) {}

      async findAll() {
        const aiAnalysis = await this.aiAnalysisRepository.find({relations: ['skin_image', 'skin_image.user']});
        return aiAnalysis;
        
      }
    
      async findOne(id: number) {
        const aiAnalysis = await this.aiAnalysisRepository.findOne({ where: { id }, relations: ['skin_image', 'skin_image.user'] });
        if (!aiAnalysis) throw new NotFoundException(`Analysis #${id} not found`);
        return aiAnalysis;
      }
    
      create(createAiAnalysisDto: CreateAiAnalysisDto) {  
        console.log("image analyse done");
        const aiAnalysis = this.aiAnalysisRepository.create(createAiAnalysisDto);
        return this.aiAnalysisRepository.save(aiAnalysis);
      }
    
      async remove(id: number) {
        const aiAnalysis = await this.findOne(id);
        return this.aiAnalysisRepository.remove(aiAnalysis);
      }
}
