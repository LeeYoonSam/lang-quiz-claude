"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateWordSet } from "@/hooks/useWordSets";
import Link from "next/link";

export default function NewWordSetPage() {
  const router = useRouter();
  const createWordSetMutation = useCreateWordSet();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("이름은 필수입니다");
      return;
    }

    if (name.length > 100) {
      setError("이름은 100자 이하여야 합니다");
      return;
    }

    if (description.length > 500) {
      setError("설명은 500자 이하여야 합니다");
      return;
    }

    try {
      const result = await createWordSetMutation.mutateAsync({
        name,
        description: description || undefined,
      });
      router.push(`/wordsets/${result.id}`);
    } catch (err) {
      setError("세트 생성에 실패했습니다");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/wordsets" className="text-blue-600 hover:underline mb-4">
        ← 돌아가기
      </Link>

      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          새 단어 세트 생성
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              세트 이름 (필수)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: TOEFL 단어"
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {name.length}/100자
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              설명 (선택사항)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="세트에 대한 설명을 입력하세요"
              maxLength={500}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500자
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createWordSetMutation.isPending}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {createWordSetMutation.isPending ? "생성 중..." : "생성"}
            </button>
            <Link
              href="/wordsets"
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-400 transition text-center"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
