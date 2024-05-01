import { AiAnalysis } from 'src/ai-analysis/entities/ai-analysis.entity';
import { Consultation } from 'src/consultations/entities/consultation.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SkinImage {
  @PrimaryGeneratedColumn()
  id: number;

  // S3 image id
  @Column()
  image_path: string;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @Column()
  user_id: number;

  @Column()
  consultation_id: number;

  // Define the relationship with the User entity
  @ManyToOne(() => User, (user) => user.skin_images)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Define the relationship with the Consultation entity
  @ManyToOne(() => Consultation, (consultation) => consultation.skin_images)
  @JoinColumn({ name: 'consultation_id' })
  consultation: Consultation;

  @OneToOne(() => AiAnalysis, (ai_analysis) => ai_analysis.skin_image)
  ai_analysis: AiAnalysis;
}
