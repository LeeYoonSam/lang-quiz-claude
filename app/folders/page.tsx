import { FolderList } from "@/app/components/folders/FolderList";

export default function FoldersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">폴더</h1>
        <p className="text-gray-600">
          단어 세트를 폴더로 구성하여 체계적으로 관리하세요
        </p>
      </div>

      <FolderList />
    </div>
  );
}
