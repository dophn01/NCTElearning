import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { EssayExercisesService, CreateEssayExerciseDto, CreateEssaySubmissionDto } from './essay-exercises.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('essay-exercises')
export class EssayExercisesController {
  constructor(private readonly essayExercisesService: EssayExercisesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createExercise(@Body() createExerciseDto: CreateEssayExerciseDto) {
    return this.essayExercisesService.createExercise(createExerciseDto);
  }

  @Post('submissions')
  @UseGuards(JwtAuthGuard)
  createSubmission(@Body() createSubmissionDto: CreateEssaySubmissionDto) {
    return this.essayExercisesService.createSubmission(createSubmissionDto);
  }

  @Get()
  findAll(@Query('lessonId') lessonId?: string) {
    if (lessonId) {
      return this.essayExercisesService.findByLesson(lessonId);
    }
    return this.essayExercisesService.findAllExercises();
  }

  @Get('submissions')
  @UseGuards(JwtAuthGuard)
  findSubmissions(@Query('userId') userId: string) {
    return this.essayExercisesService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.essayExercisesService.findExerciseById(id);
  }

  @Patch('submissions/:id/grade')
  @UseGuards(JwtAuthGuard)
  gradeSubmission(@Param('id') id: string, @Body() body: { grade: number; feedback?: string }) {
    return this.essayExercisesService.gradeSubmission(id, body.grade, body.feedback);
  }
}
