---
title: UI 컴포넌트 가이드
description: Lang Quiz 애플리케이션의 재사용 가능한 UI 컴포넌트 라이브러리 완벽 가이드
version: 0.1.0
spec: SPEC-UI-001
created: 2025-11-26
updated: 2025-11-26
maintainer: "@user"
---

# UI 컴포넌트 가이드

Lang Quiz 애플리케이션의 **UI 컴포넌트 라이브러리** 완벽 가이드입니다.

모든 컴포넌트는 **Tailwind CSS** 기반으로 작성되었으며, **TypeScript**로 완벽한 타입 안전성을 제공합니다.

---

## 🎯 목차

1. [개요](#개요)
2. [컴포넌트 목록](#컴포넌트-목록)
3. [Button 컴포넌트](#button-컴포넌트)
4. [Card 컴포넌트](#card-컴포넌트)
5. [Input 컴포넌트](#input-컴포넌트)
6. [Badge 컴포넌트](#badge-컴포넌트)
7. [Skeleton 컴포넌트](#skeleton-컴포넌트)
8. [유틸리티 함수](#유틸리티-함수)
9. [디자인 토큰](#디자인-토큰)
10. [베스트 프랙티스](#베스트-프랙티스)

---

## 개요

### 🎨 디자인 철학

- **일관성**: 모든 컴포넌트가 통일된 디자인 언어 사용
- **접근성**: WCAG 2.1 AA 표준 준수
- **성능**: 최소 번들 크기, GPU 가속 애니메이션
- **확장성**: Tailwind CSS 커스터마이징으로 쉬운 테마 변경

### 📦 위치

```
app/components/ui/
├── Button.tsx           # 버튼 컴포넌트
├── Card.tsx            # 카드 컴포넌트
├── Input.tsx           # 입력 필드 컴포넌트
├── Badge.tsx           # 배지 컴포넌트
├── Skeleton.tsx        # 스켈레톤 로딩 컴포넌트
└── index.ts            # 통합 내보내기

app/lib/utils/
└── cn.ts               # 클래스 이름 병합 유틸리티
```

### 📥 임포트 방법

```typescript
// 개별 임포트
import { Button } from '@/app/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/app/components/ui/Card';
import { Input } from '@/app/components/ui/Input';
import { Badge } from '@/app/components/ui/Badge';
import { Skeleton } from '@/app/components/ui/Skeleton';

// 또는 index를 통한 임포트
import { Button, Card, CardHeader, Input, Badge, Skeleton } from '@/app/components/ui';

// 유틸리티
import { cn } from '@/app/lib/utils/cn';
```

---

## 컴포넌트 목록

| 컴포넌트 | 용도 | Variant | Sizes | 상태 |
|---------|------|---------|-------|------|
| **Button** | 액션 버튼 | primary, secondary, outline, ghost | sm, md, lg | ✅ 완성 |
| **Card** | 콘텐츠 컨테이너 | default, interactive | - | ✅ 완성 |
| **Input** | 텍스트 입력 | text, email, password | - | ✅ 완성 |
| **Badge** | 상태 표시 | primary, secondary, success, warning, error | - | ✅ 완성 |
| **Skeleton** | 로딩 상태 | - | - | ✅ 완성 |

---

## Button 컴포넌트

버튼은 사용자 액션을 트리거하는 기본 인터랙티브 요소입니다.

### 기본 사용법

```tsx
import { Button } from '@/app/components/ui/Button';

export default function Example() {
  return <Button>저장</Button>;
}
```

### Props 명세

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';  // 기본값: 'primary'
  size?: 'sm' | 'md' | 'lg';                                 // 기본값: 'md'
  loading?: boolean;                                          // 기본값: false
  disabled?: boolean;                                         // 기본값: false
  children: React.ReactNode;
}
```

### Variant (변형)

#### 1. Primary (기본)
주요 액션에 사용합니다.

```tsx
<Button variant="primary" size="md">
  저장
</Button>
```

**스타일**: 파란색 배경, 흰색 텍스트, 호버 시 진한 파란색
```css
bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800
```

#### 2. Secondary (보조)
보조 액션에 사용합니다.

```tsx
<Button variant="secondary">
  취소
</Button>
```

**스타일**: 회색 배경, 흰색 텍스트
```css
bg-neutral-600 text-white hover:bg-neutral-700 active:bg-neutral-800
```

#### 3. Outline (테두리)
중간 강도 액션에 사용합니다.

```tsx
<Button variant="outline">
  더 보기
</Button>
```

**스타일**: 파란색 테두리, 파란색 텍스트, 호버 시 밝은 배경
```css
border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100
```

#### 4. Ghost (유령)
텍스트만 표시하는 가벼운 스타일입니다.

```tsx
<Button variant="ghost">
  링크처럼 보기
</Button>
```

**스타일**: 투명 배경, 파란색 텍스트
```css
text-primary-600 hover:bg-primary-50 active:bg-primary-100
```

### Size (크기)

#### Small (sm)
정보성 버튼, 테이블 행동, 뱃지 근처에 사용합니다.

```tsx
<Button size="sm">삭제</Button>
```

**스타일**: `px-3 py-1 text-sm`

#### Medium (md) - 기본값
대부분의 상황에서 사용합니다.

```tsx
<Button size="md">저장</Button>
```

**스타일**: `px-4 py-2 text-base`

#### Large (lg)
주요 CTA (Call-To-Action)에 사용합니다.

```tsx
<Button size="lg">계속하기</Button>
```

**스타일**: `px-6 py-3 text-lg`

### 상태 (State)

#### Loading (로딩)
비동기 작업 중을 표시합니다.

```tsx
const [isLoading, setIsLoading] = useState(false);

function handleSave() {
  setIsLoading(true);
  // API 호출
  setTimeout(() => setIsLoading(false), 2000);
}

<Button loading={isLoading} onClick={handleSave}>
  저장 중...
</Button>
```

**동작**:
- 버튼이 비활성화됨
- 스피너 애니메이션 표시
- 투명도 감소 (opacity-50)

#### Disabled (비활성화)
상호작용이 불가능한 상태입니다.

```tsx
<Button disabled>
  사용 불가
</Button>
```

**동작**:
- 클릭 불가능 (cursor-not-allowed)
- 투명도 감소 (opacity-50)

### 사용 예시

#### 폼 제출
```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';

export function CreateWordSetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch('/api/wordsets', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="세트 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div className="flex gap-2">
        <Button type="submit" loading={isLoading}>
          생성
        </Button>
        <Button type="button" variant="secondary">
          취소
        </Button>
      </div>
    </form>
  );
}
```

#### 행동 바
```tsx
export function ActionBar() {
  return (
    <div className="flex gap-3">
      <Button variant="primary" size="md">
        저장
      </Button>
      <Button variant="outline" size="md">
        미리보기
      </Button>
      <Button variant="ghost" size="md">
        더 보기
      </Button>
    </div>
  );
}
```

---

## Card 컴포넌트

카드는 관련 콘텐츠를 그룹화하는 컨테이너입니다.

### 기본 사용법

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/app/components/ui/Card';

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>제목</CardTitle>
        <CardDescription>설명 텍스트</CardDescription>
      </CardHeader>
      <p className="px-6 pb-4">카드 콘텐츠</p>
      <CardFooter>
        <span>푸터 정보</span>
      </CardFooter>
    </Card>
  );
}
```

### Props 명세

#### Card
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive';  // 기본값: 'default'
  children: React.ReactNode;
}
```

#### CardHeader, CardTitle, CardDescription, CardFooter
모두 표준 HTML 속성을 상속합니다.

### Variant (변형)

#### Default (기본)
일반적인 정보 표시 카드입니다.

```tsx
<Card variant="default">
  <CardHeader>
    <CardTitle>기본 카드</CardTitle>
  </CardHeader>
  <p className="px-6 pb-4">내용</p>
</Card>
```

**스타일**: `bg-white rounded-lg shadow-sm p-6`

#### Interactive (인터랙티브)
클릭 가능한 카드로, 호버 효과가 있습니다.

```tsx
<Card
  variant="interactive"
  onClick={() => navigate('/wordsets/123')}
>
  <CardHeader>
    <CardTitle>클릭 가능한 카드</CardTitle>
  </CardHeader>
</Card>
```

**스타일**:
- 기본: `cursor-pointer shadow-sm`
- 호버: `shadow-lg transition-shadow duration-300`

### 사용 예시

#### 단어 세트 카드
```tsx
export function WordSetCard({ wordset }: { wordset: WordSet }) {
  return (
    <Card
      variant="interactive"
      onClick={() => router.push(`/wordsets/${wordset.id}`)}
    >
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
        <Badge variant="secondary">{wordset.wordCount}개 단어</Badge>
        <span className="text-xs text-neutral-500">
          {new Date(wordset.createdAt).toLocaleDateString('ko-KR')}
        </span>
      </CardFooter>
    </Card>
  );
}
```

#### 폴더 카드
```tsx
export function FolderCard({ folder }: { folder: Folder }) {
  return (
    <Card
      variant="interactive"
      onClick={() => router.push(`/folders/${folder.id}`)}
    >
      <CardHeader>
        <CardTitle>{folder.name}</CardTitle>
        <CardDescription>{folder.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <span className="text-sm text-neutral-600">
          {folder.wordsetCount}개 세트
        </span>
      </CardFooter>
    </Card>
  );
}
```

#### 그리드 레이아웃
```tsx
export function WordSetGrid({ wordsets }: { wordsets: WordSet[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wordsets.map((wordset) => (
        <WordSetCard key={wordset.id} wordset={wordset} />
      ))}
    </div>
  );
}
```

---

## Input 컴포넌트

입력 필드는 사용자 데이터 입력을 받습니다.

### 기본 사용법

```tsx
import { Input } from '@/app/components/ui/Input';
import { useState } from 'react';

export default function Example() {
  const [value, setValue] = useState('');

  return (
    <Input
      label="이름"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="이름을 입력하세요"
    />
  );
}
```

### Props 명세

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;              // 레이블 텍스트
  error?: string;              // 에러 메시지
  helperText?: string;         // 도움말 텍스트
  required?: boolean;          // 필수 표시
}
```

### 기본 스타일

```css
/* 기본 상태 */
w-full px-4 py-2 border rounded-lg text-base
focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500

/* 에러 상태 */
border-error-500 focus:ring-error-500
```

### 사용 예시

#### 기본 입력
```tsx
<Input
  label="이메일"
  type="email"
  placeholder="your@email.com"
  required
/>
```

#### 도움말 텍스트
```tsx
<Input
  label="비밀번호"
  type="password"
  helperText="최소 8자 이상이어야 합니다"
/>
```

#### 에러 상태
```tsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

function handleChange(value: string) {
  setEmail(value);
  if (!value.includes('@')) {
    setError('유효한 이메일을 입력하세요');
  } else {
    setError('');
  }
}

<Input
  label="이메일"
  type="email"
  value={email}
  onChange={(e) => handleChange(e.target.value)}
  error={error}
/>
```

#### 폼 전체
```tsx
'use client';

import { useState } from 'react';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';

export function WordSetForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = '이름은 필수입니다';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 제출 처리
    console.log('제출:', formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="세트 이름"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
      />
      <Input
        label="설명"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="선택사항"
      />
      <Button type="submit" variant="primary" size="md">
        생성
      </Button>
    </form>
  );
}
```

---

## Badge 컴포넌트

배지는 상태, 카테고리, 라벨을 표시합니다.

### 기본 사용법

```tsx
import { Badge } from '@/app/components/ui/Badge';

export default function Example() {
  return <Badge variant="primary">활성</Badge>;
}
```

### Props 명세

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}
```

### Variant (변형)

| Variant | 색상 | 사용처 |
|---------|------|--------|
| **primary** | 파란색 | 기본 상태 |
| **secondary** | 회색 | 보조 정보 |
| **success** | 초록색 | 성공, 완료 |
| **warning** | 주황색 | 주의, 경고 |
| **error** | 빨간색 | 오류, 위험 |

### 사용 예시

#### 단어 개수 표시
```tsx
<Badge variant="secondary">25개 단어</Badge>
```

#### 상태 표시
```tsx
<div className="space-y-2">
  <Badge variant="success">학습 완료</Badge>
  <Badge variant="warning">복습 필요</Badge>
  <Badge variant="error">오류 발생</Badge>
</div>
```

#### 태그 목록
```tsx
export function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
```

---

## Skeleton 컴포넌트

스켈레톤은 콘텐츠 로딩 중에 표시합니다.

### 기본 사용법

```tsx
import { Skeleton } from '@/app/components/ui/Skeleton';

export default function Example() {
  return <Skeleton />;
}
```

### Props 명세

```typescript
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  // 기본 HTML div 속성 모두 지원
}
```

### 사용 예시

#### 텍스트 스켈레톤
```tsx
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-2/3" />
</div>
```

#### 카드 스켈레톤
```tsx
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}
```

#### 그리드 스켈레톤
```tsx
export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
```

#### 로딩 상태 처리
```tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardFooter } from '@/app/components/ui/Card';
import { Skeleton } from '@/app/components/ui/Skeleton';
import { Badge } from '@/app/components/ui/Badge';

export function WordSetList() {
  const [wordsets, setWordsets] = useState<WordSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWordSets();
  }, []);

  async function fetchWordSets() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/wordsets');
      const data = await response.json();
      setWordsets(data);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between pt-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wordsets.map((wordset) => (
        <Card key={wordset.id} variant="interactive">
          <CardHeader>
            <CardTitle>{wordset.name}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Badge variant="secondary">{wordset.wordCount}개 단어</Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
```

---

## 유틸리티 함수

### cn() - 클래스 이름 병합

클래스 이름을 병합하고 Tailwind 충돌을 해결합니다.

#### 기본 사용법

```typescript
import { cn } from '@/app/lib/utils/cn';

// 기본 병합
cn('px-4 py-2', 'text-base') // "px-4 py-2 text-base"

// 조건부 클래스
cn(
  'px-4 py-2',
  isActive && 'bg-primary-600',
  disabled && 'opacity-50'
)

// Tailwind 충돌 해결
cn(
  'px-4 py-2',           // px-4, py-2
  isLarge && 'px-8 py-3' // px-8, py-3 (px-4는 제거됨)
)
```

#### 구현

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### 사용 예시

```tsx
import { cn } from '@/app/lib/utils/cn';

function Button({ isActive, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        isActive ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-900',
        className
      )}
      {...props}
    />
  );
}
```

---

## 디자인 토큰

### 색상 팔레트

#### Primary (주 색상) - 파란색
```
primary-50:  #eff6ff
primary-100: #dbeafe
primary-200: #bfdbfe
primary-300: #93c5fd
primary-400: #60a5fa
primary-500: #3b82f6  ← 기본
primary-600: #2563eb  ← 호버
primary-700: #1d4ed8  ← 액티브
primary-800: #1e40af
primary-900: #1e3a8a
primary-950: #172554
```

#### Semantic Colors
```
Success:  #22c55e (success-500), #16a34a (success-600)
Warning:  #f59e0b (warning-500), #d97706 (warning-600)
Error:    #ef4444 (error-500), #dc2626 (error-600)
Neutral:  회색 9단계 (neutral-50 ~ neutral-950)
```

### 타이포그래피

```
Font Family: Pretendard (한글), Inter (영문), system-ui (폴백)

Sizes:
  xs:   0.75rem (12px)   → line-height: 1rem
  sm:   0.875rem (14px)  → line-height: 1.25rem
  base: 1rem (16px)      → line-height: 1.5rem
  lg:   1.125rem (18px)  → line-height: 1.75rem
  xl:   1.25rem (20px)   → line-height: 1.75rem
  2xl:  1.5rem (24px)    → line-height: 2rem
  3xl:  1.875rem (30px)  → line-height: 2.25rem
  4xl:  2.25rem (36px)   → line-height: 2.5rem
```

### 스페이싱 시스템

```
xs:  0.5rem  (8px)
sm:  0.75rem (12px)
md:  1rem    (16px)
lg:  1.5rem  (24px)
xl:  2rem    (32px)
2xl: 3rem    (48px)
```

### 그림자 (Shadows)

```
shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

### 모서리 반경 (Border Radius)

```
rounded-sm: 0.125rem
rounded:    0.25rem
rounded-md: 0.375rem
rounded-lg: 0.5rem (기본 컴포넌트)
rounded-full: 9999px (원형)
```

### 전환/애니메이션 (Transitions)

```
duration-100: 100ms
duration-200: 200ms (기본 버튼)
duration-300: 300ms (기본 카드 호버)
duration-500: 500ms

Easing: ease-in-out (기본)
```

---

## 베스트 프랙티스

### 1. 컴포넌트 구성 (Composition)

```tsx
// ✅ Good: 작은 단위로 분리
export function WordSetGrid({ wordsets }: { wordsets: WordSet[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wordsets.map((wordset) => (
        <WordSetCard key={wordset.id} wordset={wordset} />
      ))}
    </div>
  );
}

// ❌ Bad: 모든 로직이 한 곳에
export function WordSetGrid({ wordsets }: { wordsets: WordSet[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wordsets.map((wordset) => (
        <Card key={wordset.id} variant="interactive">
          <CardHeader>
            <CardTitle>{wordset.name}</CardTitle>
          </CardHeader>
          {/* ... */}
        </Card>
      ))}
    </div>
  );
}
```

### 2. Props 확장

```tsx
// ✅ Good: HTML 속성 상속
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

// 사용
<Button variant="primary" onClick={handleClick} disabled />

// ❌ Bad: Props가 제한됨
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}
```

### 3. TypeScript 타입 안전

```tsx
// ✅ Good: 완벽한 타입
function WordSetCard({ wordset }: { wordset: WordSet }) {
  return <Card>{wordset.name}</Card>;
}

// ❌ Bad: any 타입
function WordSetCard({ wordset }: any) {
  return <Card>{wordset.name}</Card>;
}
```

### 4. 조건부 렌더링

```tsx
// ✅ Good: cn() 사용
<Button
  className={cn(
    'base-classes',
    isActive && 'active-classes'
  )}
/>

// ❌ Bad: 삼항 연산자
<Button className={isActive ? 'active-classes' : 'base-classes'} />
```

### 5. 접근성 (Accessibility)

```tsx
// ✅ Good: ARIA 레이블
<Input
  label="이메일"
  aria-invalid={!!error}
  aria-describedby={errorId}
/>

// ❌ Bad: ARIA 없음
<input placeholder="이메일" />
```

### 6. 성능 최적화

```tsx
// ✅ Good: 기울임꼴 참조
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <button ref={ref} {...props} />;
});

// ✅ Good: 메모이제이션
const WordSetCard = React.memo(function WordSetCard({ wordset }: Props) {
  return <Card>{wordset.name}</Card>;
});

// ❌ Bad: 무거운 재렌더링
export function WordSetList({ wordsets }: Props) {
  // 매번 새로운 객체 생성
  const styles = { padding: '16px' };
  return <div style={styles}>{/* ... */}</div>;
}
```

---

## 문제 해결

### 색상이 적용되지 않음

**원인**: Tailwind 클래스가 동적으로 생성되는 경우

```tsx
// ❌ Bad: 동적 클래스 생성
const colorClass = `bg-${color}-600`;
<div className={colorClass}>...</div>

// ✅ Good: 정적 클래스만 사용
const colorClass = color === 'red' ? 'bg-error-600' : 'bg-primary-600';
<div className={colorClass}>...</div>
```

### 스타일 충돌

**원인**: 같은 속성에 대해 여러 클래스 적용

```tsx
// ❌ Bad: 충돌 발생
<div className="px-4 px-8">...</div>

// ✅ Good: cn() 사용
<div className={cn('px-4', 'px-8')}>...</div>
```

### 포커스 스타일 없음

**원인**: CSS 리셋이 포커스 스타일 제거

```tsx
// ✅ Good: 포커스 링 명시
<Button className="focus:outline-none focus:ring-2 focus:ring-primary-500" />
```

---

## 관련 문서

- [API_REFERENCE.md](./API_REFERENCE.md) - REST API 명세
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - 프로젝트 구조
- [CHANGELOG.md](./CHANGELOG.md) - 변경 기록

---

## 버전 이력

| 버전 | 날짜 | 변경 사항 |
|------|------|----------|
| 0.1.0 | 2025-11-26 | 초기 가이드 작성 |

---

**문의**: @user (maintainer)
**마지막 수정**: 2025-11-26
**상태**: ✅ 활성
