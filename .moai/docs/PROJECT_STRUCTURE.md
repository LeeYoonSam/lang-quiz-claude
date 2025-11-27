---
title: 프로젝트 구조
description: Lang Quiz 애플리케이션의 디렉토리 구조와 파일 조직 (Word Set, Folder, UI Design System, Learn System)
version: 0.3.0
spec: [SPEC-WORDSET-001, SPEC-FOLDER-001, SPEC-UI-001, SPEC-LEARN-001]
lastUpdated: 2025-11-27
maintainer: "@user"
---

# 프로젝트 구조

**Word Set Management System**의 전체 디렉토리 구조와 각 폴더의 목적, 역할, 그리고 파일 조직을 설명합니다.

## 전체 구조도

```
lang-quiz-claude/
│
├── app/                           # Next.js App Router (13+)
│   ├── api/                       # API Routes (백엔드)
│   │   ├── wordsets/             # Word Set API
│   │   │   ├── route.ts          # GET /api/wordsets, POST /api/wordsets
│   │   │   └── [id]/             # 동적 라우트
│   │   │       ├── route.ts      # GET/PUT/DELETE /api/wordsets/[id]
│   │   │       └── words/        # Word API (중첩)
│   │   │           └── route.ts  # POST /api/wordsets/[id]/words
│   │   └── words/                # Word API
│   │       └── [id]/
│   │           └── route.ts      # GET/PUT/DELETE /api/words/[id]
│   │
│   ├── wordsets/                  # Word Set 페이지
│   │   ├── page.tsx              # 단어 세트 목록 페이지
│   │   ├── new/
│   │   │   └── page.tsx          # 새 세트 생성 페이지
│   │   └── [id]/
│   │       └── page.tsx          # 단어 세트 상세 페이지
│   │
│   ├── layout.tsx                 # 루트 레이아웃 (메타데이터, 프로바이더)
│   ├── page.tsx                   # 홈페이지
│   └── providers.tsx              # React Query, 기타 프로바이더
│
├── lib/                           # 유틸리티 및 설정
│   ├── prisma.ts                 # Prisma Client 싱글톤
│   ├── utils.ts                  # 헬퍼 함수
│   ├── validators.ts             # 입력 검증 스키마
│   ├── utils/                    # UI 유틸리티 (SPEC-UI-001)
│   │   └── cn.ts                 # 클래스 이름 병합 함수 (clsx + tailwind-merge)
│   └── learn/                    # 학습 유틸리티 (SPEC-LEARN-001)
│       ├── sessionStorage.ts     # 세션 저장/로드/삭제
│       ├── shuffle.ts            # Fisher-Yates 셔플 알고리즘
│       └── __tests__/            # 유틸리티 테스트 (2개)
│           ├── sessionStorage.test.ts
│           └── shuffle.test.ts
│
├── hooks/                         # 커스텀 React Hooks
│   ├── useWordSets.ts            # Word Set 관련 훅 (React Query)
│   ├── useWords.ts               # Word 관련 훅 (React Query)
│   ├── useLocalStorage.ts        # 로컬 스토리지 훅
│   ├── useLearnSession.ts        # 학습 세션 상태 관리 (SPEC-LEARN-001)
│   ├── useSpeech.ts              # Web Speech API TTS (SPEC-LEARN-001)
│   ├── useKeyboard.ts            # 키보드 단축키 (SPEC-LEARN-001)
│   └── __tests__/                # 훅 테스트 (3개)
│       ├── useLearnSession.test.ts
│       ├── useSpeech.test.ts
│       └── useKeyboard.test.ts
│
├── components/                    # 재사용 가능한 React 컴포넌트
│   ├── ui/                       # UI 컴포넌트 라이브러리 (SPEC-UI-001)
│   │   ├── Button.tsx            # 버튼 컴포넌트 (primary, secondary, outline, ghost)
│   │   ├── Card.tsx              # 카드 컴포넌트 (default, interactive)
│   │   ├── Input.tsx             # 입력 필드 컴포넌트 (라벨, 에러, 헬퍼 텍스트)
│   │   ├── Badge.tsx             # 배지 컴포넌트 (상태 표시)
│   │   ├── Skeleton.tsx          # 스켈레톤 로딩 컴포넌트
│   │   └── index.ts              # UI 컴포넌트 통합 내보내기
│   ├── learn/                    # 플립 카드 학습 컴포넌트 (SPEC-LEARN-001)
│   │   ├── FlipCard.tsx          # 3D 플립 카드 (Framer Motion 애니메이션)
│   │   ├── LearnNavigation.tsx   # 이전/다음/완료 네비게이션
│   │   ├── LearnProgress.tsx     # 진행률 표시 및 프로그레스 바
│   │   ├── LearnComplete.tsx     # 학습 완료 화면 및 통계
│   │   └── __tests__/            # 학습 컴포넌트 테스트 (4개)
│   │       ├── FlipCard.test.tsx
│   │       ├── LearnNavigation.test.tsx
│   │       ├── LearnProgress.test.tsx
│   │       └── LearnComplete.test.tsx
│   ├── folders/                  # 폴더 기능 컴포넌트 (SPEC-FOLDER-001)
│   │   ├── FolderCard.tsx        # 폴더 카드
│   │   ├── FolderForm.tsx        # 폴더 생성/수정 폼
│   │   ├── FolderList.tsx        # 폴더 목록
│   │   └── FolderSelector.tsx    # 폴더 선택 드롭다운
│   ├── WordSetList.tsx           # Word Set 목록 컴포넌트
│   ├── WordSetDetail.tsx         # Word Set 상세 컴포넌트
│   ├── WordSetForm.tsx           # Word Set 생성/수정 폼
│   ├── WordForm.tsx              # Word 추가/수정 폼
│   ├── WordList.tsx              # Word 목록 컴포넌트
│   ├── DeleteDialog.tsx          # 삭제 확인 다이얼로그
│   └── LoadingSpinner.tsx        # 로딩 표시기
│
├── prisma/                        # 데이터베이스
│   ├── schema.prisma             # Prisma 스키마 정의
│   ├── migrations/               # 마이그레이션 히스토리
│   │   └── migration_lock.toml
│   └── seed.ts                   # 데이터베이스 시드 스크립트
│
├── __tests__/                     # 단위 테스트
│   ├── api/                      # API 테스트
│   │   ├── wordsets.test.ts
│   │   ├── folders.test.ts
│   │   ├── folders-http.test.ts
│   │   └── wordsets-folder.test.ts
│   ├── components/               # 컴포넌트 테스트
│   │   ├── ui/                   # UI 컴포넌트 테스트 (SPEC-UI-001)
│   │   │   ├── Button.test.tsx   # 20개 테스트 ✅
│   │   │   ├── Card.test.tsx     # 16개 테스트 ✅
│   │   │   ├── Input.test.tsx    # 13개 테스트 ✅
│   │   │   ├── Badge.test.tsx    # 8개 테스트 ✅
│   │   │   └── Skeleton.test.tsx # 14개 테스트 ✅
│   │   ├── WordSetForm.test.tsx
│   │   └── WordList.test.tsx
│   ├── config/                   # 설정 테스트
│   │   └── tailwind-theme.test.ts # 13개 테스트 (Tailwind 토큰) ✅
│   └── lib/                      # 유틸리티 테스트
│       ├── validators.test.ts
│       └── utils/
│           └── cn.test.ts        # 9개 테스트 (클래스 병합) ✅
│
├── e2e/                          # End-to-End 테스트 (Playwright)
│   ├── wordset.spec.ts           # Word Set 기능 E2E 테스트
│   └── word.spec.ts              # Word 기능 E2E 테스트
│
├── public/                        # 정적 자산
│   ├── favicon.ico
│   └── logo.svg
│
├── .moai/                        # MoAI Framework 구성 (자동 생성)
│   ├── config/                   # 프로젝트 설정
│   │   └── config.json
│   ├── specs/                    # SPEC 문서
│   │   └── SPEC-WORDSET-001/
│   │       ├── spec.md
│   │       ├── plan.md
│   │       └── acceptance.md
│   ├── docs/                     # Living Documents
│   │   ├── API_REFERENCE.md
│   │   ├── PROJECT_STRUCTURE.md
│   │   ├── DATABASE_SCHEMA.md
│   │   ├── CHANGELOG.md
│   │   └── index.md
│   ├── reports/                  # 동기화 보고서
│   │   └── sync-report-*.md
│   ├── logs/                     # 실행 로그
│   ├── cache/                    # 캐시 파일
│   └── scripts/                  # 유틸리티 스크립트
│
├── .github/                      # GitHub 설정
│   └── workflows/                # GitHub Actions
│       ├── test.yml
│       └── deploy.yml
│
├── .eslintrc.json                # ESLint 설정
├── .prettierrc.json              # Prettier 설정
├── jest.config.js                # Jest 설정
├── jest.setup.js                 # Jest 초기화
├── playwright.config.ts          # Playwright 설정
├── tsconfig.json                 # TypeScript 설정
├── next.config.ts                # Next.js 설정
├── postcss.config.cjs            # PostCSS 설정
├── tailwind.config.ts            # Tailwind CSS 설정
│
├── package.json                  # 프로젝트 의존성
├── package-lock.json             # 의존성 락 파일
├── README.md                     # 프로젝트 개요 및 설명서
├── IMPLEMENTATION_SUMMARY.md     # 구현 요약
├── TESTING_GUIDE.md              # 테스팅 가이드
├── .env.example                  # 환경 변수 예시
├── .gitignore                    # Git 무시 파일
└── LICENSE                       # 라이선스
```

