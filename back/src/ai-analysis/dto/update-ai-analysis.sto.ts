import { PartialType } from '@nestjs/swagger';
import { CreateAiAnalysisDto } from './create-ai-analysis.sto';

export class UpdateAiAnalysisDto extends PartialType(CreateAiAnalysisDto) {}