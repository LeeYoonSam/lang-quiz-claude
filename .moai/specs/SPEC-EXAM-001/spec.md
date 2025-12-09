---
id: SPEC-EXAM-001
version: 1.0.0
status: draft
created: 2025-12-09
updated: 2025-12-09
author: Albert
priority: high
dependencies:
  - SPEC-LEARN-001
  - SPEC-WORDSET-001
  - SPEC-UI-001
---

# HISTORY

| 버전  | 날짜       | 작성자 | 변경 내용      |
| ----- | ---------- | ------ | -------------- |
| 1.0.0 | 2025-12-09 | Albert | 초기 SPEC 생성 |

---

# SPEC-EXAM-001: 영어 단어 시험 시스템

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
- TypeScript: 5.9.3
- TanStack Query: ^5.90.10 (서버 상태 관리)
- Tailwind CSS: ^4.1.17 (스타일링)

**추가 라이브러리**
- **Web Speech API** (브라우저 내장): TTS 음성 재생 (역방향 모드)

**Development Tools**
- Jest, React Testing Library (단위 테스트)
- Playwright (E2E 테스트)

### 배포 환경

- **개발 환경**: localhost:3000
- **프로덕션 환경**: Vercel/AWS/자체 서버
- **브라우저 지원**: Chrome, Firefox, Safari, Edge (최신 2개 버전)
- **TTS 호환성**: SPEC-LEARN-001과 동일

### 기존 시스템 상태

- ✅ **SPEC-LEARN-001 완료**: 플립 카드 학습 시스템, LearnSession 모델, useSpeech 훅
- ✅ **SPEC-WORDSET-001 완료**: 단어 세트 CRUD 및 단어 데이터 제공
- ✅ **SPEC-UI-001 완료**: 디자인 시스템 (Button, Card, Badge)

---

## Assumptions (가정)

### 사용자 컨텍스트

1. **타겟 사용자**: 단어 세트를 생성한 모든 사용자 (어휘 학습자)
2. **사용 시나리오**:
   - 사용자가 단어 세트 상세 페이지에서 "시험 시작" 버튼 클릭
   - 시험 설정 화면에서 모드 선택 (객관식, 주관식, 혼합)
   - 출제 방향 선택 (정방향: 뜻→단어, 역방향: 단어→뜻)
   - 문제 풀이
   - 결과 확인 및 오답 복습
3. **기술 수준**: 일반 사용자 (기술적 배경 불필요)
4. **사용 환경**: 데스크톱, 태블릿, 모바일 (SPEC-LEARN-001과 동일)

### 시스템 제약사항

1. **시험 데이터 저장**:
   - 시험 진행 상태는 세션 스토리지에만 저장
   - 향후 확장: 시험 기록 DB 저장 (이번 SPEC 범위 외)

2. **시험 모드**:
   - **객관식**: 정답 + 같은 세트 내 랜덤 오답 3개 (4지선다)
   - **주관식**: 단어 입력 (완전 일치 판정, 대소문자/공백 무시)
   - **혼합**: 객관식 3개 + 주관식 7개 (고정 비율, 랜덤 순서)

3. **출제 방향**:
   - **정방향**: 뜻 표시 → 단어 입력/선택
   - **역방향**: 단어(음성 재생) → 뜻 입력

4. **성능 목표**:
   - 문제 로딩 시간 < 1초
   - 채점 피드백 < 500ms
   - 모바일 환경에서도 부드러운 UX 제공

5. **접근성 기준**:
   - WCAG 2.1 AA 수준 준수
   - 키보드 네비게이션 지원

### 비즈니스 제약사항

1. **MVP 범위**: 시험 기본 기능 (설정 → 풀이 → 결과)
2. **오답 복습**: SPEC-LEARN-001의 플립 카드 학습 모드 재사용
3. **개발 우선순위**: 시험 핵심 기능 > 통계 > 분석

---

## Requirements (요구사항)

### 기능 요구사항 (Functional Requirements)

