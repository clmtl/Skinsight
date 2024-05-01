import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAnalysis } from './entities/ai-analysis.entity';
import { AiAnalysisService } from './ai-analysis.service';

@Module({
    imports: [TypeOrmModule.forFeature([AiAnalysis])],
    providers: [AiAnalysisService] 
})
export class AiAnalysisModule {}
