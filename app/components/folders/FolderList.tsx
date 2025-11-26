"use client";

import { useQuery } from "@tanstack/react-query";
import { FolderCard } from "./FolderCard";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { Skeleton } from "@/app/components/ui/Skeleton";

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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 border border-error-200 text-error-700 px-6 py-4 rounded-lg">
        <p className="font-medium">폴더 목록을 불러올 수 없습니다</p>
        <p className="text-sm mt-1">{(error as Error).message}</p>
      </div>
    );
  }

  if (!folders || folders.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">아직 폴더가 없습니다</h2>
        <p className="text-neutral-600 mb-6">폴더를 만들어 단어 세트를 정리하세요</p>
        <Link href="/folders/new">
          <Button variant="primary" size="lg">
            새 폴더 만들기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/folders/new">
        <Button variant="primary" size="md">
          새 폴더 만들기
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