#### FR-1: 시험 시작
**WHEN** 사용자가 단어 세트 상세 페이지에서 "시험 시작" 버튼을 클릭하면,
**THE SYSTEM SHALL** 시험 설정 화면을 표시하고,
**THEN** 시험 모드 선택 (객관식, 주관식, 혼합)과 출제 방향 선택 (정방향, 역방향)을 제공한다.

**STATE**: 시험 설정 화면에서 단어가 4개 미만일 경우 "객관식은 단어가 4개 이상이어야 합니다" 경고 표시.

#### FR-2: 시험 문제 생성
**WHEN** 사용자가 시험 설정을 완료하면,
**THE SYSTEM SHALL** 선택된 모드와 출제 방향에 따라 문제를 생성하고,
**THEN** 첫 번째 문제를 표시한다.

**STATE**:
- 객관식: `generateWrongAnswers()`로 정답 외 3개 오답 생성
- 주관식: 정답은 숨김, 입력창만 표시
- 혼합: 5:5 비율로 문제 타입 랜덤 분배

#### FR-3: 객관식 문제 풀이
**WHEN** 사용자가 객관식 문제를 보면,
**THE SYSTEM SHALL** 뜻(정방향) 또는 단어(역방향)를 표시하고,
**THEN** 4개의 선택지를 제공한다.

**STATE**:
- 선택지 순서: 정답 위치 랜덤 배치
- 선택 후: 즉시 채점 결과 표시 (정답/오답 강조)

#### FR-4: 주관식 문제 풀이
**WHEN** 사용자가 주관식 문제를 보면,
**THE SYSTEM SHALL** 뜻(정방향) 또는 단어(역방향)를 표시하고,
**THEN** 텍스트 입력창을 제공한다.

**STATE**:
- 입력 완료 후 "제출" 버튼 클릭
- 채점 기준: 정답과 완전 일치 (대소문자 무시, 공백 무시)
- `validateAnswer()`로 판정 수행

#### FR-5: 시험 진행 관리
**WHEN** 사용자가 문제를 풀면,
**THE SYSTEM SHALL** 현재 문제 번호와 전체 문제 수를 업데이트하고,
**THEN** 진행률 표시를 갱신한다.

**STATE**:
- 표시 형식: "5 / 10" (5번째 문제 / 전체 10개)
- 진행률 바: 50% (5/10 * 100)
- 네비게이션: "다음" 버튼 활성화 (입력/선택 완료 후)

#### FR-6: 시험 결과 표시
**WHEN** 사용자가 마지막 문제를 완료하면,
**THE SYSTEM SHALL** 결과 화면을 표시하고,
**THEN** 정답률, 정답/오답 개수, 오답 목록을 제공한다.

**STATE**:
- 정답률: `(정답 수 / 전체 * 100).toFixed(1)%`
- 점수: `calculateScore()`로 산출 (옵션: 가중치 적용)
- 오답 목록: 오답만 필터링하여 표시

#### FR-7: 오답 복습
**WHEN** 사용자가 결과 화면에서 "오답 다시 보기" 버튼을 클릭하면,
**THE SYSTEM SHALL** 오답 단어만 필터링하여 SPEC-LEARN-001의 플립 카드 학습 모드로 전환하고,
**THEN** 복습 학습을 시작한다.

**STATE**:
- 학습 세션 생성: LearnSession에 오답 단어 배열만 포함
- 라우팅: `/wordsets/[id]/learn?mode=incorrect_review`
- 복습 완료 후: 시험 결과 화면으로 돌아가기 옵션 제공

#### FR-8: 역방향 모드 (음성 재생)
**WHEN** 사용자가 역방향 출제를 선택하고 문제를 보면,
**THE SYSTEM SHALL** 단어를 음성으로 자동 재생하고,
**THEN** 스피커 아이콘 애니메이션을 표시한다.

**STATE**:
- 자동 재생: 문제 로드 시 즉시 음성 재생
- 수동 재생: "🔊 다시 듣기" 버튼 제공
- TTS 미지원 환경: "음성 재생 불가" 메시지 표시

