import { z } from 'zod';
import { userSchema } from './user';
import { consultationSchema } from './consultation';
import { aiAnalysisSchema } from './aiAnalysis';

export const skinImageSchema = z.object({
  image_path: z.string(),
  user_id: z.number(),
  consultation_id: z.number(),
});

const skinImageReadSchema = skinImageSchema.extend({
  id: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user: userSchema,
  consultation: z.array(consultationSchema),
  ai_analysis: aiAnalysisSchema.optional(),
});

export type SkinImageType = z.infer<typeof skinImageSchema>;
export type SkinImageReadType = z.infer<typeof skinImageReadSchema>;
export type SkinImagesResponseType = {
  bad: SkinImageReadType[];
  good: SkinImageReadType[];
  notAnalyzed: SkinImageReadType[];
};
