'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AcademicCapIcon, 
  PencilIcon, 
  ClockIcon, 
  CheckCircleIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes?: number;
  maxAttempts: number;
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

interface EssayExercise {
  id: string;
  title: string;
  prompt: string;
  wordCountMin: number;
  wordCountMax: number;
  timeLimitMinutes: number;
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

export default function PracticePage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [essayExercises, setEssayExercises] = useState<EssayExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'essays'>('quizzes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<'10' | '11' | '12' | 'all'>('all');

  useEffect(() => {
    fetchPracticeData();
  }, [selectedGrade]);

  const fetchPracticeData = async () => {
    try {
      setLoading(true);
      
      // Fetch quizzes
      const quizUrl = selectedGrade === 'all' 
        ? 'http://localhost:3001/api/quizzes'
        : `http://localhost:3001/api/quizzes?gradeLevel=${selectedGrade}`;
      
      // Fetch essay exercises
      const essayUrl = selectedGrade === 'all' 
        ? 'http://localhost:3001/api/essay-exercises'
        : `http://localhost:3001/api/essay-exercises?gradeLevel=${selectedGrade}`;

      const [quizResponse, essayResponse] = await Promise.all([
        fetch(quizUrl),
        fetch(essayUrl)
      ]);

      const quizData = await quizResponse.json();
      const essayData = await essayResponse.json();

      setQuizzes(quizData);
      setEssayExercises(essayData);
    } catch (error) {
      console.error('Error fetching practice data:', error);
      // Fallback to mock data for demo
      setQuizzes([
        {
          id: '1',
          title: 'Kiểm tra Văn học Cổ điển',
          description: 'Bài kiểm tra về kiến thức văn học cổ điển',
          timeLimitMinutes: 30,
          maxAttempts: 3,
          lesson: {
            id: '1',
            title: 'Giới thiệu về Văn học Cổ điển',
            course: {
              id: '1',
              title: 'Văn Học Lớp 10 - Tác Phẩm Cổ Điển',
              gradeLevel: '10',
            },
          },
          createdAt: '2024-01-01',
        },
        {
          id: '2',
          title: 'Kiểm tra Truyện Kiều',
          description: 'Bài kiểm tra về tác phẩm Truyện Kiều',
          timeLimitMinutes: 45,
          maxAttempts: 2,
          lesson: {
            id: '2',
            title: 'Truyện Kiều - Nguyễn Du',
            course: {
              id: '1',
              title: 'Văn Học Lớp 10 - Tác Phẩm Cổ Điển',
              gradeLevel: '10',
            },
          },
          createdAt: '2024-01-01',
        },
      ]);

      setEssayExercises([
        {
          id: '1',
          title: 'Phân tích nhân vật Thúy Kiều',
          prompt: 'Hãy phân tích tính cách và số phận của nhân vật Thúy Kiều trong tác phẩm Truyện Kiều của Nguyễn Du.',
          wordCountMin: 300,
          wordCountMax: 500,
          timeLimitMinutes: 60,
          lesson: {
            id: '2',
            title: 'Truyện Kiều - Nguyễn Du',
            course: {
              id: '1',
              title: 'Văn Học Lớp 10 - Tác Phẩm Cổ Điển',
              gradeLevel: '10',
            },
          },
          createdAt: '2024-01-01',
        },
        {
          id: '2',
          title: 'Cảm nhận về thơ tình Xuân Diệu',
          prompt: 'Hãy trình bày cảm nhận của em về thơ tình của Xuân Diệu. Chọn một bài thơ cụ thể để phân tích.',
          wordCountMin: 250,
          wordCountMax: 400,
          timeLimitMinutes: 45,
          lesson: {
            id: '4',
            title: 'Xuân Diệu và Thơ Tình',
            course: {
              id: '2',
              title: 'Văn Học Lớp 11 - Thơ Ca Hiện Đại',
              gradeLevel: '11',
            },
          },
          createdAt: '2024-01-01',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || quiz.lesson.course.gradeLevel === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const filteredEssays = essayExercises.filter(essay => {
    const matchesSearch = essay.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         essay.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || essay.lesson.course.gradeLevel === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="bg-nc-cream min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-nc-dark-orange mb-4">
            Luyện Tập
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Củng cố kiến thức qua các bài tập trắc nghiệm và bài tập viết luận
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'quizzes'
                  ? 'bg-nc-gold text-white'
                  : 'text-gray-600 hover:text-nc-gold'
              }`}
            >
              <AcademicCapIcon className="h-4 w-4 inline mr-2" />
              Bài tập trắc nghiệm
            </button>
            <button
              onClick={() => setActiveTab('essays')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'essays'
                  ? 'bg-nc-gold text-white'
                  : 'text-gray-600 hover:text-nc-gold'
              }`}
            >
              <PencilIcon className="h-4 w-4 inline mr-2" />
              Bài tập viết luận
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài tập..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Grade Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as '10' | '11' | '12' | 'all')}
                className="input w-auto"
              >
                <option value="all">Tất cả lớp</option>
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Quizzes Tab */}
            {activeTab === 'quizzes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                  <div key={quiz.id} className="card hover:shadow-lg transition-shadow">
                    {/* Quiz Icon */}
                    <div className="h-16 w-16 bg-nc-gold rounded-lg flex items-center justify-center mb-4">
                      <AcademicCapIcon className="h-8 w-8 text-white" />
                    </div>

                    {/* Quiz Info */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-nc-gold text-white text-xs px-2 py-1 rounded-full">
                          Lớp {quiz.lesson.course.gradeLevel}
                        </span>
                        <span className="text-sm text-gray-500">
                          {quiz.maxAttempts} lần thử
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-nc-dark-orange mb-2">
                        {quiz.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {quiz.description}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <BookOpenIcon className="h-4 w-4 mr-1" />
                        <span className="truncate">{quiz.lesson.course.title}</span>
                      </div>

                      {quiz.timeLimitMinutes && (
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>{quiz.timeLimitMinutes} phút</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/practice/quiz/${quiz.id}`}
                      className="btn-primary w-full text-center"
                    >
                      Bắt đầu làm bài
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Essays Tab */}
            {activeTab === 'essays' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEssays.map((essay) => (
                  <div key={essay.id} className="card hover:shadow-lg transition-shadow">
                    {/* Essay Icon */}
                    <div className="h-16 w-16 bg-nc-orange rounded-lg flex items-center justify-center mb-4">
                      <PencilIcon className="h-8 w-8 text-white" />
                    </div>

                    {/* Essay Info */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-nc-orange text-white text-xs px-2 py-1 rounded-full">
                          Lớp {essay.lesson.course.gradeLevel}
                        </span>
                        <span className="text-sm text-gray-500">
                          {essay.wordCountMin}-{essay.wordCountMax} từ
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-nc-dark-orange mb-2">
                        {essay.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {essay.prompt}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <BookOpenIcon className="h-4 w-4 mr-1" />
                        <span className="truncate">{essay.lesson.course.title}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{essay.timeLimitMinutes} phút</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/practice/essay/${essay.id}`}
                      className="btn-primary w-full text-center"
                    >
                      Bắt đầu viết bài
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && ((activeTab === 'quizzes' && filteredQuizzes.length === 0) || 
                     (activeTab === 'essays' && filteredEssays.length === 0)) && (
          <div className="text-center py-12">
            {activeTab === 'quizzes' ? (
              <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            ) : (
              <PencilIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              Không có bài tập nào
            </h3>
            <p className="text-gray-400">
              {searchTerm 
                ? `Không có bài tập nào phù hợp với từ khóa "${searchTerm}"`
                : `Hiện tại chưa có bài tập ${activeTab === 'quizzes' ? 'trắc nghiệm' : 'viết luận'} nào cho lớp ${selectedGrade === 'all' ? 'này' : selectedGrade}`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
