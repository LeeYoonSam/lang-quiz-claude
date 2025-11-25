"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FolderFormProps {
  initialData?: {
    id: string;
    name: string;
    description?: string;
  };
  onSuccess?: () => void;
}

// @UI-FOLDER-FORM
export function FolderForm({ initialData, onSuccess }: FolderFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `/api/folders/${initialData.id}`
        : "/api/folders";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "요청 실패");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("폴더 이름을 입력하세요");
      return;
    }

    if (name.length > 100) {
      setError("폴더 이름은 100자 이하여야 합니다");
      return;
    }

    if (description.length > 500) {
      setError("설명은 500자 이하여야 합니다");
      return;
    }

    mutation.mutate({ name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          폴더 이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="폴더 이름을 입력하세요"
          maxLength={100}
          disabled={mutation.isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          {name.length}/100
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          설명
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="폴더 설명을 입력하세요"
          maxLength={500}
          rows={3}
          disabled={mutation.isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          {description.length}/500
        </p>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition"
      >
        {mutation.isPending
          ? "처리 중..."
          : initialData
            ? "수정"
            : "생성"}
      </button>
    </form>
  );
}
