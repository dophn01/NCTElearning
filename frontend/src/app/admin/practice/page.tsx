'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { AcademicCapIcon, PencilIcon } from '@heroicons/react/24/outline';

type Quiz = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  lesson?: { course?: { title?: string; gradeLevel?: '10' | '11' | '12' } };
};

export default function AdminPracticePage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [grade, setGrade] = useState<'all' | '10' | '11' | '12'>('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const url = grade === 'all'
        ? 'http://localhost:3001/api/quizzes'
        : `http://localhost:3001/api/quizzes?gradeLevel=${grade}`;
      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      setQuizzes(data);
    } finally {
      setLoading(false);
    }
  };

  const removeQuiz = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài tập này? Hành động không thể hoàn tác.')) return;
    await fetch(`http://localhost:3001/api/quizzes/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { ...(typeof window !== 'undefined' && sessionStorage.getItem('accessToken') ? { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` } : {}) },
    });
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  useEffect(() => {
    load();
  }, [grade]);

  if (user?.role !== 'admin') {
    return (
      <div className="bg-nc-cream min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4">Không có quyền truy cập.</div>
      </div>
    );
  }

  return (
    <div className="bg-nc-cream min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-nc-dark-orange">Quản lý Bài Tập</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Thêm bài tập</button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-gray-600">Lọc theo lớp:</span>
          <select value={grade} onChange={(e) => setGrade(e.target.value as any)} className="input w-auto">
            <option value="all">Tất cả</option>
            <option value="10">Lớp 10</option>
            <option value="11">Lớp 11</option>
            <option value="12">Lớp 12</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse h-40" />
            ))
          ) : (
            quizzes.map((q) => (
              <div key={q.id} className="card">
                <div className="flex items-center justify-between mb-1">
                  {q.lesson?.course?.gradeLevel && (
                    <span className="text-xs bg-nc-gold text-white px-2 py-0.5 rounded-full">Lớp {q.lesson.course.gradeLevel}</span>
                  )}
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/practice/exercises/${q.id}/manage`} className="text-sm text-nc-dark-orange hover:underline">Quản lý</Link>
                    <button onClick={() => removeQuiz(q.id)} className="text-sm text-red-600 hover:underline">Xóa</button>
                  </div>
                </div>
                <div className="font-semibold text-nc-dark-orange mb-1">{q.title}</div>
                <div className="text-sm text-gray-600 line-clamp-2">{q.description}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal overlay for type selection */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-lg">
            <h2 className="text-xl font-bold text-nc-dark-orange mb-6 text-center">Chọn loại bài tập</h2>
            <div className="flex flex-col gap-6 items-center">
              <button
                className="w-full border-2 border-nc-gold px-5 py-4 rounded-lg flex items-center gap-4 text-xl font-semibold hover:bg-nc-gold/10 transition mb-2"
                onClick={() => { setShowModal(false); router.push('/admin/practice/exercises/new?type=doc_hieu'); }}
              >
                <AcademicCapIcon className="h-8 w-8 text-nc-gold" /> Đọc hiểu
              </button>
              <button
                className="w-full border-2 border-nc-orange px-5 py-4 rounded-lg flex items-center gap-4 text-xl font-semibold hover:bg-nc-orange/10 transition"
                onClick={() => { setShowModal(false); router.push('/admin/practice/exercises/new?type=viet'); }}
              >
                <PencilIcon className="h-8 w-8 text-nc-orange" /> Viết
              </button>
              <button className="mt-4 text-sm text-gray-500 hover:text-nc-dark-orange underline" onClick={() => setShowModal(false)}>Huỷ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


