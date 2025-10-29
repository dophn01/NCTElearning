'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpenIcon, ClockIcon, UserIcon, PlayIcon } from '@heroicons/react/24/outline';

interface Course {
  id: string;
  title: string;
  description: string;
  gradeLevel: '10' | '11' | '12';
  thumbnailUrl?: string;
  createdBy: {
    firstName: string;
    lastName: string;
  };
  lessons: Array<{
    id: string;
    title: string;
    durationMinutes?: number;
  }>;
  createdAt: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<'10' | '11' | '12' | 'all'>('all');

  useEffect(() => {
    fetchCourses();
  }, [selectedGrade]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const url = selectedGrade === 'all' 
        ? 'http://localhost:3001/api/courses'
        : `http://localhost:3001/api/courses?gradeLevel=${selectedGrade}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Handle different response formats
      let coursesData = [];
      if (Array.isArray(data)) {
        coursesData = data;
      } else if (data && Array.isArray(data.data)) {
        coursesData = data.data;
      } else if (data && Array.isArray(data.courses)) {
        coursesData = data.courses;
      }
      
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback to mock data for demo
      setCourses([
        {
          id: '1',
          title: 'Văn Học Lớp 10 - Tác Phẩm Cổ Điển',
          description: 'Khóa học về các tác phẩm văn học cổ điển Việt Nam cho học sinh lớp 10',
          gradeLevel: '10',
          createdBy: { firstName: 'Trần', lastName: 'Thị Giáo Viên' },
          lessons: [
            { id: '1', title: 'Giới thiệu về Văn học Cổ điển', durationMinutes: 45 },
            { id: '2', title: 'Truyện Kiều - Nguyễn Du', durationMinutes: 60 },
          ],
          createdAt: '2024-01-01',
        },
        {
          id: '2',
          title: 'Văn Học Lớp 11 - Thơ Ca Hiện Đại',
          description: 'Khóa học về thơ ca hiện đại Việt Nam cho học sinh lớp 11',
          gradeLevel: '11',
          createdBy: { firstName: 'Trần', lastName: 'Thị Giáo Viên' },
          lessons: [
            { id: '3', title: 'Thơ Mới Việt Nam', durationMinutes: 50 },
            { id: '4', title: 'Xuân Diệu và Thơ Tình', durationMinutes: 55 },
          ],
          createdAt: '2024-01-01',
        },
        {
          id: '3',
          title: 'Văn Học Lớp 12 - Văn Học Đương Đại',
          description: 'Khóa học về văn học đương đại Việt Nam cho học sinh lớp 12',
          gradeLevel: '12',
          createdBy: { firstName: 'Trần', lastName: 'Thị Giáo Viên' },
          lessons: [
            { id: '5', title: 'Văn học Đương đại', durationMinutes: 40 },
            { id: '6', title: 'Nguyễn Ngọc Tư và Văn học Nam Bộ', durationMinutes: 50 },
          ],
          createdAt: '2024-01-01',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = selectedGrade === 'all' 
    ? (Array.isArray(courses) ? courses : [])
    : (Array.isArray(courses) ? courses.filter(course => course.gradeLevel === selectedGrade) : []);

  return (
    <div className="bg-nc-cream min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-nc-dark-orange mb-4">
            Khóa Học Văn Học
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá các khóa học văn học được thiết kế đặc biệt cho từng lớp học
          </p>
        </div>

        {/* Grade Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedGrade === 'all'
                  ? 'bg-nc-gold text-white'
                  : 'text-gray-600 hover:text-nc-gold'
              }`}
            >
              Tất cả
            </button>
            {['10', '11', '12'].map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade as '10' | '11' | '12')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedGrade === grade
                    ? 'bg-nc-gold text-white'
                    : 'text-gray-600 hover:text-nc-gold'
                }`}
              >
                Lớp {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="card hover:shadow-lg transition-shadow">
                {/* Course Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-nc-gold to-nc-orange rounded-lg mb-4 flex items-center justify-center">
                  <BookOpenIcon className="h-16 w-16 text-white" />
                </div>

                {/* Course Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-nc-gold text-white text-xs px-2 py-1 rounded-full">
                      Lớp {course.gradeLevel}
                    </span>
                    <span className="text-sm text-gray-500">
                      {course.lessons.length} bài học
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-nc-dark-orange mb-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    <span>{course.createdBy.firstName} {course.createdBy.lastName}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>
                      {course.lessons.reduce((total, lesson) => total + (lesson.durationMinutes || 0), 0)} phút
                    </span>
                  </div>
                </div>

                {/* Course Lessons Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Bài học:</h4>
                  <div className="space-y-1">
                    {course.lessons.slice(0, 3).map((lesson) => (
                      <div key={lesson.id} className="flex items-center text-sm text-gray-600">
                        <PlayIcon className="h-3 w-3 mr-2 text-nc-gold" />
                        <span className="truncate">{lesson.title}</span>
                        {lesson.durationMinutes && (
                          <span className="ml-auto text-xs text-gray-400">
                            {lesson.durationMinutes} phút
                          </span>
                        )}
                      </div>
                    ))}
                    {course.lessons.length > 3 && (
                      <div className="text-xs text-gray-400">
                        +{course.lessons.length - 3} bài học khác
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/courses/${course.id}`}
                  className="btn-primary w-full text-center"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              Không có khóa học nào
            </h3>
            <p className="text-gray-400">
              Hiện tại chưa có khóa học nào cho lớp {selectedGrade === 'all' ? 'này' : selectedGrade}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