---

## 주요 디렉토리 상세 설명

### 1. `app/` - Next.js 애플리케이션

**목적**: 프론트엔드 및 백엔드 코드를 포함하는 Next.js App Router

#### `app/api/` - REST API

```
app/api/
├── wordsets/
│   ├── route.ts              # POST (생성), GET (목록 조회)
│   └── [id]/
│       ├── route.ts          # GET (상세), PUT (수정), DELETE
│       └── words/
│           └── route.ts      # POST (단어 추가)
└── words/
    └── [id]/
        └── route.ts          # PUT (수정), DELETE
```

**책임**:
- RESTful API 엔드포인트 구현
- 요청 검증 및 에러 처리
- 데이터베이스 쿼리 실행
- JSON 응답 반환

**기술**:
- Next.js Route Handler
- Prisma ORM
- TypeScript

#### `app/wordsets/` - 페이지

```
app/wordsets/
├── page.tsx          # 목록 페이지 (/wordsets)
├── new/
│   └── page.tsx      # 생성 페이지 (/wordsets/new)
└── [id]/
    └── page.tsx      # 상세 페이지 (/wordsets/[id])
```

**책임**:
- 사용자 인터페이스 렌더링
- 데이터 페칭 (API 호출)
- 상태 관리 (React Query)
- 사용자 상호작용 처리

