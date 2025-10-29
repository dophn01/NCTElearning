'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  VideoCameraIcon, 
  BookOpenIcon, 
  PlayIcon,
  ClockIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  fileSizeMb?: number;
  lesson: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
      gradeLevel: '10' | '11' | '12';
    };
  };
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  gradeLevel: '10' | '11' | '12';
  thumbnailUrl?: string;
  lessons: Array<{
    id: string;
    title: string;
    description: string;
    videos: Video[];
  }>;
}

export default function GradeCoursesPage() {
  const params = useParams();
  const grade = params.grade as string;
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGradeData();
  }, [grade]);

  const fetchGradeData = async () => {
    try {
      // Fetch courses for this grade
      const coursesResponse = await fetch(`http://localhost:3001/api/courses?gradeLevel=${grade}`);
      const coursesData = await coursesResponse.json();
      setCourses(Array.isArray(coursesData) ? coursesData : []);

      // Fetch all videos for this grade
      const videosResponse = await fetch('http://localhost:3001/api/videos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const videosData = await videosResponse.json();
      
      // Filter videos by grade level
      const gradeVideos = videosData.filter((video: Video) => 
        video.lesson?.course?.gradeLevel === grade
      );
      setVideos(gradeVideos);
    } catch (error) {
      console.error('Error fetching grade data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (mb: number) => {
    if (mb < 1) {
      return `${(mb * 1024).toFixed(0)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nc-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nc-gold mx-auto"></div>
          <p className="mt-4 text-nc-dark-orange">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nc-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-nc-dark-orange flex items-center">
                <AcademicCapIcon className="h-8 w-8 mr-3" />
                Khóa học Lớp {grade}
              </h1>
              <p className="mt-2 text-gray-600">
                Tất cả video bài giảng và khóa học dành cho học sinh lớp {grade}
              </p>
            </div>
            <Link
              href="/courses"
              className="btn-secondary flex items-center"
            >
              <BookOpenIcon className="h-5 w-5 mr-2" />
              Xem tất cả khóa học
            </Link>
          </div>
        </div>

        {/* Courses Section */}
        {courses.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-nc-dark-orange mb-6">
              Khóa học có sẵn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="card hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-nc-gold via-nc-orange to-nc-dark-orange rounded-lg mb-4 flex items-center justify-center">
                    <BookOpenIcon className="h-16 w-16 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-xl font-semibold text-nc-dark-orange mb-3">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {course.lessons.length} bài học
                    </span>
                    <span className="bg-nc-gold text-white text-xs px-2 py-1 rounded-full">
                      Lớp {course.gradeLevel}
                    </span>
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className="btn-primary w-full text-center"
                  >
                    Xem khóa học
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos Section */}
        <section>
          <h2 className="text-2xl font-bold text-nc-dark-orange mb-6">
            Video bài giảng ({videos.length})
          </h2>
          
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="card hover:shadow-lg transition-shadow">
                  {/* Video Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-nc-gold via-nc-orange to-nc-dark-orange rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-black/30 backdrop-blur-sm"></div>
                    <VideoCameraIcon className="h-16 w-16 text-white relative z-10 drop-shadow-lg" />
                    {video.durationSeconds && (
                      <div className="absolute bottom-2 right-2 bg-white/20 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video.durationSeconds)}
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-nc-gold text-white text-xs px-2 py-1 rounded-full">
                        Lớp {video.lesson.course.gradeLevel}
                      </span>
                      {video.fileSizeMb && (
                        <span className="text-sm text-gray-500">
                          {formatFileSize(video.fileSizeMb)}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-nc-dark-orange mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {video.description}
                    </p>

                    <div className="text-sm text-gray-500 mb-3">
                      <p className="flex items-center mb-1">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {video.lesson.course.title}
                      </p>
                      <p className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {video.lesson.title}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 btn-primary flex items-center justify-center">
                      <PlayIcon className="h-4 w-4 mr-1" />
                      Xem video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <VideoCameraIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                Chưa có video nào cho lớp {grade}
              </h3>
              <p className="text-gray-400 mb-4">
                Video bài giảng sẽ xuất hiện ở đây khi được tải lên
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
