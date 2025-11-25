export default function Home() {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        단어 세트 관리 시스템
      </h1>
      <p className="text-gray-600 mb-8">
        어휘 학습을 위한 단어 세트를 생성하고 관리하세요.
      </p>
      <a
        href="/wordsets"
        className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        세트 목록으로 이동
      </a>
    </div>
  );
}
