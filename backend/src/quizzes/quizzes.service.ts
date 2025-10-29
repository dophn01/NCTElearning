import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { QuizQuestionOption } from './entities/quiz-question-option.entity';
import { QuizAttempt } from './entities/quiz-attempt.entity';
import { QuizAttemptAnswer } from './entities/quiz-attempt-answer.entity';

export interface CreateQuizDto {
  lessonId: string;
  title: string;
  description?: string;
  timeLimitMinutes?: number;
  maxAttempts?: number;
  isPublished?: boolean;
}

export interface CreateQuizQuestionDto {
  quizId: string;
  questionText: string;
  questionType: 'multiple_choice' | 'essay';
  orderIndex: number;
  points?: number;
}

export interface CreateQuizOptionDto {
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
}

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizzesRepository: Repository<Quiz>,
    @InjectRepository(QuizQuestion)
    private questionsRepository: Repository<QuizQuestion>,
    @InjectRepository(QuizQuestionOption)
    private optionsRepository: Repository<QuizQuestionOption>,
    @InjectRepository(QuizAttempt)
    private attemptsRepository: Repository<QuizAttempt>,
    @InjectRepository(QuizAttemptAnswer)
    private answersRepository: Repository<QuizAttemptAnswer>,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const quiz = this.quizzesRepository.create(createQuizDto);
    return this.quizzesRepository.save(quiz);
  }

  async createQuestion(createQuestionDto: CreateQuizQuestionDto): Promise<QuizQuestion> {
    const question = this.questionsRepository.create({
      ...createQuestionDto,
      questionType: createQuestionDto.questionType as any,
    });
    return this.questionsRepository.save(question);
  }

  async createOption(createOptionDto: CreateQuizOptionDto): Promise<QuizQuestionOption> {
    const option = this.optionsRepository.create(createOptionDto);
    return this.optionsRepository.save(option);
  }

  async findAllQuizzes(): Promise<Quiz[]> {
    return this.quizzesRepository.find({
      relations: ['lesson', 'questions', 'questions.options'],
      order: { createdAt: 'DESC' },
    });
  }

  async findQuizById(id: string): Promise<Quiz | null> {
    return this.quizzesRepository.findOne({
      where: { id },
      relations: ['lesson', 'questions', 'questions.options'],
    });
  }

  async findByLesson(lessonId: string): Promise<Quiz[]> {
    return this.quizzesRepository.find({
      where: { lessonId, isPublished: true },
      relations: ['lesson', 'questions', 'questions.options'],
      order: { createdAt: 'ASC' },
    });
  }

  async startAttempt(quizId: string, userId: string): Promise<QuizAttempt> {
    const attempt = this.attemptsRepository.create({
      quizId,
      userId,
      startedAt: new Date(),
    });
    return this.attemptsRepository.save(attempt);
  }

  async submitAnswer(attemptId: string, questionId: string, selectedOptionId?: string, answerText?: string): Promise<QuizAttemptAnswer> {
    const answer = this.answersRepository.create({
      attemptId,
      questionId,
      selectedOptionId,
      answerText,
    });
    return this.answersRepository.save(answer);
  }

  async completeAttempt(attemptId: string): Promise<QuizAttempt> {
    const attempt = await this.attemptsRepository.findOne({
      where: { id: attemptId },
      relations: ['answers', 'quiz', 'quiz.questions'],
    });

    if (!attempt) {
      throw new NotFoundException('Không tìm thấy bài làm');
    }

    // Calculate score
    let score = 0;
    for (const answer of attempt.answers) {
      if (answer.isCorrect) {
        score += answer.pointsEarned;
      }
    }

    attempt.completedAt = new Date();
    attempt.score = score;
    attempt.totalPoints = attempt.quiz.questions.reduce((sum, q) => sum + q.points, 0);

    return this.attemptsRepository.save(attempt);
  }
}
