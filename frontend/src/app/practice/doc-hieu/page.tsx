"use client";
import { useState } from "react";
import Link from "next/link";
import {
  AcademicCapIcon,
  BookOpenIcon,
  PuzzlePieceIcon,
  BeakerIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect } from "react";

const DOC_HIEU_TOPICS = [
  { value: "tho", label: "Thơ", icon: <PuzzlePieceIcon className="w-7 h-7 text-nc-gold" /> },
  { value: "truyen", label: "Truyện", icon: <BookOpenIcon className="w-7 h-7 text-nc-gold" /> },
  { value: "ki", label: "Kí", icon: <BeakerIcon className="w-7 h-7 text-nc-gold" /> },
  { value: "nghi_luan", label: "Văn bản nghị luận", icon: <DocumentTextIcon className="w-7 h-7 text-nc-gold" /> },
  { value: "thong_tin", label: "Văn bản thông tin", icon: <PencilSquareIcon className="w-7 h-7 text-nc-gold" /> },
];

export default function DocHieuSelectionPage() {
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<'10' | '11' | '12' | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/essay-exercises?practiceType=doc_hieu")
      .then(res => res.json())
      .then(setExercises)
      .catch(() => setExercises([]));
  }, []);

  // Filtering logic
  const filtered = exercises.filter(e => {
    if (selectedTopic && e.topic !== selectedTopic) return false;
    if (
      selectedGrade !== 'all' &&
      e.gradeLevel &&
      e.gradeLevel !== selectedGrade
    ) return false;
    if (searchTerm && !e.prompt.toLowerCase().includes(searchTerm.toLowerCase()) && !e.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    // Role-based: for student, restrict to their grade
    if (user?.role === 'user' && e.gradeLevel && e.gradeLevel !== user.gradeLevel) return false;
    return true;
  });

  return (
    <div className="bg-nc-cream min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-nc-dark-orange mb-2">
            Đọc Hiểu
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Chọn chủ đề Đọc hiểu mà bạn muốn luyện tập
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          {/* Step 1: Chọn chủ đề */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-3 text-nc-dark-orange">
              1. Chọn chủ đề Đọc hiểu
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 justify-center">
              {DOC_HIEU_TOPICS.map((topic) => (
                <button
                  key={topic.value}
                  onClick={() => setSelectedTopic(topic.value)}
                  className={`flex flex-col items-center justify-center px-4 py-3 border-2 rounded-lg transition-all cursor-pointer shadow-md focus:outline-none
                    ${selectedTopic === topic.value
                      ? "border-nc-gold bg-nc-gold/10"
                      : "border-gray-200 hover:border-nc-gold"}
                  `}
                >
                  {topic.icon}
                  <span className="mt-1 text-sm font-medium text-gray-800 text-center">
                    {topic.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Tùy chọn lọc và tìm kiếm */}
          {selectedTopic && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3 text-nc-dark-orange">
                2. Lọc bài tập đọc hiểu: 
                <span className="font-normal text-nc-gold ml-2">{DOC_HIEU_TOPICS.find(t => t.value === selectedTopic)?.label}</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tiêu đề hoặc từ khoá..."
                    className="w-full py-2 pl-10 pr-10 rounded-lg shadow-sm border border-gray-300 focus:border-nc-dark-orange focus:ring-2 focus:ring-nc-gold/20 transition placeholder-gray-400 text-gray-900 bg-white"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-nc-gold" />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-nc-dark-orange text-lg"
                      style={{ background: 'none', border: 'none' }}
                      aria-label="Xóa"
                    >×</button>
                  )}
                </div>
                {/* Grade Filter */}
                <div className="flex-1 w-full">
                  <select
                    className="input w-full"
                    value={selectedGrade}
                    onChange={e => setSelectedGrade(e.target.value as '10' | '11' | '12' | 'all')}
                  >
                    <option value="all">Tất cả lớp</option>
                    <option value="10">Lớp 10</option>
                    <option value="11">Lớp 11</option>
                    <option value="12">Lớp 12</option>
                  </select>
                </div>
              </div>
              {/* TODO: Render quiz/exercise cards filtered by topic/grade/searchTerm. Reuse card style from main practice page. */}
              <div className="py-6">
                {filtered.length === 0 ? (
                  <div className="text-center text-gray-400">
                    <AcademicCapIcon className="w-12 h-12 mx-auto mb-4 text-nc-gold" />
                    <p>Không có bài tập Đọc hiểu phù hợp.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map(e => (
                      <div key={e.id} className="bg-white rounded-lg shadow p-4 mb-4 border border-nc-gold">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs bg-nc-gold text-white px-2 py-0.5 rounded-full">Lớp {e.gradeLevel || 'N/A'}</span>
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{DOC_HIEU_TOPICS.find(t => t.value === e.topic)?.label}</span>
                        </div>
                        <div className="font-semibold text-nc-dark-orange mb-1">{e.title}</div>
                        <div className="text-sm text-gray-600 mb-2">{e.prompt}</div>
                        {/* Optionally add link/button to do this exercise */}
                        <Link href={`/practice/doc-hieu/${e.id}`} className="text-nc-gold hover:underline text-sm">Làm bài tập này →</Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="text-center">
          <Link href="/practice">
            <span className="text-nc-dark-orange hover:underline text-sm">← Quay lại trang Luyện tập</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
