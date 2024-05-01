import { Consultation } from 'src/consultations/entities/consultation.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patient_id: number;

  @Column()
  doctor_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  appointment_time: Date;

  @Column()
  status: string;

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

  @OneToOne(() => Consultation, (consultation) => consultation.appointment)
  consultation: Consultation;
}
