import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { AiAnalysis } from "../entities/ai-analysis.entity";

@ApiExtraModels(AiAnalysis)
export class CreateAiAnalysisDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    image_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    analysis_result_good: boolean;
}