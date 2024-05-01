import { z } from 'zod';
import { skinImageSchema } from './skinImage';
import { consultationSchema } from './consultation';
import { appointmentSchema } from './appointment';

export const ROLES = ['dermatologist', 'doctor', 'patient'] as const;

export const GENDERS = ['male', 'female'] as const;

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.enum(ROLES),
  first_name: z.string(),
  last_name: z.string(),
  gender: z.enum(GENDERS),
  phone_number: z.string(),
  birth_date: z.string().datetime(),
  doctor_adeli: z.string().optional(),
});

const userReadSchema = userSchema.extend({
  id: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  skin_images: z.array(skinImageSchema),
  consultations: z.array(consultationSchema),
  appointments: z.array(appointmentSchema),
  documents: z.array(z.unknown()),
});

export type UserType = z.infer<typeof userSchema>;
export type UserReadType = Omit<z.infer<typeof userReadSchema>, 'password'>;
export type UserWithoutPasswordType = Omit<UserType, 'password'>;
export type LoginUserType = Pick<UserType, 'email' | 'password'>;

export type FindManyUsersResponseType = {
  doctors?: UserReadType[];
  dermatologists?: UserReadType[];
  patients?: UserReadType[];
};
