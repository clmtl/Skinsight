import { z } from 'zod';
import { userSchema } from './user';

export const documentSchema = z.object({
  user_id: z.number(),
  document_name: z.string(),
  document_path: z.string(),
  document_type: z.string().optional(),
});

const documentReadSchema = documentSchema.extend({
  id: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user: userSchema,
});

export type DocumentType = z.infer<typeof documentSchema>;
export type DocumentReadType = z.infer<typeof documentReadSchema>;