---

### 2. `lib/` - 유틸리티 및 설정

**목적**: 공유되는 함수, 설정, 헬퍼 등을 포함

```
lib/
├── prisma.ts           # Prisma Client 싱글톤 (커넥션 풀)
├── utils.ts            # 범용 헬퍼 함수
└── validators.ts       # Zod 스키마 (입력 검증)
```

**주요 내용**:

```typescript
// prisma.ts - 데이터베이스 접근
export const prisma = new PrismaClient();

// validators.ts - 입력 검증
export const createWordSetSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional()
});

// utils.ts - 유틸리티
export const formatDate = (date: Date) => { ... };
export const generateId = () => { ... };
```

---

### 3. `hooks/` - 커스텀 React Hooks

**목적**: TanStack Query를 사용한 데이터 페칭 로직 캡슐화

```
hooks/
├── useWordSets.ts      # Word Set CRUD 훅
├── useWords.ts         # Word CRUD 훅
└── useLocalStorage.ts  # 로컬 스토리지 훅
```

**예시**:

```typescript
// useWordSets.ts
export function useWordSets() {
  return useQuery({
    queryKey: ['wordsets'],
    queryFn: async () => {
      const res = await fetch('/api/wordsets');
      return res.json();
    }
  });
}
```

**장점**:
- 데이터 페칭 로직 재사용
- 자동 캐싱 및 동기화
- 낙관적 업데이트
- 에러 처리

---

### 4. `components/` - React 컴포넌트

**목적**: 재사용 가능한 UI 컴포넌트

#### UI 컴포넌트 라이브러리 (SPEC-UI-001)

