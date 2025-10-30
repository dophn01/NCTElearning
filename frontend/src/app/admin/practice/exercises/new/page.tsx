'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

type QuestionInput = {
  questionText: string;
  points: number;
  options: { key: 'a' | 'b' | 'c' | 'd'; text: string; isCorrect: boolean }[];
};

type Lesson = {
  id: string;
  title: string;
  course: { id: string; title: string; gradeLevel: '10' | '11' | '12' };
};

export default function NewExercisePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chosenType = searchParams?.get('type') as 'doc_hieu' | 'viet' | null;

  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number | ''>('');
  const [gradeLevel, setGradeLevel] = useState<'10' | '11' | '12' | ''>('');
  const [questions, setQuestions] = useState<QuestionInput[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [practiceType, setPracticeType] = useState<'doc_hieu' | 'viet' | ''>('');
  const [topic, setTopic] = useState<string>('');
  const [description, setDescription] = useState('');

  const docHieuTopics = [
    { value: 'tho', label: 'Thơ' },
    { value: 'truyen', label: 'Truyện' },
    { value: 'ki', label: 'Kí' },
    { value: 'nghi_luan', label: 'Văn bản nghị luận' },
    { value: 'thong_tin', label: 'Văn bản thông tin' },
  ];
  const vietTopics = [
    { value: 'nghi_luan_xa_hoi', label: 'Nghị luận xã hội' },
    { value: 'nghi_luan_van_hoc', label: 'Nghị luận văn học' },
  ];

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Lessons no longer required for creation, but we may keep fetching if needed in future.

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: '',
        points: 1,
        options: [
          { key: 'a', text: '', isCorrect: false },
          { key: 'b', text: '', isCorrect: false },
          { key: 'c', text: '', isCorrect: false },
          { key: 'd', text: '', isCorrect: false },
        ],
      },
    ]);
  };

  const updateQuestion = (index: number, updater: (q: QuestionInput) => QuestionInput) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? updater(q) : q)));
  };

  const submitAll = async () => {
    if (!title) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }
    if (!gradeLevel) {
      setError('Vui lòng chọn lớp');
      return;
    }
    if (!practiceType) { setError('Vui lòng chọn loại luyện tập'); return; }
    if (!topic) { setError('Vui lòng chọn chủ đề'); return; }
    setError(null);
    setSubmitting(true);
    try {
      // Create quiz (use description as prompt)
      const quizRes = await fetch('http://localhost:3001/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description: prompt,
          timeLimitMinutes: typeof timeLimitMinutes === 'number' ? timeLimitMinutes : undefined,
          isPublished: true,
          gradeLevel,
          practiceType,
          topic,
        }),
      });
      if (!quizRes.ok) {
        const msg = await quizRes.text();
        throw new Error(msg || 'Failed to create exercise');
      }
      const quiz = await quizRes.json();

      // Create questions and options sequentially to preserve orderIndex
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const questionRes = await fetch('http://localhost:3001/api/quizzes/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          credentials: 'include',
          body: JSON.stringify({
            quizId: quiz.id,
            questionText: q.questionText,
            questionType: 'multiple_choice',
            orderIndex: i + 1,
            points: q.points,
          }),
        });
        if (!questionRes.ok) {
          const msg = await questionRes.text();
          throw new Error(msg || 'Failed to create question');
        }
        const createdQ = await questionRes.json();

        // options in a/c then b/d layout still map to orderIndex 1..4
        const orderMap = ['a', 'b', 'c', 'd'] as const;
        for (let j = 0; j < orderMap.length; j++) {
          const key = orderMap[j];
          const opt = q.options.find((o) => o.key === key)!;
          const optRes = await fetch('http://localhost:3001/api/quizzes/options', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            credentials: 'include',
            body: JSON.stringify({
              questionId: createdQ.id,
              optionText: opt.text,
              isCorrect: opt.isCorrect,
              orderIndex: j + 1,
            }),
          });
          if (!optRes.ok) {
            const msg = await optRes.text();
            throw new Error(msg || 'Failed to create option');
          }
        }
      }

      router.push('/practice');
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Không thể tạo bài tập. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // New: render based on chosenType
  if (!chosenType) {
    // Show a friendly message
    return <div className="bg-nc-cream min-h-screen py-12 flex items-center justify-center text-xl text-nc-dark-orange">Vui lòng chọn loại bài tập từ trang quản lý.</div>;
  }

  // If 'viet', render essay/viết box
  if (chosenType === 'viet') {
    return (
      <div className="bg-nc-cream min-h-screen py-8">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-nc-dark-orange mb-7">Tạo Bài Tập Viết (Nghị luận)</h1>
          <div className="card space-y-6">
            <div>
              <label className="label">Lớp</label>
              <select className="input" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value as any)}>
                <option value="">Chọn lớp</option>
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>
            </div>
            <div>
              <label className="label">Chủ đề</label>
              <select className="input" value={topic} onChange={(e) => setTopic(e.target.value)}>
                <option value="">Chọn chủ đề</option>
                {vietTopics.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Mô tả bài tập (mục đích, hướng dẫn, v.v.)</label>
              <textarea className="input min-h-[80px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Nhập mô tả cho bài tập (không bắt buộc)" />
            </div>
            <div>
              <label className="label">Đề bài</label>
              <textarea className="input min-h-[120px]" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Nhập đề bài" />
            </div>
            <div>
              <label className="label">Giới hạn thời gian (phút, tuỳ chọn)</label>
              <input className="input" type="number" min={0} value={timeLimitMinutes} onChange={(e) => setTimeLimitMinutes(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Ví dụ: 60" />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex justify-end">
              <button disabled={submitting} className="btn-primary" onClick={async () => {
                if (!gradeLevel) { setError('Vui lòng chọn lớp'); return; }
                if (!topic) { setError('Vui lòng chọn chủ đề'); return; }
                if (!prompt) { setError('Vui lòng nhập đề bài'); return; }
                setSubmitting(true); setError(null);
                try {
                  const res = await fetch('http://localhost:3001/api/essay-exercises', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                    credentials: 'include',
                    body: JSON.stringify({
                      title: prompt.slice(0, 32) + (prompt.length > 32 ? '...' : ''),
                      prompt,
                      description,
                      timeLimitMinutes: typeof timeLimitMinutes === 'number' ? timeLimitMinutes : undefined,
                      isPublished: true,
                      gradeLevel,
                      practiceType: 'viet',
                      topic,
                    }),
                  });
                  if (!res.ok) throw new Error(await res.text());
                  router.push('/admin/practice');
                } catch (e) { setError(e instanceof Error ? e.message : 'Không thể tạo bài tập.'); } finally { setSubmitting(false); }
              }}>
                {submitting ? 'Đang tạo...' : 'Tạo bài tập Viết'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // If 'doc_hieu', render original quiz flow as before
  return (
    <div className="bg-nc-cream min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-nc-dark-orange mb-6">TẠO BÀI TẬP ĐỌC HIỂU</h1>

        <div className="card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Tiêu đề</label>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tên bài tập" />
            </div>
            <div>
              <label className="label">Thời gian (phút)</label>
              <input
                className="input"
                type="number"
                min={0}
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="ví dụ: 30"
              />
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Lớp</label>
            <select className="input" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value as any)}>
              <option value="">Chọn lớp</option>
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
            </select>
          </div>
          <div>
            <label className="label">Loại luyện tập</label>
            <select
              className="input"
              value={practiceType}
              onChange={(e) => {
                setPracticeType(e.target.value as 'doc_hieu' | 'viet');
                setTopic(''); // reset topic
              }}
            >
              <option value="">Chọn loại luyện tập</option>
              <option value="doc_hieu">Đọc hiểu</option>
              <option value="viet">Viết</option>
            </select>
          </div>
        </div>
        {practiceType !== '' && (
          <div>
            <label className="label">Chủ đề</label>
            <select
              className="input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="">Chọn chủ đề</option>
              {(practiceType === 'doc_hieu' ? docHieuTopics : vietTopics).map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        )}

          <div>
            <label className="label">Đề bài</label>
            <textarea className="input min-h-[160px]" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Nhập đề bài / hướng dẫn" />
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-nc-dark-orange">Câu hỏi</h2>
            <button type="button" className="btn-primary" onClick={addQuestion}>Thêm câu hỏi</button>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm text-gray-500">Câu {idx + 1}</span>
                  <input
                    className="input flex-1"
                    value={q.questionText}
                    onChange={(e) => updateQuestion(idx, (prev) => ({ ...prev, questionText: e.target.value }))}
                    placeholder="Nhập nội dung câu hỏi"
                  />
                  <div className="w-28">
                    <label className="label">Điểm</label>
                    <input
                      className="input"
                      type="number"
                      min={0}
                      value={q.points}
                      onChange={(e) => updateQuestion(idx, (prev) => ({ ...prev, points: Number(e.target.value) }))}
                    />
                  </div>
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-700 text-sm"
                    onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== idx))}
                    aria-label="Xóa câu hỏi"
                  >
                    Xóa
                  </button>
                </div>

                {/* Options layout: a c on first row, b d on second row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['a', 'c'] as const).map((key) => {
                    const opt = q.options.find((o) => o.key === key)!;
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span className="w-6 font-medium uppercase">{key}</span>
                        <input
                          className="input flex-1"
                          value={opt.text}
                          onChange={(e) => updateQuestion(idx, (prev) => ({
                            ...prev,
                            options: prev.options.map((o) => (o.key === key ? { ...o, text: e.target.value } : o)),
                          }))}
                          placeholder={`Đáp án ${key.toUpperCase()}`}
                        />
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="radio"
                            name={`correct-${idx}`}
                            checked={opt.isCorrect}
                            onChange={(e) => updateQuestion(idx, (prev) => ({
                              ...prev,
                              options: prev.options.map((o) => ({ ...o, isCorrect: o.key === key })),
                            }))}
                          />
                          Đúng
                        </label>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {(['b', 'd'] as const).map((key) => {
                    const opt = q.options.find((o) => o.key === key)!;
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span className="w-6 font-medium uppercase">{key}</span>
                        <input
                          className="input flex-1"
                          value={opt.text}
                          onChange={(e) => updateQuestion(idx, (prev) => ({
                            ...prev,
                            options: prev.options.map((o) => (o.key === key ? { ...o, text: e.target.value } : o)),
                          }))}
                          placeholder={`Đáp án ${key.toUpperCase()}`}
                        />
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="radio"
                            name={`correct-${idx}`}
                            checked={opt.isCorrect}
                            onChange={() => updateQuestion(idx, (prev) => ({
                              ...prev,
                              options: prev.options.map((o) => ({ ...o, isCorrect: o.key === key })),
                            }))}
                          />
                          Đúng
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end">
            <button disabled={submitting} className="btn-primary" onClick={submitAll}>
              {submitting ? 'Đang tạo...' : 'Tạo bài tập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


