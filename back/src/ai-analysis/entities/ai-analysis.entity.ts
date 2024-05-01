import { SkinImage } from 'src/skin-images/entities/skin-image.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class AiAnalysis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  image_id: number;

  @Column({ type: 'boolean' })
  analysis_result_good: boolean;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @OneToOne(() => SkinImage, (skin_image) => skin_image.ai_analysis, { eager: true })
  @JoinColumn({ name: 'image_id' })
  skin_image: SkinImage;
}
