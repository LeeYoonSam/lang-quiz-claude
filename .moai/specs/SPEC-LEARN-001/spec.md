---
id: SPEC-LEARN-001
version: 0.1.0
status: draft
created: 2025-11-26
updated: 2025-11-26
author: "@user"
priority: high
dependencies:
  - SPEC-WORDSET-001
  - SPEC-UI-001
---

# HISTORY

| 버전  | 날짜       | 작성자 | 변경 내용      |
| ----- | ---------- | ------ | -------------- |
| 0.1.0 | 2025-11-26 | @user  | 초기 SPEC 생성 |

---

# SPEC-LEARN-001: 플립 카드 학습 시스템

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

**신규 추가 라이브러리**
- **Framer Motion**: ^10.16.5 (3D 플립 애니메이션)
- **React Swipeable**: ^7.0.1 (터치/스와이프 제스처 - Phase 2)
- **Web Speech API** (브라우저 내장): TTS 음성 재생

**Development Tools**
- Jest, React Testing Library (테스팅)
- Playwright (E2E 테스팅)

### 배포 환경

- **개발 환경**: localhost:3000
- **프로덕션 환경**: Vercel/AWS/자체 서버
- **브라우저 지원**: Chrome, Firefox, Safari, Edge (최신 2개 버전)
- **TTS 호환성**:
  - Chrome/Edge: 완전 지원
  - Safari: 부분 지원 (일부 언어 제한)
  - Firefox: 부분 지원

### 기존 시스템 상태

- ✅ **SPEC-WORDSET-001 완료**: 단어 세트 CRUD 및 단어 데이터 제공
- ✅ **SPEC-UI-001 완료 (2025-12-06)**: 디자인 시스템 (Button, Card, Badge) - 174 테스트 통과, TRUST 5: 98/100
- ✅ **학습 기능 구현 준비 완료**: SPEC-UI-001 완료로 의존성 해제됨

---

## Assumptions (가정)

### 사용자 컨텍스트

1. **타겟 사용자**: 단어 세트를 생성한 모든 사용자 (어휘 학습자)
2. **사용 시나리오**:
   - 사용자가 단어 세트 상세 페이지에서 "학습 시작" 버튼 클릭
   - 학습 모드 선택 (순서대로/랜덤)
   - 플립 카드를 클릭하여 뜻 ↔ 단어 전환
   - 음성 재생을 통해 발음 학습
   - 이전/다음 버튼으로 카드 네비게이션
   - 마지막 카드 후 학습 완료
3. **기술 수준**: 일반 사용자 (기술적 배경 불필요)
4. **사용 환경**:
   - 데스크톱 (1920x1080 이상)
   - 태블릿 (768px-1024px)
   - 모바일 (375px-767px)

### 시스템 제약사항

1. **학습 데이터 저장**:
   - 학습 진행 상태는 **세션 스토리지**에 저장 (새로고침 시 초기화)
   - 향후 확장: 학습 기록 DB 저장 (이번 SPEC 범위 외)
2. **TTS 음성**:
   - 브라우저 기본 TTS 엔진 사용 (Web Speech API)
   - 커스텀 음성 라이브러리 제외 (비용/성능 고려)
   - 음성 언어: 영어 (en-US) 우선, 향후 다국어 확장
3. **성능 목표**:
   - 플립 애니메이션 프레임레이트 60fps 유지
   - TTS 음성 재생 지연 < 500ms
   - 카드 전환 애니메이션 Duration: 600ms
4. **접근성 기준**:
   - WCAG 2.1 AA 수준 준수
   - 키보드 네비게이션 지원 (Space: 플립, ← →: 이전/다음)
   - ARIA 레이블 (카드 상태, 진행률)

### 비즈니스 제약사항

1. **MVP 범위**: Phase 1-2 (플립 카드 + TTS + 네비게이션 + 진행률)
2. **향후 확장**: 학습 기록 저장, 복습 알고리즘 (Spaced Repetition), 즐겨찾기
3. **개발 우선순위**: 핵심 학습 기능 > 통계 > 고급 기능

---

## Requirements (요구사항)

