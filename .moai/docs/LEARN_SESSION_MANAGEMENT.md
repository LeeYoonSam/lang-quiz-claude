---
title: 학습 세션 관리
description: 플립 카드 학습 시스템의 세션 상태 관리, 데이터 구조, 저장소 메커니즘 상세 설명
version: 0.1.0
spec: SPEC-LEARN-001
created: 2025-11-27
updated: 2025-11-27
maintainer: "@user"
---

# 학습 세션 관리 (Learn Session Management)

**플립 카드 학습 시스템**의 세션 관리 아키텍처, 데이터 구조, 저장소 메커니즘에 대한 완벽한 설명입니다.

---

## 목차

1. [개요](#개요)
2. [세션 데이터 구조](#세션-데이터-구조)
3. [useLearnSession Hook 상세](#uselearnsession-hook-상세)
4. [sessionStorage 유틸리티](#sessionstorage-유틸리티)
5. [세션 생명주기](#세션-생명주기)
6. [데이터 처리 흐름](#데이터-처리-흐름)
7. [에러 처리 및 복구](#에러-처리-및-복구)
8. [성능 최적화](#성능-최적화)
9. [보안 고려사항](#보안-고려사항)

---

## 개요

### 세션 관리의 목표

- **연속성**: 사용자의 학습 진행 상황 유지
- **자동 저장**: 매번 수동 저장하지 않고 자동 처리
- **복구 가능성**: 브라우저 새로고침 후 복구
- **격리**: 다른 단어 세트와 독립적 관리
- **효율성**: 메모리 최소화, 빠른 접근

### 기술 스택

```
┌─────────────────────────────────────┐
│    React Component (LearnPage)      │
├─────────────────────────────────────┤
│     useLearnSession Hook             │
│     (상태 관리 & 자동 저장)          │
├─────────────────────────────────────┤
│    useEffect (저장/복구)             │
├─────────────────────────────────────┤
│  sessionStorage (브라우저 저장소)    │
│  (key: "learn_session_setId")       │
└─────────────────────────────────────┘
```

---

## 세션 데이터 구조

### LearnSession 인터페이스

```typescript
interface LearnSession {
  wordSetId: string;                    // ✅ 세트 고유 식별자
  mode: 'sequential' | 'random';        // ✅ 학습 모드
  words: Array<{                        // ✅ 단어 배열 (순서 중요)
    id: string;
    text: string;
    meaning: string;
  }>;
  currentIndex: number;                 // ✅ 현재 카드 인덱스
  startTime: number;                    // ✅ 세션 시작 시간
}
```

### 필드 상세 설명

| 필드 | 타입 | 필수 | 설명 | 예시 |
|------|------|------|------|------|
| **wordSetId** | string | ✅ | 단어 세트의 고유 ID | `"set-123"` |
| **mode** | 'sequential' \| 'random' | ✅ | 학습 모드 선택 | `"random"` |
| **words** | Word[] | ✅ | 학습할 단어 배열 | `[{...}, {...}]` |
| **currentIndex** | number | ✅ | 현재 카드 위치 (0-based) | `5` |
| **startTime** | number | ✅ | 학습 시작 시간 (밀리초) | `1732683727000` |

### JSON 직렬화 예시

```json
{
  "wordSetId": "set-english-basics",
  "mode": "random",
  "words": [
    {
      "id": "word-001",
      "text": "Apple",
      "meaning": "사과"
    },
    {
      "id": "word-002",
      "text": "Banana",
      "meaning": "바나나"
    },
    {
      "id": "word-003",
      "text": "Cherry",
      "meaning": "체리"
    }
  ],
  "currentIndex": 1,
  "startTime": 1732683727000
}
```

### 저장소 키 포맷

```typescript
// 저장소 키 생성 규칙
const key = `learn_session_${wordSetId}`;

// 예시
"learn_session_set-english-basics"
"learn_session_set-french-vocabulary"
```

---

## useLearnSession Hook 상세

### Hook 구조

```typescript
export function useLearnSession(
  wordSetId: string,
  initialWords: Word[],
  mode: 'sequential' | 'random'
): UseLearnSessionResult {
  // 상태 선언
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // 초기화 및 복구 (1차 useEffect)
  useEffect(() => { ... }, [wordSetId, mode, initialWords]);

  // 자동 저장 (2차 useEffect)
  useEffect(() => { ... }, [currentIndex, words, wordSetId, mode]);

  // 현재 단어 파생
  const currentWord = words[currentIndex] || null;

  // 이벤트 핸들러들
  const next = useCallback(() => { ... }, [words.length]);
  const previous = useCallback(() => { ... }, []);
  const toggleFlip = useCallback(() => { ... }, []);
  const reset = useCallback(() => { ... }, [wordSetId]);

  // 반환
  return { ... };
}
```

### 초기화 프로세스 (1차 useEffect)

```typescript
useEffect(() => {
  const existing = loadSession(wordSetId);

  if (existing) {
    // ✅ 경로 1: 기존 세션 복구
    console.log('기존 세션 복구');
    setWords(existing.words);
    setCurrentIndex(existing.currentIndex);
    setIsFlipped(false);
  } else {
    // ✅ 경로 2: 새 세션 생성
    console.log('새 세션 생성');

    // 1. 모드에 따라 단어 정렬
    const orderedWords = mode === 'random'
      ? fisherYatesShuffle(initialWords)
      : initialWords;

    // 2. 상태 설정
    setWords(orderedWords);
    setCurrentIndex(0);
    setIsFlipped(false);

    // 3. 첫 번째 세션 저장
    const newSession: LearnSession = {
      wordSetId,
      mode,
      words: orderedWords,
      currentIndex: 0,
      startTime: Date.now(),
    };
    saveSession(wordSetId, newSession);
  }
}, [wordSetId, mode, initialWords]);
```

### 자동 저장 프로세스 (2차 useEffect)

```typescript
useEffect(() => {
  // 단어가 로드된 후에만 저장
  if (words.length > 0) {
    const session: LearnSession = {
      wordSetId,
      mode,
      words,
      currentIndex,
      startTime: Date.now(),  // ⚠️ 매번 갱신됨 (의도적)
    };

    saveSession(wordSetId, session);
    console.log('세션 저장:', currentIndex);
  }
}, [currentIndex, words, wordSetId, mode]);
```

### 현재 단어 파생

```typescript
const currentWord = words[currentIndex] || null;

// 예시
words = [Apple, Banana, Cherry]
currentIndex = 0
currentWord = Apple

currentIndex = 1
currentWord = Banana

currentIndex = 3 (범위 초과)
currentWord = null
```

### 이벤트 핸들러 구현

#### next() - 다음 카드

```typescript
const next = useCallback(() => {
  setCurrentIndex((prev) => {
    if (prev < words.length - 1) {
      return prev + 1;      // 이동
    }
    return prev;            // 마지막 카드에서 멈춤
  });
  setIsFlipped(false);      // 새 카드는 앞면부터
}, [words.length]);
```

**동작 흐름**:
```
currentIndex: 0 → 1 → 2 → 3 → 3 (끝에서 멈춤)
isFlipped: false (매번 초기화)
```

#### previous() - 이전 카드

```typescript
const previous = useCallback(() => {
  setCurrentIndex((prev) => {
    if (prev > 0) {
      return prev - 1;      // 이동
    }
    return prev;            // 첫 카드에서 멈춤
  });
  setIsFlipped(false);
}, []);
```

**동작 흐름**:
```
currentIndex: 3 → 2 → 1 → 0 → 0 (처음에서 멈춤)
isFlipped: false (매번 초기화)
```

#### toggleFlip() - 카드 뒤집기

```typescript
const toggleFlip = useCallback(() => {
  setIsFlipped((prev) => !prev);
}, []);
```

**동작 흐름**:
```
isFlipped: false → true → false → true ...
```

#### reset() - 세션 초기화

```typescript
const reset = useCallback(() => {
  setCurrentIndex(0);
  setIsFlipped(false);
  clearSession(wordSetId);  // ✅ 저장된 세션 삭제
}, [wordSetId]);
```

**동작**:
- 인덱스를 0으로 리셋
- 플립 상태 초기화
- sessionStorage의 세션 데이터 삭제

---

## sessionStorage 유틸리티

### 저장소 메커니즘

```
┌──────────────────────────────────────┐
│   sessionStorage (브라우저 저장소)    │
│   용량: 약 5-10MB (브라우저별 다름)  │
│   범위: 같은 탭/도메인만 접근         │
│   생명주기: 탭 닫을 때까지            │
├──────────────────────────────────────┤
│  Key: "learn_session_set-123"        │
│  Value: JSON 문자열                  │
│  {                                   │
│    "wordSetId": "set-123",           │
│    "mode": "random",                 │
│    "words": [...],                   │
│    "currentIndex": 3,                │
│    "startTime": 1732683727000        │
│  }                                   │
└──────────────────────────────────────┘
```

### loadSession - 세션 로드

```typescript
export function loadSession(wordSetId: string): LearnSession | null {
  try {
    // 1. 저장소 키 생성
    const key = getSessionKey(wordSetId);
    // key = "learn_session_set-123"

    // 2. 저장소에서 JSON 문자열 추출
    const stored = sessionStorage.getItem(key);
    // stored = '{"wordSetId":"set-123",...}'

    if (!stored) {
      // 3. 저장된 세션 없음
      return null;
    }

    // 4. JSON 파싱
    return JSON.parse(stored) as LearnSession;
    // 반환: LearnSession 객체
  } catch (error) {
    // 5. 오류 처리 (잘못된 JSON 등)
    console.error('Failed to load session:', error);
    return null;
  }
}
```

**사용 예시**:
```typescript
const session = loadSession('set-123');
if (session) {
  console.log('세션 찾음:', session.currentIndex);
} else {
  console.log('저장된 세션 없음');
}
```

### saveSession - 세션 저장

```typescript
export function saveSession(
  wordSetId: string,
  session: LearnSession
): void {
  try {
    // 1. 저장소 키 생성
    const key = getSessionKey(wordSetId);

    // 2. 세션을 JSON 문자열로 직렬화
    const json = JSON.stringify(session);

    // 3. sessionStorage에 저장
    sessionStorage.setItem(key, json);

    console.log(`세션 저장 [${wordSetId}]: index=${session.currentIndex}`);
  } catch (error) {
    // 4. 오류 처리 (저장소 가득 찬 경우 등)
    console.error('Failed to save session:', error);
  }
}
```

**사용 예시**:
```typescript
const session: LearnSession = {
  wordSetId: 'set-123',
  mode: 'random',
  words: [...],
  currentIndex: 5,
  startTime: Date.now()
};

saveSession('set-123', session);
console.log('저장 완료');
```

### clearSession - 세션 삭제

```typescript
export function clearSession(wordSetId: string): void {
  try {
    // 1. 저장소 키 생성
    const key = getSessionKey(wordSetId);

    // 2. sessionStorage에서 제거
    sessionStorage.removeItem(key);

    console.log(`세션 삭제 [${wordSetId}]`);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}
```

**사용 예시**:
```typescript
clearSession('set-123');  // 저장된 세션 정리
```

### getSessionKey - 저장소 키 생성

```typescript
function getSessionKey(wordSetId: string): string {
  return `learn_session_${wordSetId}`;
}

// 예시
getSessionKey('set-123')           // → "learn_session_set-123"
getSessionKey('set-french')        // → "learn_session_set-french"
```

---

## 세션 생명주기

### 전체 생명주기 다이어그램

```
┌─────────────────────────────────────────────────────────┐
│                  세션 생명주기                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  1️⃣ 세션 시작 (Session Initialization)  │
├─────────────────────────────────────────┤
│ • useLearnSession 훅 호출               │
│ • sessionStorage 확인                   │
│ • 저장된 세션 유무 판단                  │
└────────────┬────────────────────────────┘
             │
     ┌───────┴────────┐
     │                │
┌────▼──────────┐  ┌──▼──────────────┐
│ 신규 세션     │  │ 기존 세션 복구   │
├──────────────┤  ├─────────────────┤
│ • 단어 정렬  │  │ • 저장된 데이터 │
│   (순차/랜덤) │  │   로드          │
│ • 첫 세션    │  │ • 인덱스 복구   │
│   저장       │  │ • 상태 복원     │
└────┬─────────┘  └────┬────────────┘
     │                 │
     └────────┬────────┘
              │
┌─────────────▼──────────────────────┐
│  2️⃣ 학습 진행 (In Progress)        │
├────────────────────────────────────┤
│ 사용자 상호작용 루프:               │
│ • 카드 플립 (toggleFlip)           │
│ • 음성 재생 (speak)                │
│ • 다음 카드 (next)                 │
│ • 이전 카드 (previous)             │
│                                    │
│ 각 상호작용 후:                     │
│ → currentIndex/isFlipped 상태 변경  │
│ → useEffect 감지                   │
│ → 자동 저장 실행                   │
└────────────┬─────────────────────┘
             │
       ┌─────▼─────┐
       │ 계속?      │
       ├───────────┤
  No   │           │   Yes
  ────▼─          ─▼────
       │ ┌──────────┐
       │ │ 저장     │
       │ └────┬─────┘
       │      │
       │      ↓ (상호작용 계속)
       │ ┌──────────┐
       │ │ 자동     │
       │ │ 저장     │
       │ └────┬─────┘
       │      │
       ├──────┘
       │
└──────▼─────────────────────────────┐
│  3️⃣ 학습 완료 (Completion)        │
├────────────────────────────────────┤
│ • 마지막 카드 도달                  │
│ • 완료 화면 표시                    │
│ • 선택지:                           │
│   - 다시 학습 (reset)              │
│   - 세트로 복귀                    │
└────────────┬─────────────────────┘
             │
     ┌───────┴────────┐
     │                │
┌────▼──────┐  ┌─────▼─────────┐
│ 다시 학습  │  │ 세트로 복귀    │
├──────────┤  ├────────────────┤
│ reset()  │  │ 라우팅         │
└─────┬────┘  └────────────────┘
      │
      └──────────────┬────────────┐
                     │            │
              동일 세션 시작   캐시 유지 여부?
```

### 시간 흐름 (Timeline)

```
T₀: 페이지 로드
    ├─ useLearnSession 초기화
    ├─ loadSession 확인
    └─ sessionStorage "learn_session_set-123" 확인

T₁: 첫 번째 세션 저장
    ├─ 신규 세션 생성
    ├─ words 배열 정렬 (순차/랜덤)
    ├─ currentIndex = 0
    └─ saveSession 실행

T₂: 사용자 상호작용
    ├─ 스페이스: toggleFlip()
    │  └─ isFlipped = true → useEffect 감지 → 저장
    │
    ├─ 오른쪽 화살표: next()
    │  └─ currentIndex = 1 → useEffect 감지 → 저장
    │
    └─ (반복...)

T₃: 마지막 카드 도달
    ├─ currentIndex = words.length - 1
    ├─ LearnComplete 표시
    └─ 사용자 선택 대기

T₄: 복귀 또는 다시 시작
    ├─ "다시 학습": reset() → clearSession()
    ├─ "세트로 복귀": 라우팅
    └─ (끝)

T₅: 별도 시점에서 동일 세트 재접근
    ├─ useLearnSession 재호출
    ├─ loadSession 확인
    ├─ sessionStorage에서 이전 세션 발견!
    ├─ 저장된 데이터 로드
    ├─ 저장된 인덱스 복구
    └─ 사용자: "어제는 3번째까지 했는데..." → 3번째부터 시작
```

---

## 데이터 처리 흐름

### 초기화 플로우

```
시작: useLearnSession(setId, initialWords, mode)
  ↓
로드: loadSession(setId)
  ↓
  ├─ null 반환 (저장된 세션 없음)
  │  └─ 신규 세션:
  │     • fisherYatesShuffle (mode='random')
  │     • 상태 설정
  │     • saveSession 호출
  │     └─ 반환: 초기화된 세션
  │
  └─ LearnSession 반환 (저장된 세션 있음)
     └─ 복구:
        • 데이터 로드
        • 상태 복원
        └─ 반환: 복구된 세션
  ↓
완료: UseLearnSessionResult 반환
```

### 매 상호작용 플로우

```
사용자 상호작용 (클릭, 키보드 등)
  ↓
핸들러 호출 (next, toggleFlip 등)
  ↓
useState 업데이트 (currentIndex, isFlipped 등)
  ↓
컴포넌트 리렌더링
  ↓
useEffect 의존성 배열 확인
  ↓
[currentIndex, words, wordSetId, mode] 변경 감지?
  ├─ Yes → saveSession 실행
  │        ├─ LearnSession 객체 생성
  │        ├─ JSON.stringify
  │        ├─ sessionStorage.setItem
  │        └─ 저장 완료
  │
  └─ No → useEffect 스킵
```

### 에러 처리 플로우

```
saveSession 호출
  ↓
try {
  JSON.stringify(session)
  sessionStorage.setItem(key, json)
}
  ↓
성공 ─→ 로그: "세션 저장 완료"
  │
실패 ─→ catch {
         • sessionStorage 불가 (Private browsing)
         • 저장소 가득 찬 경우
         • 쿼터 초과
         }
         └─ 로그: "세션 저장 실패"
            └─ 메모리 내에만 유지 (지속성 없음)
```

---

## 에러 처리 및 복구

### 시나리오 1: sessionStorage 미지원

```typescript
// Private browsing 모드에서 sessionStorage 접근 불가

// 현상
console.error('Failed to save session: Error: QuotaExceededError');

// 감지
function saveSession(wordSetId: string, session: LearnSession) {
  try {
    sessionStorage.setItem(key, json);
  } catch (error) {
    // QuotaExceededError 또는 SecurityError
    console.error('sessionStorage 사용 불가:', error);
    // 대체: 메모리에만 유지 (새로고침 시 손실)
  }
}

// 복구 전략
// ✅ 사용자에게 경고: "개인 정보 보호 모드에서는 진행 상황이 저장되지 않습니다"
// ✅ UI: "저장하지 않는 세션" 배너 표시
// ✅ 기능: 메모리 기반 상태 관리 계속 동작
```

### 시나리오 2: JSON 파싱 실패

```typescript
// sessionStorage에 손상된 데이터가 있을 경우

// 현상
const stored = sessionStorage.getItem(key);
// stored = '{"wordSetId":"set-123"' (불완전한 JSON)

JSON.parse(stored);  // SyntaxError!

// 감지
function loadSession(wordSetId: string): LearnSession | null {
  try {
    const stored = sessionStorage.getItem(key);
    if (!stored) return null;
    return JSON.parse(stored);  // SyntaxError 발생
  } catch (error) {
    console.error('Failed to load session:', error);
    return null;  // null 반환 → 새 세션 생성
  }
}

// 복구 전략
// ✅ 손상된 세션 무시
// ✅ 새 세션 자동 생성
// ✅ 로그: "손상된 세션 감지, 새 세션 시작"
// ✅ clearSession으로 정리 가능
```

### 시나리오 3: 저장소 용량 초과

```typescript
// 매우 큰 단어 세트 (1000개 이상) 또는 여러 세션

// 현상
sessionStorage.setItem(key, largeJson);
// QuotaExceededError: sessionStorage quota exceeded

// 감지
function saveSession(wordSetId: string, session: LearnSession) {
  try {
    sessionStorage.setItem(key, JSON.stringify(session));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('sessionStorage 용량 초과');
      // 가장 오래된 세션 정리
      cleanupOldSessions();
    }
  }
}

// 복구 전략
// ✅ 확인: 저장소 사용량
// ✅ 정리: 불필요한 세션 삭제
// ✅ 제한: 세션 크기 제한 고려
```

### 복구 전략 우선순위

```
1. 시도 (Try)
   ├─ 저장/로드 시도
   └─ 정상 동작 (대부분의 경우)

2. 감지 (Catch)
   ├─ 에러 발생
   ├─ 에러 유형 분류
   └─ 적절한 처리

3. 처리 (Handle)
   ├─ 로깅
   ├─ 사용자 알림
   ├─ 대체 방안 활성화
   └─ 상태 유지

4. 진행 (Continue)
   ├─ 메모리 기반 상태 관리 계속
   ├─ UI 정상 동작
   └─ 사용자 경험 유지
```

---

## 성능 최적화

### 저장 전략

```typescript
// 매 상호작용마다 저장 (현재)
useEffect(() => {
  saveSession(wordSetId, session);
}, [currentIndex, words, ...]);
// 부하: 높음 (매번 JSON 직렬화)

// 개선 1: 디바운싱 (debouncing)
const debouncedSave = useMemo(
  () => debounce((session) => {
    saveSession(wordSetId, session);
  }, 500),
  [wordSetId]
);

// 개선 2: 중요한 상태만 저장
// currentIndex 변경만 저장 (isFlipped는 제외)
const [saveCounter, setSaveCounter] = useState(0);

useEffect(() => {
  if (currentIndex !== prevIndex) {
    saveSession(wordSetId, session);
  }
}, [currentIndex]);
```

### 메모리 최적화

```typescript
// 문제: 큰 단어 배열 저장
// 1000개 단어 → JSON 문자열 ~100KB

// 해결 1: 필요한 정보만 저장
const sessionToBeSaved = {
  wordSetId,
  mode,
  currentIndex,
  startTime,
  // words 배열 전체를 저장하지 말고
  // 초기 호출 시의 words 사용
};

// 해결 2: 압축 (고급)
const compressed = LZ.compress(JSON.stringify(session));
sessionStorage.setItem(key, compressed);
```

### 접근 시간 최적화

```typescript
// 문제: 매번 JSON 파싱
const session = loadSession(setId);  // 파싱 필요

// 해결: 메모리 캐시
const sessionCache = new Map<string, LearnSession>();

export function loadSession(wordSetId: string): LearnSession | null {
  // 1. 캐시 확인
  if (sessionCache.has(wordSetId)) {
    return sessionCache.get(wordSetId)!;
  }

  // 2. sessionStorage 로드
  const stored = sessionStorage.getItem(key);
  if (!stored) return null;

  // 3. 파싱 및 캐싱
  const session = JSON.parse(stored);
  sessionCache.set(wordSetId, session);

  return session;
}
```

---

## 보안 고려사항

### 1. 세션 격리

```
sessionStorage 범위:
├─ 도메인별 격리: example.com ≠ example.org
├─ 프로토콜별 격리: http:// ≠ https://
├─ 포트별 격리: localhost:3000 ≠ localhost:3001
├─ 탭별 격리: 각 탭이 독립적 저장소
└─ → 크로스 사이트 공격 방지
```

### 2. XSS 방지

```typescript
// 문제: 사용자 입력이 세션에 포함될 경우
const word = {
  id: userProvidedId,
  text: userProvidedText,  // "<img src=x onerror='alert(1)'>"
  meaning: userMeaning
};

// 저장
saveSession(setId, { words: [word], ... });

// 로드 및 렌더링
const session = loadSession(setId);
const meaning = session.words[0].meaning;
// JSX: <p>{meaning}</p>
// React는 자동으로 이스케이프 처리

// ✅ 안전: React가 HTML 인터프리테이션 방지
```

### 3. 민감 정보 미저장

```typescript
// ✅ 저장해도 안전한 정보
interface LearnSession {
  wordSetId: string;      // ID
  mode: string;           // 공개 설정
  words: Word[];          // 학습 내용
  currentIndex: number;   // 진행 상황
  startTime: number;      // 타임스탬프
}

// ❌ 저장하면 위험한 정보
// - 사용자 인증 토큰
// - 비밀번호
// - API 키
// - 개인 식별 정보 (이메일, 주소 등)
```

### 4. HTTPS 권장

```
Private browsing 모드:
├─ 명시적으로 sessionStorage 접근 제한하는 브라우저 있음
├─ HTTP (비암호화) 환경에서 민감 데이터 주의
└─ HTTPS 권장 (전송 중 데이터 암호화)

sessionStorage 보안 모범사례:
✅ HTTPS 사용
✅ Content Security Policy (CSP) 설정
✅ 클라이언트 검증만으로 부족 (서버 검증 필수)
✅ 정기적 세션 정리
```

---

## 모니터링 및 디버깅

### 개발자 도구에서 확인

```javascript
// Chrome DevTools > Application > Session Storage

// 저장된 세션 확인
sessionStorage.getItem('learn_session_set-123');

// 모든 세션 확인
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  if (key.startsWith('learn_session_')) {
    console.log(key, sessionStorage.getItem(key));
  }
}

// 세션 정리
sessionStorage.removeItem('learn_session_set-123');
sessionStorage.clear();  // 모든 데이터 삭제
```

### 로깅 전략

```typescript
// 개발 환경에서만 상세 로깅
const DEBUG = process.env.NODE_ENV === 'development';

function saveSession(wordSetId: string, session: LearnSession) {
  try {
    const json = JSON.stringify(session);
    sessionStorage.setItem(key, json);

    if (DEBUG) {
      console.log('✅ 세션 저장', {
        setId: wordSetId,
        index: session.currentIndex,
        words: session.words.length,
        size: `${json.length} bytes`,
      });
    }
  } catch (error) {
    console.error('❌ 세션 저장 실패', {
      error: error.message,
      setId: wordSetId,
    });
  }
}
```

---

## 참고 자료

### 관련 문서
- [LEARN_FEATURES.md](./LEARN_FEATURES.md) - 기능 설명
- [LEARN_COMPONENTS_API.md](./LEARN_COMPONENTS_API.md) - API 레퍼런스

### 외부 참조
- [Web Storage API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [sessionStorage vs localStorage](https://www.w3schools.com/html/html5_webstorage.asp)
- [Session Management Best Practices](https://owasp.org/www-community/attacks/Session_fixation)

---

**TAG**: @LEARN-SESSION, @LEARN-STORAGE, @LEARN-DATA

**마지막 업데이트**: 2025-11-27
**유지보수자**: @user
**버전**: 0.1.0
**상태**: ✅ 완성