#### FR-9: 시험 중단
**WHEN** 사용자가 시험 중에 "뒤로" 버튼을 클릭하면,
**THE SYSTEM SHALL** 확인 다이얼로그를 표시하고,
**THEN** 확인 시 시험을 종료하고 세트 상세 페이지로 이동한다.

**STATE**: 진행 중인 시험 데이터는 저장되지 않음 (세션 스토리지 초기화).

### 비기능 요구사항 (Non-Functional Requirements)

#### NFR-1: 성능
**THE SYSTEM SHALL** 문제 로딩 < 1초, 채점 피드백 < 500ms를 유지해야 한다.

#### NFR-2: 접근성
**THE SYSTEM SHALL** WCAG 2.1 AA 기준을 준수하고, 키보드 네비게이션을 지원해야 한다.

#### NFR-3: 반응형 디자인
**THE SYSTEM SHALL** 모바일, 태블릿, 데스크톱 환경에서 최적화된 레이아웃을 제공해야 한다.

#### NFR-4: 테스트 커버리지
**THE SYSTEM SHALL** 단위 테스트 커버리지 90% 이상 달성해야 한다.

### 인터페이스 요구사항 (Interface Requirements)

#### IR-1: 시험 시작 버튼
**THE SYSTEM SHALL** 단어 세트 상세 페이지에 "시험 시작" 버튼을 추가해야 하며, 단어가 4개 미만인 경우 버튼을 비활성화 처리해야 한다.

#### IR-2: 시험 UI 라우팅
**THE SYSTEM SHALL** 다음 경로를 제공해야 한다:
- `/wordsets/[id]/exam` - 시험 설정 화면
- `/wordsets/[id]/exam/progress` - 시험 진행 화면
- `/wordsets/[id]/exam/result` - 결과 화면

#### IR-3: 세션 스토리지 키
**THE SYSTEM SHALL** 시험 진행 상태를 저장할 때 키 형식을 `exam_session_${wordSetId}`로 사용해야 한다.

### 설계 제약사항 (Design Constraints)

#### DC-1: SPEC-LEARN-001 재사용
**THE SYSTEM SHALL** LearnSession 모델과 useSpeech 훅을 재사용하며, 새로운 라이브러리 추가는 최소화해야 한다.

#### DC-2: 기존 기능 유지
**THE SYSTEM SHALL** SPEC-WORDSET-001, SPEC-LEARN-001의 모든 기능을 유지하며, 단어 데이터 구조 변경 없이 시험 기능을 추가해야 한다.

---

## Specifications (명세)

### 데이터 모델

#### 시험 세션 (세션 스토리지)
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

interface ExamQuestion {
  wordId: string;
  type: 'multiple-choice' | 'short-answer';
  prompt: string; // 정방향: meaning, 역방향: word
  correctAnswer: string;
  choices?: string[]; // 객관식만 사용
}

interface ExamAnswer {
  questionIndex: number;
  wordId: string;
  userAnswer: string;
  isCorrect: boolean;
  answeredAt: number;
}