### 기능 요구사항 (Functional Requirements)

#### FR-1: 학습 세션 시작
**WHEN** 사용자가 단어 세트 상세 페이지에서 "학습 시작" 버튼을 클릭하면,
**THE SYSTEM SHALL** 해당 세트의 모든 단어를 로드하고,
**THEN** 학습 모드 선택 화면을 표시한다 (순서대로/랜덤).

**STATE**: 학습 모드가 선택되면 첫 번째 카드가 앞면(뜻)으로 표시된다.

#### FR-2: 학습 모드 선택
**WHEN** 사용자가 학습 모드 선택 화면에서 "순서대로" 또는 "랜덤" 버튼을 클릭하면,
**THE SYSTEM SHALL** 선택된 모드에 따라 단어 배열을 정렬하고,
**THEN** 첫 번째 학습 카드를 표시한다.

**STATE**:
- 순서대로: 단어 세트의 원래 순서 유지
- 랜덤: Fisher-Yates 셔플 알고리즘 적용

#### FR-3: 플립 카드 인터랙션
**WHEN** 사용자가 카드를 클릭하면,
**THE SYSTEM SHALL** 3D 플립 애니메이션 (rotateY 180deg)을 실행하고,
**THEN** 앞면(뜻) ↔ 뒷면(단어) 전환을 수행한다.

**STATE**:
- 앞면: 뜻 표시 (예: "사과")
- 뒷면: 단어 표시 (예: "apple") + TTS 음성 자동 재생

#### FR-4: TTS 음성 재생 (자동)
**WHEN** 카드가 뒷면(단어)으로 플립되면,
**THE SYSTEM SHALL** Web Speech API를 사용하여 단어를 음성으로 자동 재생하고,
**THEN** 재생 상태를 UI에 표시한다 (스피커 아이콘 애니메이션).

**STATE**: 음성 재생 실패 시 "음성 재생 불가" 토스트 메시지를 표시한다.

#### FR-5: TTS 음성 재생 (수동)
**WHEN** 사용자가 음성 버튼(🔊)을 클릭하면,
**THE SYSTEM SHALL** 현재 단어를 음성으로 재생하고,
**THEN** 재생 중 스피커 아이콘에 애니메이션을 적용한다.

**STATE**: 카드가 앞면(뜻)일 때도 음성 버튼 클릭 가능 (단어 미리 듣기).

#### FR-6: 네비게이션 (이전/다음)
**WHEN** 사용자가 "이전" 또는 "다음" 버튼을 클릭하면,
**THE SYSTEM SHALL** 학습 진행 상태를 업데이트하고,
**THEN** 해당 카드를 앞면으로 표시한다.

**STATE**:
- 첫 카드(인덱스 0)에서는 "이전" 버튼 비활성화
- 마지막 카드에서는 "다음" 버튼 대신 "학습 완료" 버튼 표시

#### FR-7: 키보드 단축키
**WHEN** 사용자가 키보드를 입력하면,
**THE SYSTEM SHALL** 다음 단축키를 지원하고,
**THEN** 해당 액션을 실행한다.

**STATE**:
- **Space**: 카드 플립
- **← (왼쪽 화살표)**: 이전 카드
- **→ (오른쪽 화살표)**: 다음 카드
- **Escape**: 학습 종료 (확인 다이얼로그)

#### FR-8: 학습 진행률 표시
**WHEN** 학습이 진행될 때,
**THE SYSTEM SHALL** 현재 카드 번호와 전체 카드 수를 표시하고,
**THEN** 진행률 바를 업데이트한다.

**STATE**:
- 표시 형식: "5 / 20" (5번째 카드 / 전체 20개)
- 진행률 바: 25% (5/20 * 100)
- 애니메이션: smooth transition (300ms)

#### FR-9: 학습 완료
**WHEN** 사용자가 마지막 카드에서 "학습 완료" 버튼을 클릭하면,
**THE SYSTEM SHALL** 학습 완료 화면을 표시하고,
**THEN** "다시 학습" 또는 "세트로 돌아가기" 옵션을 제공한다.

