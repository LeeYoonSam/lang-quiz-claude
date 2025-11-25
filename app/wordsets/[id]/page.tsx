"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import {
  useWordSet,
  useDeleteWordSet,
  useUpdateWordSet,
  useCreateWord,
  useUpdateWord,
  useDeleteWord,
} from "@/hooks/useWordSets";
import Link from "next/link";

export default function WordSetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: wordset, isLoading, error } = useWordSet(id);
  const deleteWordSetMutation = useDeleteWordSet();
  const updateWordSetMutation = useUpdateWordSet(id);
  const createWordMutation = useCreateWord(id);
  const updateWordMutation = useUpdateWord("");
  const deleteWordMutation = useDeleteWord();

  const [isEditingSet, setIsEditingSet] = useState(false);
  const [setName, setSetName] = useState("");
  const [setDescription, setSetDescription] = useState("");
  const [wordText, setWordText] = useState("");
  const [wordMeaning, setWordMeaning] = useState("");
  const [editingWordId, setEditingWordId] = useState<string | null>(null);
  const [editWordText, setEditWordText] = useState("");
  const [editWordMeaning, setEditWordMeaning] = useState("");

  if (isLoading) {
    return <div className="text-center py-16">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">오류: {error.message}</div>;
  }

  if (!wordset) {
    return <div className="text-center py-16">세트를 찾을 수 없습니다</div>;
  }

  const handleUpdateSet = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateWordSetMutation.mutateAsync({
      name: setName || wordset.name,
      description: setDescription !== undefined ? setDescription : wordset.description,
    });
    setIsEditingSet(false);
  };

  const handleDeleteSet = async () => {
    if (confirm("이 세트와 포함된 모든 단어가 삭제됩니다. 계속하시겠습니까?")) {
      await deleteWordSetMutation.mutateAsync(id);
      router.push("/wordsets");
    }
  };

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordText.trim() || !wordMeaning.trim()) {
      alert("단어와 의미를 입력하세요");
      return;
    }
    await createWordMutation.mutateAsync({
      text: wordText,
      meaning: wordMeaning,
    });
    setWordText("");
    setWordMeaning("");
  };

  const handleUpdateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWordId) {
      await updateWordMutation.mutateAsync({
        text: editWordText,
        meaning: editWordMeaning,
      });
      setEditingWordId(null);
    }
  };

  const handleDeleteWord = async (wordId: string) => {
    if (confirm("단어를 삭제하시겠습니까?")) {
      await deleteWordMutation.mutateAsync(wordId);
    }
  };

  return (
    <div>
      <Link href="/wordsets" className="text-blue-600 hover:underline mb-4">
        ← 돌아가기
      </Link>

      {/* Set Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        {!isEditingSet ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {wordset.name}
            </h1>
            {wordset.description && (
              <p className="text-gray-600 mb-4">{wordset.description}</p>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSetName(wordset.name);
                  setSetDescription(wordset.description || "");
                  setIsEditingSet(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                수정
              </button>
              <button
                onClick={handleDeleteSet}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                삭제
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdateSet} className="space-y-4">
            <input
              type="text"
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              placeholder="세트 이름"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <textarea
              value={setDescription}
              onChange={(e) => setSetDescription(e.target.value)}
              placeholder="설명 (선택사항)"
              className="w-full px-4 py-2 border rounded"
              rows={3}
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => setIsEditingSet(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Add Word Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          단어 추가
        </h2>
        <form onSubmit={handleAddWord} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={wordText}
              onChange={(e) => setWordText(e.target.value)}
              placeholder="단어"
              className="px-4 py-2 border rounded"
              required
            />
            <input
              type="text"
              value={wordMeaning}
              onChange={(e) => setWordMeaning(e.target.value)}
              placeholder="의미"
              className="px-4 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            추가
          </button>
        </form>
      </div>

      {/* Words List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          단어 목록 ({wordset.words?.length || 0}개)
        </h2>

        {!wordset.words || wordset.words.length === 0 ? (
          <p className="text-gray-600">단어를 추가해보세요</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">단어</th>
                  <th className="text-left py-3 px-4 font-semibold">의미</th>
                  <th className="text-right py-3 px-4 font-semibold">작업</th>
                </tr>
              </thead>
              <tbody>
                {wordset.words.map((word) => (
                  <tr key={word.id} className="border-b hover:bg-gray-50">
                    {editingWordId === word.id ? (
                      <>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={editWordText}
                            onChange={(e) => setEditWordText(e.target.value)}
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={editWordMeaning}
                            onChange={(e) =>
                              setEditWordMeaning(e.target.value)
                            }
                            className="w-full px-2 py-1 border rounded"
                          />
                        </td>
                        <td className="text-right py-3 px-4 space-x-2">
                          <button
                            onClick={handleUpdateWord}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => setEditingWordId(null)}
                            className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                          >
                            취소
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4">{word.text}</td>
                        <td className="py-3 px-4">{word.meaning}</td>
                        <td className="text-right py-3 px-4 space-x-2">
                          <button
                            onClick={() => {
                              setEditingWordId(word.id);
                              setEditWordText(word.text);
                              setEditWordMeaning(word.meaning);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteWord(word.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            삭제
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
