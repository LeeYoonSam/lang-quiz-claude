---
id: SPEC-UI-001
version: 0.1.0
status: draft
created: 2025-11-26
updated: 2025-11-26
author: "@user"
priority: high
---

# @SPEC-UI-001 Implementation Plan

## 목차

1. [목표 및 범위](#목표-및-범위)
2. [기술 접근 방식](#기술-접근-방식)
3. [구현 마일스톤](#구현-마일스톤)
4. [아키텍처 설계](#아키텍처-설계)
5. [리스크 및 대응 방안](#리스크-및-대응-방안)
6. [기술 결정 사항](#기술-결정-사항)

---

## 목표 및 범위

### 핵심 목표
1. **가독성 향상**: 타이포그래피, 컬러, 공백 최적화
2. **모던 디자인**: 일관된 컴포넌트 시스템, 스무스 인터랙션
3. **접근성 준수**: WCAG 2.1 AA 기준 충족
4. **성능 유지**: 번들 크기 최소화, 60fps 애니메이션

### 구현 범위 (Phase 1-3)
- ✅ **Phase 1**: 디자인 토큰 및 기초 시스템
- ✅ **Phase 2**: 핵심 컴포넌트 리팩토링
- ✅ **Phase 3**: 레이아웃 및 네비게이션 개선

### 제외 범위 (향후 확장)
- ❌ 다크 모드
- ❌ 고급 애니메이션 (Framer Motion)
- ❌ 중첩 테마 커스터마이징

---

## 기술 접근 방식

### 1. 디자인 토큰 관리
**전략**: Tailwind CSS 커스텀 테마 + CSS 변수

**장점**:
- Tailwind 유틸리티 클래스와 통합
- 타입 안전성 (TypeScript 자동 완성)
- 번들 크기 증가 없음

**구현**:
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: { /* 커스텀 팔레트 */ },
        // ...
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'sans-serif'],
      },
    },
  },
};
```

### 2. 컴포넌트 라이브러리 구조
**전략**: Headless 스타일 + 조합 가능한 컴포넌트

**디렉토리 구조**:
```
app/
  components/
    ui/                  # 재사용 가능한 기본 컴포넌트
      button.tsx
      card.tsx
      input.tsx
      badge.tsx
      skeleton.tsx
    folders/             # 폴더 관련 컴포넌트
      FolderCard.tsx     # Card 컴포넌트 사용
      FolderList.tsx
    wordsets/            # 단어 세트 관련 컴포넌트 (신규)
      WordSetCard.tsx
      WordSetList.tsx
  lib/
    utils/
      cn.ts              # clsx + tailwind-merge
```

### 3. 스타일 패턴
**전략**: Compound Component + Variants

**예제**:
```tsx
// Card 컴포넌트 (합성 패턴)
<Card variant="interactive">
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardFooter>
    <Badge>25개 단어</Badge>
  </CardFooter>
</Card>
```

### 4. 폰트 로딩 전략
**전략**: Next.js Font Optimization + Preload

**구현**:
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'] });
const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
});
```

---

## 구현 마일스톤

### Phase 1: 디자인 토큰 및 기초 시스템 (우선순위: 최고)

**목표**: 일관된 디자인 언어 기반 구축

**작업 항목**:
1. **Tailwind 커스텀 테마 설정** @DESIGN-TOKENS
   - 컬러 팔레트 정의 (primary, success, warning, error, neutral)
   - 타이포그래피 스케일 (xs, sm, base, lg, xl, 2xl-4xl)
   - 스페이싱 시스템 (xs, sm, md, lg, xl, 2xl)
   - 그림자, 모서리 반경 확장

2. **폰트 최적화** @DESIGN-FONT-LOADING
   - Pretendard 로컬 폰트 추가 (woff2 형식)
   - Inter 구글 폰트 통합
   - Font display: swap 설정
   - Preload 링크 추가

3. **유틸리티 함수 구현** @UTILS-CN
   - `cn()` 함수 구현 (clsx + tailwind-merge)
   - 타입 정의 추가

**완료 기준**:
- Tailwind 테마가 적용되어 모든 색상/폰트가 사용 가능
- 폰트가 FOUT 없이 로드됨
- 유틸리티 함수가 테스트와 함께 구현됨

---

### Phase 2: 핵심 컴포넌트 리팩토링 (우선순위: 높음)

**목표**: 재사용 가능한 UI 컴포넌트 라이브러리 구축

**작업 항목**:
1. **Button 컴포넌트** @UI-BUTTON-COMPONENT
   - Variants: primary, secondary, outline, ghost
   - Sizes: sm, md, lg
   - 상태: disabled, loading
   - 접근성: ARIA 속성, 키보드 지원

2. **Card 컴포넌트** @UI-CARD-COMPONENT
   - 기본 Card + CardHeader, CardFooter 서브 컴포넌트
   - Variants: default, interactive
   - 호버 효과, 트랜지션

3. **Input 컴포넌트** @UI-INPUT-COMPONENT
   - Label, HelperText, ErrorMessage 통합
   - 포커스 스타일, 에러 상태
   - ARIA 속성 (aria-invalid, aria-describedby)

4. **Badge 컴포넌트** @UI-BADGE-COMPONENT
   - Variants: primary, secondary, success, warning, error
   - Sizes: sm, md

5. **Skeleton 컴포넌트** @UI-SKELETON-LOADING
   - Pulse 애니메이션
   - 다양한 크기/형태 (text, card, avatar)

**완료 기준**:
- 모든 컴포넌트가 Storybook 또는 테스트 페이지에서 확인 가능
- 단위 테스트 커버리지 90% 이상
- TypeScript 타입 안전성 보장

---

### Phase 3: 레이아웃 및 네비게이션 개선 (우선순위: 중간)

**목표**: 사용자 경험 향상 및 일관된 레이아웃

**작업 항목**:
1. **글로벌 레이아웃 개선** @LAYOUT-GLOBAL
   - 헤더: 로고, 네비게이션 링크 (단어 세트, 폴더)
   - 활성 상태 표시 (현재 경로)
   - Sticky 헤더 (스크롤 시 고정)

2. **반응형 그리드 개선** @LAYOUT-GRID-SYSTEM
   - 모바일: 1열
   - 태블릿: 2열
   - 데스크톱: 3열/4열
   - Gap 일관성 (16px-24px)

3. **페이지별 적용** @UI-PAGE-REFACTOR
   - WordSetList: Card 컴포넌트 적용
   - WordSetDetail: 레이아웃 개선
   - FolderList: Card 컴포넌트 적용
   - FolderDetail: 레이아웃 개선

4. **로딩 및 빈 상태 개선** @UI-EMPTY-STATE
   - Skeleton UI 적용 (목록 로딩 시)
   - 빈 상태: 아이콘 + 메시지 + 액션 버튼
   - 에러 상태: 에러 메시지 + 재시도 버튼

**완료 기준**:
- 모든 페이지가 일관된 레이아웃 사용
- 반응형 테스트 통과 (모바일, 태블릿, 데스크톱)
- 로딩/빈 상태가 명확히 표시됨

---

## 아키텍처 설계

### 컴포넌트 계층 구조

```
┌─────────────────────────────────────┐
│ app/layout.tsx (Global Layout)      │
│ - Header (Navigation)                │
│ - Main Container (max-w-7xl)        │
└─────────────────────────────────────┘
            │
    ┌───────┴────────┐
    ▼                ▼
┌─────────┐    ┌──────────┐
│ Page 1  │    │ Page 2   │
│ (List)  │    │ (Detail) │
└─────────┘    └──────────┘
    │                │
    ▼                ▼
┌───────────────────────┐
│ Reusable Components   │
│ - Card                │
│ - Button              │
│ - Input               │
│ - Badge               │
│ - Skeleton            │
└───────────────────────┘
```

### 스타일 적용 흐름

```
1. Tailwind Config (디자인 토큰 정의)
   ↓
2. Global CSS (베이스 스타일, 폰트)
   ↓
3. 컴포넌트 (Tailwind 유틸리티 클래스)
   ↓
4. cn() 유틸리티 (조건부 클래스 병합)
```

### 접근성 체크리스트

- [ ] 모든 인터랙티브 요소에 키보드 접근 가능
- [ ] 포커스 인디케이터 명확히 표시
- [ ] ARIA 레이블 추가 (버튼, 입력 필드, 링크)
- [ ] 색상 대비율 4.5:1 이상
- [ ] 스크린 리더 테스트 (VoiceOver, NVDA)

---

## 리스크 및 대응 방안

### 리스크 1: 폰트 로딩 지연으로 인한 레이아웃 시프트
**영향**: 사용자 경험 저하, Core Web Vitals(CLS) 악화

**대응**:
- `font-display: swap` 사용 (FOUT 최소화)
- Preload 링크로 폰트 우선 로드
- 폴백 폰트 크기 맞춤 (size-adjust)
- 테스트: Lighthouse CLS < 0.1 확인

### 리스크 2: 번들 크기 증가
**영향**: 초기 로딩 속도 저하

**대응**:
- 트리 쉐이킹 (Lucide-react 개별 아이콘 import)
- clsx, tailwind-merge는 경량 라이브러리 (< 5KB)
- 번들 분석 (next build --analyze)
- 목표: 번들 크기 증가 < 50KB (gzip)

### 리스크 3: 기존 테스트 실패
**영향**: 회귀 테스트 실패, 배포 지연

**대응**:
- 클래스 이름 변경으로 인한 테스트 수정
- 시각적 회귀 테스트 추가 (Playwright 스크린샷)
- E2E 테스트 우선 실행하여 기능 유지 확인

### 리스크 4: 접근성 기준 미달
**영향**: WCAG 기준 미충족, 사용자 접근성 저하

**대응**:
- 개발 중 Lighthouse 접근성 점수 확인
- axe-core 또는 jest-axe 자동 테스트
- 키보드 네비게이션 수동 테스트
- 색상 대비율 도구 사용 (Contrast Checker)

---

## 기술 결정 사항

### 결정 1: Tailwind CSS vs CSS-in-JS
**선택**: Tailwind CSS (기존 유지)

**이유**:
- 기존 프로젝트에 이미 통합됨
- 번들 크기 최소화 (런타임 오버헤드 없음)
- 빠른 개발 속도
- 퍼지 검색 (Tailwind Intellisense)

**대안**: Styled Components, Emotion (제외 - 번들 크기 증가)

---

### 결정 2: 컴포넌트 라이브러리 (Radix UI, Shadcn/UI, Custom)
**선택**: Custom 컴포넌트 (Shadcn/UI 패턴 참고)

**이유**:
- 프로젝트 규모가 작아 전체 라이브러리 불필요
- 필요한 컴포넌트만 구현하여 번들 크기 최소화
- Shadcn/UI 패턴 (복사 가능한 컴포넌트) 참고
- 학습 목적으로 직접 구현

**대안**: Radix UI (제외 - 오버엔지니어링), Material-UI (제외 - 무거움)

---

### 결정 3: 아이콘 라이브러리
**선택**: Lucide React

**이유**:
- 모던한 디자인, 일관된 스타일
- 트리 쉐이킹 지원 (개별 아이콘 import)
- TypeScript 타입 지원
- 경량 (< 1KB per icon)

**대안**: Heroicons (유사), React Icons (다양하지만 무거움)

---

### 결정 4: 폰트 선택
**선택**: Pretendard (한글) + Inter (영문)

**이유**:
- Pretendard: 한글 가독성 최고, 무료, Variable Font
- Inter: 영문 가독성 높음, 구글 폰트 지원
- 두 폰트 모두 라이선스 자유

**대안**: Noto Sans KR (제외 - Pretendard보다 가독성 낮음)

---

### 결정 5: 애니메이션 라이브러리
**선택**: Tailwind CSS 애니메이션 (Framer Motion 제외)

**이유**:
- 간단한 트랜지션만 필요 (호버, 포커스)
- Tailwind 내장 애니메이션 충분 (transition, duration, ease)
- Framer Motion은 번들 크기 증가 (45KB+)

**대안**: Framer Motion (향후 확장 시 고려)

---

## 다음 단계

**SPEC 승인 후**:
1. `/moai:2-run SPEC-UI-001` 실행
2. Git 브랜치 생성: `feature/SPEC-UI-001`
3. TDD 사이클로 구현 (RED → GREEN → REFACTOR)
4. 테스트 커버리지 90% 이상 달성
5. `/moai:3-sync SPEC-UI-001` 실행하여 문서화

**예상 완료 후 결과물**:
- 일관된 디자인 시스템 적용
- 재사용 가능한 UI 컴포넌트 라이브러리
- 개선된 가독성 및 사용자 경험
- WCAG 2.1 AA 기준 충족
- Lighthouse 점수 향상 (성능, 접근성 90+)

---

**END OF PLAN**
