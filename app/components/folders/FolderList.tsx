"use client";

import { useQuery } from "@tanstack/react-query";
import { FolderCard } from "./FolderCard";
import Link from "next/link";

// @UI-FOLDER-LIST
export function FolderList() {
  const { data: folders, isLoading, error } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const res = await fetch("/api/folders");
      if (!res.ok) throw new Error("폴더 목록 조회 실패");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">로드 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        폴더 목록을 불러올 수 없습니다.
      </div>
    );
  }

  if (!folders || folders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          폴더를 만들어 단어 세트를 정리하세요
        </p>
        <Link
          href="/folders/new"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          새 폴더 만들기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/folders/new"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-6"
        >
          새 폴더 만들기
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map((folder: any) => (
          <FolderCard
            key={folder.id}
            id={folder.id}
            name={folder.name}
            description={folder.description}
            wordSetCount={folder._count.wordSets}
          />
        ))}
      </div>
    </div>
  );
}
