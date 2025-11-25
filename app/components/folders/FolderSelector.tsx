"use client";

import { useQuery } from "@tanstack/react-query";

interface FolderSelectorProps {
  value: string | null;
  onChange: (folderId: string | null) => void;
  disabled?: boolean;
}

// @UI-FOLDER-SELECTOR
export function FolderSelector({
  value,
  onChange,
  disabled = false,
}: FolderSelectorProps) {
  const { data: folders, isLoading } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const res = await fetch("/api/folders");
      if (!res.ok) throw new Error("폴더 목록 조회 실패");
      return res.json();
    },
  });

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        폴더
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={disabled || isLoading}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">없음 (루트 영역)</option>
        {folders?.map((folder: any) => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>
    </div>
  );
}
