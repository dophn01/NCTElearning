import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile, BadRequestException, ForbiddenException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService, CreateVideoDto, UpdateVideoDto } from './videos.service';
import { Video } from './entities/video.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('health')
  async healthCheck() {
    try {
      // Simple health check
      return { status: 'ok', timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: any,
    @Body() createVideoDto: CreateVideoDto
  ) {
    try {
      console.log('Video upload request received:', {
        fileName: file?.originalname,
        fileSize: file?.size,
        title: createVideoDto.title,
        gradeLevel: createVideoDto.gradeLevel,
        lessonId: createVideoDto.lessonId,
        bodyKeys: Object.keys(createVideoDto)
      });

      if (!file) {
        console.error('No file uploaded');
        throw new BadRequestException('Video file is required');
      }

      // Validate file type
      if (!file.mimetype.startsWith('video/')) {
        console.error('Invalid file type:', file.mimetype);
        throw new BadRequestException('File must be a video');
      }

      // Validate file size (100MB max)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        console.error('File too large:', file.size);
        throw new BadRequestException('File size must be less than 100MB');
      }

      // Validate required fields
      if (!createVideoDto.title) {
        console.error('Missing title');
        throw new BadRequestException('Title is required');
      }

      if (!createVideoDto.gradeLevel) {
        console.error('Missing gradeLevel');
        throw new BadRequestException('Grade level is required');
      }

      console.log('Starting video creation process...');
      const result = await this.videosService.createWithFile(file, createVideoDto);
      console.log('Video created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('Error in video upload:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Re-throw the error to be handled by the global exception filter
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: User,
    @Query('lessonId') lessonId?: string
  ) {
    if (lessonId) {
      const videos = await this.videosService.findByLesson(lessonId);
      // Filter videos based on user access
      const accessibleVideos: Video[] = [];
      for (const video of videos) {
        if (await this.videosService.canUserAccessVideo(video, user)) {
          accessibleVideos.push(video);
        }
      }
      return accessibleVideos;
    }
    return this.videosService.findAllForUser(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const video = await this.videosService.findByIdForUser(id, user);
    if (!video) {
      throw new ForbiddenException('Bạn không có quyền truy cập video này');
    }
    return video;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }
}
