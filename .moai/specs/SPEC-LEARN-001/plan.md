---
id: SPEC-LEARN-001
type: implementation-plan
version: 0.1.0
created: 2025-11-26
updated: 2025-11-26
---

# SPEC-LEARN-001 구현 계획

## 📋 구현 개요

**목표**: 플립 카드 방식의 인터랙티브 학습 시스템 구현
**범위**: 학습 세션 시작 → 플립 카드 → TTS 음성 → 진행률 → 학습 완료
**예상 복잡도**: 중간 (새로운 애니메이션 라이브러리 도입, TTS API 통합)

---

## 🎯 구현 우선순위

### Phase 1: 핵심 학습 기능 (필수)
**목표**: MVP 학습 경험 제공

1. **학습 세션 관리**
   - 학습 시작 버튼 (WordSetDetail 페이지)
   - 학습 모드 선택 화면 (순서대로/랜덤)
   - 세션 스토리지 상태 관리

2. **플립 카드 UI**
   - FlipCard 컴포넌트 (Framer Motion)
   - 3D 플립 애니메이션 (rotateY 180deg, 600ms)
   - 앞면(뜻) / 뒷면(단어) 전환

3. **TTS 음성 재생**
   - useSpeech 커스텀 훅
   - Web Speech API 통합
   - 자동 재생 (카드 플립 시)
   - 수동 재생 버튼

4. **네비게이션 및 진행률**
   - 이전/다음 버튼
   - 진행률 표시 (현재/전체)
   - 진행률 바 애니메이션

5. **학습 완료 화면**
   - 완료 메시지
   - 다시 학습 / 세트로 돌아가기 버튼

### Phase 2: UX 향상 (선택)
**목표**: 사용성 개선

1. **키보드 단축키**
   - Space: 카드 플립
   - ← / →: 이전/다음 카드
   - Escape: 학습 종료

2. **학습 통계**
   - 소요 시간 측정
   - 학습한 단어 수 표시

3. **반응형 최적화**
   - 모바일 터치 제스처 (스와이프)
   - 태블릿 레이아웃 조정

### Phase 3: 미래 확장 (범위 외)
**이번 SPEC에 포함되지 않음**

1. 학습 기록 DB 저장
2. 복습 알고리즘 (Spaced Repetition)
3. 즐겨찾기 / 어려운 단어 표시
4. 학습 통계 대시보드

---

## 🏗️ 구현 전략

### 1. 라이브러리 설치 및 설정

**신규 라이브러리 추가**:
```bash
npm install framer-motion@^10.16.5
npm install react-swipeable@^7.0.1  # Phase 2
```

**버전 선택 기준**:
- Framer Motion 10.16.5: React 19 호환, 안정적인 3D 애니메이션 지원
- React Swipeable 7.0.1: 가벼운 번들 크기 (< 5KB), React 19 호환

**Web Speech API**:
- 브라우저 내장 API (별도 설치 불필요)
- 타입 정의: `npm install --save-dev @types/dom-speech-recognition`

### 2. 파일 구조

```
app/
├── wordsets/
│   └── [id]/
│       ├── learn/
│       │   ├── page.tsx                    # 학습 메인 페이지
│       │   ├── LearnModeSelect.tsx         # 모드 선택 컴포넌트
│       │   ├── FlipCard.tsx                # 플립 카드 컴포넌트
│       │   ├── LearnNavigation.tsx         # 네비게이션 컴포넌트
│       │   ├── LearnProgress.tsx           # 진행률 컴포넌트
│       │   └── LearnComplete.tsx           # 완료 화면 컴포넌트
│       └── page.tsx (수정)                 # "학습 시작" 버튼 추가
├── hooks/
│   ├── useSpeech.ts                        # TTS 훅
│   ├── useKeyboard.ts                      # 키보드 단축키 훅 (Phase 2)
│   └── useLearnSession.ts                  # 학습 세션 관리 훅
└── lib/
    └── learn/
        ├── shuffle.ts                      # Fisher-Yates 셔플
        └── sessionStorage.ts               # 세션 스토리지 유틸리티
```

### 3. 컴포넌트 설계

#### FlipCard 컴포넌트
**책임**: 3D 플립 애니메이션, 앞면/뒷면 전환

