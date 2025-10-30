'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Attempt = {
  id: string;
  user: { id: string; firstName: string; lastName: string; email: string };
  startedAt: string;
  completedAt?: string | null;
  score: number;
  totalPoints: number;
};

type FullAttempt = Attempt & {
  answers: {
    id: string;
    question: { id: string; questionText: string; points: number };
    answerText?: string | null;
    selectedOption?: { id: string; optionText: string } | null;
    isCorrect?: boolean | null;
    pointsEarned: number;
  }[];
};

export default function ManageExercisePage() {
  const params = useParams<{ id: string }>();
  const quizId = params?.id as string;
  const [inProgress, setInProgress] = useState<Attempt[]>([]);
  const [completed, setCompleted] = useState<Attempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<FullAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!quizId) return;
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`http://localhost:3001/api/quizzes/${quizId}/attempts?status=in_progress`, { credentials: 'include' }),
        fetch(`http://localhost:3001/api/quizzes/${quizId}/attempts?status=completed`, { credentials: 'include' }),
      ]);
      setInProgress(await pRes.json());
      setCompleted(await cRes.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [quizId]);

  const openAttempt = async (attemptId: string) => {
    const res = await fetch(`http://localhost:3001/api/quizzes/attempts/${attemptId}`, { credentials: 'include' });
    const data = await res.json();
    setSelectedAttempt(data);
  };

  const gradeAnswer = async (answerId: string, pointsEarned: number, isCorrect: boolean) => {
    await fetch(`http://localhost:3001/api/quizzes/attempts/answers/${answerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ pointsEarned, isCorrect }),
    });
    if (selectedAttempt) openAttempt(selectedAttempt.id);
  };

  return (
    <div className="bg-nc-cream min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-nc-dark-orange mb-6">Quản lý bài tập</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Đang làm</h2>
            {loading ? (
              <div>Đang tải...</div>
            ) : (
              <ul className="divide-y">
                {inProgress.map((a) => (
                  <li key={a.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{a.user.firstName} {a.user.lastName}</div>
                      <div className="text-sm text-gray-500">Bắt đầu: {new Date(a.startedAt).toLocaleString()}</div>
                    </div>
                    <button className="btn-secondary" onClick={() => openAttempt(a.id)}>Xem</button>
                  </li>
                ))}
                {inProgress.length === 0 && <div className="text-sm text-gray-500">Không có</div>}
              </ul>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Đã nộp</h2>
            {loading ? (
              <div>Đang tải...</div>
            ) : (
              <ul className="divide-y">
                {completed.map((a) => (
                  <li key={a.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{a.user.firstName} {a.user.lastName}</div>
                      <div className="text-sm text-gray-500">Điểm: {a.score}/{a.totalPoints}</div>
                    </div>
                    <button className="btn-secondary" onClick={() => openAttempt(a.id)}>Chấm</button>
                  </li>
                ))}
                {completed.length === 0 && <div className="text-sm text-gray-500">Không có</div>}
              </ul>
            )}
          </div>
        </div>

        {selectedAttempt && (
          <div className="card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Bài làm của {selectedAttempt.user.firstName} {selectedAttempt.user.lastName}</h3>
            </div>
            <div className="space-y-4">
              {selectedAttempt.answers.map((ans, idx) => (
                <div key={ans.id} className="border rounded p-3">
                  <div className="text-sm text-gray-500 mb-1">Câu {idx + 1} • {ans.question.points} điểm</div>
                  <div className="font-medium mb-2">{ans.question.questionText}</div>
                  {ans.selectedOption ? (
                    <div className="mb-2">Chọn: {ans.selectedOption.optionText}</div>
                  ) : (
                    <div className="mb-2 whitespace-pre-wrap">Trả lời: {ans.answerText || '(trống)'}</div>
                  )}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!ans.isCorrect}
                        onChange={(e) => gradeAnswer(ans.id, ans.pointsEarned, e.target.checked)}
                      />
                      Đúng
                    </label>
                    <div className="flex items-center gap-2">
                      <span>Điểm:</span>
                      <input
                        className="input w-24"
                        type="number"
                        min={0}
                        value={ans.pointsEarned}
                        onChange={(e) => gradeAnswer(ans.id, Number(e.target.value), ans.isCorrect ?? false)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





