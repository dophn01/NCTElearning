import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { QuizzesService, CreateQuizDto, CreateQuizQuestionDto, CreateQuizOptionDto } from './quizzes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
  findAll(@Query('lessonId') lessonId?: string) {
    if (lessonId) {
      return this.quizzesService.findByLesson(lessonId);
    }
    return this.quizzesService.findAllQuizzes();
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
}