```typescript
interface FlipCardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
}

// 구현 요점:
// - Framer Motion <motion.div>
// - transformStyle: 'preserve-3d'
// - rotateY 애니메이션 (0deg ↔ 180deg)
// - 앞면: bg-primary-50, 큰 텍스트 (뜻)
// - 뒷면: bg-white, 큰 텍스트 (단어)
```

#### useSpeech 훅
**책임**: TTS 음성 재생 로직

```typescript
interface UseSpeechResult {
  speak: (text: string, lang?: string) => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

// 구현 요점:
// - window.speechSynthesis 체크
// - SpeechSynthesisUtterance 생성
// - rate: 0.9 (약간 느리게)
// - onstart, onend, onerror 핸들러
// - isSpeaking 상태 관리
```

#### useLearnSession 훅
**책임**: 학습 세션 상태 관리

```typescript
interface UseLearnSessionResult {
  words: Word[];
  currentIndex: number;
  isFlipped: boolean;
  mode: 'sequential' | 'random';
  next: () => void;
  previous: () => void;
  flip: () => void;
  reset: () => void;
}

// 구현 요점:
// - 세션 스토리지에서 상태 로드
// - 모드에 따라 단어 셔플
// - currentIndex 관리
// - 세션 스토리지에 상태 저장
```

### 4. 라우팅 및 네비게이션

#### 라우팅 구조
- `/wordsets/[id]` → 단어 세트 상세 (기존)
  - "학습 시작" 버튼 추가
- `/wordsets/[id]/learn` → 학습 메인 페이지 (신규)
  - 모드 선택 → 학습 화면 → 완료 화면

#### 네비게이션 흐름
```
WordSetDetail
  ↓ "학습 시작" 클릭
LearnModeSelect (모드 선택)
  ↓ "순서대로" 또는 "랜덤" 클릭
LearnPage (플립 카드 학습)
  ↓ "학습 완료" 클릭
LearnComplete (완료 화면)
  ↓ "다시 학습" 클릭
LearnModeSelect (재시작)
  ↓ "세트로 돌아가기" 클릭
WordSetDetail
```

### 5. 상태 관리 전략

#### 세션 스토리지 구조
**키**: `learn_session_${wordSetId}`

**값**:
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

**저장 타이밍**:
- 학습 시작 시: 초기 세션 생성
- 카드 전환 시: currentIndex 업데이트
- 학습 완료/중단 시: 세션 삭제

#### React 상태 관리
```typescript
// useLearnSession 내부
const [currentIndex, setCurrentIndex] = useState(0);
const [isFlipped, setIsFlipped] = useState(false);
const [words, setWords] = useState<Word[]>([]);

// useEffect: 세션 스토리지 동기화
useEffect(() => {
  const session = loadSession(wordSetId);
  if (session) {
    setWords(session.words);
    setCurrentIndex(session.currentIndex);
  }
}, [wordSetId]);

useEffect(() => {
  saveSession(wordSetId, { words, currentIndex, mode, startTime });
}, [currentIndex, words]);
```

### 6. 애니메이션 구현

#### Framer Motion 설정
```typescript
const flipVariants = {
  front: {
    rotateY: 0,
    transition: { duration: 0.6, ease: 'easeInOut' }
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.6, ease: 'easeInOut' }
  }
};

<motion.div
  variants={flipVariants}
  animate={isFlipped ? 'back' : 'front'}
  style={{
    transformStyle: 'preserve-3d',
    perspective: '1000px'
  }}
>
  {/* 카드 내용 */}
</motion.div>
```

#### 진행률 바 애니메이션
```typescript
<motion.div
  className="h-full bg-primary-600"
  initial={{ width: '0%' }}
  animate={{ width: `${(currentIndex + 1) / words.length * 100}%` }}
  transition={{ duration: 0.3 }}
/>
```

### 7. TTS 통합

#### useSpeech 구현
```typescript
function useSpeech(): UseSpeechResult {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState('speechSynthesis' in window);

  const speak = useCallback((text: string, lang = 'en-US') => {
    if (!isSupported) {
      console.warn('TTS not supported');
      return;
    }

    // 기존 재생 중지
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      console.error('TTS error');
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  return { speak, isSpeaking, isSupported };
}
```

