import { z } from 'zod';
import { skinImageSchema } from './skinImage';

export const aiAnalysisSchema = z.object({
  image_id: z.number(),
  analysis_result_good: z.boolean(),
});

const aiAnalysisReadSchema = aiAnalysisSchema.extend({
  id: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  skin_image: skinImageSchema,
});

export type aiAnalysisType = z.infer<typeof aiAnalysisSchema>;
export type aiAnalysisReadType = z.infer<typeof aiAnalysisReadSchema>;
