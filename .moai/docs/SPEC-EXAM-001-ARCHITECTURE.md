---
id: SPEC-EXAM-001-ARCHITECTURE
title: SPEC-EXAM-001 아키텍처 문서
version: 1.0.0
created: 2025-12-11
updated: 2025-12-11
author: doc-syncer
related_specs:
  - SPEC-EXAM-001
  - SPEC-LEARN-001
  - SPEC-WORDSET-001
  - SPEC-UI-001
---

# SPEC-EXAM-001: 영어 단어 시험 시스템 - 아키텍처

## 개요

SPEC-EXAM-001은 영어 단어 시험 시스템으로, 사용자가 학습한 단어 세트를 기반으로 다양한 모드(객관식, 주관식, 혼합)의 시험을 진행하고 결과를 확인할 수 있는 시스템입니다. Phase 4에서 완성된 이 시스템은 기존의 SPEC-LEARN-001(학습 시스템), SPEC-WORDSET-001(단어 데이터), SPEC-UI-001(디자인 시스템)과 완벽하게 통합되어 있습니다.

## 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                    Word Quiz Application                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
        ┌───────▼──────┐  ┌─────▼──────┐  ┌────▼────────┐
        │   Frontend   │  │  State     │  │  Session    │
        │   Pages      │  │  Management│  │  Storage    │
        └───────┬──────┘  └─────┬──────┘  └────┬────────┘
                │                │              │
        ┌───────▼────────────────▼──────────────▼─────┐
        │     ExamSession / useExamSession Hook      │
        │  (Session Storage: exam_session_${id})      │
        └───────┬──────────────────────────────────────┘
                │
        ┌───────▼──────────────────────────────┐
        │   Exam Core Logic Components         │
        │ - ExamConfigScreen (설정)             │
        │ - MultipleChoiceQuestion (객관식)     │
        │ - ShortAnswerQuestion (주관식)        │
        │ - ExamResult (결과)                   │
        └───────┬──────────────────────────────┘
                │
        ┌───────▼──────────────────────────────┐
        │   Utility Functions                  │
        │ - generateQuestions()                │
        │ - generateWrongAnswers()             │
        │ - validateAnswer()                   │
        │ - calculateScore()                   │
        │ - Type Adapters                      │
        └───────┬──────────────────────────────┘
                │
        ┌───────▼──────────────────────────────┐
        │   External Dependencies              │
        │ - SPEC-LEARN-001 (음성, 학습)        │
        │ - SPEC-WORDSET-001 (단어 데이터)     │
        │ - SPEC-UI-001 (디자인 시스템)        │
        │ - Web Speech API (TTS)               │
        └──────────────────────────────────────┘
```

## 계층 구조 (Layered Architecture)

### 1. 프레젠테이션 계층 (Presentation Layer)

#### 페이지 및 라우팅
```
app/wordsets/[id]/exam/
├── page.tsx                          # ExamConfigScreen
├── progress/
│   └── page.tsx                      # ExamProgress
└── result/
    └── page.tsx                      # ExamResult
```

#### 컴포넌트 계층
```
components/Exam/
├── ExamConfigScreen.tsx              # 시험 설정 (모드, 방향 선택)
├── MultipleChoiceQuestion.tsx        # 객관식 문제 표시
├── ShortAnswerQuestion.tsx           # 주관식 문제 표시
├── ExamProgress.tsx                  # 진행률 표시
├── ExamResult.tsx                    # 결과 표시
├── IncorrectReview.tsx              # 오답 복습 링크
└── ExamNavigation.tsx               # 네비게이션 버튼
```

**특징**:
- React FC + TypeScript 기반
- SPEC-UI-001 (Button, Card, Badge) 컴포넌트 재사용
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- 접근성 준수 (WCAG 2.1 AA)

### 2. 비즈니스 로직 계층 (Business Logic Layer)

#### 상태 관리 (State Management)

**useExamSession Hook**:
```typescript
interface ExamSession {
  wordSetId: string;
  mode: 'multiple-choice' | 'short-answer' | 'mixed';
  direction: 'forward' | 'reverse';
  questions: ExamQuestion[];
  currentIndex: number;
  answers: ExamAnswer[];
  startTime: number;
}

