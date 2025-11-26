"use client";

import { useWordSets } from "@/hooks/useWordSets";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Skeleton } from "@/app/components/ui/Skeleton";

export default function WordSetsPage() {
  const { data: wordsets, isLoading, error } = useWordSets();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900">단어 세트</h1>
        </div>
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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error-600 mb-2">오류가 발생했습니다</h2>
          <p className="text-neutral-600 mb-6">{error.message}</p>
        </div>
        <Link href="/wordsets">
          <Button variant="primary">다시 시도</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-neutral-900">단어 세트</h1>
        <Link href="/wordsets/new">
          <Button variant="primary" size="md">
            새 세트 만들기
          </Button>
        </Link>
      </div>

      {!wordsets || wordsets.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">아직 세트가 없습니다</h2>
          <p className="text-neutral-600 text-lg mb-6">첫 번째 단어 세트를 만들어보세요</p>
          <Link href="/wordsets/new">
            <Button variant="primary" size="lg">
              세트 생성하기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wordsets.map((wordset) => (
            <Link key={wordset.id} href={`/wordsets/${wordset.id}`}>
              <Card variant="interactive">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-neutral-900">
                    {wordset.name}
                  </CardTitle>
                  {wordset.description && (
                    <CardDescription className="text-sm text-neutral-600 mt-2 line-clamp-2">
                      {wordset.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <Badge variant="secondary" size="sm">
                    {wordset.wordCount || 0}개 단어
                  </Badge>
                  <span className="text-xs text-neutral-500">
                    {new Date(wordset.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
