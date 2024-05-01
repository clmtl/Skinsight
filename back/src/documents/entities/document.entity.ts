import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class PatientDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ name: 'document_name', length: 255 })
  document_name: string;

  @Column({ name: 'document_path', length: 255 })
  document_path: string;

  @Column({ name: 'document_type', length: 50, nullable: true })
  document_type: string;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