// 주요 메서드
- initSession(questions, mode, direction)
- submitAnswer(answer)
- nextQuestion()
- getResult() → ExamResult
- saveToStorage()
- loadFromStorage()
```

**세션 스토리지 저장**:
```typescript
// Key: exam_session_${wordSetId}
// Value: JSON.stringify(ExamSession)
// 용도: 브라우저 새로고침 시 진행 상태 복원
```

#### 유틸리티 함수

**`generateQuestions(words, mode, direction)`**:
- 입력: Word[], mode, direction
- 출력: ExamQuestion[] (100개)
- 기능:
  - 객관식 모드: 모든 문제에 choices[] 포함
  - 주관식 모드: 텍스트 입력만 포함
  - 혼합 모드: 3:7 비율 (객관식 3개, 주관식 7개) 랜덤 배치
  - 정방향: prompt = word.meaning (뜻)
  - 역방향: prompt = word.text (단어)

**`generateWrongAnswers(correctAnswer, words, count)`**:
- 입력: 정답, Word[], 개수
- 출력: string[] (오답 배열)
- 기능:
  - 정답을 제외한 단어에서 랜덤 선택
  - 중복 제거
  - 개수 정확히 반환

**`validateAnswer(userAnswer, correctAnswer)`**:
- 입력: 사용자 답변, 정답
- 출력: boolean
- 기능:
  - 대소문자 무시: `toLowerCase()`
  - 공백 제거: `trim()`
  - 완전 일치 판정

**`calculateScore(correctCount, totalCount)`**:
- 입력: 정답 수, 전체 수
- 출력: number (백분율, 소수점 1자리)
- 계산: `(correctCount / totalCount * 100).toFixed(1)`

**Type Adapter 패턴**:
```typescript
// WordSet 데이터 → ExamQuestion 데이터 변환
- wordToWordItem(word: Word): ExamQuestion
- wordsToWordItems(words: Word[]): ExamQuestion[]

// 목적: 데이터 구조 일관성 유지
// SPEC-WORDSET-001의 Word 모델과
// SPEC-EXAM-001의 ExamQuestion 모델 간 매핑
```

### 3. 데이터 계층 (Data Layer)

#### 외부 데이터 소스

**SPEC-WORDSET-001 통합**:
- 단어 세트 조회: `/api/wordsets/[id]`
- 단어 목록: `/api/wordsets/[id]/words`
- 캐싱: TanStack Query (react-query)

**세션 스토리지**:
- 키: `exam_session_${wordSetId}`
- 용도: 시험 진행 상태 임시 저장
- 생명주기: 브라우저 세션 동안 유지

## 주요 데이터 흐름

### 1. 시험 시작 플로우

```
사용자 클릭 "시험 시작"
    ↓
ExamConfigScreen 렌더링
    ↓
모드 선택 (객관식, 주관식, 혼합)
방향 선택 (정방향, 역방향)
    ↓
"시험 시작" 버튼 클릭
    ↓
generateQuestions(words, mode, direction)
    ↓
ExamQuestion[] 생성
    ↓
useExamSession.initSession()
    ↓
세션 스토리지 저장
    ↓
ExamProgress 페이지로 라우팅
```

### 2. 문제 풀이 플로우 (객관식)

```
ExamProgress 페이지 로드
    ↓
현재 문제 (currentIndex)의 ExamQuestion 표시
    ↓
MultipleChoiceQuestion 컴포넌트
    - prompt (뜻) 표시
    - choices[] (4개 선택지) 표시
    - 선택지 순서 무작위 배치
    ↓
사용자 선택지 클릭
    ↓
validateAnswer()로 채점
    ↓
ExamAnswer 생성 및 저장
    ↓
정답/오답 강조
    - 정답: 녹색 배경
    - 오답: 빨간색 배경 + 정답 표시
    ↓
2초 대기 → 다음 문제로 자동 진행
```

### 3. 문제 풀이 플로우 (주관식)

```
ExamProgress 페이지 로드
    ↓
현재 문제의 ExamQuestion 표시
    ↓
ShortAnswerQuestion 컴포넌트
    - prompt (뜻) 표시
    - 입력 필드 표시
    ↓
사용자 입력 후 "제출" 버튼 클릭
    ↓
validateAnswer(userInput, correctAnswer)
    - 대소문자 무시
    - 공백 무시
    - 완전 일치 판정
    ↓
ExamAnswer 저장
    ↓
정답/오답 표시
    ↓
"다음" 버튼으로 수동 진행
```

### 4. 역방향 모드 음성 재생

```
ExamProgress 로드 (direction = 'reverse')
    ↓
useExamSpeech(word.text) 호출
    ↓
Web Speech API 또는 useSpeech (SPEC-LEARN-001)
    ↓
자동 음성 재생 (0.5초 내)
    ↓
"🔊 다시 듣기" 버튼 제공
    ↓
클릭 시 수동 재생
    ↓
