# SPEC-WORDSET-001 구현 계획

## 목차

1. [작업 개요](#작업-개요)
2. [작업 분해 및 우선순위](#작업-분해-및-우선순위)
3. [기술 스택 상세](#기술-스택-상세)
4. [아키텍처 설계](#아키텍처-설계)
5. [데이터베이스 설계](#데이터베이스-설계)
6. [API 설계 및 구현 전략](#api-설계-및-구현-전략)
7. [UI/UX 설계](#uiux-설계)
8. [TDD 사이클 계획](#tdd-사이클-계획)
9. [품질 보증](#품질-보증)
10. [리스크 및 완화 전략](#리스크-및-완화-전략)

---

## 작업 개요

**프로젝트명**: 단어 세트 관리 시스템
**SPEC ID**: SPEC-WORDSET-001
**목표**: 사용자가 학습을 위한 단어 세트를 생성하고 관리할 수 있는 풀스택 웹 애플리케이션 구현

**핵심 기능**:
- 단어 세트 CRUD (생성, 조회, 수정, 삭제)
- 단어 CRUD (세트 내 단어 추가, 수정, 삭제)
- 향후 폴더 기능을 위한 확장 가능한 데이터 모델

---

## 작업 분해 및 우선순위

### Phase 1: 기반 구축 (우선순위: 최고)

#### 1.1 환경 설정
- [ ] Next.js 15 프로젝트 초기화
- [ ] TypeScript 설정
- [ ] Tailwind CSS 설정
- [ ] ESLint, Prettier 설정
- [ ] 테스트 환경 설정 (Jest, React Testing Library, Playwright)

#### 1.2 데이터베이스 설정
- [ ] PostgreSQL 16 설치 및 설정
- [ ] Prisma ORM 설정
- [ ] Prisma 스키마 정의 (WordSet, Word 모델)
- [ ] 초기 마이그레이션 생성 및 적용
- [ ] Seed 데이터 준비 (개발/테스트용)

**의존성**: 1.1 완료 후 1.2 시작

### Phase 2: API 구현 (우선순위: 높음)

#### 2.1 단어 세트 API
- [ ] POST /api/wordsets - 세트 생성 (TDD)
- [ ] GET /api/wordsets - 세트 목록 조회 (TDD)
- [ ] GET /api/wordsets/[id] - 세트 상세 조회 (TDD)
- [ ] PUT /api/wordsets/[id] - 세트 수정 (TDD)
- [ ] DELETE /api/wordsets/[id] - 세트 삭제 (TDD, Cascade 테스트)

#### 2.2 단어 API
- [ ] POST /api/wordsets/[id]/words - 단어 추가 (TDD)
- [ ] PUT /api/words/[id] - 단어 수정 (TDD)
- [ ] DELETE /api/words/[id] - 단어 삭제 (TDD)

**의존성**: Phase 1 완료 후 시작

### Phase 3: UI 구현 (우선순위: 높음)

#### 3.1 공통 컴포넌트
- [ ] Button 컴포넌트 (TDD)
- [ ] Input 컴포넌트 (TDD)
- [ ] Card 컴포넌트 (TDD)
- [ ] Dialog (확인 다이얼로그) 컴포넌트 (TDD)
- [ ] Toast (알림) 컴포넌트 (TDD)

#### 3.2 단어 세트 관리 UI
- [ ] WordSetList 페이지 (/wordsets) (TDD)
- [ ] WordSetDetail 페이지 (/wordsets/[id]) (TDD)
- [ ] WordSetForm 컴포넌트 (생성/수정) (TDD)
- [ ] EmptyState 컴포넌트 (빈 상태 안내) (TDD)

#### 3.3 단어 관리 UI
- [ ] WordForm 컴포넌트 (추가/수정) (TDD)
- [ ] WordList 컴포넌트 (단어 목록 테이블) (TDD)
- [ ] WordItem 컴포넌트 (개별 단어 표시/수정) (TDD)

**의존성**: Phase 2 완료 후 시작 (API 준비 필요)

### Phase 4: 상태 관리 및 통합 (우선순위: 중간)

#### 4.1 TanStack Query 설정
- [ ] Query Client 설정
- [ ] 단어 세트 Query Hooks (useWordSets, useWordSet)
- [ ] 단어 세트 Mutation Hooks (useCreateWordSet, useUpdateWordSet, useDeleteWordSet)
- [ ] 단어 Mutation Hooks (useCreateWord, useUpdateWord, useDeleteWord)
- [ ] Optimistic Updates 설정

**의존성**: Phase 2, 3 완료 후 시작

### Phase 5: E2E 테스트 및 품질 보증 (우선순위: 중간)

#### 5.1 E2E 테스트
- [ ] 세트 생성 플로우 테스트
- [ ] 단어 추가 플로우 테스트
- [ ] 세트 수정 플로우 테스트
- [ ] 세트 삭제 및 Cascade 테스트
- [ ] 빈 상태 UI 테스트

#### 5.2 품질 검증
- [ ] 테스트 커버리지 90% 이상 달성
- [ ] 접근성 검증 (WCAG 2.1 AA 기준)
- [ ] 성능 테스트 (API 응답 시간 < 500ms)
- [ ] 반응형 디자인 검증 (모바일, 태블릿, 데스크톱)

**의존성**: Phase 4 완료 후 시작

### Phase 6: 문서화 및 배포 준비 (우선순위: 낮음)

#### 6.1 문서화
- [ ] README.md 작성 (설치, 실행, 테스트 가이드)
- [ ] API 문서 자동 생성 (Swagger/OpenAPI)
- [ ] 컴포넌트 Storybook 문서

#### 6.2 배포 준비
- [ ] 환경 변수 설정 (.env.example)
- [ ] 프로덕션 빌드 테스트
- [ ] Docker 컨테이너화 (선택)
- [ ] Vercel/AWS 배포 설정

**의존성**: Phase 5 완료 후 시작

---

## 기술 스택 상세

### Frontend

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | ^15.1.0 | 풀스택 React 프레임워크 |
| React | 19 | UI 라이브러리 |
| TypeScript | 최신 stable | 타입 안전성 |
| TanStack Query | ^5.59.0 | 서버 상태 관리 |
| Tailwind CSS | ^3.4.0 | 유틸리티 기반 스타일링 |

### Backend

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js API Routes | 15.1.0 | 서버리스 API |
| Prisma ORM | ^5.22.0 | 데이터베이스 ORM |
| PostgreSQL | 16 | 관계형 데이터베이스 |

### Development & Testing

| 기술 | 버전 | 용도 |
|------|------|------|
| Jest | 최신 | 단위 테스트 |
| React Testing Library | 최신 | 컴포넌트 테스트 |
| Playwright | 최신 | E2E 테스트 |
| ESLint | 최신 | 코드 품질 |
| Prettier | 최신 | 코드 포맷팅 |

---

## 아키텍처 설계

### 디렉토리 구조

```
lang-quiz-claude/
├── prisma/
│   ├── schema.prisma          # Prisma 스키마 정의
│   ├── migrations/            # 데이터베이스 마이그레이션
│   └── seed.ts                # Seed 데이터
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── wordsets/
│   │   │   │   ├── route.ts                  # GET /api/wordsets, POST /api/wordsets
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts              # GET/PUT/DELETE /api/wordsets/[id]
│   │   │   │   │   └── words/
│   │   │   │   │       └── route.ts          # POST /api/wordsets/[id]/words
│   │   │   └── words/
│   │   │       └── [id]/
│   │   │           └── route.ts              # PUT/DELETE /api/words/[id]
│   │   ├── wordsets/
│   │   │   ├── page.tsx                      # 세트 목록 페이지
│   │   │   └── [id]/
│   │   │       └── page.tsx                  # 세트 상세 페이지
│   │   ├── layout.tsx                        # 루트 레이아웃
│   │   └── page.tsx                          # 홈페이지 (세트 목록으로 리다이렉트)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dialog.tsx
│   │   │   └── Toast.tsx
│   │   ├── wordsets/
│   │   │   ├── WordSetList.tsx
│   │   │   ├── WordSetCard.tsx
│   │   │   ├── WordSetForm.tsx
│   │   │   └── EmptyState.tsx
│   │   └── words/
│   │       ├── WordForm.tsx
│   │       ├── WordList.tsx
│   │       └── WordItem.tsx
│   ├── lib/
│   │   ├── prisma.ts                         # Prisma Client 싱글톤
│   │   ├── queryClient.ts                    # TanStack Query Client 설정
│   │   └── utils.ts                          # 유틸리티 함수
│   ├── hooks/
│   │   ├── useWordSets.ts                    # 세트 Query Hooks
│   │   ├── useWords.ts                       # 단어 Query Hooks
│   │   └── useToast.ts                       # 토스트 알림 Hook
│   └── types/
│       └── index.ts                          # 공통 타입 정의
├── tests/
│   ├── unit/                                 # 단위 테스트
│   ├── integration/                          # 통합 테스트
│   └── e2e/                                  # E2E 테스트 (Playwright)
└── .moai/
    └── specs/
        └── SPEC-WORDSET-001/
            ├── spec.md
            ├── plan.md
            └── acceptance.md
```

### 레이어 아키텍처

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│   (Next.js Pages & Components)      │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         State Management            │
│       (TanStack Query Hooks)        │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         API Layer                   │
│       (Next.js API Routes)          │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Data Access Layer           │
│         (Prisma ORM)                │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Database                    │
│         (PostgreSQL 16)             │
└─────────────────────────────────────┘
```

---

## 데이터베이스 설계

### Prisma 스키마

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model WordSet {
  id          String   @id @default(cuid())
  name        String
  description String?
  folderId    String?  // 향후 폴더 기능을 위한 필드
  words       Word[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([folderId])
}

model Word {
  id          String   @id @default(cuid())
  text        String   // 단어
  meaning     String   // 뜻
  wordSetId   String
  wordSet     WordSet  @relation(fields: [wordSetId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([wordSetId])
}
```

### 마이그레이션 전략

1. **초기 마이그레이션**: WordSet 및 Word 모델 생성
2. **인덱스 최적화**: folderId 및 wordSetId 인덱스 생성
3. **Cascade 설정**: WordSet 삭제 시 관련 Word 자동 삭제

**명령어**:
```bash
# 마이그레이션 생성
npx prisma migrate dev --name init_wordset_and_word

# 마이그레이션 적용
npx prisma migrate deploy

# Prisma Client 생성
npx prisma generate
```

### Seed 데이터 예시

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const wordSet1 = await prisma.wordSet.create({
    data: {
      name: '기초 영어 단어',
      description: '초급 학습자를 위한 기본 영어 단어',
      words: {
        create: [
          { text: 'apple', meaning: '사과' },
          { text: 'banana', meaning: '바나나' },
          { text: 'cat', meaning: '고양이' },
        ],
      },
    },
  });

  console.log('Seed 데이터 생성 완료', wordSet1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## API 설계 및 구현 전략

### API 엔드포인트 상세

#### POST /api/wordsets
**요청 검증**:
- `name`: 필수, 최소 1자, 최대 100자
- `description`: 선택, 최대 500자

**구현**:
```typescript
// src/app/api/wordsets/route.ts
export async function POST(request: Request) {
  const body = await request.json();

  // 입력 검증
  if (!body.name || body.name.length > 100) {
    return NextResponse.json(
      { error: '이름은 1-100자 사이여야 합니다' },
      { status: 400 }
    );
  }

  // 세트 생성
  const wordSet = await prisma.wordSet.create({
    data: {
      name: body.name,
      description: body.description,
    },
    include: { words: true },
  });

  return NextResponse.json(wordSet, { status: 201 });
}
```

#### GET /api/wordsets
**응답 형식**: 세트 목록 + 각 세트의 단어 개수

**구현**:
```typescript
export async function GET() {
  const wordSets = await prisma.wordSet.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { words: true },
      },
    },
  });

  // wordCount 필드 추가
  const wordSetsWithCount = wordSets.map((set) => ({
    ...set,
    wordCount: set._count.words,
  }));

  return NextResponse.json(wordSetsWithCount);
}
```

#### DELETE /api/wordsets/[id]
**Cascade 동작**: 세트 삭제 시 관련 단어 자동 삭제

**구현**:
```typescript
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.wordSet.delete({
    where: { id: params.id },
    // onDelete: Cascade 설정에 의해 자동 삭제
  });

  return new NextResponse(null, { status: 204 });
}
```

### 에러 처리 전략

| 상황 | HTTP 코드 | 응답 예시 |
|------|-----------|----------|
| 요청 검증 실패 | 400 | `{ error: "이름은 필수입니다" }` |
| 리소스 없음 | 404 | `{ error: "세트를 찾을 수 없습니다" }` |
| 서버 오류 | 500 | `{ error: "서버 오류가 발생했습니다" }` |

---

## UI/UX 설계

### 디자인 원칙

1. **간결함**: 학습에 집중할 수 있는 깔끔한 인터페이스
2. **직관성**: 별도 설명 없이 사용 가능한 UI
3. **반응성**: 모바일, 태블릿, 데스크톱 환경 대응
4. **접근성**: WCAG 2.1 AA 기준 준수

### 주요 페이지 와이어프레임

#### 세트 목록 페이지 (`/wordsets`)

```
┌────────────────────────────────────────┐
│  단어 세트 목록          [+ 새 세트]    │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────┐  ┌──────────────┐   │
│  │ TOEFL 단어   │  │ 일상 회화    │   │
│  │ 150개 단어   │  │ 80개 단어    │   │
│  │ 2025-11-20   │  │ 2025-11-18   │   │
│  └──────────────┘  └──────────────┘   │
│                                        │
│  ┌──────────────┐                     │
│  │ 비즈니스 영어│                     │
│  │ 200개 단어   │                     │
│  │ 2025-11-15   │                     │
│  └──────────────┘                     │
└────────────────────────────────────────┘
```

#### 세트 상세 페이지 (`/wordsets/[id]`)

```
┌────────────────────────────────────────┐
│  ← TOEFL 단어          [수정] [삭제]   │
│  TOEFL 시험 대비 단어 모음             │
├────────────────────────────────────────┤
│  단어 추가                             │
│  ┌──────────┐ ┌──────────┐ [추가]    │
│  │ 단어     │ │ 뜻       │            │
│  └──────────┘ └──────────┘            │
├────────────────────────────────────────┤
│  단어 목록 (150개)                     │
│  ┌────────────────────────────────┐   │
│  │ apple       사과      [수정][X]│   │
│  │ banana      바나나    [수정][X]│   │
│  │ cat         고양이    [수정][X]│   │
│  └────────────────────────────────┘   │
└────────────────────────────────────────┘
```

### 컴포넌트 스타일링 (Tailwind CSS)

**Button 컴포넌트**:
```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
  새 세트 만들기
</button>
```

**Card 컴포넌트**:
```tsx
<div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
  <h3 className="text-xl font-semibold">TOEFL 단어</h3>
  <p className="text-gray-600 mt-2">150개 단어</p>
</div>
```

---

## TDD 사이클 계획

### RED-GREEN-REFACTOR 사이클

#### 예시: POST /api/wordsets 구현

**RED (실패하는 테스트 작성)**:
```typescript
// tests/unit/api/wordsets.test.ts
describe('POST /api/wordsets', () => {
  it('should create a new word set', async () => {
    const response = await fetch('/api/wordsets', {
      method: 'POST',
      body: JSON.stringify({
        name: 'TOEFL 단어',
        description: 'TOEFL 시험 대비',
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.name).toBe('TOEFL 단어');
    expect(data.description).toBe('TOEFL 시험 대비');
  });
});
```

**GREEN (테스트 통과 최소 구현)**:
```typescript
// src/app/api/wordsets/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const wordSet = await prisma.wordSet.create({
    data: body,
  });
  return NextResponse.json(wordSet, { status: 201 });
}
```

**REFACTOR (코드 개선)**:
```typescript
export async function POST(request: Request) {
  const body = await request.json();

  // 입력 검증 추가
  const validation = validateWordSetInput(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }

  // 세트 생성
  const wordSet = await prisma.wordSet.create({
    data: {
      name: body.name,
      description: body.description,
    },
    include: { words: true },
  });

  return NextResponse.json(wordSet, { status: 201 });
}
```

### 테스트 커버리지 목표

| 레이어 | 커버리지 목표 | 테스트 유형 |
|--------|---------------|-------------|
| API Routes | 95% | 단위 + 통합 |
| UI Components | 90% | 단위 + 스냅샷 |
| Hooks | 90% | 단위 |
| E2E Scenarios | 100% | E2E (Playwright) |

---

## 품질 보증

### TRUST 5 기준

#### 1. Test-first (테스트 우선)
- **목표**: 모든 기능에 대해 테스트 작성 후 구현
- **검증**: 테스트 커버리지 90% 이상

#### 2. Readable (가독성)
- **목표**: 명확한 변수명, 적절한 주석, 일관된 코드 스타일
- **검증**: ESLint 규칙 100% 준수, 코드 리뷰

#### 3. Unified (통일성)
- **목표**: 일관된 API 응답 형식, 컴포넌트 패턴
- **검증**: 스타일 가이드 준수, Prettier 자동 포맷팅

#### 4. Secured (보안)
- **목표**: SQL Injection 방지 (Prisma), XSS 방지 (React 자동 이스케이프)
- **검증**: 보안 테스트, 입력 검증 100%

#### 5. Trackable (추적 가능)
- **목표**: 모든 변경사항 Git 커밋, SPEC 추적성 확보
- **검증**: TAG 체계 구축, 커밋 메시지 규칙 준수

---

## 리스크 및 완화 전략

| 리스크 | 영향도 | 완화 전략 |
|--------|--------|----------|
| PostgreSQL 설정 실패 | 높음 | Docker Compose로 로컬 DB 환경 구성, 설치 가이드 작성 |
| Prisma 마이그레이션 오류 | 중간 | 마이그레이션 테스트 환경 구축, 롤백 계획 수립 |
| Next.js 15 호환성 문제 | 중간 | 공식 문서 참고, 커뮤니티 이슈 모니터링 |
| 성능 요구사항 미달 | 낮음 | 인덱스 최적화, API 응답 시간 모니터링, 부하 테스트 |
| TDD 사이클 미준수 | 낮음 | TDD 체크리스트 활용, 코드 리뷰에서 테스트 확인 |

---

**END OF PLAN**

**다음 단계**: `/moai:2-run SPEC-WORDSET-001`로 TDD 구현 시작