#### TTS 자동 재생
```typescript
// FlipCard 내부
useEffect(() => {
  if (isFlipped && isSupported) {
    speak(word.text);
  }
}, [isFlipped]);
```

### 8. 키보드 단축키 (Phase 2)

#### useKeyboard 훅
```typescript
function useKeyboard(handlers: KeyboardHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlers.onFlip();
          break;
        case 'ArrowLeft':
          handlers.onPrevious();
          break;
        case 'ArrowRight':
          handlers.onNext();
          break;
        case 'Escape':
          handlers.onExit();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
```

---

## 🧪 테스트 전략

### 1. 단위 테스트 (Jest + React Testing Library)

**useSpeech 훅 테스트**:
```typescript
describe('useSpeech', () => {
  it('should speak text with correct parameters', () => {
    const { result } = renderHook(() => useSpeech());

    act(() => {
      result.current.speak('apple', 'en-US');
    });

    // SpeechSynthesisUtterance 생성 확인
    // speechSynthesis.speak 호출 확인
  });

  it('should handle unsupported browsers', () => {
    // speechSynthesis 없는 환경 시뮬레이션
    // isSupported: false 확인
  });
});
```

**FlipCard 컴포넌트 테스트**:
```typescript
describe('FlipCard', () => {
  it('should render front side initially', () => {
    render(<FlipCard word={mockWord} isFlipped={false} />);
    expect(screen.getByText('사과')).toBeInTheDocument();
  });

  it('should flip to back side when clicked', () => {
    const onFlip = jest.fn();
    render(<FlipCard word={mockWord} isFlipped={false} onFlip={onFlip} />);

    fireEvent.click(screen.getByTestId('flip-card'));
    expect(onFlip).toHaveBeenCalled();
  });
});
```

**useLearnSession 훅 테스트**:
```typescript
describe('useLearnSession', () => {
  it('should initialize with first word', () => {
    const { result } = renderHook(() => useLearnSession(mockWords, 'sequential'));
    expect(result.current.currentIndex).toBe(0);
  });

  it('should navigate to next word', () => {
    const { result } = renderHook(() => useLearnSession(mockWords, 'sequential'));

    act(() => {
      result.current.next();
    });

    expect(result.current.currentIndex).toBe(1);
  });

  it('should shuffle words in random mode', () => {
    const { result } = renderHook(() => useLearnSession(mockWords, 'random'));
    // 셔플된 순서가 원래 순서와 다름 확인
  });
});
```

### 2. E2E 테스트 (Playwright)

**전체 학습 플로우**:
```typescript
test('should complete full learning flow', async ({ page }) => {
  // 1. 세트 상세 페이지 접근
  await page.goto('/wordsets/test-id');

  // 2. 학습 시작 클릭
  await page.click('text=학습 시작');

  // 3. 모드 선택
  await page.click('text=순서대로 학습');

  // 4. 첫 카드 확인
  await expect(page.locator('text=사과')).toBeVisible();

  // 5. 카드 플립
  await page.click('[data-testid="flip-card"]');
  await expect(page.locator('text=apple')).toBeVisible();

  // 6. 다음 카드
  await page.click('text=다음');

  // 7. 학습 완료
  // ... (모든 카드 반복)
  await page.click('text=학습 완료');

  // 8. 완료 화면 확인
  await expect(page.locator('text=학습을 완료했습니다')).toBeVisible();
});
```

**키보드 단축키 테스트**:
```typescript
test('should support keyboard shortcuts', async ({ page }) => {
  await page.goto('/wordsets/test-id/learn?mode=sequential');

  // Space: 카드 플립
  await page.keyboard.press('Space');
  await expect(page.locator('text=apple')).toBeVisible();

  // 오른쪽 화살표: 다음 카드
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-testid="progress"]')).toHaveText('2 / 5');

  // Escape: 종료 다이얼로그
  await page.keyboard.press('Escape');
  await expect(page.locator('text=학습을 중단하시겠습니까?')).toBeVisible();
});
```

