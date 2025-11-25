"use client";

import Link from "next/link";

interface FolderCardProps {
  id: string;
  name: string;
  description?: string;
  wordSetCount: number;
}

export function FolderCard({
  id,
  name,
  description,
  wordSetCount,
}: FolderCardProps) {
  return (
    <Link href={`/folders/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {wordSetCount}개의 세트
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            보기
          </span>
        </div>
      </div>
    </Link>
  );
}
