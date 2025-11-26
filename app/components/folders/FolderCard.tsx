"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";

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
      <Card variant="interactive">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-900">
            {name}
          </CardTitle>
          {description && (
            <CardDescription className="text-sm text-neutral-600 mt-2 line-clamp-2">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardFooter>
          <Badge variant="primary" size="sm">
            {wordSetCount}개 세트
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
