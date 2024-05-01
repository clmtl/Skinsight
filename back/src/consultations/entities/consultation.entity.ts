import { Appointment } from 'src/appointments/entities/appointments.entity';
import { SkinImage } from 'src/skin-images/entities/skin-image.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patient_id: number;

  @Column()
  doctor_id: number;

  @Column()
  appointment_id: number;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // consultation_date: Date;

  @Column({ type: 'boolean', default: false })
  pre_consultation: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'doctor_id' })
  doctor: User;

  @OneToMany(() => SkinImage, (skin_image) => skin_image.consultation, { eager: true })
  skin_images: SkinImage[];

  @OneToOne(() => Appointment, (appointment) => appointment.consultation, { eager: true })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;
}
