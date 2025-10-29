'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

type Option = { id: string; optionText: string; orderIndex: number };
type Question = { id: string; questionText: string; orderIndex: number; points: number; options: Option[] };
type Quiz = { id: string; title: string; description: string; timeLimitMinutes?: number; questions: Question[] };

export default function QuizTakePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const quizId = params?.id as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> selectedOptionId
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined'
      ? (sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken'))
      : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (!quizId) return;
    // If not authenticated, send to login
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
    if (!token && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3001/api/quizzes/${quizId}`);
        const data = await res.json();
        setQuiz(data);
        // Start attempt (requires auth cookie)
        const startRes = await fetch(`http://localhost:3001/api/quizzes/${quizId}/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          // JWT via Authorization header
          body: JSON.stringify({ userId: user?.id || '' }),
        });
        if (startRes.ok) {
          const started = await startRes.json();
          setAttemptId(started.id);
        } else if (startRes.status === 401) {
          router.push('/auth/login');
          return;
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [quizId, isAuthenticated]);

  const selectAnswer = async (questionId: string, selectedOptionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOptionId }));
    if (!attemptId) return;
    try {
      const ansRes = await fetch(`http://localhost:3001/api/quizzes/attempts/${attemptId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ questionId, selectedOptionId }),
      });
      if (ansRes.status === 401) {
        router.push('/auth/login');
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const submitAttempt = async () => {
    setSubmitting(true);
    try {
      let currentAttemptId = attemptId;
      if (!currentAttemptId) {
        // Try to start an attempt if one wasn't started successfully on load
        const startRes = await fetch(`http://localhost:3001/api/quizzes/${quizId}/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ userId: user?.id || '' }),
        });
        if (!startRes.ok) {
          const msg = await startRes.text();
          if (startRes.status === 401) {
            router.push('/auth/login');
            return;
          }
          alert(msg || 'Không thể bắt đầu bài làm. Vui lòng thử lại.');
          return;
        }
        const started = await startRes.json();
        currentAttemptId = started.id;
        setAttemptId(started.id);
      }

      const completeRes = await fetch(`http://localhost:3001/api/quizzes/attempts/${currentAttemptId}/complete`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
      });
      if (!completeRes.ok) {
        const msg = await completeRes.text();
        if (completeRes.status === 401) {
          router.push('/auth/login');
          return;
        }
        alert(msg || 'Không thể nộp bài.');
        return;
      }

      setShowSubmittedModal(true);
      setTimeout(() => {
        router.push('/practice');
      }, 1500);
    } catch (e) {
      console.error(e);
      alert('Không thể nộp bài.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !quiz) {
    return (
      <div className="bg-nc-cream min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className={`bg-nc-cream min-h-screen py-8 ${showSubmittedModal ? 'overflow-hidden' : ''}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="card">
          <h1 className="text-2xl font-bold text-nc-dark-orange mb-2">{quiz.title}</h1>
          <p className="text-gray-700 whitespace-pre-wrap">{quiz.description}</p>
        </div>

        <div className="space-y-4">
          {quiz.questions
            .slice()
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((q, idx) => (
              <div key={q.id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Câu {idx + 1} • {q.points} điểm</div>
                    <div className="font-medium mb-3">{q.questionText}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options
                    .slice()
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((opt) => (
                      <label key={opt.id} className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${answers[q.id] === opt.id ? 'border-nc-gold bg-yellow-50' : 'border-gray-200'}`}>
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[q.id] === opt.id}
                          onChange={() => selectAnswer(q.id, opt.id)}
                        />
                        <span>{opt.optionText}</span>
                      </label>
                    ))}
                </div>
              </div>
            ))}
        </div>

        <div className="flex justify-end">
          <button className="btn-primary" onClick={submitAttempt} disabled={submitting}>
            {submitting ? 'Đang nộp...' : 'Nộp bài'}
          </button>
        </div>
      </div>

      {showSubmittedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 bg-white rounded-lg shadow-xl px-6 py-5 w-80 text-center">
            <div className="text-lg font-semibold text-nc-dark-orange mb-2">Đã nộp bài</div>
            <div className="text-gray-700 mb-4">Vui lòng chờ giáo viên chấm điểm</div>
            <div className="text-xs text-gray-400">Đang chuyển về trang luyện tập...</div>
          </div>
        </div>
      )}
    </div>
  );
}