interface ExamResult {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  correctRate: number; // 백분율
  score: number;
  incorrectWords: Word[];
  elapsedTime: number;
}
```

**세션 스토리지 키**: `exam_session_${wordSetId}`

### 유틸리티 함수

#### generateWrongAnswers()
```typescript
function generateWrongAnswers(
  correctAnswer: string,
  words: Word[],
  count: number = 3
): string[] {
  // 정답을 제외한 단어에서 랜덤 선택
  // 중복 제거, 개수 정확히 반환
}
```

#### validateAnswer()
```typescript
function validateAnswer(userAnswer: string, correctAnswer: string): boolean {
  // 대소문자 무시, 공백 제거 후 비교
  // true: 정답, false: 오답
}
```

#### calculateScore()
```typescript
function calculateScore(correctCount: number, totalCount: number): number {
  // 정답 수 / 전체 * 100
  // 소수점 1자리 반올림
}
```

#### generateQuestions()
```typescript
function generateQuestions(
  words: Word[],
  mode: 'multiple-choice' | 'short-answer' | 'mixed',
  direction: 'forward' | 'reverse'
): ExamQuestion[] {
  // 모드에 따라 문제 생성
  // 혼합: 3:7 비율 (객관식 3개 + 주관식 7개 중 출제)
}
```

### UI 컴포넌트 명세

#### ExamConfigScreen (시험 설정)
- **경로**: `/wordsets/[id]/exam`
- **기능**:
  - 시험 모드 선택: 라디오 버튼 (객관식, 주관식, 혼합)
  - 출제 방향 선택: 라디오 버튼 (정방향, 역방향)
  - "시험 시작" 버튼, "뒤로" 버튼
- **검증**: 단어 4개 미만 시 객관식 불가 경고

#### MultipleChoiceQuestion (객관식)
```typescript
interface MultipleChoiceQuestionProps {
  prompt: string;
  choices: string[];
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
  isCorrect?: boolean;
}
```

#### ShortAnswerQuestion (주관식)
```typescript
interface ShortAnswerQuestionProps {
  prompt: string;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
  correctAnswer?: string;
}
```

#### ExamProgress (진행률)
```typescript
interface ExamProgressProps {
  current: number;
  total: number;
}
```

#### ExamResult (결과 화면)
- **정보 표시**:
  - 정답률 (%)
  - 정답 개수 / 전체 개수
  - 점수 (옵션)
  - 소요 시간
- **액션 버튼**:
  - "오답 다시 보기" (오답이 있을 경우만)
  - "다시 시험하기"
  - "세트로 돌아가기"

#### IncorrectReview (오답 복습)
- **기능**: "오답 다시 보기" 버튼 클릭 시 LearnSession 생성 후 학습 모드로 전환
- **데이터**: 오답 단어만 필터링

### 라우팅 명세

| 경로 | 컴포넌트 | 상태 |
|------|---------|------|
| `/wordsets/[id]/exam` | ExamConfigScreen | 설정 화면 |
| `/wordsets/[id]/exam/progress` | ExamProgress + 문제 컴포넌트 | 시험 진행 |
| `/wordsets/[id]/exam/result` | ExamResult | 결과 화면 |

### 스타일 및 레이아웃

#### 객관식 문제 (예시)
```tsx
<div className="space-y-4">
  <div className="text-2xl font-bold text-neutral-900">{prompt}</div>
  <div className="space-y-2">
    {choices.map((choice, index) => (
      <button
        key={index}
        className={`w-full p-4 rounded-lg border-2 transition ${
          isCorrect ? 'border-green-500 bg-green-50' :
          !isCorrect && selectedAnswer === choice ? 'border-red-500 bg-red-50' :
          'border-neutral-300 hover:border-primary-500'
        }`}
      >
        {choice}
      </button>
    ))}
  </div>
