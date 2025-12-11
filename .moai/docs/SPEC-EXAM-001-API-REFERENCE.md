---
id: SPEC-EXAM-001-API-REFERENCE
title: SPEC-EXAM-001 API 참조
version: 1.0.0
created: 2025-12-11
updated: 2025-12-11
author: doc-syncer
related_specs:
  - SPEC-EXAM-001
---

# SPEC-EXAM-001: API 참조 문서

## 개요

이 문서는 SPEC-EXAM-001에서 제공하는 모든 API, 훅, 타입 정의를 상세히 설명합니다.

## 목차

1. [유틸리티 함수](#유틸리티-함수)
2. [훅 (Hooks)](#훅-hooks)
3. [타입 정의](#타입-정의)
4. [컴포넌트](#컴포넌트)
5. [세션 스토리지](#세션-스토리지)
6. [에러 처리](#에러-처리)

---

## 유틸리티 함수

### generateQuestions()

대상 단어 배열에서 주어진 모드와 방향에 따라 시험 문제를 생성합니다.

**위치**: `lib/utils/exam/generateQuestions.ts`

**시그니처**:
```typescript
function generateQuestions(
  words: Word[],
  mode: 'multiple-choice' | 'short-answer' | 'mixed',
  direction: 'forward' | 'reverse'
): ExamQuestion[]
```

**매개변수**:

| 이름 | 타입 | 설명 |
|------|------|------|
| `words` | `Word[]` | 단어 배열 (SPEC-WORDSET-001에서 제공) |
| `mode` | `string` | 시험 모드 (객관식/주관식/혼합) |
| `direction` | `string` | 출제 방향 (정방향/역방향) |

**반환값**: `ExamQuestion[]`

**예시**:
```typescript
import { generateQuestions } from '@/lib/utils/exam';

const words = [
  { id: '1', text: 'apple', meaning: '사과' },
  { id: '2', text: 'banana', meaning: '바나나' },
  // ...
];

const questions = generateQuestions(
  words,
  'multiple-choice',
  'forward'
);

console.log(questions[0]);
// {
//   wordId: '1',
//   type: 'multiple-choice',
//   prompt: '사과',
//   correctAnswer: 'apple',
//   choices: ['apple', 'banana', 'cherry', 'date']
// }
```

**주요 동작**:

- **객관식 모드**: 모든 문제에 `choices[]` (4개 선택지) 포함
- **주관식 모드**: `choices` 필드 없음 (텍스트 입력만)
- **혼합 모드**: 3:7 비율로 객관식/주관식 랜덤 배치
- **정방향**: `prompt = word.meaning`, `correctAnswer = word.text`
- **역방향**: `prompt = word.text`, `correctAnswer = word.meaning`

**에러 처리**:
```typescript
// 단어 4개 미만 + 객관식 선택
if (words.length < 4 && mode === 'multiple-choice') {
  throw new Error('객관식은 단어가 4개 이상이어야 합니다');
}
```

---

### generateWrongAnswers()

정답을 제외한 단어 중에서 랜덤하게 오답을 선택합니다.

**위치**: `lib/utils/exam/generateWrongAnswers.ts`

**시그니처**:
```typescript
function generateWrongAnswers(
  correctAnswer: string,
  words: Word[],
  count: number = 3
): string[]
```

**매개변수**:

| 이름 | 타입 | 설명 |
|------|------|------|
| `correctAnswer` | `string` | 정답 (word.text 또는 word.meaning) |
| `words` | `Word[]` | 전체 단어 배열 |
| `count` | `number` | 생성할 오답 개수 (기본값: 3) |

**반환값**: `string[]` - 오답 배열 (개수 정확히 반환)

**예시**:
```typescript
import { generateWrongAnswers } from '@/lib/utils/exam';

const words = [
  { id: '1', text: 'apple', meaning: '사과' },
  { id: '2', text: 'banana', meaning: '바나나' },
  { id: '3', text: 'cherry', meaning: '체리' },
  { id: '4', text: 'date', meaning: '대추' },
];

const wrongAnswers = generateWrongAnswers('apple', words, 3);
console.log(wrongAnswers);
// ['banana', 'cherry', 'date'] 또는
// ['cherry', 'banana', 'date'] 등 (랜덤)
```

**주요 동작**:

- 정답(`correctAnswer`)을 제외한 단어 중 랜덤 선택
- 중복 제거 (같은 오답이 여러 번 나오지 않음)
- 요청한 개수를 정확히 반환
- 사용 가능한 오답이 부족하면 가능한 개수만 반환

**에러 처리**:
```typescript
// 오답이 충분하지 않은 경우
if (availableWrongAnswers.length < count) {
  console.warn(`Requested ${count} wrong answers, but only ${availableWrongAnswers.length} available`);
  return availableWrongAnswers; // 가능한 개수만 반환
}
```

---

### validateAnswer()

사용자의 답변이 정답인지 판정합니다.

**위치**: `lib/utils/exam/validateAnswer.ts`

**시그니처**:
```typescript
function validateAnswer(
  userAnswer: string,
  correctAnswer: string
): boolean
```

**매개변수**:

| 이름 | 타입 | 설명 |
|------|------|------|
| `userAnswer` | `string` | 사용자 입력 답변 |
| `correctAnswer` | `string` | 정답 |

**반환값**: `boolean` - true (정답), false (오답)

**예시**:
```typescript
import { validateAnswer } from '@/lib/utils/exam';

console.log(validateAnswer('apple', 'apple'));           // true
console.log(validateAnswer('APPLE', 'apple'));           // true (대소문자 무시)
console.log(validateAnswer('  apple  ', 'apple'));       // true (공백 무시)
console.log(validateAnswer('a p p l e', 'apple'));       // true (공백 제거)
console.log(validateAnswer('app', 'apple'));             // false (부분 입력)
console.log(validateAnswer('orangee', 'apple'));         // false (완전 오답)
```

**검증 규칙**:

1. **대소문자 무시**: `toLowerCase()`로 통일
2. **공백 무시**: `trim()`으로 앞뒤 공백 제거, 중간 공백도 제거
3. **완전 일치**: 정규화 후 완전 일치만 정답

**구현**:
```typescript
function validateAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalized1 = userAnswer.toLowerCase().trim().replace(/\s+/g, '');
  const normalized2 = correctAnswer.toLowerCase().trim().replace(/\s+/g, '');
  return normalized1 === normalized2;
}
```

---

### calculateScore()

정답 수를 기반으로 점수를 계산합니다.

**위치**: `lib/utils/exam/calculateScore.ts`

**시그니처**:
```typescript
function calculateScore(
  correctCount: number,
  totalCount: number
): number
```

**매개변수**:

| 이름 | 타입 | 설명 |
|------|------|------|
| `correctCount` | `number` | 정답 개수 |
| `totalCount` | `number` | 전체 문제 개수 |

**반환값**: `number` - 점수 (백분율, 소수점 1자리)

**예시**:
```typescript
import { calculateScore } from '@/lib/utils/exam';

console.log(calculateScore(8, 10));     // 80.0
console.log(calculateScore(10, 10));    // 100.0
console.log(calculateScore(0, 10));     // 0.0
console.log(calculateScore(7, 11));     // 63.6
console.log(calculateScore(1, 3));      // 33.3
```

**계산 공식**:
```typescript
(correctCount / totalCount * 100).toFixed(1)
```

---

## Type Adapter 함수

### wordToWordItem()

SPEC-WORDSET-001의 `Word` 모델을 시험용 `ExamQuestion`으로 변환합니다.

**위치**: `lib/utils/exam/typeAdapters.ts`

**시그니처**:
```typescript
function wordToWordItem(
  word: Word,
  mode: 'multiple-choice' | 'short-answer' | 'mixed',
  direction: 'forward' | 'reverse'
): ExamQuestion
```

**매개변수**:

| 이름 | 타입 | 설명 |
|------|------|------|
| `word` | `Word` | 변환할 단어 객체 |
| `mode` | `string` | 시험 모드 |
| `direction` | `string` | 출제 방향 |

**반환값**: `ExamQuestion`

**예시**:
```typescript
import { wordToWordItem } from '@/lib/utils/exam';

const word = {
  id: '1',
  text: 'apple',
  meaning: '사과',
  difficulty: 1,
  // ...
};

const question = wordToWordItem(word, 'multiple-choice', 'forward');
console.log(question);
// {
//   wordId: '1',
//   type: 'multiple-choice',
//   prompt: '사과',
//   correctAnswer: 'apple',
//   choices: []
// }
```

---

### wordsToWordItems()

`Word` 배열을 `ExamQuestion` 배열로 변환합니다.

**시그니처**:
```typescript
function wordsToWordItems(
  words: Word[],
  mode: 'multiple-choice' | 'short-answer' | 'mixed',
  direction: 'forward' | 'reverse'
): ExamQuestion[]
```

**예시**:
```typescript
const words = [/* Word[] */];
const questions = wordsToWordItems(words, 'short-answer', 'reverse');
```

---

## 훅 (Hooks)

### useExamSession()

시험 세션 상태를 관리하는 커스텀 훅입니다.

**위치**: `hooks/useExamSession.ts`

**시그니처**:
```typescript
function useExamSession(
  wordSetId: string
): {
  session: ExamSession | null;
  initSession: (questions: ExamQuestion[], mode: string, direction: string) => void;
  submitAnswer: (answer: string) => ExamAnswer;
  nextQuestion: () => void;
  previousQuestion: () => void;
  getResult: () => ExamResult;
  resetSession: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => boolean;
}
```

**반환값 (Return Object)**:

| 메서드 | 설명 |
|--------|------|
| `session` | 현재 세션 상태 (ExamSession \| null) |
| `initSession()` | 새 시험 세션 초기화 |
| `submitAnswer()` | 답변 제출 및 채점 |
| `nextQuestion()` | 다음 문제로 진행 |
| `previousQuestion()` | 이전 문제로 돌아가기 |
| `getResult()` | 최종 결과 계산 |
| `resetSession()` | 세션 초기화 |
| `saveToStorage()` | 세션 스토리지에 저장 |
| `loadFromStorage()` | 세션 스토리지에서 복원 |

**예시**:
```typescript
import { useExamSession } from '@/hooks/useExamSession';

export default function ExamProgress({ wordSetId }) {
  const {
    session,
    submitAnswer,
    nextQuestion,
    getResult,
  } = useExamSession(wordSetId);

  const handleAnswer = (userAnswer: string) => {
    const answer = submitAnswer(userAnswer);
    console.log(answer.isCorrect);

    if (session.currentIndex === session.questions.length - 1) {
      const result = getResult();
      console.log(`최종 정답률: ${result.correctRate}%`);
    } else {
      nextQuestion();
    }
  };

  return (
    <div>
      <h2>{session.questions[session.currentIndex].prompt}</h2>
      <button onClick={() => handleAnswer('user_input')}>
        제출
      </button>
    </div>
  );
}
```

**세션 스토리지 통합**:
```typescript
// 페이지 언로드 전 자동 저장
useEffect(() => {
  const handleBeforeUnload = () => {
    saveToStorage();
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [session]);

// 페이지 로드 시 자동 복원
useEffect(() => {
  const restored = loadFromStorage();
  if (!restored) {
    initSession(questions, mode, direction);
  }
}, []);
```

---

### useExamSpeech()

역방향 모드에서 단어를 음성으로 재생하는 훅입니다. (SPEC-LEARN-001의 `useSpeech` 기반)

**위치**: `hooks/useExamSpeech.ts`

**시그니처**:
```typescript
function useExamSpeech(text: string): {
  speak: () => Promise<void>;
  isSpeaking: boolean;
  isSupported: boolean;
  error: Error | null;
}
```

**반환값**:

| 속성 | 타입 | 설명 |
|------|------|------|
| `speak` | `() => Promise<void>` | 음성 재생 함수 |
| `isSpeaking` | `boolean` | 현재 재생 중 여부 |
| `isSupported` | `boolean` | TTS 지원 여부 |
| `error` | `Error \| null` | 오류 정보 |

**예시**:
```typescript
import { useExamSpeech } from '@/hooks/useExamSpeech';

export default function ReverseExamQuestion({ word }) {
  const { speak, isSpeaking, isSupported } = useExamSpeech(word.text);

  useEffect(() => {
    // 문제 로드 시 자동 재생 (0.5초 내)
    if (isSupported) {
      speak();
    }
  }, [word, isSupported]);

  return (
    <div>
      <p>{word.text}</p>
      {isSupported ? (
        <button onClick={speak} disabled={isSpeaking}>
          {isSpeaking ? '재생 중...' : '🔊 다시 듣기'}
        </button>
      ) : (
        <p className="text-red-500">음성 재생 불가</p>
      )}
    </div>
  );
}
```

---

## 타입 정의

### ExamQuestion

시험 문제를 표현하는 인터페이스입니다.

**위치**: `types/exam.ts`

**정의**:
```typescript
interface ExamQuestion {
  wordId: string;
  type: 'multiple-choice' | 'short-answer';
  prompt: string;
  correctAnswer: string;
  choices?: string[];
}
```

**필드**:

| 필드 | 타입 | 설명 |
|------|------|------|
| `wordId` | `string` | 단어 ID (SPEC-WORDSET-001 참조) |
| `type` | `string` | 문제 타입 (객관식/주관식) |
| `prompt` | `string` | 문제 지문 (뜻 또는 단어) |
| `correctAnswer` | `string` | 정답 (단어 또는 뜻) |
| `choices` | `string[]` | 객관식 선택지 (객관식만 있음) |

**예시**:
```typescript
// 객관식 문제 (정방향)
const mcQuestion: ExamQuestion = {
  wordId: '1',
  type: 'multiple-choice',
  prompt: '사과',
  correctAnswer: 'apple',
  choices: ['apple', 'banana', 'cherry', 'date']
};

// 주관식 문제 (역방향)
const saQuestion: ExamQuestion = {
  wordId: '2',
  type: 'short-answer',
  prompt: 'banana',
  correctAnswer: '바나나'
};
```

---

### ExamAnswer

사용자의 답변을 표현하는 인터페이스입니다.

**정의**:
```typescript
interface ExamAnswer {
  questionIndex: number;
  wordId: string;
  userAnswer: string;
  isCorrect: boolean;
  answeredAt: number;
}
```

**필드**:

| 필드 | 타입 | 설명 |
|------|------|------|
| `questionIndex` | `number` | 문제 인덱스 (0부터 시작) |
| `wordId` | `string` | 해당 단어 ID |
| `userAnswer` | `string` | 사용자의 답변 |
| `isCorrect` | `boolean` | 정답 여부 |
| `answeredAt` | `number` | 답변 시간 (Unix timestamp) |

---

### ExamResult

시험 결과를 표현하는 인터페이스입니다.

**정의**:
```typescript
interface ExamResult {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  correctRate: number;
  score: number;
  incorrectWords: Word[];
  elapsedTime: number;
}
```

**필드**:

| 필드 | 타입 | 설명 |
|------|------|------|
| `totalQuestions` | `number` | 전체 문제 수 |
| `correctCount` | `number` | 정답 개수 |
| `incorrectCount` | `number` | 오답 개수 |
| `correctRate` | `number` | 정답률 (%) |
| `score` | `number` | 점수 |
| `incorrectWords` | `Word[]` | 오답 단어 배열 |
| `elapsedTime` | `number` | 소요 시간 (ms) |

**계산 예시**:
```typescript
const result: ExamResult = {
  totalQuestions: 10,
  correctCount: 8,
  incorrectCount: 2,
  correctRate: 80.0,  // (8/10) * 100
  score: 80.0,        // calculateScore(8, 10)
  incorrectWords: [
    { id: '3', text: 'cherry', meaning: '체리' },
    { id: '5', text: 'egg', meaning: '계란' }
  ],
  elapsedTime: 120000 // 2분
};
```

---

### ExamSession

세션 스토리지에 저장되는 시험 상태를 표현하는 인터페이스입니다.

**정의**:
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
```

---

## 컴포넌트

### ExamConfigScreen

**위치**: `app/wordsets/[id]/exam/page.tsx`

시험 설정 화면 (모드, 방향 선택)

**Props**: 없음 (라우팅 파라미터 사용)

**기능**:
- 시험 모드 선택: 객관식, 주관식, 혼합
- 출제 방향 선택: 정방향, 역방향
- 단어 4개 미만 시 객관식 불가 경고
- "시험 시작", "뒤로" 버튼

---

### MultipleChoiceQuestion

**위치**: `components/Exam/MultipleChoiceQuestion.tsx`

객관식 문제 표시 컴포넌트

**Props**:
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

---

### ShortAnswerQuestion

**위치**: `components/Exam/ShortAnswerQuestion.tsx`

주관식 문제 표시 컴포넌트

**Props**:
```typescript
interface ShortAnswerQuestionProps {
  prompt: string;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
  correctAnswer?: string;
}
```

---

### ExamProgress

**위치**: `app/wordsets/[id]/exam/progress/page.tsx`

시험 진행 화면

**기능**:
- 문제 표시 (MultipleChoiceQuestion 또는 ShortAnswerQuestion)
- 진행률 표시 ("5 / 10")
- 진행률 바 애니메이션
- "다음" / "자동 진행" 버튼
- "뒤로" 버튼 (시험 중단 확인)

---

### ExamResult

**위치**: `app/wordsets/[id]/exam/result/page.tsx`

결과 화면

**기능**:
- 정답률 (%) 표시
- 정답 개수 / 전체 개수
- 점수 표시
- 소요 시간
- 오답 목록
- "오답 다시 보기" 버튼
- "다시 시험하기" 버튼
- "세트로 돌아가기" 버튼

---

## 세션 스토리지

### 저장 형식

**키**: `exam_session_${wordSetId}`

**값**: JSON 문자열 (ExamSession)

**생명주기**: 브라우저 세션 동안 유지

### 스키마

```json
{
  "wordSetId": "set-123",
  "mode": "multiple-choice",
  "direction": "forward",
  "questions": [
    {
      "wordId": "word-1",
      "type": "multiple-choice",
      "prompt": "사과",
      "correctAnswer": "apple",
      "choices": ["apple", "banana", "cherry", "date"]
    }
  ],
  "currentIndex": 3,
  "answers": [
    {
      "questionIndex": 0,
      "wordId": "word-1",
      "userAnswer": "apple",
      "isCorrect": true,
      "answeredAt": 1702274400000
    }
  ],
  "startTime": 1702274350000
}
```

### 사용 예시

```typescript
// 저장
const session = { /* ExamSession */ };
sessionStorage.setItem(
  `exam_session_${wordSetId}`,
  JSON.stringify(session)
);

// 로드
const stored = sessionStorage.getItem(`exam_session_${wordSetId}`);
const session = stored ? JSON.parse(stored) as ExamSession : null;

// 삭제
sessionStorage.removeItem(`exam_session_${wordSetId}`);
```

---

## 에러 처리

### 일반적인 에러 시나리오

**1. 단어 부족**
```typescript
if (words.length < 4 && mode === 'multiple-choice') {
  throw new Error('객관식은 단어가 4개 이상이어야 합니다');
}
```

**2. 음성 재생 오류**
```typescript
try {
  await speak();
} catch (error) {
  console.error('음성 재생 실패:', error);
  setError('음성 재생 불가');
}
```

**3. 세션 스토리지 오류**
```typescript
try {
  sessionStorage.setItem(key, JSON.stringify(session));
} catch (error) {
  if (error instanceof Error && error.name === 'QuotaExceededError') {
    console.error('저장 공간 부족');
  }
}
```

**4. 타입 검증**
```typescript
const isValidMode = ['multiple-choice', 'short-answer', 'mixed'].includes(mode);
if (!isValidMode) {
  throw new Error(`Invalid mode: ${mode}`);
}
```

---

## 통합 예제

### 완전한 시험 플로우

```typescript
import { useExamSession } from '@/hooks/useExamSession';
import { generateQuestions } from '@/lib/utils/exam';
import { useRouter } from 'next/navigation';

export default function ExamFlow() {
  const router = useRouter();
  const wordSetId = 'set-123';
  const { session, initSession, submitAnswer, getResult, saveToStorage } =
    useExamSession(wordSetId);

  const words = [ /* 단어 배열 */ ];

  // 1. 시험 설정
  const startExam = (mode: string, direction: string) => {
    const questions = generateQuestions(words, mode, direction);
    initSession(questions, mode, direction);
    saveToStorage();
    router.push(`/wordsets/${wordSetId}/exam/progress`);
  };

  // 2. 답변 제출
  const handleAnswer = (userAnswer: string) => {
    const answer = submitAnswer(userAnswer);
    saveToStorage();

    if (session.currentIndex === session.questions.length - 1) {
      // 3. 결과 계산
      const result = getResult();
      router.push(`/wordsets/${wordSetId}/exam/result`);
    }
  };

  return (
    <div>
      <button onClick={() => startExam('multiple-choice', 'forward')}>
        객관식으로 시험 시작
      </button>
    </div>
  );
}
```

---

## 성능 팁

### 1. 렌더링 최적화
```typescript
// React.memo로 불필요한 리렌더링 방지
export const MultipleChoiceQuestion = React.memo(
  function MultipleChoiceQuestion(props) {
    // ...
  }
);
```

### 2. 콜백 최적화
```typescript
// useCallback으로 참조 안정화
const handleAnswer = useCallback((answer: string) => {
  submitAnswer(answer);
}, [submitAnswer]);
```

### 3. 번들 크기
```typescript
// Dynamic import로 라우트별 로드
const ExamProgress = dynamic(() => import('./ExamProgress'));
```

---

**문서 버전**: 1.0.0
**최종 업데이트**: 2025-12-11
**작성자**: doc-syncer
