import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { QuizzesService, CreateQuizDto, CreateQuizQuestionDto, CreateQuizOptionDto } from './quizzes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createQuiz(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.createQuiz(createQuizDto);
  }

  @Post('questions')
  @UseGuards(JwtAuthGuard)
  createQuestion(@Body() createQuestionDto: CreateQuizQuestionDto) {
    return this.quizzesService.createQuestion(createQuestionDto);
  }

  @Post('options')
  @UseGuards(JwtAuthGuard)
  createOption(@Body() createOptionDto: CreateQuizOptionDto) {
    return this.quizzesService.createOption(createOptionDto);
  }

  @Get()
  findAll(
    @Query('lessonId') lessonId?: string,
    @Query('gradeLevel') gradeLevel?: '10' | '11' | '12'
  ) {
    if (lessonId) {
      return this.quizzesService.findByLesson(lessonId);
    }
    return this.quizzesService.findAllQuizzes(gradeLevel);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzesService.findQuizById(id);
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  startAttempt(@Param('id') quizId: string, @Body() body: { userId: string }) {
    return this.quizzesService.startAttempt(quizId, body.userId);
  }

  @Post('attempts/:attemptId/answers')
  @UseGuards(JwtAuthGuard)
  submitAnswer(@Param('attemptId') attemptId: string, @Body() body: { questionId: string; selectedOptionId?: string; answerText?: string }) {
    return this.quizzesService.submitAnswer(attemptId, body.questionId, body.selectedOptionId, body.answerText);
  }

  @Post('attempts/:attemptId/complete')
  @UseGuards(JwtAuthGuard)
  completeAttempt(@Param('attemptId') attemptId: string) {
    return this.quizzesService.completeAttempt(attemptId);
  }

  // Admin endpoints for managing attempts
  @Get(':id/attempts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  listAttempts(
    @Param('id') quizId: string,
    @Query('status') status?: 'in_progress' | 'completed'
  ) {
    return this.quizzesService.listAttemptsForQuiz(quizId, status);
  }

  @Get('attempts/:attemptId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAttempt(@Param('attemptId') attemptId: string) {
    return this.quizzesService.getAttemptWithAnswers(attemptId);
  }

  @Patch('attempts/answers/:answerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  gradeAnswer(
    @Param('answerId') answerId: string,
    @Body() body: { pointsEarned?: number; isCorrect?: boolean }
  ) {
    return this.quizzesService.gradeAnswer(answerId, body.pointsEarned, body.isCorrect);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.quizzesService.deleteQuiz(id);
  }
}
