import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SkinImage } from 'src/skin-images/entities/skin-image.entity';
import { Consultation } from 'src/consultations/entities/consultation.entity';
import { Appointment } from 'src/appointments/entities/appointments.entity';
import { Message } from 'src/messages/entities/message.entity';
import { PatientDocument } from 'src/documents/entities/document.entity';

@Entity() // sql table name will be "user"
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  gender: string;

  @Column()
  phone_number: string;

  @Column({ type: 'date' })
  birth_date: Date;

  @Column({ nullable: true })
  doctor_adeli: string;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @OneToMany(() => SkinImage, (skin_image) => skin_image.user)
  skin_images: SkinImage[];

  @OneToMany(() => Consultation, (consultation) => consultation.doctor || consultation.patient)
  consultations: Consultation[];

  @OneToMany(() => Appointment, (appointment) => appointment.patient || appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => Message, (message) => message.sender || message.receiver)
  messages: Message[];

  @OneToMany(() => PatientDocument, (document) => document.user)
  documents: PatientDocument[];

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
