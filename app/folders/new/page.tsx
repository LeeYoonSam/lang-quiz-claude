"use client";

import { FolderForm } from "@/app/components/folders/FolderForm";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewFolderPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/folders");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-6">
        <Link href="/folders" className="text-blue-500 hover:underline text-sm">
          &larr; 폴더 목록으로 돌아가기
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">새 폴더 만들기</h1>
        <p className="text-gray-600">
          단어 세트를 그룹화할 새 폴더를 생성합니다
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <FolderForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