</div>
```

---

## Acceptance Criteria (인수 기준)

### AC-1: 시험 설정 화면 진입
**GIVEN** 사용자가 5개 이상의 단어를 포함한 단어 세트 상세 페이지에 있을 때
**WHEN** "시험 시작" 버튼을 클릭하면
**THEN**
- ExamConfigScreen이 렌더링된다
- 시험 모드 선택 옵션 (객관식, 주관식, 혼합) 표시
- 출제 방향 선택 옵션 (정방향, 역방향) 표시
- "시험 시작", "뒤로" 버튼 표시

### AC-2: 단어 부족 경고
**GIVEN** 사용자가 3개 단어만 있는 세트에서 시험 설정 화면에 있을 때
**WHEN** "객관식" 모드를 선택하면
**THEN**
- "객관식은 단어가 4개 이상이어야 합니다" 경고 표시
- "시험 시작" 버튼 비활성화

### AC-3: 객관식 문제 생성
**GIVEN** 사용자가 객관식 + 정방향 설정으로 시험 시작할 때
**WHEN** "시험 시작" 버튼 클릭 후
**THEN**
- 첫 번째 문제: 뜻 표시 + 4개 선택지 (정답 1개 + 오답 3개)
- 선택지 순서: 정답 위치 랜덤 배치
- 진행률: "1 / 10" (전체 10개 문제)

### AC-4: 객관식 정답 선택
**GIVEN** 사용자가 객관식 문제를 보고 있을 때
**WHEN** 정답을 클릭하면
**THEN**
- 선택지 강조: 정답 (녹색), 선택한 답변 (파란색 배경)
- "정답입니다!" 메시지 표시
- 자동으로 2초 후 다음 문제로 진행

### AC-5: 객관식 오답 선택
**GIVEN** 사용자가 객관식 문제에서 오답을 선택했을 때
**WHEN** 오답 선택지를 보면
**THEN**
- 선택지 강조: 정답 (녹색), 오답 선택 (빨간색)
- "오답입니다. 정답은 [정답]입니다" 메시지 표시
- "다음" 버튼 클릭으로 진행

### AC-6: 주관식 문제 풀이
**GIVEN** 사용자가 주관식 문제를 보고 있을 때
**WHEN** 정답을 입력하고 "제출" 버튼을 클릭하면
**THEN**
- validateAnswer() 호출로 판정 (대소문자/공백 무시)
- 정답 시: "정답입니다!" 메시지 + 다음 진행
- 오답 시: "오답입니다. 정답은 [정답]입니다" 메시지 + "다음" 버튼

### AC-7: 혼합 모드 출제
**GIVEN** 사용자가 혼합 모드로 시험 시작할 때
**WHEN** 첫 3개 문제의 타입을 확인하면
**THEN**
- 객관식과 주관식이 랜덤 순서로 배치됨
- 전체 문제 중 객관식 약 30% (3개), 주관식 약 70% (7개) 비율 유지

### AC-8: 역방향 모드 음성 재생
**GIVEN** 사용자가 역방향 출제로 시험 진행 중일 때
**WHEN** 단어 문제가 로드되면
**THEN**
- 단어가 음성으로 자동 재생된다 (useSpeech 훅 사용)
- "🔊 다시 듣기" 버튼 제공
- TTS 미지원 환경: "음성 재생 불가" 메시지 표시

### AC-9: 시험 진행률 표시
**GIVEN** 사용자가 5번째 문제를 풀 때
**WHEN** 진행 상태를 보면
**THEN**
- 진행률 텍스트: "5 / 10"
- 진행률 바: 50% 표시
- 애니메이션: smooth transition (300ms)

### AC-10: 시험 결과 화면
**GIVEN** 사용자가 모든 문제를 완료했을 때
**WHEN** 결과 화면을 보면
**THEN**
- 정답률: "80.0%" (계산된 값)
- 정답 개수: "8 / 10"
- 점수: calculateScore() 결과
- 소요 시간: 분:초 형식
- 오답 목록: 오답 단어와 정답 표시

### AC-11: 오답 복습 기능
**GIVEN** 사용자가 결과 화면에서 오답이 있을 때
**WHEN** "오답 다시 보기" 버튼을 클릭하면
**THEN**
- LearnSession 생성: 오답 단어만 포함
- 경로 이동: `/wordsets/[id]/learn?mode=incorrect_review`
- 플립 카드 학습 모드로 전환
- 복습 완료 후: "결과로 돌아가기" 옵션 제공

### AC-12: 시험 중단
**GIVEN** 사용자가 시험 진행 중일 때
**WHEN** "뒤로" 버튼을 클릭하면
**THEN**
- 확인 다이얼로그: "시험을 중단하시겠습니까?"
- "예" 클릭 시: 세트 상세 페이지로 이동, 세션 초기화
- "아니오" 클릭 시: 시험 화면 유지

### AC-13: 반응형 디자인
**GIVEN** 다양한 화면 크기에서 시험을 진행할 때
**WHEN** 문제 화면을 확인하면
**THEN**
- **모바일 (375px)**: 문제 텍스트 충분히 큼 (font-2xl), 선택지 풀 너비
- **태블릿 (768px)**: 최적화된 간격
- **데스크톱 (1920px)**: 중앙 정렬, 적절한 여백

### AC-14: 브라우저 호환성
**GIVEN** 다양한 브라우저에서 시험에 접근할 때
**WHEN** 역방향 모드를 사용하면
**THEN**
- Chrome/Edge: TTS 완전 지원
- Safari/Firefox: TTS 부분 지원
- TTS 미지원: 대체 메시지 표시, 시험 진행 가능

### AC-15: 성능 기준
**GIVEN** 프로덕션 환경에서 시험을 진행할 때
**WHEN** 문제 로딩과 채점을 확인하면
**THEN**
- 문제 로딩: < 1초
- 채점 피드백: < 500ms

---

## Traceability (추적성)

### TAG 체계

```
@SPEC-EXAM-001
  ├─ @FR-1 (시험 시작)
  │   ├─ @UI-EXAM-START-BUTTON
  │   ├─ @COMPONENT-EXAM-CONFIG-SCREEN
  │   └─ @TEST-EXAM-START
  ├─ @FR-2 (문제 생성)
  │   ├─ @UTILITY-GENERATE-QUESTIONS
  │   ├─ @UTILITY-GENERATE-WRONG-ANSWERS
  │   └─ @TEST-QUESTION-GENERATION
  ├─ @FR-3 (객관식 풀이)
  │   ├─ @COMPONENT-MULTIPLE-CHOICE-QUESTION
  │   ├─ @LOGIC-ANSWER-VALIDATION
  │   └─ @TEST-MULTIPLE-CHOICE
  ├─ @FR-4 (주관식 풀이)
  │   ├─ @COMPONENT-SHORT-ANSWER-QUESTION
  │   ├─ @UTILITY-VALIDATE-ANSWER
  │   └─ @TEST-SHORT-ANSWER
  ├─ @FR-5 (진행 관리)
  │   ├─ @COMPONENT-EXAM-PROGRESS
  │   ├─ @STATE-EXAM-SESSION
  │   └─ @TEST-PROGRESS-UPDATE
  ├─ @FR-6 (결과 표시)
  │   ├─ @COMPONENT-EXAM-RESULT
  │   ├─ @UTILITY-CALCULATE-SCORE
  │   └─ @TEST-RESULT-DISPLAY
  ├─ @FR-7 (오답 복습)
  │   ├─ @COMPONENT-INCORRECT-REVIEW
  │   ├─ @INTEGRATION-SPEC-LEARN-001
  │   └─ @TEST-INCORRECT-REVIEW
  ├─ @FR-8 (역방향 음성)
  │   ├─ @HOOK-USE-EXAM-SPEECH
  │   ├─ @API-WEB-SPEECH
  │   └─ @TEST-REVERSE-MODE-TTS
  └─ @FR-9 (시험 중단)
      ├─ @UI-DIALOG-CONFIRM
      └─ @TEST-EXIT-EXAM