**반응형 테스트**:
```typescript
test('should display correctly on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/wordsets/test-id/learn?mode=sequential');

  // 카드 크기 확인
  const card = page.locator('[data-testid="flip-card"]');
  const box = await card.boundingBox();
  expect(box?.width).toBeLessThanOrEqual(400);
});
```

### 3. 접근성 테스트

**axe-core 통합**:
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<LearnPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**키보드 네비게이션 테스트**:
```typescript
test('should navigate with keyboard only', async ({ page }) => {
  await page.goto('/wordsets/test-id/learn?mode=sequential');

  // Tab으로 포커스 이동
  await page.keyboard.press('Tab'); // 첫 번째 요소 (카드)
  await page.keyboard.press('Tab'); // 음성 버튼
  await page.keyboard.press('Tab'); // 이전 버튼
  await page.keyboard.press('Tab'); // 다음 버튼

  // Enter로 클릭
  await page.keyboard.press('Enter');
});
```

### 4. 성능 테스트

**애니메이션 프레임레이트 측정**:
```typescript
test('should maintain 60fps during flip animation', async ({ page }) => {
  await page.goto('/wordsets/test-id/learn?mode=sequential');

  // Performance 측정 시작
  await page.evaluate(() => performance.mark('flip-start'));

  // 카드 플립
  await page.click('[data-testid="flip-card"]');
  await page.waitForTimeout(600); // 애니메이션 duration

  // Performance 측정 종료
  await page.evaluate(() => performance.mark('flip-end'));

  // 프레임레이트 확인 (Chrome DevTools Protocol)
  // 60fps = 16.67ms/frame
});
```

**번들 크기 측정**:
```bash
npm run build
npm run analyze

# Framer Motion 추가 후 번들 크기 증가 확인
# 목표: < 50KB (gzip)
```

---

## 🚧 기술적 제약사항 및 고려사항

### 1. Web Speech API 제약사항

**브라우저 호환성**:
- ✅ Chrome/Edge: 완전 지원
- ⚠️ Safari: 부분 지원 (iOS에서 일부 언어 제한)
- ⚠️ Firefox: 부분 지원 (일부 음성 엔진 제한)

**대응 전략**:
```typescript
if (!isSupported) {
  // 대체 UI 표시
  return (
    <div className="text-sm text-neutral-600">
      이 브라우저는 음성 재생을 지원하지 않습니다.
    </div>
  );
}
```

**음성 품질**:
- 브라우저 기본 TTS 엔진 사용 (커스텀 음성 제외)
- 영어 (en-US) 우선, 향후 다국어 확장
- rate: 0.9 (약간 느리게, 학습 목적)

### 2. Framer Motion 성능 최적화

**GPU 가속 활용**:
```typescript
// transform 속성만 사용 (GPU 가속)
// ✅ transform: rotateY(), translateX()
// ❌ top, left, width, height (CPU 연산)

<motion.div
  style={{ transform: 'rotateY(180deg)' }}
  animate={{ rotateY: isFlipped ? 180 : 0 }}
/>
```

**번들 크기 최적화**:
```typescript
// 트리 쉐이킹 활용
import { motion } from 'framer-motion';

// ❌ 전체 import 금지
// import * as FramerMotion from 'framer-motion';
```

### 3. 세션 스토리지 제약사항

**데이터 영속성**:
- ❌ 새로고침 시: 세션 유지 (sessionStorage)
- ❌ 탭 닫기 시: 세션 삭제
- ❌ 브라우저 닫기 시: 세션 삭제

**대응 전략**:
- Phase 1: 세션 스토리지만 사용 (간단한 구현)
- Phase 3: localStorage 또는 DB 저장으로 확장 (학습 기록)

**데이터 크기 제한**:
- 세션 스토리지 제한: ~5MB (브라우저마다 다름)
- 단어 세트당 최대 1,000개 단어 가정
- 예상 크기: ~100KB/세션 (충분함)

### 4. 접근성 고려사항

**ARIA 레이블**:
```tsx
<div
  role="region"
  aria-label="학습 카드"
  aria-live="polite"
  aria-atomic="true"
>
  <motion.div
    role="button"
    aria-label={isFlipped ? `단어: ${word.text}` : `뜻: ${word.meaning}`}
    tabIndex={0}
  >
    {/* 카드 내용 */}
  </motion.div>
</div>
```

