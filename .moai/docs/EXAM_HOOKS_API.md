# EXAM Custom Hooks API 레퍼런스

---

## useExamSession Hook

시험 세션 상태를 관리하고 SessionStorage에 자동으로 저장합니다.

### 기본 사용법

```typescript
import { useExamSession } from '@/hooks/useExamSession';

function ExamComponent() {
  const session = useExamSession(wordSet, {
    mode: 'mixed',
    direction: 'forward',
    questionCount: 10
  });

  const handleSubmit = (answer: string) => {
    session.submitAnswer(answer);
  };

  return (
    <div>
      <Question question={session.currentQuestion} />
      <button onClick={() => handleSubmit('answer')}>제출</button>
    </div>
  );
}
```

### Props

- **words**: WordItem[] - 시험 대상 단어 배열
- **config**: ExamConfig - 시험 설정
  - mode: 'multiple-choice' | 'short-answer' | 'mixed'
  - direction: 'forward' | 'reverse'
  - questionCount?: number

### 반환 값

- **currentQuestion**: ExamQuestion | null - 현재 문제
- **currentIndex**: number - 문제 순서
- **totalQuestions**: number - 전체 문제 수
- **status**: 'config' | 'in-progress' | 'completed' - 시험 상태
- **answers**: ExamAnswer[] - 제출된 답변들
- **startTime**: number - 시작 시간 (타임스탐프)

### 메서드

#### startExam(config: ExamConfig)
시험을 시작합니다.

#### submitAnswer(answer: string)
현재 문제에 대한 답변을 제출합니다.

#### nextQuestion()
다음 문제로 이동합니다. (마지막 문제면 효과 없음)

#### prevQuestion()
이전 문제로 이동합니다. (첫 문제면 효과 없음)

#### finishExam(): ExamResult
시험을 종료하고 결과를 반환합니다.

결과 구조:
```typescript
{
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  duration: number; // 밀리초
}
```

#### resetExam()
세션을 초기화하고 설정 화면으로 돌아갑니다.

---

## useExamSpeech Hook

Web Speech API를 사용하여 텍스트를 음성으로 재생합니다.

### 기본 사용법

```typescript
import { useExamSpeech } from '@/hooks/useExamSpeech';

function PronunciationButton() {
  const { isPlaying, isSupported, speak, stop } = useExamSpeech();

  if (!isSupported) {
    return <p>음성 기능 미지원</p>;
  }

  return (
    <div>
      <button
        onClick={() => speak('hello', 'en-US')}
        disabled={isPlaying}
      >
        발음 듣기
      </button>
      {isPlaying && <button onClick={stop}>중단</button>}
    </div>
  );
}
```

### 반환 값

- **isPlaying**: boolean - 음성 재생 중인지 여부
- **isSupported**: boolean - Web Speech API 지원 여부
- **currentUtterance**: string | null - 재생 중인 텍스트
- **error**: string | null - 에러 메시지

### 메서드

#### speak(text: string, lang?: string)
텍스트를 음성으로 재생합니다.

매개변수:
- text: 재생할 텍스트
- lang: 언어 코드 (기본값: 'en-US')

지원 언어:
- 'en-US': 영어 (미국)
- 'en-GB': 영어 (영국)
- 'ko-KR': 한국어
- 기타 BCP 47 언어 태그

#### stop()
재생 중인 음성을 중단합니다.

#### checkSupport(): boolean
Web Speech API 지원 여부를 확인합니다.

---

## 오류 처리

### useExamSession

```typescript
try {
  session.submitAnswer(userAnswer);
} catch (error) {
  console.error('답변 제출 실패:', error);
}
```

### useExamSpeech

```typescript
const { error } = useExamSpeech();

if (error) {
  console.error('음성 재생 실패:', error);
}
```

---

## 성능 최적화

### SessionStorage 효율성
- 자동 저장은 100ms 디바운싱됨 (불필요한 저장 방지)
- 세션 크기 < 50KB (브라우저 안전 범위)

### Web Speech API 효율성
- 동시에 1개 음성만 재생 (중복 방지)
- 언마운트 시 자동 정리

---

## 호환성

### 브라우저 지원

| 브라우저 | useExamSession | useExamSpeech |
|---------|----------------|---------------|
| Chrome | ✅ | ✅ |
| Firefox | ✅ | ⚠️ (partial) |
| Safari | ✅ | ⚠️ (webkit) |
| Edge | ✅ | ✅ |
| IE | ❌ | ❌ |

### Graceful Degradation
useExamSpeech는 미지원 브라우저에서 graceful degradation을 제공합니다.
(isSupported = false, 기능 비활성화)

---
