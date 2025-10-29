import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { EssaySubmission } from './essay-submission.entity';

@Entity('essay_exercises')
export class EssayExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lessonId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ default: 200 })
  wordCountMin: number;

  @Column({ default: 1000 })
  wordCountMax: number;

  @Column({ default: 60 })
  timeLimitMinutes: number;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Lesson, (lesson) => lesson.essayExercises)
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @OneToMany(() => EssaySubmission, (submission) => submission.exercise)
  submissions: EssaySubmission[];

  // Helper methods
  get wordCountRange(): string {
    return `${this.wordCountMin} - ${this.wordCountMax} từ`;
  }

  get timeLimitFormatted(): string {
    return `${this.timeLimitMinutes} phút`;
  }
}