**키보드 포커스**:
```typescript
// 카드에 포커스 가능
<motion.div
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onFlip();
    }
  }}
/>
```

**색상 대비율**:
- 앞면(뜻): `text-primary-900` on `bg-primary-50` (대비율 > 4.5:1)
- 뒷면(단어): `text-neutral-900` on `bg-white` (대비율 > 7:1)

---

## 📦 배포 전략

### 1. Feature Flag (선택사항)

**점진적 롤아웃**:
```typescript
// config.ts
export const FEATURES = {
  LEARN_MODE: process.env.NEXT_PUBLIC_FEATURE_LEARN === 'true'
};

// WordSetDetail 페이지
{FEATURES.LEARN_MODE && (
  <Button onClick={handleLearnStart}>학습 시작</Button>
)}
```

### 2. 성능 모니터링

**Vercel Analytics 통합**:
```typescript
import { Analytics } from '@vercel/analytics/react';

// app/layout.tsx
<Analytics />
```

**커스텀 이벤트**:
```typescript
// 학습 시작
analytics.track('learn_start', {
  wordSetId,
  mode,
  wordCount: words.length
});

// 학습 완료
analytics.track('learn_complete', {
  wordSetId,
  mode,
  duration: Date.now() - startTime
});
```

### 3. 에러 처리

**TTS 에러**:
```typescript
try {
  speak(word.text);
} catch (error) {
  console.error('TTS error:', error);
  toast.error('음성 재생에 실패했습니다.');
}
```

**세션 스토리지 에러**:
```typescript
try {
  sessionStorage.setItem(key, JSON.stringify(session));
} catch (error) {
  console.error('Session storage error:', error);
  // 세션 스토리지가 가득 찬 경우 대응
}
```

---

## 🔗 의존성 및 선행 작업

### 필수 선행 작업
- ✅ SPEC-WORDSET-001 완료 (단어 데이터 제공)
- ✅ SPEC-UI-001 완료 (Button, Card 컴포넌트)

### 확장 가능성
- Phase 3: 학습 기록 저장 (SPEC-LEARN-002 후보)
- Phase 3: 복습 알고리즘 (SPEC-LEARN-003 후보)
- Phase 3: 학습 통계 대시보드 (SPEC-LEARN-004 후보)

---

## 📊 예상 개발 시간 (우선순위 기준)

### Phase 1 (필수)
**우선순위**: 높음
**마일스톤**:
1. 학습 세션 관리 및 모드 선택
2. 플립 카드 UI 및 애니메이션
3. TTS 음성 재생 통합
4. 네비게이션 및 진행률 표시
5. 학습 완료 화면

### Phase 2 (선택)
**우선순위**: 중간
**마일스톤**:
1. 키보드 단축키 지원
2. 학습 통계 (소요 시간)
3. 모바일 제스처 최적화

### Phase 3 (미래 확장)
**우선순위**: 낮음
**범위**: 이번 SPEC에 포함되지 않음

---

## ✅ 완료 기준 (Definition of Done)

### 기능 완성도
- [ ] 학습 시작 → 모드 선택 → 학습 → 완료 전체 플로우 동작
- [ ] 플립 카드 애니메이션 60fps 유지
- [ ] TTS 음성 재생 정상 동작 (Chrome/Edge/Safari)
- [ ] 이전/다음 네비게이션 정상 동작
- [ ] 진행률 표시 정확성

### 테스트 커버리지
- [ ] 단위 테스트 커버리지 90% 이상
- [ ] E2E 테스트: 전체 학습 플로우 100% 커버
- [ ] 접근성 테스트: Lighthouse 점수 90 이상
- [ ] 성능 테스트: 애니메이션 60fps 확인

### 품질 기준
- [ ] ESLint, Prettier 통과
- [ ] TypeScript 타입 에러 없음
- [ ] WCAG 2.1 AA 준수
- [ ] 크로스 브라우저 테스트 (Chrome, Safari, Firefox)

### 문서화
- [ ] 컴포넌트 JSDoc 주석
- [ ] README 업데이트 (학습 기능 설명)
- [ ] SPEC-LEARN-001 acceptance.md 검증 완료

---

**END OF IMPLEMENTATION PLAN**