TTS 미지원: "음성 재생 불가" 메시지
```

### 5. 결과 화면 플로우

```
마지막 문제 완료
    ↓
useExamSession.getResult()
    ↓
ExamResult 계산:
- totalQuestions: 전체 문제 수
- correctCount: 정답 수
- incorrectCount: 오답 수
- correctRate: (correctCount/total*100).toFixed(1)%
- score: calculateScore()
- incorrectWords: 오답 단어 필터링
- elapsedTime: startTime으로부터 경과 시간
    ↓
ExamResult 페이지로 라우팅
    ↓
결과 정보 표시
    ↓
사용자 선택:
- "오답 다시 보기" → SPEC-LEARN-001 학습 모드
- "다시 시험하기" → ExamConfigScreen으로 복귀
- "세트로 돌아가기" → WordSetDetail 페이지
```

### 6. 오답 복습 플로우

```
ExamResult 페이지
    ↓
"오답 다시 보기" 버튼 클릭
    ↓
incorrectWords 필터링
    ↓
LearnSession 생성
    - words: incorrectWords[]
    - mode: 'flip-card'
    ↓
라우팅: /wordsets/[id]/learn?mode=incorrect_review
    ↓
SPEC-LEARN-001 FlipCard 학습 시작
    ↓
학습 완료
    ↓
ExamResult 페이지로 복귀
```

## Type Adapter 패턴

### 목적
SPEC-WORDSET-001의 `Word` 모델과 SPEC-EXAM-001의 `ExamQuestion` 모델 간 데이터 변환을 담당합니다. 이를 통해 각 SPEC의 독립성을 유지하면서도 원활한 데이터 통합이 가능합니다.

### 구현

```typescript
// lib/utils/exam/typeAdapters.ts

/**
 * WordSet의 Word 모델을 ExamQuestion으로 변환
 * @SPEC-EXAM-001
 * @INTEGRATION-WORDSET-001
 */
export function wordToWordItem(
  word: Word,
  mode: 'multiple-choice' | 'short-answer' | 'mixed',
  direction: 'forward' | 'reverse'
): ExamQuestion {
  const prompt = direction === 'forward' ? word.meaning : word.text;
  const correctAnswer = direction === 'forward' ? word.text : word.meaning;

  return {
    wordId: word.id,
    type: mode === 'short-answer' ? 'short-answer' : 'multiple-choice',
    prompt,
    correctAnswer,
    choices: mode === 'multiple-choice' ? [] : undefined,
  };
}

/**
 * Word 배열을 ExamQuestion 배열로 변환
 */
export function wordsToWordItems(
  words: Word[],
  mode: 'multiple-choice' | 'short-answer' | 'mixed',
  direction: 'forward' | 'reverse'
): ExamQuestion[] {
  return words.map(word => wordToWordItem(word, mode, direction));
}
```

### 사용 위치
- `generateQuestions()` 함수 내에서 Word → ExamQuestion 변환
- ExamConfigScreen에서 단어 검증
- Type 안정성 보장

## 라우팅 구조

```
/wordsets/[id]
├── /exam                     # ExamConfigScreen (설정)
│   ├── /progress            # ExamProgress (진행)
│   │   └── [questionIndex]  # (Optional: 특정 문제)
│   └── /result              # ExamResult (결과)
└── /learn?mode=incorrect_review  # 오답 복습 (SPEC-LEARN-001)
```

### 라우팅 규칙

**ExamConfigScreen (`/wordsets/[id]/exam`)**:
- 용도: 시험 설정 (모드, 방향 선택)
- 진입: WordSetDetail에서 "시험 시작" 버튼 클릭
- 종료: "시험 시작" 버튼 클릭 → ExamProgress로 이동

**ExamProgress (`/wordsets/[id]/exam/progress`)**:
- 용도: 시험 진행 (문제 표시, 채점)
- 진입: ExamConfigScreen에서 "시험 시작"
- 종료: 마지막 문제 완료 → ExamResult로 이동

**ExamResult (`/wordsets/[id]/exam/result`)**:
- 용도: 결과 표시 및 다음 액션
- 진입: ExamProgress에서 마지막 문제 완료
- 종료:
  - "오답 다시 보기" → /wordsets/[id]/learn
  - "다시 시험하기" → ExamConfigScreen으로
  - "세트로 돌아가기" → /wordsets/[id]

## 세션 스토리지 스키마

```typescript
interface ExamSessionStorage {
  key: "exam_session_${wordSetId}";
  value: {
    wordSetId: string;
    mode: "multiple-choice" | "short-answer" | "mixed";
    direction: "forward" | "reverse";
    questions: Array<{
      wordId: string;
      type: "multiple-choice" | "short-answer";
      prompt: string;
      correctAnswer: string;
      choices?: string[];
    }>;
    currentIndex: number;
    answers: Array<{
      questionIndex: number;
      wordId: string;
      userAnswer: string;
      isCorrect: boolean;
      answeredAt: number;
    }>;
    startTime: number;
  };
}
```

## SPEC-LEARN-001 통합 포인트

### 재사용 컴포넌트/훅

1. **useSpeech 훅**
   - 위치: `hooks/useSpeech.ts` (SPEC-LEARN-001)
   - 사용: `useExamSpeech()` 훅에서 래핑
   - 목적: 역방향 모드에서 단어 음성 재생

2. **LearnSession 모델**
   - 위치: 데이터 모델 (SPEC-LEARN-001)
   - 사용: 오답 복습 시 LearnSession 생성
   - 목적: 오답 단어만 필터링하여 학습 모드 전환

3. **FlipCard 컴포넌트**
   - 위치: `components/Learn/FlipCard.tsx` (SPEC-LEARN-001)
   - 사용: 오답 복습 진행
   - 목적: 일관된 학습 경험 제공

### 데이터 연결

```
ExamResult
  └─ incorrectWords: Word[]
       └─ LearnSession 생성
            └─ /wordsets/[id]/learn?mode=incorrect_review
                 └─ FlipCard 컴포넌트 렌더링
