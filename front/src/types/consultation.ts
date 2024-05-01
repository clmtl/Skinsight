import { z } from 'zod';
import { userSchema } from './user';
import { appointmentSchema } from './appointment';
import { skinImageSchema } from './skinImage';

export const consultationSchema = z.object({
  patient_id: z.number(),
  doctor_id: z.number(),
  // consultation_date: z.string().datetime(),
  pre_consultation: z.boolean(),
  notes: z.string().optional(),
});

const consultationReadSchema = consultationSchema.extend({
  id: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  patient: userSchema,
  doctor: userSchema,
  skin_images: z.array(skinImageSchema),
  appointment: appointmentSchema,
});

export type ConsultationType = z.infer<typeof consultationSchema>;
export type ConsultationReadType = z.infer<typeof consultationReadSchema>;