**STATE**:
- 학습 세션 데이터는 세션 스토리지에서 제거
- 통계 표시: 학습한 단어 수, 소요 시간 (Phase 2)

#### FR-10: 학습 중단
**WHEN** 사용자가 "뒤로" 버튼 또는 Escape 키를 누르면,
**THE SYSTEM SHALL** 확인 다이얼로그를 표시하고,
**THEN** 확인 시 학습을 종료하고 세트 상세 페이지로 이동한다.

**STATE**: 학습 진행 상태는 저장되지 않음 (세션 스토리지 초기화).

### 비기능 요구사항 (Non-Functional Requirements)

#### NFR-1: 성능
**THE SYSTEM SHALL** 플립 애니메이션 60fps를 유지하고, TTS 음성 재생 지연을 500ms 이내로 제한해야 한다.

#### NFR-2: 접근성
**THE SYSTEM SHALL** WCAG 2.1 AA 기준을 준수하고, 키보드 네비게이션, ARIA 레이블을 제공해야 한다.

#### NFR-3: 브라우저 호환성
**THE SYSTEM SHALL** Chrome, Edge, Safari, Firefox 최신 2개 버전에서 정상 동작해야 하며, TTS 미지원 브라우저에서는 대체 메시지를 표시해야 한다.

#### NFR-4: 반응형 디자인
**THE SYSTEM SHALL** 모바일, 태블릿, 데스크톱 환경에서 최적화된 카드 크기와 레이아웃을 제공해야 한다.

#### NFR-5: 테스트 커버리지
**THE SYSTEM SHALL** 단위 테스트 커버리지 90% 이상, E2E 테스트를 통한 주요 학습 플로우 100% 커버를 달성해야 한다.

### 인터페이스 요구사항 (Interface Requirements)

#### IR-1: 학습 시작 버튼
**THE SYSTEM SHALL** 단어 세트 상세 페이지에 "학습 시작" 버튼을 추가해야 하며, 단어가 없는 세트는 버튼 비활성화 처리해야 한다.

#### IR-2: 학습 UI 라우팅
**THE SYSTEM SHALL** 학습 화면을 `/wordsets/[id]/learn` 경로로 제공해야 한다.

#### IR-3: 세션 스토리지 키
**THE SYSTEM SHALL** 학습 진행 상태를 세션 스토리지에 저장할 때 키 형식을 `learn_session_${wordSetId}`로 사용해야 한다.

### 설계 제약사항 (Design Constraints)

#### DC-1: 기술 스택 고정
**THE SYSTEM SHALL** Framer Motion 10.16.5, Web Speech API를 사용해야 하며, 추가 애니메이션 라이브러리는 사용하지 않는다.

#### DC-2: 기존 기능 유지
**THE SYSTEM SHALL** SPEC-WORDSET-001의 모든 기능을 유지하며, 단어 데이터 구조 변경 없이 학습 기능을 추가해야 한다.

#### DC-3: 번들 크기 제한
**THE SYSTEM SHALL** Framer Motion 추가로 인한 번들 크기 증가를 50KB 이하로 제한해야 하며, 트리 쉐이킹을 활용해야 한다.

---

## Specifications (명세)

### 데이터 모델

#### 학습 세션 상태 (세션 스토리지)
```typescript
interface LearnSession {
  wordSetId: string;
  mode: 'sequential' | 'random';
  words: Word[];
  currentIndex: number;
  startTime: number;
}
```

**세션 스토리지 키**: `learn_session_${wordSetId}`

**예시**:
```json
{
  "wordSetId": "clx1a2b3c4d5e6f7g8h9",
  "mode": "random",
  "words": [
    { "id": "clx2b3c4d5e6f7g8h9i0", "text": "apple", "meaning": "사과" },
    { "id": "clx3c4d5e6f7g8h9i0j1", "text": "banana", "meaning": "바나나" }
  ],
  "currentIndex": 1,
  "startTime": 1700000000000
}
```

### UI 컴포넌트 명세

#### LearnModeSelect (학습 모드 선택)
- **경로**: `/wordsets/[id]/learn` (초기 화면)
- **컴포넌트**:
  - 제목: "학습 방법을 선택하세요"
  - 버튼: "순서대로 학습", "랜덤 학습"
  - 뒤로가기 버튼
