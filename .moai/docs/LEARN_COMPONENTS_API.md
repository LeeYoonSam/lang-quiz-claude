---
title: 학습 컴포넌트 API 레퍼런스
description: FlipCard, LearnNavigation, LearnProgress, LearnComplete 컴포넌트 및 Hooks API 완벽 레퍼런스
version: 0.1.0
spec: SPEC-LEARN-001
created: 2025-11-27
updated: 2025-11-27
maintainer: "@user"
---

# 학습 컴포넌트 API 레퍼런스

**SPEC-LEARN-001** 플립 카드 학습 시스템의 모든 컴포넌트와 Hooks에 대한 상세 API 문서입니다.

---

## 목차

1. [컴포넌트 개요](#컴포넌트-개요)
2. [FlipCard 컴포넌트](#flipcard-컴포넌트)
3. [LearnNavigation 컴포넌트](#learnnavigation-컴포넌트)
4. [LearnProgress 컴포넌트](#learnprogress-컴포넌트)
5. [LearnComplete 컴포넌트](#learncomplete-컴포넌트)
6. [useLearnSession Hook](#uselearnsession-hook)
7. [useSpeech Hook](#usespeech-hook)
8. [useKeyboard Hook](#usekeyboard-hook)
9. [유틸리티 함수](#유틸리티-함수)
10. [타입 정의](#타입-정의)

---

## 컴포넌트 개요

### 컴포넌트 히에라키

```
┌─ LearnPage
│  ├─ LearnProgress (진행률)
│  ├─ FlipCard (카드 표시)
│  │  └─ 음성 버튼 (내부)
│  └─ LearnNavigation (네비게이션)
│
└─ LearnComplete (완료 화면)
```

### 위치 및 임포트

```typescript
// 컴포넌트
import FlipCard from '@/app/components/learn/FlipCard';
import LearnNavigation from '@/app/components/learn/LearnNavigation';
import LearnProgress from '@/app/components/learn/LearnProgress';
import LearnComplete from '@/app/components/learn/LearnComplete';

// Hooks
import { useLearnSession } from '@/hooks/useLearnSession';
import { useSpeech } from '@/hooks/useSpeech';
import { useKeyboard } from '@/hooks/useKeyboard';

// 유틸리티
import {
  loadSession,
  saveSession,
  clearSession
} from '@/lib/learn/sessionStorage';
import { fisherYatesShuffle } from '@/lib/learn/shuffle';
```

---

## FlipCard 컴포넌트

### 목적

3D 플립 애니메이션 카드를 표시하고 사용자 상호작용을 처리하는 핵심 컴포넌트입니다.

### Props 인터페이스

```typescript
interface Word {
  id: string;
  text: string;        // 영어 단어
  meaning: string;     // 한국어 뜻
}

interface FlipCardProps {
  word: Word;                    // 표시할 단어
  isFlipped: boolean;            // 카드 플립 상태
  onFlip: () => void;            // 플립 콜백
  onSpeak: () => void;           // 음성 재생 콜백
  isSpeaking: boolean;           // 음성 재생 중 여부
}
```

### Props 상세 설명

| Prop | 타입 | 필수 | 설명 | 예시 |
|------|------|------|------|------|
| **word** | Word | ✅ | 표시할 단어 객체 | `{ id: "1", text: "Apple", meaning: "사과" }` |
| **isFlipped** | boolean | ✅ | 카드 뒤집혔는지 여부 | `true` (뒷면 표시) |
| **onFlip** | () => void | ✅ | 플립 시 호출될 콜백 | `() => toggleFlip()` |
| **onSpeak** | () => void | ✅ | 음성 재생 콜백 | `() => speak(word.text)` |
| **isSpeaking** | boolean | ✅ | 음성 재생 중 여부 | `false` |

### 기본 사용법

```typescript
import FlipCard from '@/app/components/learn/FlipCard';
import { useLearnSession } from '@/hooks/useLearnSession';
import { useSpeech } from '@/hooks/useSpeech';

export default function LearnPage() {
  const session = useLearnSession(setId, words, 'random');
  const { speak, isSpeaking } = useSpeech();

  return (
    <FlipCard
      word={session.currentWord}
      isFlipped={session.isFlipped}
      onFlip={session.toggleFlip}
      onSpeak={() => speak(session.currentWord.text, 'en-US')}
      isSpeaking={isSpeaking}
    />
  );
}
```

### 3D 애니메이션 설정

```typescript
const flipVariants = {
  front: {
    rotateY: 0,
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
};

// 컴포넌트 내부에서 사용:
<motion.div
  variants={flipVariants}
  animate={isFlipped ? 'back' : 'front'}
  initial={false}
  style={{ transformStyle: 'preserve-3d' }}
>
  {/* 앞면과 뒷면 */}
</motion.div>
```

### 스타일 및 반응형

```typescript
// 카드 크기
className="
  w-[90vw]              // 모바일: 90% 뷰포트
  max-w-[400px]         // 모바일: 최대 400px
  md:w-[500px]          // 태블릿: 500px
  lg:w-[600px]          // 데스크톱: 600px

  h-[300px]             // 모바일: 300px 높이
  md:h-[350px]          // 태블릿: 350px
  lg:h-[400px]          // 데스크톱: 400px

  cursor-pointer
  rounded-lg
  shadow-lg
"
```

### 접근성 (A11y)

```typescript
// 키보드 및 스크린 리더 지원
<div
  role="button"
  tabIndex={0}
  aria-label={
    isFlipped
      ? `단어: ${word.text}, 클릭하여 뜻 보기`
      : `뜻: ${word.meaning}, 클릭하여 단어 보기`
  }
  onKeyDown={handleKeyDown}  // Enter/Space 지원
  onClick={onFlip}
>
```

### 성능 최적화

```typescript
// Framer Motion 최적화
<motion.div
  initial={false}  // 마운트 시 애니메이션 스킵
  style={{
    transformStyle: 'preserve-3d' as const,  // 3D 가속
  }}
>
```

---

## LearnNavigation 컴포넌트

### 목적

이전/다음 버튼과 학습 완료 버튼을 제공하는 네비게이션 컴포넌트입니다.

### Props 인터페이스

```typescript
interface LearnNavigationProps {
  onPrevious: () => void;       // 이전 버튼 클릭
  onNext: () => void;           // 다음 버튼 클릭
  onComplete: () => void;       // 완료 버튼 클릭
  isFirstCard: boolean;         // 첫 카드 여부
  isLastCard: boolean;          // 마지막 카드 여부
}
```

### Props 상세 설명

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| **onPrevious** | () => void | ✅ | 이전 카드로 이동 콜백 |
| **onNext** | () => void | ✅ | 다음 카드로 이동 콜백 |
| **onComplete** | () => void | ✅ | 학습 완료 콜백 |
| **isFirstCard** | boolean | ✅ | 첫 카드 상태 (이전 버튼 비활성화) |
| **isLastCard** | boolean | ✅ | 마지막 카드 상태 (다음→완료 버튼 전환) |

### 기본 사용법

```typescript
import LearnNavigation from '@/app/components/learn/LearnNavigation';
import { useLearnSession } from '@/hooks/useLearnSession';

export default function LearnPage() {
  const session = useLearnSession(setId, words, mode);
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <LearnNavigation
      onPrevious={session.previous}
      onNext={session.next}
      onComplete={() => setIsCompleted(true)}
      isFirstCard={session.currentIndex === 0}
      isLastCard={session.currentIndex === words.length - 1}
    />
  );
}
```

### 버튼 상태

#### 이전 버튼
- **활성화**: `isFirstCard === false`
- **비활성화**: `isFirstCard === true` (첫 카드일 때)

#### 다음/완료 버튼
- **다음 버튼**: `isLastCard === false` (일반 카드)
- **완료 버튼**: `isLastCard === true` (마지막 카드)

### 스타일

```typescript
// 이전 버튼
className="
  bg-neutral-200 text-neutral-900
  hover:bg-neutral-300
  disabled:bg-neutral-100 disabled:text-neutral-400
  transition-colors
"

// 다음/완료 버튼
className="
  bg-blue-600 text-white
  hover:bg-blue-700
  transition-colors
"
```

---

## LearnProgress 컴포넌트

### 목적

현재 학습 진행률을 시각적으로 표시하는 컴포넌트입니다.

### Props 인터페이스

```typescript
interface LearnProgressProps {
  current: number;    // 현재 카드 번호 (1-indexed)
  total: number;      // 전체 카드 수
}
```

### Props 상세 설명

| Prop | 타입 | 필수 | 설명 | 예시 |
|------|------|------|------|------|
| **current** | number | ✅ | 현재 위치 (1부터 시작) | `3` |
| **total** | number | ✅ | 전체 카드 수 | `10` |

### 기본 사용법

```typescript
import LearnProgress from '@/app/components/learn/LearnProgress';
import { useLearnSession } from '@/hooks/useLearnSession';

export default function LearnPage() {
  const session = useLearnSession(setId, words, mode);

  return (
    <LearnProgress
      current={session.currentIndex + 1}  // 0-indexed → 1-indexed
      total={words.length}
    />
  );
}
```

### 진행률 계산

```typescript
const percentage = (current / total) * 100;
// 3 / 10 = 0.3 → 30%
```

### 애니메이션

```typescript
<motion.div
  className="h-full bg-blue-600"
  initial={{ width: '0%' }}
  animate={{ width: `${percentage}%` }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
/>
```

### 접근성

```typescript
<div
  role="region"
  aria-label={`학습 진행률: ${current}/${total}`}
>
```

---

## LearnComplete 컴포넌트

### 목적

학습 완료 시 축하 메시지와 통계를 표시하는 컴포넌트입니다.

### Props 인터페이스

```typescript
interface LearnCompleteProps {
  wordCount: number;      // 학습한 단어 수
  onRestart: () => void;  // 다시 학습 콜백
  onReturn: () => void;   // 세트로 돌아가기 콜백
}
```

### Props 상세 설명

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| **wordCount** | number | ✅ | 학습한 총 단어 수 |
| **onRestart** | () => void | ✅ | 다시 학습 시 호출 |
| **onReturn** | () => void | ✅ | 세트로 복귀 시 호출 |

### 기본 사용법

```typescript
import LearnComplete from '@/app/components/learn/LearnComplete';
import { useLearnSession } from '@/hooks/useLearnSession';

export default function LearnPage() {
  const session = useLearnSession(setId, words, mode);
  const [isCompleted, setIsCompleted] = useState(false);

  return isCompleted ? (
    <LearnComplete
      wordCount={words.length}
      onRestart={() => {
        session.reset();  // 세션 초기화
        setIsCompleted(false);
      }}
      onReturn={() => {
        router.push(`/wordsets/${setId}`);
      }}
    />
  ) : (
    // 학습 화면
  );
}
```

### 컨텐츠

- **축하 이모지**: 🎉
- **메시지**: "학습을 완료했습니다!"
- **통계**: "{wordCount}개 단어를 학습했습니다"
- **버튼**: 다시 학습 / 세트로 돌아가기

### 애니메이션

```typescript
const containerVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};
```

---

## useLearnSession Hook

### 목적

학습 세션의 전체 상태를 관리하는 핵심 Hook입니다.

### 함수 시그니처

```typescript
function useLearnSession(
  wordSetId: string,
  initialWords: Word[],
  mode: 'sequential' | 'random'
): UseLearnSessionResult
```

### 입력 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| **wordSetId** | string | ✅ | 단어 세트 고유 ID |
| **initialWords** | Word[] | ✅ | 초기 단어 배열 |
| **mode** | 'sequential' \| 'random' | ✅ | 학습 모드 |

### 반환값

```typescript
interface UseLearnSessionResult {
  words: Word[];                      // 현재 세션의 단어 (순차/랜덤)
  currentIndex: number;               // 현재 카드 인덱스 (0-based)
  currentWord: Word | null;           // 현재 카드 단어 또는 null
  isFlipped: boolean;                 // 카드 플립 상태
  mode: 'sequential' | 'random';      // 현재 학습 모드
  next: () => void;                   // 다음 카드로 이동
  previous: () => void;               // 이전 카드로 이동
  toggleFlip: () => void;             // 카드 플립 토글
  reset: () => void;                  // 세션 초기화
}
```

### 사용 예시

#### 기본 사용

```typescript
const session = useLearnSession('set-123', words, 'random');

// 현재 단어 접근
console.log(session.currentWord);  // { id: "1", text: "Apple", ... }

// 상태 변경
session.next();       // 다음 카드
session.previous();   // 이전 카드
session.toggleFlip(); // 카드 플립
session.reset();      // 초기화
```

#### 조건부 사용

```typescript
if (session.currentWord === null) {
  // 단어가 없으면 로딩
  return <LoadingSpinner />;
}

const isFirstCard = session.currentIndex === 0;
const isLastCard = session.currentIndex === session.words.length - 1;
```

### 내부 동작

#### 1. 초기화 (useEffect)

```typescript
useEffect(() => {
  const existing = loadSession(wordSetId);

  if (existing) {
    // 기존 세션 복구
    setWords(existing.words);
    setCurrentIndex(existing.currentIndex);
  } else {
    // 새 세션 생성
    const orderedWords = mode === 'random'
      ? fisherYatesShuffle(initialWords)
      : initialWords;

    setWords(orderedWords);
    saveSession(wordSetId, {
      wordSetId,
      mode,
      words: orderedWords,
      currentIndex: 0,
      startTime: Date.now(),
    });
  }
}, [wordSetId, mode, initialWords]);
```

#### 2. 자동 저장 (useEffect)

```typescript
useEffect(() => {
  if (words.length > 0) {
    saveSession(wordSetId, {
      wordSetId,
      mode,
      words,
      currentIndex,
      startTime: Date.now(),
    });
  }
}, [currentIndex, words, wordSetId, mode]);
```

---

## useSpeech Hook

### 목적

Web Speech API를 통한 텍스트-음성 변환(TTS) 기능을 제공합니다.

### 함수 시그니처

```typescript
function useSpeech(): UseSpeechResult
```

### 반환값

```typescript
interface UseSpeechResult {
  speak: (text: string, lang?: string) => void;  // 텍스트 음성 재생
  isSpeaking: boolean;                            // 재생 중 여부
  isSupported: boolean;                           // 브라우저 지원 여부
  cancel: () => void;                             // 재생 중단
}
```

### 사용 예시

#### 기본 사용

```typescript
const { speak, isSpeaking, isSupported } = useSpeech();

// 영어 발음
speak('Apple', 'en-US');

// 기본값 (en-US)
speak('Hello');
```

#### 버튼 통합

```typescript
<button
  onClick={() => speak(word.text, 'en-US')}
  disabled={isSpeaking}
  aria-label={isSpeaking ? '음성 재생 중' : '음성 듣기'}
>
  {isSpeaking ? '재생 중...' : '음성 듣기'}
</button>
```

#### 브라우저 호환성 처리

```typescript
if (!isSupported) {
  return <p>이 브라우저는 음성을 지원하지 않습니다</p>;
}
```

### 음성 설정

```typescript
// 내부 설정
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = lang;          // 언어 설정
utterance.rate = 0.9;           // 속도 0.9배 (느림)
utterance.pitch = 1.0;          // 음정 (보통)
utterance.volume = 1.0;         // 음량 (최대)
```

### 이벤트 핸들러

```typescript
utterance.onstart = () => {
  setIsSpeaking(true);  // 재생 시작
};

utterance.onend = () => {
  setIsSpeaking(false);  // 재생 끝
};

utterance.onerror = (error) => {
  console.error('Speech synthesis error:', error);
  setIsSpeaking(false);
};
```

### 지원 언어

```typescript
// 주요 언어 코드
'en-US'  // 영어 (미국)
'en-GB'  // 영어 (영국)
'ko-KR'  // 한국어
'ja-JP'  // 일본어
'zh-CN'  // 중국어 (간체)
'fr-FR'  // 프랑스어
'de-DE'  // 독일어
'es-ES'  // 스페인어
```

---

## useKeyboard Hook

### 목적

키보드 단축키를 처리하는 Hook입니다.

### 함수 시그니처

```typescript
function useKeyboard(handlers: KeyboardHandlers): void
```

### 입력 파라미터

```typescript
interface KeyboardHandlers {
  onFlip: () => void;      // 스페이스: 카드 플립
  onNext: () => void;      // 오른쪽 화살표: 다음
  onPrevious: () => void;  // 왼쪽 화살표: 이전
  onExit: () => void;      // Escape: 종료
}
```

### 사용 예시

```typescript
const { toggleFlip, next, previous } = useLearnSession(setId, words, mode);

useKeyboard({
  onFlip: toggleFlip,
  onNext: next,
  onPrevious: previous,
  onExit: () => router.push(`/wordsets/${setId}`)
});
```

### 지원 키

| 키 | 핸들러 | 기능 |
|----|--------|------|
| **스페이스** | onFlip | 카드 플립 |
| **→ (오른쪽)** | onNext | 다음 카드 |
| **← (왼쪽)** | onPrevious | 이전 카드 |
| **Escape** | onExit | 학습 중단 |

### 내부 구현

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case ' ':
        e.preventDefault();
        handlers.onFlip();
        break;
      case 'ArrowRight':
        handlers.onNext();
        break;
      case 'ArrowLeft':
        handlers.onPrevious();
        break;
      case 'Escape':
        handlers.onExit();
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [handlers]);
```

---

## 유틸리티 함수

### sessionStorage 함수

#### loadSession

```typescript
function loadSession(wordSetId: string): LearnSession | null
```

**목적**: sessionStorage에서 저장된 세션 로드

**반환값**: LearnSession 객체 또는 null

```typescript
const session = loadSession('set-123');
if (session) {
  // 저장된 세션이 있음
  const { words, currentIndex } = session;
}
```

#### saveSession

```typescript
function saveSession(wordSetId: string, session: LearnSession): void
```

**목적**: 현재 세션을 sessionStorage에 저장

```typescript
saveSession('set-123', {
  wordSetId: 'set-123',
  mode: 'random',
  words: [...],
  currentIndex: 3,
  startTime: Date.now()
});
```

#### clearSession

```typescript
function clearSession(wordSetId: string): void
```

**목적**: sessionStorage에서 세션 삭제

```typescript
clearSession('set-123');  // 세션 정리
```

### shuffle 함수

#### fisherYatesShuffle

```typescript
function fisherYatesShuffle<T>(array: T[]): T[]
```

**목적**: Fisher-Yates 알고리즘으로 배열 섞기

**특징**:
- 원본 배열 변경 안 함
- O(n) 시간 복잡도
- 균등한 난수 분포

```typescript
const words = [word1, word2, word3, word4, word5];
const shuffled = fisherYatesShuffle(words);
// 결과: [word3, word5, word1, word4, word2] (무작위)
```

---

## 타입 정의

### Word 인터페이스

```typescript
interface Word {
  id: string;          // 고유 식별자
  text: string;        // 영어 단어
  meaning: string;     // 한국어 뜻
}
```

### LearnSession 인터페이스

```typescript
interface LearnSession {
  wordSetId: string;                    // 세트 ID
  mode: 'sequential' | 'random';        // 학습 모드
  words: Word[];                        // 단어 배열
  currentIndex: number;                 // 현재 인덱스
  startTime: number;                    // 시작 시간 (밀리초)
}
```

### 기타 타입

```typescript
// 학습 상태
type LearnMode = 'sequential' | 'random';

// 카드 상태
type CardState = 'front' | 'back';

// 음성 언어
type SpeechLanguage = 'en-US' | 'en-GB' | 'ko-KR' | string;
```

---

## 에러 처리 및 제한사항

### 에러 시나리오

```typescript
// sessionStorage 불가능 (Private browsing)
try {
  saveSession(setId, session);
} catch (error) {
  console.error('세션 저장 불가:', error);
  // 대체 방안: 메모리에만 유지
}

// Web Speech API 미지원
if (!isSupported) {
  console.warn('이 브라우저는 음성을 지원하지 않습니다');
  // 대체 UI: 음성 버튼 숨기기
}
```

### 성능 제한

| 항목 | 제한 |
|------|------|
| **최대 단어 수** | 1,000개 (sessionStorage ~5MB) |
| **애니메이션 시간** | 0.6초 (프레임 드롭 방지) |
| **음성 길이** | 최대 30초 권장 |

---

## 완전한 통합 예시

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FlipCard from '@/app/components/learn/FlipCard';
import LearnNavigation from '@/app/components/learn/LearnNavigation';
import LearnProgress from '@/app/components/learn/LearnProgress';
import LearnComplete from '@/app/components/learn/LearnComplete';
import { useLearnSession } from '@/hooks/useLearnSession';
import { useSpeech } from '@/hooks/useSpeech';
import { useKeyboard } from '@/hooks/useKeyboard';

export default function LearnPage() {
  const router = useRouter();
  const wordSetId = 'set-123';
  const mode = 'random';
  const words = [
    { id: '1', text: 'Apple', meaning: '사과' },
    { id: '2', text: 'Banana', meaning: '바나나' },
  ];

  // 세션 관리
  const session = useLearnSession(wordSetId, words, mode);

  // 음성 기능
  const { speak, isSpeaking, isSupported } = useSpeech();

  // 키보드 단축키
  useKeyboard({
    onFlip: session.toggleFlip,
    onNext: session.next,
    onPrevious: session.previous,
    onExit: () => router.push(`/wordsets/${wordSetId}`),
  });

  // 상태
  const [isCompleted, setIsCompleted] = useState(false);
  const isFirstCard = session.currentIndex === 0;
  const isLastCard = session.currentIndex === session.words.length - 1;

  if (isCompleted) {
    return (
      <LearnComplete
        wordCount={words.length}
        onRestart={() => {
          session.reset();
          setIsCompleted(false);
        }}
        onReturn={() => router.push(`/wordsets/${wordSetId}`)}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <LearnProgress
        current={session.currentIndex + 1}
        total={words.length}
      />

      {session.currentWord && (
        <FlipCard
          word={session.currentWord}
          isFlipped={session.isFlipped}
          onFlip={session.toggleFlip}
          onSpeak={() => speak(session.currentWord!.text, 'en-US')}
          isSpeaking={isSpeaking}
        />
      )}

      <LearnNavigation
        onPrevious={session.previous}
        onNext={session.next}
        onComplete={() => setIsCompleted(true)}
        isFirstCard={isFirstCard}
        isLastCard={isLastCard}
      />
    </div>
  );
}
```

---

## 참고 자료

### 관련 문서
- [LEARN_FEATURES.md](./LEARN_FEATURES.md) - 기능 및 워크플로우
- [LEARN_SESSION_MANAGEMENT.md](./LEARN_SESSION_MANAGEMENT.md) - 세션 관리 상세
- [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md) - UI 컴포넌트 가이드

### 외부 참조
- [Framer Motion API](https://www.framer.com/motion/api/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

**TAG**: @LEARN-COMPONENTS, @LEARN-HOOKS, @LEARN-UTILS

**마지막 업데이트**: 2025-11-27
**유지보수자**: @user
**버전**: 0.1.0
**상태**: ✅ 완성