```

### 요구사항 → 구현 매핑

| 요구사항 | 구현 대상 | 영향받는 페이지 | 테스트 |
|---------|---------|----------------|--------|
| FR-1 | "시험 시작" 버튼, ExamConfigScreen | WordSetDetail → ExamConfig | E2E |
| FR-2 | generateQuestions, generateWrongAnswers | ExamProgress | 단위 |
| FR-3 | MultipleChoiceQuestion | ExamProgress | 단위, E2E |
| FR-4 | ShortAnswerQuestion, validateAnswer | ExamProgress | 단위, E2E |
| FR-5 | ExamProgress, ExamSession | ExamProgress | 단위, E2E |
| FR-6 | ExamResult, calculateScore | ExamResult | 단위, E2E |
| FR-7 | IncorrectReview, LearnSession 통합 | ExamResult → Learn | 통합, E2E |
| FR-8 | useExamSpeech (useSpeech 기반) | ExamProgress | 단위 |
| FR-9 | 확인 다이얼로그 | ExamProgress | E2E |

### SPEC 의존성

- **SPEC-LEARN-001**: LearnSession 모델, useSpeech 훅 재사용 (필수)
- **SPEC-WORDSET-001**: 단어 데이터 제공 (필수)
- **SPEC-UI-001**: Button, Card, Badge 컴포넌트 재사용 (필수)

---

**END OF SPEC-EXAM-001**