- **상태 관리**: 로컬 상태 (모드 선택 후 세션 스토리지 저장)

#### FlipCard (플립 카드)
```typescript
interface FlipCardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
}

// 사용 예
<FlipCard
  word={{ text: 'apple', meaning: '사과' }}
  isFlipped={isFlipped}
  onFlip={handleFlip}
  onSpeak={handleSpeak}
  isSpeaking={isSpeaking}
/>
```

**스타일 정의**:
- **앞면 (뜻)**:
  - 배경: `bg-primary-50`
  - 텍스트: `text-4xl font-bold text-primary-900`
  - 가이드: `text-sm text-primary-600` ("클릭하여 단어 보기")
- **뒷면 (단어)**:
  - 배경: `bg-white`
  - 텍스트: `text-5xl font-bold text-neutral-900`
  - 발음 표시 (옵션): `text-lg text-neutral-600`

**애니메이션**:
```typescript
// Framer Motion variants
const flipVariants = {
  front: { rotateY: 0 },
  back: { rotateY: 180 }
};

<motion.div
  variants={flipVariants}
  animate={isFlipped ? 'back' : 'front'}
  transition={{ duration: 0.6, ease: 'easeInOut' }}
  style={{ transformStyle: 'preserve-3d' }}
>
  {/* 카드 내용 */}
</motion.div>
```

#### LearnNavigation (네비게이션 컨트롤)
- **컴포넌트**:
  - "이전" 버튼 (← 아이콘 + 텍스트)
  - "다음" 버튼 (→ 아이콘 + 텍스트)
  - "학습 완료" 버튼 (마지막 카드)
- **상태**:
  - 첫 카드: "이전" 버튼 비활성화 (`disabled`)
  - 마지막 카드: "다음" 버튼 → "학습 완료" 버튼으로 변경

#### LearnProgress (진행률 표시)
```typescript
interface LearnProgressProps {
  current: number;
  total: number;
}

// 사용 예
<LearnProgress current={5} total={20} />
```

**표시 형식**:
- 텍스트: "5 / 20"
- 진행률 바:
  ```tsx
  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
    <motion.div
      className="h-full bg-primary-600"
      initial={{ width: '0%' }}
      animate={{ width: `${(current / total) * 100}%` }}
      transition={{ duration: 0.3 }}
    />
  </div>
  ```

#### LearnComplete (학습 완료 화면)
- **컴포넌트**:
  - 축하 메시지: "학습을 완료했습니다! 🎉"
  - 통계 (Phase 2):
    - 학습한 단어 수: "20개 단어를 학습했습니다"
    - 소요 시간: "5분 30초 소요"
  - 액션 버튼:
    - "다시 학습": 같은 세트 재시작
    - "세트로 돌아가기": 상세 페이지로 이동

### TTS 음성 재생 로직

#### useSpeech Hook
```typescript
interface UseSpeechResult {
  speak: (text: string, lang?: string) => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

function useSpeech(): UseSpeechResult {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState('speechSynthesis' in window);

  const speak = (text: string, lang = 'en-US') => {
    if (!isSupported) {
      console.warn('TTS not supported in this browser');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // 약간 느리게 (학습 목적)
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      console.error('TTS error');
    };

    speechSynthesis.speak(utterance);
  };

  return { speak, isSpeaking, isSupported };
}
```

**사용 예**:
```typescript
const { speak, isSpeaking, isSupported } = useSpeech();

// 카드 플립 시 자동 재생
useEffect(() => {
  if (isFlipped && isSupported) {
    speak(currentWord.text);
  }
}, [isFlipped]);

// 수동 재생 버튼
<Button onClick={() => speak(currentWord.text)}>
  {isSpeaking ? '🔊 재생 중...' : '🔊 음성 듣기'}
</Button>
```

### 레이아웃 명세

