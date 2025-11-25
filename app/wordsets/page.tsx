"use client";

import { useWordSets } from "@/hooks/useWordSets";
import Link from "next/link";

export default function WordSetsPage() {
  const { data: wordsets, isLoading, error } = useWordSets();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">오류: {error.message}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">단어 세트</h1>
        <Link
          href="/wordsets/new"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          새 세트 만들기
        </Link>
      </div>

      {!wordsets || wordsets.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg mb-4">첫 세트를 만들어보세요</p>
          <Link
            href="/wordsets/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            세트 생성하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wordsets.map((wordset) => (
            <Link
              key={wordset.id}
              href={`/wordsets/${wordset.id}`}
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {wordset.name}
              </h3>
              {wordset.description && (
                <p className="text-gray-600 text-sm mb-4">
                  {wordset.description}
                </p>
              )}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{wordset.wordCount || 0}개 단어</span>
                <span>
                  {new Date(wordset.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