```

## 성능 최적화

### 1. 렌더링 최적화
- React.memo() 활용 (ExamQuestion 컴포넌트)
- useCallback() 의존성 관리
- 불필요한 리렌더링 방지

### 2. 번들 최적화
- Tree shaking 적용
- Dynamic imports (라우팅)
- 번들 크기 모니터링

### 3. 로딩 성능
- 문제 로딩: < 1초
- 채점 피드백: < 500ms
- 페이지 전환: smooth navigation

## 보안 및 접근성

### 입력 검증
- 주관식 답변: 길이 < 100자, 특수문자 제한 (선택)
- 모드/방향 선택: enum 타입으로 제한
- XSS 방지: 사용자 입력 sanitizing

### 접근성 (WCAG 2.1 AA)
- ARIA 레이블: 모든 interactive 요소
- 키보드 네비게이션: Tab, Enter, Escape
- 색상 대비율: 4.5:1 이상
- 포커스 관리: 자동 포커스 이동

## 테스트 전략

### 단위 테스트 (Unit Tests)
- 유틸리티 함수 (4개): 100% 커버리지
- 훅 (2개): 95%+ 커버리지
- 컴포넌트 (6개): 90%+ 커버리지

### 통합 테스트 (Integration Tests)
- SPEC-LEARN-001 연동
- 세션 스토리지 저장/복원
- 상태 관리 플로우

### E2E 테스트 (E2E Tests)
- 객관식/주관식/혼합 모드 여정
- 정방향/역방향 여정
- 오답 복습 여정
- 시험 중단 및 복귀

## 품질 기준 (TRUST 5)

### Test-First
- 단위 테스트: 881개, 91.89% 커버리지 ✅
- E2E 테스트: 주요 플로우 100% ✅

### Readable
- 명확한 함수명/변수명 ✅
- JSDoc 주석 추가 ✅
- 논리 구조 간결 ✅

### Unified
- SPEC-LEARN-001, SPEC-UI-001과 패턴 일관 ✅
- TypeScript strict mode ✅
- ESLint, Prettier 통과 ✅

### Secured
- 입력 검증 구현 ✅
- OWASP 기본 준수 ✅
- 민감정보 보호 ✅

### Trackable
- TAG 시스템 적용 ✅
- 요구사항-구현 매핑 ✅
- 커밋 메시지 추적성 ✅

## 향후 확장 계획

### Phase 5: E2E 테스트 확대
- Playwright를 통한 실제 사용자 여정 테스트
- 브라우저 호환성 검증
- 성능 프로파일링

### 추가 기능 (범위 외)
- 시험 기록 DB 저장
- 통계 및 분석 대시보드
- 시험 설정 저장/재사용
- 협력 학습 (멀티플레이어)
- AI 기반 문제 생성

## 관련 문서

- `.moai/specs/SPEC-EXAM-001/spec.md` - 상세 명세
- `.moai/specs/SPEC-EXAM-001/acceptance.md` - 인수 기준
- `.moai/docs/SPEC-EXAM-001-API-REFERENCE.md` - API 참조

---

**문서 버전**: 1.0.0
**최종 업데이트**: 2025-12-11
**작성자**: doc-syncer
**상태**: Complete