#### 학습 화면 레이아웃
```tsx
<div className="min-h-screen bg-neutral-50 flex flex-col">
  {/* 헤더 */}
  <header className="sticky top-0 z-50 bg-white shadow-sm py-4 px-6">
    <div className="max-w-4xl mx-auto flex items-center justify-between">
      <Button variant="ghost" onClick={handleBack}>
        ← 뒤로
      </Button>
      <h1 className="text-xl font-semibold text-neutral-900">
        {wordSet.name}
      </h1>
      <LearnProgress current={currentIndex + 1} total={words.length} />
    </div>
  </header>

  {/* 진행률 바 */}
  <div className="w-full h-1 bg-neutral-200">
    <motion.div
      className="h-full bg-primary-600"
      animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
      transition={{ duration: 0.3 }}
    />
  </div>

  {/* 카드 영역 */}
  <main className="flex-1 flex items-center justify-center p-6">
    <FlipCard
      word={currentWord}
      isFlipped={isFlipped}
      onFlip={handleFlip}
      onSpeak={handleSpeak}
      isSpeaking={isSpeaking}
    />
  </main>

  {/* 네비게이션 */}
  <footer className="bg-white border-t py-6 px-6">
    <div className="max-w-4xl mx-auto flex justify-between items-center">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
      >
        ← 이전
      </Button>
      <Button onClick={handleSpeak} variant="ghost" size="lg">
        {isSpeaking ? '🔊 재생 중...' : '🔊 음성 듣기'}
      </Button>
      {currentIndex === words.length - 1 ? (
        <Button variant="primary" onClick={handleComplete}>
          학습 완료 ✓
        </Button>
      ) : (
        <Button variant="outline" onClick={handleNext}>
          다음 →
        </Button>
      )}
    </div>
  </footer>
</div>
```

### 반응형 디자인

#### 카드 크기
```typescript
// tailwind.config.ts 또는 인라인 스타일
const cardSizes = {
  mobile: 'w-[90vw] max-w-[400px] h-[300px]',
  tablet: 'w-[500px] h-[350px]',
  desktop: 'w-[600px] h-[400px]'
};

// 사용 예
<div className="w-[90vw] max-w-[400px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[350px] lg:h-[400px]">
  {/* 플립 카드 */}
</div>
```

#### 브레이크포인트
- **모바일** (< 768px): 1열, 작은 카드, 간격 축소
- **태블릿** (768px-1024px): 중간 카드
- **데스크톱** (> 1024px): 큰 카드

---

## Acceptance Criteria (인수 기준)

### AC-1: 학습 세션 시작
**GIVEN** 사용자가 5개의 단어를 포함한 단어 세트 상세 페이지에 있을 때
**WHEN** "학습 시작" 버튼을 클릭하면
**THEN**
- 학습 모드 선택 화면이 표시된다
- "순서대로 학습", "랜덤 학습" 버튼이 표시된다
- 뒤로가기 버튼이 표시된다

**검증 방법**:
- E2E 테스트: 버튼 클릭 → 모드 선택 화면 렌더링 확인
- URL 확인: `/wordsets/[id]/learn`

### AC-2: 순서대로 학습 모드
**GIVEN** 학습 모드 선택 화면에 있을 때
**WHEN** "순서대로 학습" 버튼을 클릭하면
**THEN**
- 첫 번째 단어의 앞면(뜻)이 표시된다
- 진행률이 "1 / 5"로 표시된다
- 진행률 바가 20% (1/5)로 표시된다

**검증 방법**:
- E2E 테스트: 모드 선택 → 첫 카드 렌더링 확인
- 세션 스토리지: `mode: 'sequential'` 저장 확인
- 단어 순서: 원래 순서 유지 확인

### AC-3: 랜덤 학습 모드
**GIVEN** 학습 모드 선택 화면에 있을 때
**WHEN** "랜덤 학습" 버튼을 클릭하면
**THEN**
- 랜덤하게 셔플된 첫 번째 단어의 앞면(뜻)이 표시된다
- 진행률이 "1 / 5"로 표시된다

**검증 방법**:
- E2E 테스트: 모드 선택 → 첫 카드 렌더링 확인
- 세션 스토리지: `mode: 'random'` 저장 확인
- 단어 순서: 셔플 알고리즘 적용 확인 (원래 순서와 다름)

