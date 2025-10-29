import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { QuizQuestionOption } from './entities/quiz-question-option.entity';
import { QuizAttempt } from './entities/quiz-attempt.entity';
import { QuizAttemptAnswer } from './entities/quiz-attempt-answer.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { GradeLevel } from '../users/entities/user.entity';

export interface CreateQuizDto {
  lessonId?: string;
  title: string;
  description?: string;
  timeLimitMinutes?: number;
  maxAttempts?: number;
  isPublished?: boolean;
  gradeLevel?: GradeLevel;
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
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    // If lessonId provided, ensure it exists; otherwise allow quiz without lesson
    if (createQuizDto.lessonId) {
      const lesson = await this.lessonsRepository.findOne({ where: { id: createQuizDto.lessonId }, relations: ['course'] });
      if (!lesson) {
        throw new BadRequestException('Lesson không tồn tại');
      }
    }

    const quiz = this.quizzesRepository.create({
      ...createQuizDto,
      maxAttempts: createQuizDto.maxAttempts ?? 3,
    });
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

  async findAllQuizzes(gradeLevel?: '10' | '11' | '12'): Promise<Quiz[]> {
    const qb = this.quizzesRepository.createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.lesson', 'lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .leftJoinAndSelect('quiz.questions', 'questions')
      .leftJoinAndSelect('questions.options', 'options')
      .orderBy('quiz.createdAt', 'DESC');

    if (gradeLevel) {
      qb.andWhere('(quiz.gradeLevel = :gradeLevel OR course.gradeLevel = :gradeLevel)', { gradeLevel });
    }

    return qb.getMany();
  }

  async findQuizById(id: string): Promise<Quiz | null> {
    return this.quizzesRepository.findOne({
      where: { id },
      relations: ['lesson', 'lesson.course', 'questions', 'questions.options'],
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

  async listAttemptsForQuiz(quizId: string, status?: 'in_progress' | 'completed'): Promise<QuizAttempt[]> {
    const where: any = { quizId };
    if (status === 'in_progress') {
      where.completedAt = null;
    } else if (status === 'completed') {
      where.completedAt = Not(null as unknown as Date);
    }
    return this.attemptsRepository.find({
      where,
      relations: ['user'],
      order: { startedAt: 'DESC' },
    });
  }

  async getAttemptWithAnswers(attemptId: string): Promise<QuizAttempt | null> {
    return this.attemptsRepository.findOne({
      where: { id: attemptId },
      relations: [
        'answers',
        'answers.question',
        'answers.selectedOption',
        'quiz',
        'quiz.questions',
        'quiz.questions.options',
        'user',
      ],
    });
  }

  async gradeAnswer(answerId: string, pointsEarned?: number, isCorrect?: boolean): Promise<QuizAttemptAnswer> {
    const answer = await this.answersRepository.findOne({ where: { id: answerId } });
    if (!answer) {
      throw new NotFoundException('Không tìm thấy câu trả lời');
    }
    if (typeof pointsEarned === 'number') {
      answer.pointsEarned = pointsEarned;
    }
    if (typeof isCorrect === 'boolean') {
      answer.isCorrect = isCorrect;
    }
    return this.answersRepository.save(answer);
  }

  async deleteQuiz(id: string): Promise<void> {
    await this.quizzesRepository.delete(id);
  }
}
