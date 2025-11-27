---
title: 플립 카드 학습 시스템
description: 플립 카드 학습 시스템의 사용자 기능, 워크플로우, API 개요
version: 0.1.0
spec: SPEC-LEARN-001
created: 2025-11-27
updated: 2025-11-27
maintainer: "@user"
---

# 플립 카드 학습 시스템 (Flip Card Learning System)

**Lang Quiz 애플리케이션**의 플립 카드 기반 학습 시스템에 대한 완벽한 가이드입니다.

이 시스템은 사용자가 단어를 효율적으로 학습할 수 있도록 설계되었으며, 3D 애니메이션, 음성 재생, 키보드 단축키 등 다양한 기능을 제공합니다.

---

## 목차

1. [개요](#개요)
2. [주요 기능](#주요-기능)
3. [학습 모드](#학습-모드)
4. [사용자 인터페이스](#사용자-인터페이스)
5. [사용 시나리오](#사용-시나리오)
6. [API 및 훅 개요](#api-및-훅-개요)
7. [키보드 단축키](#키보드-단축키)
8. [세션 관리](#세션-관리)
9. [베스트 프랙티스](#베스트-프랙티스)

---

## 개요

### 학습 시스템의 목표

- **직관적 경험**: 클릭 한 번으로 단어/뜻 전환
- **멀티모달 학습**: 시각(카드) + 청각(음성) 통합
- **효율성**: 키보드로 전체 학습 가능
- **연속성**: 세션 저장으로 진행 상황 유지

### 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| **애니메이션** | Framer Motion | 10.16.5 |
| **음성** | Web Speech API | 브라우저 기본 |
| **상태 관리** | React Hooks | 19+ |
| **스타일** | Tailwind CSS | 최신 |
| **저장소** | sessionStorage | 브라우저 기본 |

---

## 주요 기능

### 1️⃣ 3D 플립 카드 애니메이션

**특징**:
- 매끄러운 180도 회전 애니메이션 (0.6초)
- preserve-3d를 이용한 리얼한 3D 효과
- 클릭 또는 스페이스 키로 플립
- 모바일 친화적 제스처 지원

**시각적 구성**:
- **앞면 (기본)**: 파란색 배경, 단어의 뜻 표시
- **뒷면**: 흰색 배경, 영어 단어 표시
- **애니메이션**: Framer Motion의 rotateY 변형 활용

```
┌─────────────────────────┐
│                         │
│    🔄 (0.6초)          │
│                         │
│  "meaning"     →     "word"
│  (앞면)              (뒷면)
│                         │
└─────────────────────────┘
```

### 2️⃣ Web Speech API 기반 음성 재생 (TTS)

**특징**:
- 브라우저 기본 음성 합성 기술 사용
- 외부 API 의존성 없음
- 느린 속도 (0.9배) 설정으로 학습 최적화
- 음성 재생 중 버튼 비활성화

**지원 브라우저**:
- ✅ Chrome, Edge (완벽 지원)
- ✅ Firefox (지원)
- ✅ Safari (부분 지원)
- ⚠️ IE (미지원)

### 3️⃣ 키보드 단축키 (학습 가속화)

**단축키 목록**:

| 키 | 기능 | 설명 |
|---|------|------|
| **스페이스** | 플립 | 단어/뜻 전환 |
| **→ (오른쪽)** | 다음 | 다음 카드로 이동 |
| **← (왼쪽)** | 이전 | 이전 카드로 이동 |
| **Escape** | 종료 | 학습 중지 및 세트로 복귀 |

**사용 예시**:
```
스페이스 → 다음(→) → 다음(→) → 오른쪽(→)으로 5개 카드 스킵
```

### 4️⃣ 학습 진행률 추적

**진행률 표시**:
- 현재 카드 / 전체 카드 수 (예: 3 / 10)
- 프로그레스 바: 시각적 진행 상황 표시
- 애니메이션: 부드러운 바 너비 변화

**실시간 업데이트**:
- 각 카드 전환 시 즉시 반영
- 모바일에서도 명확하게 표시

### 5️⃣ 세션 저장 및 복구

**자동 저장**:
- 매 카드 이동 시 자동 저장
- sessionStorage에 JSON 형식으로 저장
- 브라우저 탭 닫아도 데이터 유지 (같은 탭의 다른 페이지에서도)

**저장되는 정보**:
- 단어 세트 ID
- 학습 모드 (순차/랜덤)
- 현재 카드 인덱스
- 전체 단어 목록
- 세션 시작 시간

**복구 프로세스**:
1. 사용자가 동일한 단어 세트 접근
2. useLearnSession 훅이 sessionStorage 확인
3. 저장된 세션 발견 시 복구
4. 저장된 위치부터 학습 재개

### 6️⃣ 순차/랜덤 학습 모드

**순차 모드 (Sequential)**:
- 추가된 순서대로 카드 표시
- 체계적 학습에 적합
- 같은 순서로 반복

**랜덤 모드 (Random)**:
- Fisher-Yates 셔플 알고리즘 사용
- 매번 다른 순서로 제시
- 암기력 강화

### 7️⃣ 학습 완료 화면

**완료 시 표시 정보**:
- 축하 메시지 🎉
- 학습한 단어 개수
- 다시 학습 버튼
- 세트로 돌아가기 버튼

**UI 특징**:
- 초록색과 파란색 그라데이션 배경
- 부드러운 fade-in 애니메이션
- 모바일 친화적 레이아웃

---

## 학습 모드

### 순차 학습 (Sequential)

```
시작
  ↓
Word 1 → Word 2 → Word 3 → ... → Word N
  ↓
완료
```

**사용 사례**:
- 새로운 단어 세트 처음 학습
- 체계적인 순서 학습
- 상관성 있는 단어 그룹 학습

### 랜덤 학습 (Random)

```
시작
  ↓
Fisher-Yates 셔플
  ↓
Word 5 → Word 2 → Word 8 → ... (무작위)
  ↓
완료
```

**사용 사례**:
- 암기력 강화
- 순서에 의존하는 학습 방지
- 복습 모드

---

## 사용자 인터페이스

### 레이아웃 구조

```
┌─────────────────────────────────────┐
│  🏠 / 📚 단어 세트 / 학습           │  (네비게이션 바)
├─────────────────────────────────────┤
│                                     │
│        진행률: 3 / 10               │  (LearnProgress)
│  ▓▓▓░░░░░░░░░░░░░░░░░ (30%)        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│                                     │
│        ┌─────────────────────┐      │
│        │ 뜻                 │      │  (FlipCard)
│        │  "Apple"          │      │
│        │ (클릭하여 보기)     │      │
│        └─────────────────────┘      │
│                                     │
│            🎤 음성 듣기              │  (음성 버튼)
│                                     │
├─────────────────────────────────────┤
│  [이전]          [다음]              │  (LearnNavigation)
└─────────────────────────────────────┘
```

### 반응형 디자인

| 화면 크기 | 카드 크기 | 텍스트 크기 |
|----------|---------|-----------|
| 모바일 (< 640px) | 90vw, 최대 400px | 4xl |
| 태블릿 (640px~) | 500px | 5xl |
| 데스크톱 (1024px~) | 600px | 6xl |

---

## 사용 시나리오

### 시나리오 1: 새로운 학습 세션 시작

```
1. 사용자가 Word Set 상세 페이지 접근
2. "학습 시작" 버튼 클릭
3. useLearnSession 훅 초기화
4. sessionStorage 확인: 저장된 세션 없음
5. 선택한 모드(순차/랜덤)로 카드 준비
6. 첫 번째 카드 표시
```

### 시나리오 2: 진행 중인 학습 재개

```
1. 사용자가 동일한 Word Set으로 학습 재접근
2. useLearnSession 훅 초기화
3. sessionStorage 확인: 저장된 세션 존재!
4. 저장된 카드 목록 복구
5. 저장된 인덱스 위치에서 재개
6. 사용자: "어제는 7번째까지 했는데..." → 이제 7번째부터 시작
```

### 시나리오 3: 카드 학습 중

```
1. 카드 표시: "사과"
2. 사용자 스페이스 키 또는 클릭
3. 180도 회전 애니메이션 (0.6초)
4. "Apple" 표시
5. 사용자 음성 버튼 클릭
6. Web Speech API로 "Apple" 발음
7. 사용자 오른쪽 화살표 또는 "다음" 버튼
8. 다음 카드로 이동
9. 진행률 업데이트 (4/10 → 5/10)
10. sessionStorage에 상태 저장
```

### 시나리오 4: 마지막 카드 완료

```
1. 사용자 마지막 카드 도달
2. "다음" 버튼 → "학습 완료" 버튼으로 변경
3. 사용자 "학습 완료" 클릭
4. 애니메이션 완료 화면 표시
5. "다시 학습" 또는 "세트로 돌아가기" 선택
   - "다시 학습": 새 세션 시작 (같은 모드)
   - "세트로 돌아가기": 세트 상세 페이지로 복귀
```

---

## API 및 훅 개요

### useLearnSession Hook

**목적**: 학습 세션의 전체 상태 관리

**입력 파라미터**:
```typescript
useLearnSession(
  wordSetId: string,      // 학습 단어 세트 ID
  initialWords: Word[],   // 초기 단어 목록
  mode: 'sequential' | 'random'  // 학습 모드
)
```

**반환값**:
```typescript
{
  words: Word[]              // 현재 세션의 단어 목록
  currentIndex: number       // 현재 카드 인덱스
  currentWord: Word | null   // 현재 카드의 단어
  isFlipped: boolean         // 카드 플립 상태
  mode: 'sequential' | 'random'  // 현재 모드
  next(): void              // 다음 카드
  previous(): void          // 이전 카드
  toggleFlip(): void        // 카드 플립 토글
  reset(): void             // 세션 초기화
}
```

**사용 예시**:
```typescript
const {
  currentWord,
  currentIndex,
  words,
  isFlipped,
  next,
  previous,
  toggleFlip
} = useLearnSession(wordSetId, words, 'random');
```

### useSpeech Hook

**목적**: Web Speech API를 래핑하여 음성 재생 기능 제공

**반환값**:
```typescript
{
  speak(text: string, lang?: string): void  // 텍스트 음성 재생
  isSpeaking: boolean                        // 음성 재생 중 여부
  isSupported: boolean                       // 브라우저 지원 여부
  cancel(): void                             // 재생 중단
}
```

**사용 예시**:
```typescript
const { speak, isSpeaking, isSupported } = useSpeech();

// 영어 발음
speak('Apple', 'en-US');

// 기본값 (en-US)
speak('Hello');
```

### useKeyboard Hook

**목적**: 키보드 단축키 처리

**입력 파라미터**:
```typescript
useKeyboard({
  onFlip: () => void,      // 스페이스: 카드 플립
  onNext: () => void,      // 오른쪽 화살표: 다음
  onPrevious: () => void,  // 왼쪽 화살표: 이전
  onExit: () => void       // Escape: 종료
})
```

**사용 예시**:
```typescript
useKeyboard({
  onFlip: toggleFlip,
  onNext: handleNext,
  onPrevious: handlePrevious,
  onExit: handleExit
});
```

---

## 키보드 단축키

### 전체 단축키 맵

```
┌────────────────┬──────────────────┬─────────────────────┐
│ 키             │ 기능             │ 설명                │
├────────────────┼──────────────────┼─────────────────────┤
│ Space          │ toggleFlip()     │ 단어/뜻 전환       │
│ ArrowRight (→) │ next()          │ 다음 카드           │
│ ArrowLeft (←)  │ previous()      │ 이전 카드           │
│ Escape         │ exit()          │ 학습 중단           │
└────────────────┴──────────────────┴─────────────────────┘
```

### 단축키 시나리오

```
입력 시퀀스: Space → → → (세 번 다음)
결과: 카드 플립 → 다음 → 다음 → 다음 (총 3개 카드 진행)

입력 시퀀스: Space → ← ← Space →
결과: 플립 → 다음 → 이전 → 이전 → 플립 → 다음
```

---

## 세션 관리

### 세션 생명주기

```
┌─────────────────────────────────────────────┐
│         세션 생명주기 (Lifecycle)            │
└─────────────────────────────────────────────┘

1️⃣ 초기화 (Initialization)
   - useLearnSession 훅 호출
   - sessionStorage 확인
   - 신규/기존 세션 결정

2️⃣ 진행 (In Progress)
   - 사용자 상호작용
   - 카드 플립/이동
   - 정기적 자동 저장

3️⃣ 저장 (Save)
   - useEffect로 상태 변경 감지
   - JSON 직렬화
   - sessionStorage 저장

4️⃣ 복구 (Recovery)
   - 브라우저 재시작
   - 동일 탭/도메인
   - 세션 로드 및 재개

5️⃣ 종료 (Completion)
   - 마지막 카드 완료
   - 학습 완료 화면 표시
   - 세션 소거 또는 유지
```

### 저장된 세션 구조

```json
{
  "wordSetId": "set-123",
  "mode": "random",
  "words": [
    { "id": "1", "text": "Apple", "meaning": "사과" },
    { "id": "2", "text": "Banana", "meaning": "바나나" }
  ],
  "currentIndex": 3,
  "startTime": 1732683727000
}
```

---

## 베스트 프랙티스

### 1. 모바일 사용자

```
✅ DO:
- 큰 터치 영역 제공 (최소 44x44px)
- 세로 모드 지원
- 부드러운 스크롤

❌ DON'T:
- 마우스 호버 의존
- 작은 터치 버튼
- 가로 모드만 지원
```

### 2. 접근성 (Accessibility)

```
✅ DO:
- 키보드로 모든 기능 사용 가능
- aria-label 제공
- 충분한 색상 대비

❌ DON'T:
- 마우스만 지원
- 색상으로만 정보 전달
- 포커스 인디케이터 제거
```

### 3. 성능 최적화

```
✅ DO:
- useCallback으로 이벤트 핸들러 메모이제이션
- 불필요한 리렌더링 방지
- 애니메이션 프레임 최적화

❌ DON'T:
- 매번 새로운 함수 인스턴스 생성
- 모든 상태를 최상위 컴포넌트에서 관리
- 불필요한 애니메이션 추가
```

### 4. 오류 처리

```typescript
// 음성 미지원 브라우저
if (!isSupported) {
  showWarning('이 브라우저에서는 음성을 지원하지 않습니다');
  // 대체 UI 표시
}

// sessionStorage 오류
try {
  saveSession(wordSetId, session);
} catch (error) {
  console.error('세션 저장 실패:', error);
  // 사용자에게 알림
}
```

### 5. 사용자 경험

```
✅ 권장:
- 짧은 애니메이션 시간 (0.3~0.6초)
- 명확한 시각적 피드백
- 학습 진행 상황 표시

❌ 권장하지 않음:
- 1초 이상의 긴 애니메이션
- 애니메이션 없는 딱딱한 변화
- 진행 상황 표시 없음
```

---

## 통합 가이드

### Word Set 페이지에서 학습 시작

```typescript
// app/wordsets/[id]/page.tsx
import { useLearnSession } from '@/hooks/useLearnSession';
import FlipCard from '@/app/components/learn/FlipCard';

export default function WordSetDetail() {
  const [mode, setMode] = useState('sequential');
  const { words } = useWordSet(); // 단어 세트 로드

  const session = useLearnSession(wordSetId, words, mode);

  return (
    <div>
      {/* 학습 시작 */}
      <button onClick={() => startLearning()}>
        학습 시작
      </button>

      {/* 학습 화면 */}
      {isLearning && (
        <div>
          <LearnProgress current={session.currentIndex + 1} total={words.length} />
          <FlipCard word={session.currentWord} {...} />
          <LearnNavigation {...} />
        </div>
      )}
    </div>
  );
}
```

---

## 트러블슈팅

### Q1: 음성이 재생되지 않음
**A**: 브라우저가 Web Speech API를 지원하는지 확인하세요
```typescript
if (!isSupported) {
  console.log('이 브라우저는 음성을 지원하지 않습니다');
}
```

### Q2: 세션이 저장되지 않음
**A**: sessionStorage 활성화 확인 및 용량 확인
```typescript
try {
  sessionStorage.setItem('test', '1');
} catch (e) {
  console.log('sessionStorage 불가능:', e);
}
```

### Q3: 카드 애니메이션이 버벅임
**A**: 하드웨어 가속 활성화
```css
.flip-card {
  transform: translateZ(0);  /* GPU 가속 */
  will-change: transform;
}
```

---

## 참고 자료

### 내부 참조
- [LEARN_COMPONENTS_API.md](./LEARN_COMPONENTS_API.md) - 컴포넌트 API 상세
- [LEARN_SESSION_MANAGEMENT.md](./LEARN_SESSION_MANAGEMENT.md) - 세션 관리 상세
- [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md) - UI 컴포넌트 가이드

### 외부 참조
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**TAG**: @LEARN-FEATURES, @LEARN-UI, @LEARN-HOOKS

**마지막 업데이트**: 2025-11-27
**유지보수자**: @user
**버전**: 0.1.0
**상태**: ✅ 완성