### AC-4: 플립 카드 애니메이션
**GIVEN** 사용자가 학습 화면에서 앞면(뜻) 카드를 보고 있을 때
**WHEN** 카드를 클릭하면
**THEN**
- 3D 플립 애니메이션이 실행된다 (rotateY 180deg, 600ms)
- 뒷면(단어)이 표시된다
- TTS 음성이 자동 재생된다 (Web Speech API)

**AND**

**WHEN** 뒷면(단어) 카드를 다시 클릭하면
**THEN**
- 역방향 플립 애니메이션이 실행된다
- 앞면(뜻)이 표시된다

**검증 방법**:
- Playwright 테스트: 카드 클릭 → 애니메이션 확인
- 스크린샷 비교: 앞면/뒷면 렌더링 확인
- 성능 측정: 60fps 유지 확인

### AC-5: TTS 음성 자동 재생
**GIVEN** 사용자가 앞면(뜻) 카드를 보고 있을 때
**WHEN** 카드를 클릭하여 뒷면(단어)으로 플립하면
**THEN**
- 단어가 음성으로 자동 재생된다 (Web Speech API)
- 스피커 아이콘에 애니메이션이 적용된다 (재생 중)
- 재생 완료 후 아이콘 애니메이션이 중지된다

**검증 방법**:
- 브라우저 수동 테스트: 카드 플립 → 음성 재생 확인
- 단위 테스트: `useSpeech` 훅 테스트
- 에러 처리: TTS 미지원 브라우저에서 경고 메시지 확인

### AC-6: TTS 음성 수동 재생
**GIVEN** 사용자가 학습 화면에 있을 때
**WHEN** "🔊 음성 듣기" 버튼을 클릭하면
**THEN**
- 현재 단어가 음성으로 재생된다
- 버튼 텍스트가 "🔊 재생 중..."으로 변경된다
- 재생 완료 후 "🔊 음성 듣기"로 복원된다

**AND**

**WHEN** 카드가 앞면(뜻)일 때 음성 버튼을 클릭하면
**THEN**
- 단어를 미리 들을 수 있다 (뒷면 전환 없이)

**검증 방법**:
- E2E 테스트: 버튼 클릭 → 음성 재생 확인
- 상태 테스트: `isSpeaking` 상태 변화 확인

### AC-7: 네비게이션 (다음 카드)
**GIVEN** 사용자가 첫 번째 카드를 보고 있을 때
**WHEN** "다음" 버튼을 클릭하면
**THEN**
- 두 번째 카드의 앞면(뜻)이 표시된다
- 진행률이 "2 / 5"로 업데이트된다
- 진행률 바가 40% (2/5)로 업데이트된다
- "이전" 버튼이 활성화된다

**검증 방법**:
- E2E 테스트: 버튼 클릭 → 카드 전환 확인
- 상태 테스트: `currentIndex` 증가 확인
- 세션 스토리지: `currentIndex` 업데이트 확인

### AC-8: 네비게이션 (이전 카드)
**GIVEN** 사용자가 세 번째 카드를 보고 있을 때
**WHEN** "이전" 버튼을 클릭하면
**THEN**
- 두 번째 카드의 앞면(뜻)이 표시된다
- 진행률이 "2 / 5"로 업데이트된다

**AND**

**GIVEN** 사용자가 첫 번째 카드를 보고 있을 때
**WHEN** 화면을 확인하면
**THEN**
- "이전" 버튼이 비활성화 (`disabled`) 상태이다

**검증 방법**:
- E2E 테스트: 버튼 클릭 → 카드 전환 확인
- 상태 테스트: `currentIndex` 감소 확인
- UI 테스트: 첫 카드에서 "이전" 버튼 비활성화 확인

### AC-9: 키보드 단축키
**GIVEN** 사용자가 학습 화면에 있을 때
**WHEN** 키보드를 입력하면
**THEN**
- **Space**: 카드 플립
- **← (왼쪽 화살표)**: 이전 카드
- **→ (오른쪽 화살표)**: 다음 카드
- **Escape**: 학습 종료 확인 다이얼로그 표시

