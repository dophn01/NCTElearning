import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Video } from '../videos/entities/video.entity';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { QuizQuestion } from '../quizzes/entities/quiz-question.entity';
import { QuizQuestionOption } from '../quizzes/entities/quiz-question-option.entity';
import { QuizAttempt } from '../quizzes/entities/quiz-attempt.entity';
import { QuizAttemptAnswer } from '../quizzes/entities/quiz-attempt-answer.entity';
import { EssayExercise } from '../essay-exercises/entities/essay-exercise.entity';
import { EssaySubmission } from '../essay-exercises/entities/essay-submission.entity';
import { UserProgress } from '../user-progress/entities/user-progress.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get('DATABASE_TYPE') || 'postgres';
        
        const entities = [
          User,
          Course,
          Lesson,
          Video,
          Quiz,
          QuizQuestion,
          QuizQuestionOption,
          QuizAttempt,
          QuizAttemptAnswer,
          EssayExercise,
          EssaySubmission,
          UserProgress,
        ];
        
        if (dbType === 'sqlite') {
          return {
            type: 'sqlite',
            database: configService.get('DATABASE_NAME') || 'database.sqlite',
            entities,
            synchronize: configService.get('DATABASE_SYNCHRONIZE') === 'true' || configService.get('NODE_ENV') === 'development',
            logging: configService.get('NODE_ENV') === 'development',
          };
        }
        
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities,
          synchronize: false, // Disabled to prevent schema conflicts
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
