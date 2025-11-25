"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { FolderForm } from "@/app/components/folders/FolderForm";
import Link from "next/link";
import { useState } from "react";

// @UI-FOLDER-DETAIL
export default function FolderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const folderId = params.id as string;

  const { data: folder, isLoading: folderLoading } = useQuery({
    queryKey: ["folder", folderId],
    queryFn: async () => {
      const res = await fetch(`/api/folders/${folderId}`);
      if (!res.ok) throw new Error("폴더를 찾을 수 없습니다");
      return res.json();
    },
  });

  const { data: wordsets = [], isLoading: wordsetsLoading } = useQuery({
    queryKey: ["folder-wordsets", folderId],
    queryFn: async () => {
      const res = await fetch(`/api/folders/${folderId}/wordsets`);
      if (!res.ok) throw new Error("단어 세트를 불러올 수 없습니다");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("폴더 삭제에 실패했습니다");
      return res.json();
    },
    onSuccess: (data) => {
      alert(
        `폴더가 삭제되었습니다. ${data.movedWordSets}개의 단어 세트가 루트로 이동되었습니다.`
      );
      router.push("/folders");
    },
  });

  if (folderLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">로드 중...</div>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">폴더를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/folders" className="text-blue-500 hover:underline text-sm mb-6">
        &larr; 폴더 목록으로 돌아가기
      </Link>

      {!isEditing ? (
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {folder.name}
              </h1>
              {folder.description && (
                <p className="text-gray-600">{folder.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {folder._count.wordSets}개의 세트
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                수정
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>

          {showDeleteConfirm && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
              <p className="text-red-700 mb-4">
                이 폴더를 삭제하시겠습니까? 폴더에 속한 {folder._count.wordSets}
                개의 단어 세트는 루트로 이동됩니다.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400"
                >
                  {deleteMutation.isPending ? "처리 중..." : "삭제"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-md">
          <h2 className="text-xl font-bold mb-4">폴더 수정</h2>
          <FolderForm
            initialData={folder}
            onSuccess={() => {
              setIsEditing(false);
              queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
            }}
          />
          <button
            onClick={() => setIsEditing(false)}
            className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">단어 세트</h2>

        {wordsetsLoading ? (
          <div className="text-center">로드 중...</div>
        ) : wordsets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>이 폴더에 단어 세트를 추가해보세요</p>
            <Link
              href={`/wordsets/new?folderId=${folderId}`}
              className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              새 세트 만들기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wordsets.map((wordset: any) => (
              <Link key={wordset.id} href={`/wordsets/${wordset.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {wordset.name}
                  </h3>
                  {wordset.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {wordset.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {wordset.wordCount}개의 단어
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