**검증 방법**:
- Playwright 테스트: 키보드 이벤트 시뮬레이션
- 접근성 테스트: 키보드만으로 모든 기능 사용 가능 확인

### AC-10: 학습 완료
**GIVEN** 사용자가 마지막 카드를 보고 있을 때
**WHEN** "학습 완료" 버튼을 클릭하면
**THEN**
- 학습 완료 화면이 표시된다
- "20개 단어를 학습했습니다" 메시지가 표시된다
- "다시 학습", "세트로 돌아가기" 버튼이 표시된다
- 세션 스토리지에서 학습 데이터가 제거된다

**AND**

**WHEN** "다시 학습" 버튼을 클릭하면
**THEN**
- 학습 모드 선택 화면으로 돌아간다

**AND**

**WHEN** "세트로 돌아가기" 버튼을 클릭하면
**THEN**
- 단어 세트 상세 페이지로 이동한다

**검증 방법**:
- E2E 테스트: 전체 플로우 (시작 → 완료) 확인
- 세션 스토리지: 학습 완료 후 데이터 제거 확인

### AC-11: 학습 중단
**GIVEN** 사용자가 학습 중일 때
**WHEN** "뒤로" 버튼 또는 Escape 키를 누르면
**THEN**
- 확인 다이얼로그가 표시된다 ("학습을 중단하시겠습니까?")
- "예" 버튼 클릭 시 세트 상세 페이지로 이동한다
- "아니오" 버튼 클릭 시 학습 화면으로 돌아간다

**검증 방법**:
- E2E 테스트: 뒤로 버튼 → 다이얼로그 표시 확인
- 세션 스토리지: 중단 시 데이터 제거 확인

### AC-12: 빈 단어 세트 처리
**GIVEN** 사용자가 단어가 없는 세트 상세 페이지에 있을 때
**WHEN** "학습 시작" 버튼 영역을 확인하면
**THEN**
- 버튼이 비활성화 (`disabled`) 상태이다
- "학습하려면 단어를 추가하세요" 안내 메시지가 표시된다

**검증 방법**:
- E2E 테스트: 빈 세트에서 버튼 비활성화 확인
- UI 테스트: 안내 메시지 렌더링 확인

### AC-13: 반응형 디자인
**GIVEN** 다양한 화면 크기에서 접근할 때
**WHEN** 학습 화면을 확인하면
**THEN**
- **모바일 (375px)**: 카드 크기 90vw (max 400px), 높이 300px
- **태블릿 (768px)**: 카드 크기 500px, 높이 350px
- **데스크톱 (1920px)**: 카드 크기 600px, 높이 400px
- 모든 화면에서 카드가 중앙 정렬된다
- 네비게이션 버튼이 올바르게 배치된다

**검증 방법**:
- Playwright 다양한 뷰포트 테스트
- 스크린샷 비교

### AC-14: 성능 기준 충족
**GIVEN** 프로덕션 빌드를 확인할 때
**WHEN** Lighthouse 성능 검사를 수행하면
**THEN**
- 플립 애니메이션 60fps 유지
- TTS 음성 재생 지연 < 500ms
- 번들 크기 증가 < 50KB (Framer Motion 포함)

**검증 방법**:
- Lighthouse 성능 점수 90 이상
- 번들 분석 (next build --analyze)
- 프레임레이트 측정 (Chrome DevTools Performance)

### AC-15: 접근성 기준 준수
**GIVEN** 시스템 전체를 확인할 때
**WHEN** 접근성 검사를 수행하면
**THEN**
- 모든 인터랙티브 요소가 키보드로 접근 가능하다
- ARIA 레이블이 적절히 추가되어 있다 (카드 상태, 진행률)
- 포커스 인디케이터가 명확하게 표시된다
- 색상 대비율이 4.5:1 이상이다 (WCAG AA)

**검증 방법**:
- Lighthouse 접근성 점수 90 이상
- axe-core 또는 jest-axe 테스트
- 키보드 네비게이션 수동 테스트