```
components/ui/
├── Button.tsx          # 버튼 (variants: primary, secondary, outline, ghost)
├── Card.tsx            # 카드 (variants: default, interactive)
├── Input.tsx           # 입력 필드 (라벨, 에러, 헬퍼 텍스트)
├── Badge.tsx           # 배지 (상태 표시)
├── Skeleton.tsx        # 스켈레톤 로딩
└── index.ts            # 통합 내보내기
```

**특징**:
- 디자인 토큰 기반 (Tailwind CSS)
- TypeScript 완벽 지원
- 접근성 준수 (WCAG 2.1 AA)
- 100% 테스트 커버리지
- 성능 최적화 (forwardRef, React.memo)

**테스트**:
- Button: 20개 테스트 ✅
- Card: 16개 테스트 ✅
- Input: 13개 테스트 ✅
- Badge: 8개 테스트 ✅
- Skeleton: 14개 테스트 ✅

#### 폴더 기능 컴포넌트 (SPEC-FOLDER-001)

```
components/folders/
├── FolderCard.tsx      # 폴더 카드
├── FolderForm.tsx      # 폴더 생성/수정 폼
├── FolderList.tsx      # 폴더 목록
└── FolderSelector.tsx  # 폴더 선택 드롭다운
```

#### 비즈니스 로직 컴포넌트

```
components/
├── WordSetList.tsx      # 세트 목록 그리드
├── WordSetDetail.tsx    # 세트 상세 정보
├── WordSetForm.tsx      # 세트 생성/수정 폼
├── WordForm.tsx         # 단어 추가/수정 폼
├── WordList.tsx         # 단어 목록 테이블
├── DeleteDialog.tsx     # 확인 다이얼로그
└── LoadingSpinner.tsx   # 로딩 표시기
```

**설계 원칙**:
- 단일 책임 (Single Responsibility)
- Props로 데이터 및 콜백 받음
- 스타일은 Tailwind CSS 또는 UI 컴포넌트 조합
- 접근성 고려 (ARIA)
- TypeScript 타입 안전성

---

### 5. `prisma/` - 데이터베이스

**목적**: 데이터베이스 스키마 및 마이그레이션 관리

```
prisma/
├── schema.prisma          # 데이터 모델 정의
└── migrations/            # 마이그레이션 히스토리
    ├── 20250101000000_init
    └── migration_lock.toml
```

**schema.prisma 개요**:

```prisma
model WordSet {
  id          String   @id @default(cuid())
  name        String
  description String?
  folderId    String?  // 향후 폴더 기능
  words       Word[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@index([folderId])
}

model Word {
  id          String   @id @default(cuid())
  text        String
  meaning     String
  wordSetId   String
  wordSet     WordSet  @relation(fields: [wordSetId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@index([wordSetId])
}
```

**마이그레이션 관리**:
```bash
npm run prisma:generate   # Prisma Client 생성
npm run prisma:migrate    # 마이그레이션 실행
npm run prisma:push       # 스키마 푸시 (개발용)
npm run prisma:seed       # 테스트 데이터 추가
```

---

### 6. `__tests__/` - 단위 테스트

**목적**: Jest와 React Testing Library를 사용한 단위 테스트

```
__tests__/
├── api/
│   ├── wordsets.test.ts
│   └── words.test.ts
├── components/
│   ├── WordSetForm.test.tsx
│   └── WordList.test.tsx
└── lib/
    └── validators.test.ts
```

**테스트 전략**:
- API 엔드포인트: 요청/응답 검증
- 컴포넌트: 렌더링, 상호작용, 상태 변화
- 유틸리티: 입력/출력 검증

**테스트 커버리지 목표**: 90% 이상

```bash
npm run test              # 테스트 실행
npm run test:watch       # Watch 모드
npm run test:coverage    # 커버리지 리포트
```

---

### 7. `e2e/` - End-to-End 테스트

**목적**: Playwright를 사용한 사용자 시나리오 테스트

```
e2e/
├── wordset.spec.ts   # Word Set 기능
└── word.spec.ts      # Word 기능
```

**테스트 항목**:
1. Word Set 생성, 조회, 수정, 삭제
2. Word 추가, 수정, 삭제
3. Cascade Delete (세트 삭제 시 단어도 삭제)
4. 빈 상태 처리
5. 에러 처리

```bash
npm run test:e2e      # E2E 테스트 실행
```

---

### 8. `.moai/` - MoAI Framework 구성

