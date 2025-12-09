---
id: SPEC-UI-001
version: 0.2.0
status: completed
created: 2025-11-26
updated: 2025-12-06
author: "@user"
priority: high
dependencies:
  - SPEC-WORDSET-001
  - SPEC-FOLDER-001
---

# HISTORY

| 버전  | 날짜       | 작성자 | 변경 내용      |
| ----- | ---------- | ------ | -------------- |
| 0.2.0 | 2025-12-06 | @user  | 디자인 시스템 구현 완료 - 174개 테스트 통과, TRUST 5 점수 98/100 |
| 0.1.0 | 2025-11-26 | @user  | 초기 SPEC 생성 |

---

# SPEC-UI-001: 디자인 시스템 및 가독성 개선

## 목차

1. [Environment (환경)](#environment-환경)
2. [Assumptions (가정)](#assumptions-가정)
3. [Requirements (요구사항)](#requirements-요구사항)
4. [Specifications (명세)](#specifications-명세)
5. [Acceptance Criteria (인수 기준)](#acceptance-criteria-인수-기준)
6. [Traceability (추적성)](#traceability-추적성)

---

## Environment (환경)

### 기술 스택

**Frontend**
- Next.js: ^15.1.0 (React 19 기반)
- React: 19
- TypeScript: 최신 stable 버전
- TanStack Query: ^5.59.0 (서버 상태 관리)
- Tailwind CSS: ^4.1.17 (스타일링)

**신규 추가 라이브러리**
- `clsx`: 조건부 클래스 이름 병합 유틸리티
- `tailwind-merge`: Tailwind 클래스 충돌 해결
- `lucide-react`: 모던 아이콘 라이브러리
- `@next/font` (Next.js 내장): 폰트 최적화

**Design Tools**
- Tailwind CSS 커스텀 테마 설정
- CSS 변수를 통한 디자인 토큰 관리

### 배포 환경

- **개발 환경**: localhost:3000
- **프로덕션 환경**: Vercel/AWS/자체 서버
- **브라우저 지원**: Chrome, Firefox, Safari, Edge (최신 2개 버전)

### 기존 시스템 상태

- ✅ **SPEC-WORDSET-001 완료**: 단어 세트 CRUD 시스템
- ✅ **SPEC-FOLDER-001 완료**: 폴더 기능 구현
- ⚠️ **현재 UI 상태**: 기본 Tailwind 유틸리티 클래스, 단순한 회색 톤 디자인
- ⚠️ **개선 필요**: 타이포그래피, 컬러 시스템, 컴포넌트 일관성, 레이아웃, 접근성

---

## Assumptions (가정)

### 사용자 컨텍스트

1. **타겟 사용자**: 어휘 학습을 위해 단어 세트를 사용하는 모든 연령대의 사용자
2. **사용 환경**:
   - 데스크톱 (1920x1080 이상)
   - 태블릿 (768px-1024px)
   - 모바일 (375px-767px)
3. **시각 요구사항**:
   - 장시간 사용 시에도 눈의 피로를 최소화
   - 명확한 정보 계층 구조
   - 직관적인 인터랙션

### 시스템 제약사항

1. **성능 목표**:
   - First Contentful Paint (FCP) < 1.5초
   - Largest Contentful Paint (LCP) < 2.5초
   - 폰트 로딩으로 인한 레이아웃 시프트 방지 (CLS < 0.1)
   - 애니메이션 프레임레이트 60fps 유지

2. **접근성 기준**:
   - WCAG 2.1 AA 수준 준수
   - 색상 대비율 최소 4.5:1 (일반 텍스트), 3:1 (큰 텍스트)
   - 키보드 네비게이션 지원
   - 스크린 리더 호환성

3. **호환성**:
   - 기존 SPEC-WORDSET-001, SPEC-FOLDER-001 기능 유지
   - API 변경 없음 (UI/프론트엔드만 개선)
   - 기존 데이터 마이그레이션 불필요

### 비즈니스 제약사항

1. **MVP 범위**: Phase 1-3 (디자인 토큰 + 핵심 컴포넌트 + 레이아웃)
2. **향후 확장**: 다크 모드, 고급 애니메이션, 테마 커스터마이징
3. **개발 우선순위**: 가독성 > 미적 요소 > 애니메이션

---

## Requirements (요구사항)

### 기능 요구사항 (Functional Requirements)

#### FR-1: 타이포그래피 시스템 적용
**WHEN** 시스템이 렌더링될 때,
**THE SYSTEM SHALL** 계층적 타이포그래피 스케일을 적용하여,
**THEN** 모든 텍스트 요소가 명확한 시각적 계층 구조를 갖추고 가독성이 향상되어야 한다.

**STATE**:
- 폰트: Pretendard (한글), Inter (영문) 또는 시스템 폰트 폴백
- 크기: 6단계 (xs, sm, base, lg, xl, 2xl-4xl)
- 행간: 1.5-1.8 (본문), 1.2-1.4 (제목)
- 자간: 최적화된 letter-spacing

#### FR-2: 컬러 시스템 정의
**WHEN** UI 요소에 색상이 적용될 때,
**THE SYSTEM SHALL** 시맨틱 컬러 팔레트를 사용하여,
**THEN** 일관된 브랜드 아이덴티티와 명도 대비가 유지되어야 한다.

**STATE**:
- Primary: 블루 계열 (기존 blue-600 기반, 확장)
- Secondary: 그레이 계열
- Success: 그린 계열
- Warning: 옐로우/오렌지 계열
- Error: 레드 계열
- 각 색상은 50-950까지 9단계 명도 제공

#### FR-3: 버튼 컴포넌트 개선
**WHEN** 사용자가 버튼을 렌더링하거나 클릭할 때,
**THE SYSTEM SHALL** 일관된 스타일 변형(variant)과 크기(size)를 제공하고,
**THEN** 시각적 피드백(호버, 포커스, 클릭)을 명확하게 표시해야 한다.

**STATE**:
- Variants: primary, secondary, outline, ghost
- Sizes: sm, md, lg
- 상태: default, hover, active, disabled, loading

#### FR-4: 카드 컴포넌트 개선
**WHEN** 단어 세트 또는 폴더 카드가 렌더링될 때,
**THE SYSTEM SHALL** 향상된 그림자, 호버 효과, 스무스 트랜지션을 적용하고,
**THEN** 클릭 가능한 영역을 명확히 표시해야 한다.

**STATE**:
- 기본 그림자: shadow-sm
- 호버 그림자: shadow-lg
- 트랜지션: 200-300ms ease-in-out
- 내부 여백, 모서리 반경 일관성

#### FR-5: 입력 필드 컴포넌트 개선
**WHEN** 사용자가 입력 필드와 상호작용할 때,
**THE SYSTEM SHALL** 포커스 스타일, 에러 상태, 도움말 텍스트를 명확히 표시하고,
**THEN** 접근 가능한 레이블과 ARIA 속성을 제공해야 한다.

**STATE**:
- 레이블: 필수 표시(*), 도움말 텍스트
- 포커스: 명확한 아웃라인 (ring-2)
- 에러: 붉은 테두리, 에러 메시지 표시
- 성공: 초록 테두리 (옵션)

#### FR-6: 레이아웃 그리드 시스템 개선
**WHEN** 콘텐츠 목록이 렌더링될 때,
**THE SYSTEM SHALL** 반응형 그리드 시스템을 적용하여,
**THEN** 다양한 화면 크기에서 최적의 레이아웃을 제공해야 한다.

**STATE**:
- 모바일: 1열
- 태블릿: 2열
- 데스크톱: 3열 또는 4열
- Gap: 일관된 간격 (16px-24px)

#### FR-7: 네비게이션 개선
**WHEN** 사용자가 페이지 간 이동할 때,
**THE SYSTEM SHALL** 명확한 네비게이션 UI를 제공하고,
**THEN** 현재 위치를 시각적으로 표시해야 한다.

**STATE**:
- 헤더: 로고, 메뉴 링크, 활성 상태 표시
- 사이드바 (옵션): 접고 펼치기 가능
- Breadcrumb (옵션): 현재 경로 표시

#### FR-8: 로딩 및 빈 상태 개선
**WHEN** 데이터 로딩 또는 빈 상태일 때,
**THE SYSTEM SHALL** 스켈레톤 UI 또는 명확한 메시지를 표시하고,
**THEN** 사용자가 시스템 상태를 이해할 수 있어야 한다.

**STATE**:
- 로딩: 스켈레톤 UI (카드, 텍스트)
- 빈 상태: 아이콘 + 안내 메시지 + 액션 버튼
- 에러 상태: 에러 메시지 + 재시도 버튼

### 비기능 요구사항 (Non-Functional Requirements)

#### NFR-1: 성능
**THE SYSTEM SHALL** 폰트 로딩 최적화를 통해 FOUT/FOIT를 방지하고, 애니메이션은 GPU 가속(transform, opacity)만 사용하여 60fps를 유지해야 한다.

#### NFR-2: 접근성
**THE SYSTEM SHALL** WCAG 2.1 AA 기준을 준수하고, 키보드 네비게이션, ARIA 레이블, 적절한 색상 대비를 제공해야 한다.

#### NFR-3: 확장성
**THE SYSTEM SHALL** 디자인 토큰을 CSS 변수 또는 Tailwind 테마로 관리하여, 향후 다크 모드 또는 테마 커스터마이징이 용이하도록 해야 한다.

#### NFR-4: 일관성
**THE SYSTEM SHALL** 재사용 가능한 UI 컴포넌트 라이브러리를 구축하여, 모든 페이지에서 일관된 디자인 언어를 유지해야 한다.

#### NFR-5: 테스트 커버리지
**THE SYSTEM SHALL** 단위 테스트 커버리지 90% 이상, 시각적 회귀 테스트를 통해 UI 변경사항을 검증해야 한다.

### 인터페이스 요구사항 (Interface Requirements)

#### IR-1: 공통 컴포넌트 라이브러리
**THE SYSTEM SHALL** 재사용 가능한 UI 컴포넌트를 다음과 같이 제공해야 한다:
- `Button`: 다양한 변형 및 크기 지원
- `Card`: 단어 세트, 폴더 카드에 사용
- `Input`, `Textarea`: 폼 입력 요소
- `Modal`, `Dialog`: 확인/삭제 다이얼로그
- `Badge`, `Tag`: 상태 표시
- `Skeleton`: 로딩 상태

#### IR-2: 유틸리티 함수
**THE SYSTEM SHALL** 스타일 유틸리티 함수를 제공해야 한다:
- `cn()`: clsx + tailwind-merge 조합 (클래스 병합)
- 색상 변환, 접근성 체크 유틸리티

### 설계 제약사항 (Design Constraints)

#### DC-1: 기술 스택 고정
**THE SYSTEM SHALL** Next.js 15, React 19, Tailwind CSS 4.1.17을 사용해야 하며, 추가 CSS-in-JS 라이브러리는 사용하지 않는다.

#### DC-2: 기존 기능 유지
**THE SYSTEM SHALL** SPEC-WORDSET-001, SPEC-FOLDER-001의 모든 기능을 유지하며, API 변경 없이 UI만 개선해야 한다.

#### DC-3: 번들 크기 제한
**THE SYSTEM SHALL** 추가 라이브러리로 인한 번들 크기 증가를 최소화해야 하며, 트리 쉐이킹을 활용해야 한다.

---

## Specifications (명세)

### 디자인 토큰 (Design Tokens)

#### 타이포그래피 스케일
```typescript
// tailwind.config.ts 확장
const typography = {
  fontFamily: {
    sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },
};
```

#### 컬러 팔레트
```typescript
// tailwind.config.ts 확장
const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // 기본
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  success: {
    500: '#10b981',
    600: '#059669',
  },
  warning: {
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    500: '#ef4444',
    600: '#dc2626',
  },
  neutral: {
    // 기존 gray 확장
    50: '#f9fafb',
    100: '#f3f4f6',
    // ... 생략
  },
};
```

#### 스페이싱 시스템
```typescript
const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
};
```

### 핵심 컴포넌트 명세

#### Button 컴포넌트
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

// 사용 예
<Button variant="primary" size="md">저장</Button>
<Button variant="outline" size="sm" loading>로딩 중...</Button>
```

**스타일 정의**:
- primary: `bg-primary-600 text-white hover:bg-primary-700`
- secondary: `bg-neutral-600 text-white hover:bg-neutral-700`
- outline: `border-2 border-primary-600 text-primary-600 hover:bg-primary-50`
- ghost: `text-primary-600 hover:bg-primary-50`

#### Card 컴포넌트
```typescript
interface CardProps {
  variant?: 'default' | 'interactive';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// 사용 예
<Card variant="interactive" onClick={() => navigate('/wordsets/123')}>
  <CardHeader>
    <CardTitle>일상 영어 단어</CardTitle>
    <CardDescription>매일 사용하는 기본 영어 단어 모음</CardDescription>
  </CardHeader>
  <CardFooter>
    <Badge>25개 단어</Badge>
  </CardFooter>
</Card>
```

**스타일 정의**:
- default: `bg-white rounded-lg shadow-sm p-6`
- interactive: `cursor-pointer hover:shadow-lg transition-shadow duration-300`

#### Input 컴포넌트
```typescript
interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}

// 사용 예
<Input
  label="세트 이름"
  placeholder="예: TOEFL 단어"
  required
  error={errors.name}
  value={name}
  onChange={setName}
/>
```

**스타일 정의**:
- 기본: `border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500`
- 에러: `border-error-500 focus:ring-error-500`

### UI 개선 전/후 비교

#### WordSetList 페이지
**개선 전**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {wordsets.map((wordset) => (
    <Link href={`/wordsets/${wordset.id}`} className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
      <h3 className="text-xl font-semibold">{wordset.name}</h3>
      <p className="text-gray-600">{wordset.description}</p>
    </Link>
  ))}
</div>
```

**개선 후**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {wordsets.map((wordset) => (
    <Card key={wordset.id} variant="interactive" onClick={() => navigate(`/wordsets/${wordset.id}`)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-neutral-900">{wordset.name}</CardTitle>
        {wordset.description && (
          <CardDescription className="text-sm text-neutral-600 mt-2 line-clamp-2">
            {wordset.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="secondary">{wordset.wordCount}개 단어</Badge>
        <span className="text-xs text-neutral-500">
          {format(wordset.createdAt, 'yyyy.MM.dd')}
        </span>
      </CardFooter>
    </Card>
  ))}
</div>
```

### 레이아웃 개선

#### 글로벌 레이아웃 (app/layout.tsx)
**개선 사항**:
- 헤더: 로고 + 네비게이션 링크 (단어 세트, 폴더)
- 푸터: 저작권, 링크 (옵션)
- 컨테이너: max-w-7xl, 일관된 패딩

```tsx
<header className="sticky top-0 z-50 bg-white shadow-sm">
  <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    <Link href="/" className="text-2xl font-bold text-primary-600">
      단어 학습
    </Link>
    <div className="flex gap-6">
      <NavLink href="/wordsets" active={pathname === '/wordsets'}>
        단어 세트
      </NavLink>
      <NavLink href="/folders" active={pathname === '/folders'}>
        폴더
      </NavLink>
    </div>
  </nav>
</header>
```

### 유틸리티 함수

#### cn() - 클래스 병합
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 사용 예
<Button className={cn('custom-class', isActive && 'active')} />
```

---

## Acceptance Criteria (인수 기준)

### AC-1: 타이포그래피 시스템 적용
**GIVEN** 시스템이 렌더링될 때
**WHEN** 모든 페이지를 확인하면
**THEN**
- Pretendard/Inter 폰트가 적용되어 있다
- 제목, 본문, 캡션 등 계층적 크기가 명확하다
- 행간이 1.5-1.8 범위로 설정되어 가독성이 향상되었다

**검증 방법**:
- 브라우저 개발자 도구로 폰트 패밀리 확인
- 시각적으로 타이포그래피 계층 확인
- 테스트: 스크린샷 비교 (Playwright)

### AC-2: 버튼 컴포넌트 일관성
**GIVEN** 버튼 컴포넌트가 렌더링될 때
**WHEN** 다양한 변형(primary, outline, ghost)과 크기(sm, md, lg)를 확인하면
**THEN**
- 모든 변형이 일관된 스타일을 갖는다
- 호버, 포커스, 클릭 상태가 명확하게 표시된다
- 로딩 상태 시 스피너가 표시된다

**검증 방법**:
- Storybook 또는 테스트 페이지에서 모든 변형 확인
- 인터랙션 테스트 (Playwright)
- 접근성 테스트 (키보드 네비게이션)

### AC-3: 카드 컴포넌트 호버 효과
**GIVEN** 단어 세트 또는 폴더 카드가 렌더링될 때
**WHEN** 마우스를 호버하면
**THEN**
- 그림자가 shadow-sm → shadow-lg로 변경된다
- 트랜지션이 스무스하게 적용된다 (300ms ease-in-out)
- 클릭 가능한 영역이 명확히 표시된다

**검증 방법**:
- 브라우저에서 호버 효과 확인
- 스크린샷 비교 (호버 전/후)
- E2E 테스트로 인터랙션 검증

### AC-4: 입력 필드 에러 상태
**GIVEN** 입력 필드에 유효하지 않은 값이 입력될 때
**WHEN** 에러 상태가 표시되면
**THEN**
- 테두리가 붉은색(error-500)으로 변경된다
- 에러 메시지가 필드 하단에 표시된다
- ARIA 속성(aria-invalid, aria-describedby)이 추가된다

**검증 방법**:
- 유효성 검사 실패 시나리오 테스트
- 접근성 테스트 (스크린 리더 확인)
- E2E 테스트

### AC-5: 레이아웃 반응형
**GIVEN** 다양한 화면 크기에서 접근할 때
**WHEN** 모바일(375px), 태블릿(768px), 데스크톱(1920px)을 확인하면
**THEN**
- 모바일: 1열 그리드
- 태블릿: 2열 그리드
- 데스크톱: 3열 또는 4열 그리드
- 모든 요소가 올바르게 정렬되고 잘림이 없다

**검증 방법**:
- 브라우저 반응형 모드 확인
- Playwright 다양한 뷰포트 테스트
- 스크린샷 비교

### AC-6: 로딩 스켈레톤 UI
**GIVEN** 데이터 로딩 중일 때
**WHEN** 단어 세트 목록 페이지를 확인하면
**THEN**
- 카드 모양의 스켈레톤 UI가 표시된다
- 애니메이션(pulse 효과)이 적용된다
- 실제 데이터 로드 시 스무스하게 전환된다

**검증 방법**:
- 네트워크 속도 제한 시뮬레이션
- 스켈레톤 UI 렌더링 확인
- E2E 테스트

### AC-7: 접근성 기준 준수
**GIVEN** 시스템 전체를 확인할 때
**WHEN** 접근성 검사를 수행하면
**THEN**
- 색상 대비율이 4.5:1 이상이다 (WCAG AA)
- 모든 인터랙티브 요소가 키보드로 접근 가능하다
- ARIA 레이블이 적절히 추가되어 있다
- 포커스 인디케이터가 명확하게 표시된다

**검증 방법**:
- Lighthouse 접근성 점수 90 이상
- axe-core 또는 jest-axe 테스트
- 키보드 네비게이션 수동 테스트

### AC-8: 성능 기준 충족
**GIVEN** 프로덕션 빌드를 확인할 때
**WHEN** Lighthouse 성능 검사를 수행하면
**THEN**
- First Contentful Paint (FCP) < 1.5초
- Largest Contentful Paint (LCP) < 2.5초
- Cumulative Layout Shift (CLS) < 0.1
- 번들 크기 증가 < 50KB (gzip)

**검증 방법**:
- Lighthouse 성능 점수 90 이상
- 번들 분석 (next build --analyze)
- WebPageTest 성능 측정

### AC-9: 기존 기능 호환성
**GIVEN** SPEC-WORDSET-001, SPEC-FOLDER-001 기능이 구현되어 있을 때
**WHEN** UI 개선 후 모든 기능을 테스트하면
**THEN**
- 단어 세트 CRUD 기능이 정상 동작한다
- 폴더 CRUD 및 필터링 기능이 정상 동작한다
- 기존 테스트가 모두 통과한다 (회귀 테스트)

**검증 방법**:
- 기존 E2E 테스트 전체 실행
- 수동 회귀 테스트
- API 호출 확인 (변경 없음)

---

## Traceability (추적성)

### TAG 체계

```
@SPEC-UI-001
  ├─ @FR-1 (타이포그래피 시스템)
  │   ├─ @DESIGN-TYPOGRAPHY-SCALE
  │   ├─ @DESIGN-FONT-LOADING
  │   └─ @TEST-TYPOGRAPHY
  ├─ @FR-2 (컬러 시스템)
  │   ├─ @DESIGN-COLOR-PALETTE
  │   ├─ @DESIGN-SEMANTIC-COLORS
  │   └─ @TEST-COLOR-CONTRAST
  ├─ @FR-3 (버튼 컴포넌트)
  │   ├─ @UI-BUTTON-COMPONENT
  │   ├─ @UI-BUTTON-VARIANTS
  │   └─ @TEST-BUTTON-INTERACTIONS
  ├─ @FR-4 (카드 컴포넌트)
  │   ├─ @UI-CARD-COMPONENT
  │   ├─ @UI-CARD-HOVER
  │   └─ @TEST-CARD-ANIMATIONS
  ├─ @FR-5 (입력 필드 컴포넌트)
  │   ├─ @UI-INPUT-COMPONENT
  │   ├─ @UI-INPUT-VALIDATION
  │   └─ @TEST-INPUT-ACCESSIBILITY
  ├─ @FR-6 (레이아웃 그리드)
  │   ├─ @LAYOUT-GRID-SYSTEM
  │   ├─ @LAYOUT-RESPONSIVE
  │   └─ @TEST-LAYOUT-BREAKPOINTS
  ├─ @FR-7 (네비게이션)
  │   ├─ @UI-NAVIGATION-HEADER
  │   ├─ @UI-NAVIGATION-ACTIVE
  │   └─ @TEST-NAVIGATION
  └─ @FR-8 (로딩 및 빈 상태)
      ├─ @UI-SKELETON-LOADING
      ├─ @UI-EMPTY-STATE
      └─ @TEST-LOADING-STATES
```

### 요구사항 → 구현 매핑

| 요구사항 | 구현 대상 | 영향받는 페이지 | 테스트 |
|---------|---------|----------------|--------|
| FR-1 | Tailwind 테마, 폰트 로딩 | 전체 | 시각적, 성능 |
| FR-2 | Tailwind 컬러 팔레트 | 전체 | 접근성, 대비율 |
| FR-3 | Button 컴포넌트 | 전체 (버튼 사용처) | 단위, 인터랙션 |
| FR-4 | Card 컴포넌트 | WordSetList, FolderList | 단위, E2E |
| FR-5 | Input 컴포넌트 | 폼 페이지 (new, edit) | 단위, 접근성 |
| FR-6 | 그리드 레이아웃 | WordSetList, FolderList | 반응형 |
| FR-7 | Header, Navigation | 전체 (layout.tsx) | E2E |
| FR-8 | Skeleton, EmptyState | 로딩/빈 상태 페이지 | E2E |

### SPEC 의존성

- **SPEC-WORDSET-001**: UI 개선 대상 페이지 제공 (WordSetList, WordSetDetail)
- **SPEC-FOLDER-001**: UI 개선 대상 페이지 제공 (FolderList, FolderDetail)
- **기존 API 유지**: 백엔드 변경 없음, 프론트엔드만 개선

---

**END OF SPEC-UI-001**