### AC-16: 브라우저 호환성
**GIVEN** 다양한 브라우저에서 접근할 때
**WHEN** 학습 기능을 사용하면
**THEN**
- Chrome/Edge: TTS 완전 지원, 정상 동작
- Safari: TTS 부분 지원, 정상 동작 (일부 언어 제한)
- Firefox: TTS 부분 지원, 정상 동작
- TTS 미지원 브라우저: "음성 재생 불가" 메시지 표시

**검증 방법**:
- 크로스 브라우저 테스트 (BrowserStack 또는 Playwright)
- TTS 미지원 환경 시뮬레이션 테스트

---

## Traceability (추적성)

### TAG 체계

```
@SPEC-LEARN-001
  ├─ @FR-1 (학습 세션 시작)
  │   ├─ @UI-LEARN-START-BUTTON
  │   ├─ @ROUTE-LEARN-PAGE
  │   └─ @TEST-LEARN-START
  ├─ @FR-2 (학습 모드 선택)
  │   ├─ @UI-MODE-SELECT
  │   ├─ @LOGIC-SHUFFLE-ALGORITHM
  │   └─ @TEST-MODE-SELECTION
  ├─ @FR-3 (플립 카드 인터랙션)
  │   ├─ @UI-FLIP-CARD-COMPONENT
  │   ├─ @ANIMATION-FRAMER-MOTION
  │   └─ @TEST-FLIP-ANIMATION
  ├─ @FR-4 (TTS 음성 자동 재생)
  │   ├─ @HOOK-USE-SPEECH
  │   ├─ @API-WEB-SPEECH
  │   └─ @TEST-TTS-AUTO-PLAY
  ├─ @FR-5 (TTS 음성 수동 재생)
  │   ├─ @UI-SPEAK-BUTTON
  │   └─ @TEST-TTS-MANUAL-PLAY
  ├─ @FR-6 (네비게이션)
  │   ├─ @UI-NAVIGATION-BUTTONS
  │   ├─ @LOGIC-INDEX-MANAGEMENT
  │   └─ @TEST-NAVIGATION
  ├─ @FR-7 (키보드 단축키)
  │   ├─ @HOOK-USE-KEYBOARD
  │   └─ @TEST-KEYBOARD-SHORTCUTS
  ├─ @FR-8 (진행률 표시)
  │   ├─ @UI-PROGRESS-BAR
  │   └─ @TEST-PROGRESS-UPDATE
  ├─ @FR-9 (학습 완료)
  │   ├─ @UI-COMPLETE-SCREEN
  │   └─ @TEST-COMPLETE-FLOW
  └─ @FR-10 (학습 중단)
      ├─ @UI-EXIT-DIALOG
      └─ @TEST-EXIT-FLOW
```

### 요구사항 → 구현 매핑

| 요구사항 | 구현 대상 | 영향받는 페이지 | 테스트 |
|---------|---------|----------------|--------|
| FR-1 | "학습 시작" 버튼, 라우팅 | WordSetDetail → Learn | E2E |
| FR-2 | LearnModeSelect 컴포넌트 | `/wordsets/[id]/learn` | 단위, E2E |
| FR-3 | FlipCard 컴포넌트, Framer Motion | Learn 화면 | 단위, E2E, 성능 |
| FR-4 | useSpeech 훅, Web Speech API | Learn 화면 | 단위, 통합 |
| FR-5 | 음성 버튼, useSpeech 훅 | Learn 화면 | 단위, E2E |
| FR-6 | LearnNavigation 컴포넌트 | Learn 화면 | 단위, E2E |
| FR-7 | useKeyboard 훅 | Learn 화면 | 단위, 접근성 |
| FR-8 | LearnProgress 컴포넌트 | Learn 화면 | 단위, E2E |
| FR-9 | LearnComplete 컴포넌트 | Learn 완료 화면 | E2E |
| FR-10 | 확인 다이얼로그 | Learn 화면 | E2E |

### SPEC 의존성

- **SPEC-WORDSET-001**: 단어 세트 및 단어 데이터 제공 (필수)
- **SPEC-UI-001**: Button, Card, Badge 컴포넌트 재사용 (필수)
- **기존 API 유지**: 백엔드 변경 없음, 프론트엔드만 확장

---

**END OF SPEC-LEARN-001**