**목적**: SPEC-기반 개발 추적 및 문서화

```
.moai/
├── specs/SPEC-WORDSET-001/    # SPEC 문서
├── docs/                       # Living Documents (자동 생성)
├── reports/                    # 동기화 보고서
├── config/config.json          # 프로젝트 설정
└── logs/                       # 실행 로그
```

**관리되는 정보**:
- SPEC (요구사항)
- Living Documents (API, 구조, DB)
- Traceability Matrix (요구사항 → 구현)
- 실행 로그 및 보고서

---

## 파일 조직 원칙

### 1. 계층화 구조 (Layered Architecture)

```
Presentation Layer (Pages, Components)
         ↓
Business Logic Layer (Hooks, Validators)
         ↓
Data Access Layer (Prisma, API Routes)
         ↓
Database Layer (PostgreSQL)
```

### 2. 관심사의 분리 (Separation of Concerns)

- **API Routes**: 데이터 처리 및 응답
- **Hooks**: 데이터 페칭 및 상태 관리
- **Components**: UI 렌더링 및 사용자 상호작용
- **Utilities**: 공유 함수 및 설정

### 3. 재사용성 (Reusability)

- 컴포넌트는 여러 페이지에서 재사용
- Hooks는 복잡한 로직 캡슐화
- 유틸리티는 앱 전역에서 사용

### 4. 테스트 용이성 (Testability)

- API Routes는 쉽게 테스트 가능
- Components는 Props 기반으로 설계
- 비즈니스 로직은 별도 함수로 분리

---

## 향후 확장 계획

### 기능 확장

```
lang-quiz-claude/
├── components/
│   ├── FolderExplorer.tsx     # 폴더 탐색기
│   └── WordSetSharing.tsx     # 공유 기능
├── app/api/
│   ├── folders/               # 폴더 API
│   ├── shares/                # 공유 API
│   └── auth/                  # 인증 API
└── hooks/
    ├── useFolders.ts         # 폴더 훅
    └── useAuth.ts            # 인증 훅
```

### 추가 되는 기술

- **인증**: NextAuth.js
- **폴더**: 폴더 모델 추가 및 마이그레이션
- **공유**: 소셜 기능
- **오디오**: 발음 지원
- **분석**: Google Analytics

---

## 개발 워크플로우

### 새 기능 추가 단계

1. **SPEC 작성** (`.moai/specs/`)
   - 요구사항 정의
   - TAG 설정

2. **API 구현** (`app/api/`)
   - Route Handler 작성
   - Prisma 쿼리 구현
   - 테스트 작성

3. **UI 구현** (`components/`, `app/`)
   - 컴포넌트 개발
   - Hooks 작성
   - 페이지 통합

4. **문서화** (`.moai/docs/`)
   - API 문서 업데이트
   - 구조 변경 반영
   - 예시 추가

5. **테스트** (`__tests__/`, `e2e/`)
   - 단위 테스트 작성
   - E2E 테스트 작성
   - 커버리지 확인

---

## 성능 최적화 전략

### 1. 프론트엔드

- Code Splitting (Next.js)
- Image Optimization
- CSS-in-JS 최적화
- 컴포넌트 메모이제이션

### 2. 백엔드

- 데이터베이스 인덱스
- 쿼리 최적화
- API 응답 캐싱
- 로드 밸런싱 (프로덕션)

### 3. 데이터베이스

- Index on `wordSetId` (Word 테이블)
- Index on `folderId` (WordSet 테이블)
- 연결 풀링
- 백업 전략

---

---

## SPEC 참조

| SPEC | 상태 | 설명 | 파일 |
|------|------|------|------|
| **SPEC-WORDSET-001** | ✅ 완료 | Word Set 관리 시스템 | `app/api/wordsets`, `app/wordsets` |
| **SPEC-FOLDER-001** | ✅ 완료 | 폴더 기능 | `app/api/folders`, `app/folders`, `components/folders` |
| **SPEC-UI-001** | ✅ 완료 | 디자인 시스템 및 UI 개선 | `components/ui`, `tailwind.config.ts`, `app/lib/utils/cn.ts` |

---

**마지막 업데이트**: 2025-11-26 (SPEC-UI-001 Living Document 동기화)
**유지보수자**: @user
