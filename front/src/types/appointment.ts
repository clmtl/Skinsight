import { z } from 'zod';
import { userSchema } from './user';
import { consultationSchema } from './consultation';

export const appointmentSchema = z.object({
  patient_id: z.number(),
  doctor_id: z.number(),
  appointment_time: z.string().datetime(),
  status: z.string(),
});

const appointmentReadSchema = appointmentSchema.extend({
  id: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  patient: userSchema,
  doctor: userSchema,
  consultation: consultationSchema,
});

export type AppointmentType = z.infer<typeof appointmentSchema>;
export type AppointmentReadType = z.infer<typeof appointmentReadSchema>;
