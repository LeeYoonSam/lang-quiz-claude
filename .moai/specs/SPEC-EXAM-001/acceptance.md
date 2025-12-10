---
id: SPEC-EXAM-001
version: 1.0.0
status: draft
created: 2025-12-09
updated: 2025-12-09
author: Albert
document_type: acceptance
---

# SPEC-EXAM-001: 인수 기준 및 테스트 시나리오

## 섹션 목차

1. [테스트 전략](#테스트-전략)
2. [단위 테스트 시나리오](#단위-테스트-시나리오)
3. [통합 테스트 시나리오](#통합-테스트-시나리오)
4. [E2E 테스트 시나리오](#e2e-테스트-시나리오)
5. [에지 케이스 및 오류 처리](#에지-케이스-및-오류-처리)
6. [성능 기준](#성능-기준)
7. [품질 게이트 (TRUST 5)](#품질-게이트-trust-5)
8. [Definition of Done](#definition-of-done)

---

## 테스트 전략

### 테스트 계층별 목표

| 계층 | 목표 | 테스트 수 | 커버리지 |
|------|------|----------|---------|
| **단위 테스트** | 유틸리티, 훅, 컴포넌트 로직 | 40-50 | 90%+ |
| **통합 테스트** | SPEC-LEARN-001 연동, 상태 관리 | 5-8 | 85%+ |
| **E2E 테스트** | 사용자 여정, 실제 UX | 10-15 | 주요 플로우 100% |

### TDD 순서 (RED-GREEN-REFACTOR)

1. **RED**: 테스트 작성 (실패)
2. **GREEN**: 최소 구현 (통과)
3. **REFACTOR**: 코드 개선, 최적화

---

## 단위 테스트 시나리오

### UT-1: generateWrongAnswers() 함수

**테스트 케이스**:

```gherkin
Scenario: 올바른 개수의 오답 생성
  Given 정답 "apple"과 5개 단어 배열이 주어질 때
  When generateWrongAnswers("apple", words, 3) 호출
  Then 3개의 오답이 반환되고, 정답을 포함하지 않는다

Scenario: 중복 제거
  Given 같은 단어 여러 개가 있는 배열일 때
  When 오답 3개 생성
  Then 중복 없는 서로 다른 단어 3개 반환

Scenario: 단어 부족 처리
  Given 2개 단어만 있는 배열일 때
  When 3개 오답 요청
  Then 가능한 개수만큼 반환 또는 에러 발생
```

**Expected Output**:
```typescript
expect(generateWrongAnswers('apple', [
  { id: '1', text: 'apple', meaning: 'apple' },
  { id: '2', text: 'banana', meaning: 'banana' },
  { id: '3', text: 'cherry', meaning: 'cherry' },
  { id: '4', text: 'date', meaning: 'date' },
], 3)).toHaveLength(3);
expect(result).not.toContain('apple');
```

### UT-2: validateAnswer() 함수

**테스트 케이스**:

```gherkin
Scenario: 정답 판정 (완전 일치)
  Given userAnswer = "apple", correctAnswer = "apple"
  When validateAnswer() 호출
  Then true 반환

Scenario: 대소문자 무시
  Given userAnswer = "APPLE", correctAnswer = "apple"
  When validateAnswer() 호출
  Then true 반환

Scenario: 공백 무시
  Given userAnswer = " a p p l e ", correctAnswer = "apple"
  When validateAnswer() 호출
  Then true 반환

Scenario: 오답 판정
  Given userAnswer = "orangee", correctAnswer = "apple"
  When validateAnswer() 호출
  Then false 반환
```

**Expected Output**:
```typescript
expect(validateAnswer('apple', 'apple')).toBe(true);
expect(validateAnswer('APPLE', 'apple')).toBe(true);
expect(validateAnswer('  a p p l e  ', 'apple')).toBe(true);
expect(validateAnswer('orangee', 'apple')).toBe(false);
```

### UT-3: calculateScore() 함수

**테스트 케이스**:

```gherkin
Scenario: 점수 계산 (100점 만점)
  Given correctCount = 8, totalCount = 10
  When calculateScore(8, 10) 호출
  Then 80.0 반환

Scenario: 만점 처리
  Given correctCount = 10, totalCount = 10
  When calculateScore(10, 10) 호출
  Then 100.0 반환

Scenario: 영점 처리
  Given correctCount = 0, totalCount = 10
  When calculateScore(0, 10) 호출
  Then 0.0 반환

Scenario: 소수점 반올림
  Given correctCount = 7, totalCount = 11
  When calculateScore(7, 11) 호출
  Then 63.6 반환 (또는 63.64)
```

**Expected Output**:
```typescript
expect(calculateScore(8, 10)).toBe(80.0);
expect(calculateScore(10, 10)).toBe(100.0);
expect(calculateScore(0, 10)).toBe(0.0);
expect(calculateScore(7, 11)).toBeCloseTo(63.6, 1);
```

### UT-4: generateQuestions() 함수

**테스트 케이스**:

```gherkin
Scenario: 객관식 모드 문제 생성
  Given 10개 단어 배열, mode = 'multiple-choice'
  When generateQuestions() 호출
  Then 10개 문제, 각 문제는 choices[] 포함, type = 'multiple-choice'

Scenario: 주관식 모드 문제 생성
  Given 10개 단어 배열, mode = 'short-answer'
  When generateQuestions() 호출
  Then 10개 문제, type = 'short-answer', choices[] 없음

Scenario: 혼합 모드 문제 생성 (3:7 비율)
  Given 10개 단어 배열, mode = 'mixed'
  When generateQuestions() 호출
  Then 10개 문제 중 객관식 ~3개, 주관식 ~7개 (5:5 가능)

Scenario: 정방향 출제
  Given direction = 'forward'
  When 문제 확인
  Then prompt = word.meaning (뜻)

Scenario: 역방향 출제
  Given direction = 'reverse'
  When 문제 확인
  Then prompt = word.text (단어)
```

**Expected Output**:
```typescript
const mcQuestions = generateQuestions(words, 'multiple-choice', 'forward');
expect(mcQuestions).toHaveLength(10);
expect(mcQuestions[0].type).toBe('multiple-choice');
expect(mcQuestions[0].choices).toHaveLength(4);

const mixedQuestions = generateQuestions(words, 'mixed', 'forward');
const mcCount = mixedQuestions.filter(q => q.type === 'multiple-choice').length;
expect(mcCount).toBeGreaterThanOrEqual(2); // 약 30%
expect(mcCount).toBeLessThanOrEqual(4);
```

### UT-5: useExamSession() 훅

**테스트 케이스**:

```gherkin
Scenario: 시험 세션 초기화
  Given 새 시험 시작
  When useExamSession() 호출
  Then { questions, currentIndex: 0, answers: [] } 반환

Scenario: 답변 저장
  Given 시험 진행 중
  When submitAnswer('apple', true) 호출
  Then answers[] 배열에 추가, currentIndex 증가

Scenario: 세션 스토리지 저장
  Given 시험 진행 중
  When 페이지 새로고침
  Then 세션 스토리지에서 상태 복원

Scenario: 시험 종료
  Given 마지막 문제 완료
  When finish() 호출
  Then 결과 계산 (ExamResult), 세션 초기화
```

### UT-6: useExamSpeech() 훅 (useSpeech 기반)

**테스트 케이스**:

```gherkin
Scenario: 음성 재생 요청
  Given "apple" 단어 입력
  When speak("apple") 호출
  Then speechSynthesis.speak() 호출됨, isSpeaking = true

Scenario: 음성 재생 완료
  Given 음성 재생 중
  When 재생 완료 콜백 호출
  Then isSpeaking = false

Scenario: TTS 미지원 브라우저
  Given window.speechSynthesis 없음
  When speak() 호출
  Then isSupported = false, 콘솔 경고
```

### UT-7: MultipleChoiceQuestion 컴포넌트

**테스트 케이스**:

```gherkin
Scenario: 선택지 렌더링
  Given 4개 선택지
  When 컴포넌트 렌더링
  Then 4개 버튼 표시

Scenario: 선택 시 콜백
  Given 선택지 클릭
  When 버튼 클릭
  Then onAnswer() 콜백 호출, 인자 = 선택한 답변

Scenario: 정답 강조
  Given isCorrect = true
  When isAnswered = true
  Then 선택지 녹색 배경 (bg-green-50)

Scenario: 오답 강조
  Given 오답 선택
  When isCorrect = false
  Then 오답 빨간색, 정답 녹색 강조
```

### UT-8: ShortAnswerQuestion 컴포넌트

**테스트 케이스**:

```gherkin
Scenario: 입력 필드 렌더링
  When 컴포넌트 렌더링
  Then 입력 필드, "제출" 버튼 표시

Scenario: 입력 및 제출
  Given "apple" 입력
  When "제출" 버튼 클릭
  Then onAnswer("apple") 호출됨

Scenario: 정답 표시 (답변 후)
  Given isAnswered = true, correctAnswer = "apple"
  When 화면 표시
  Then "정답은 apple입니다" 메시지 표시
```

### UT-9: ExamProgress 컴포넌트

**테스트 케이스**:

```gherkin
Scenario: 진행률 텍스트 표시
  Given current = 5, total = 10
  When 컴포넌트 렌더링
  Then "5 / 10" 텍스트 표시

Scenario: 진행률 바 애니메이션
  Given current = 5, total = 10
  When 렌더링
  Then width = 50% 진행률 바

Scenario: 진행률 업데이트
  Given current = 5
  When current = 6으로 변경
  Then 진행률 바 smooth transition (300ms)
```

### UT-10: ExamResult 컴포넌트

**테스트 케이스**:

```gherkin
Scenario: 결과 정보 표시
  Given correctCount = 8, totalCount = 10, score = 80.0
  When 컴포넌트 렌더링
  Then "정답 8 / 10", "정답률 80.0%", "점수 80.0" 표시

Scenario: 오답 목록 표시
  Given incorrectWords = [apple, banana]
  When 렌더링
  Then 오답 단어 2개 목록 표시

Scenario: 오답 복습 버튼 표시
  Given incorrectCount > 0
  When 렌더링
  Then "오답 다시 보기" 버튼 활성화

Scenario: 오답 없을 때
  Given correctCount = 10
  When 렌더링
  Then "오답 다시 보기" 버튼 비활성화 또는 숨김
```

---

## 통합 테스트 시나리오

### IT-1: LearnSession 통합 (SPEC-LEARN-001)

**테스트 케이스**:

```gherkin
Scenario: 오답 필터링 후 학습 모드 전환
  Given 시험 완료, incorrectWords = [apple, banana, cherry]
  When "오답 다시 보기" 버튼 클릭
  Then
    - LearnSession 생성: words = [apple, banana, cherry]
    - 라우팅: /wordsets/[id]/learn?mode=incorrect_review
    - FlipCard 학습 시작

Scenario: 복습 완료 후 결과로 돌아가기
  Given 오답 복습 중
  When 학습 완료 버튼 클릭
  Then 시험 결과 화면 (ExamResult)으로 복귀
```

### IT-2: useSpeech 훅 통합

**테스트 케이스**:

```gherkin
Scenario: 역방향 모드에서 음성 자동 재생
  Given direction = 'reverse', 문제 로드
  When 문제 화면 렌더링
  Then useSpeech 호출, 단어 음성 자동 재생 (0.5초 내)

Scenario: 수동 음성 재생
  Given "🔊 다시 듣기" 버튼 표시
  When 버튼 클릭
  Then 단어 음성 재생, 버튼 텍스트 "재생 중..." 변경
```

### IT-3: 시험 세션 상태 관리

**테스트 케이스**:

```gherkin
Scenario: 세션 스토리지 저장/복원
  Given exam_session_${wordSetId} 키
  When 시험 진행 → 페이지 새로고침
  Then 세션 스토리지에서 상태 복원, 시험 계속

Scenario: 시험 완료 후 세션 초기화
  Given 시험 완료
  When ExamResult 화면 진입
  Then 세션 스토리지 초기화, 새 시험 시작 시 깨끗한 상태
```

---

## E2E 테스트 시나리오

### E2E-1: 객관식 시험 전체 여정

```gherkin
Feature: 객관식 시험 완료

  Scenario: 객관식 정방향 시험 완료
    Given 사용자가 10개 단어를 포함한 단어 세트 상세 페이지에 있음
    When "시험 시작" 버튼 클릭
    Then ExamConfigScreen 렌더링

    When 시험 모드 "객관식" 선택
    And 출제 방향 "정방향" 선택
    And "시험 시작" 버튼 클릭
    Then 첫 번째 객관식 문제 표시
    And 진행률 "1 / 10" 표시

    When 정답 선택지 클릭
    Then "정답입니다!" 메시지 표시
    And 2초 후 다음 문제 자동 진행

    # 반복: 9개 문제 더 풀이

    When 10번째 문제 정답 선택
    Then 결과 화면 (ExamResult) 렌더링
    And 정답률 "80.0%", 정답 개수 "8 / 10" 표시

    When "세트로 돌아가기" 버튼 클릭
    Then 단어 세트 상세 페이지 이동
```

### E2E-2: 주관식 시험 전체 여정

```gherkin
Feature: 주관식 시험 완료

  Scenario: 주관식 역방향 시험
    Given ExamConfigScreen
    When "주관식" 모드, "역방향" 방향 선택
    And "시험 시작" 클릭
    Then 단어가 음성으로 자동 재생
    And "뜻을 입력하세요" 입력 필드 표시

    When "사과" 입력 후 "제출" 클릭
    Then validateAnswer("사과", "사과") 호출
    And "정답입니다!" 메시지

    # 반복: 주관식 9개 문제 더 풀이

    When 모든 문제 완료
    Then 결과 화면 진입
    And 정답률 표시
```

### E2E-3: 혼합 모드 시험

```gherkin
Feature: 혼합 모드 시험

  Scenario: 객관식 3개 + 주관식 7개 랜덤 순서
    Given 혼합 모드 선택
    When "시험 시작"
    Then
      - 문제 1: 객관식 (4지선다)
      - 문제 2: 주관식 (입력)
      - 문제 3: 객관식
      - 문제 4: 주관식
      # ... 혼합 배치

    When 모든 문제 완료
    Then 결과 화면, 정답률 표시
```

### E2E-4: 오답 복습 연결 (SPEC-LEARN-001)

```gherkin
Feature: 오답 복습 플로우

  Scenario: 오답 복습으로 학습 모드 전환
    Given 시험 완료, 오답 2개 (apple, banana)
    When "오답 다시 보기" 버튼 클릭
    Then
      - 경로: /wordsets/[id]/learn?mode=incorrect_review
      - 플립 카드 화면: apple, banana만 표시
      - 학습 모드 진행

    When 학습 완료
    Then 결과 화면 (ExamResult)으로 복귀
```

### E2E-5: 시험 중단 및 복귀

```gherkin
Feature: 시험 중단 처리

  Scenario: 시험 중 뒤로가기
    Given 시험 진행 중 (5 / 10)
    When "뒤로" 버튼 클릭
    Then 확인 다이얼로그: "시험을 중단하시겠습니까?"

    When "예" 버튼 클릭
    Then
      - 세트 상세 페이지 이동
      - 세션 스토리지 초기화

    When 같은 세트에서 다시 "시험 시작"
    Then 새로운 시험 시작 (이전 진행 상태 없음)
```

### E2E-6: 시험 재시작

```gherkin
Feature: 같은 세트 재시험

  Scenario: 결과 화면에서 재시험
    Given 시험 완료 화면
    When "다시 시험하기" 버튼 클릭
    Then ExamConfigScreen으로 복귀

    When 다시 시험 설정 후 시작
    Then 새로운 문제 배열로 시험 시작 (무작위)
```

### E2E-7: 반응형 디자인 (모바일)

```gherkin
Feature: 모바일 환경 시험

  Scenario: 375px 화면에서 시험
    Given viewport = 375px
    When 시험 진행
    Then
      - 문제 텍스트: 읽기 쉬운 크기 (font-2xl)
      - 선택지 버튼: 풀 너비, 충분한 패딩
      - 진행률 바: 상단 고정
      - 입력 필드: 모바일 키보드 호환
```

---

## 에지 케이스 및 오류 처리

### EC-1: 단어 부족 처리

```gherkin
Scenario: 4개 미만 단어에서 객관식 불가
  Given 단어 3개 세트
  When ExamConfigScreen에서 "객관식" 선택
  Then "객관식은 단어가 4개 이상이어야 합니다" 경고
  And "시험 시작" 버튼 비활성화

Scenario: 3개 단어로 혼합 모드 불가
  Given 단어 3개 세트
  When "혼합" 모드 선택 (객관식 포함)
  Then 경고 표시
  And "주관식만 선택 가능" 안내
```

### EC-2: TTS 미지원 환경

```gherkin
Scenario: Web Speech API 미지원
  Given Chrome 구형 버전 또는 Firefox
  When 역방향 모드 진행
  Then
    - "음성 재생 불가" 메시지 표시
    - 시험 진행 가능 (음성 없이)

Scenario: 음성 재생 오류
  Given 네트워크 불안정
  When 음성 재생 요청
  Then 에러 처리, "음성 재생 실패" 토스트
  And 시험 계속 진행
```

### EC-3: 주관식 정답 판정 엣지 케이스

```gherkin
Scenario: 공백 변형
  Given userAnswer = "a p p l e", correctAnswer = "apple"
  When validateAnswer() 호출
  Then true (공백 제거 후 비교)

Scenario: 대소문자 혼합
  Given userAnswer = "ApPlE", correctAnswer = "APPLE"
  When validateAnswer() 호출
  Then true (소문자 통일 후 비교)

Scenario: 부분 입력
  Given userAnswer = "app", correctAnswer = "apple"
  When validateAnswer() 호출
  Then false (완전 일치만 정답)

Scenario: 빈 입력
  Given userAnswer = "", correctAnswer = "apple"
  When validateAnswer() 호출
  Then false
```

### EC-4: 세션 스토리지 오류

```gherkin
Scenario: 세션 스토리지 쿼터 초과
  Given 브라우저 저장소 거의 가득 참
  When 시험 세션 저장 시도
  Then 에러 처리, "저장 공간 부족" 메시지
  And 시험 계속 (메모리에서만 관리)

Scenario: 세션 스토리지 손상
  Given exam_session_${id} 데이터 손상
  When 페이지 새로고침 후 시험 복구 시도
  Then 에러 처리, 새 시험 시작 옵션 제공
```

### EC-5: 빠른 사용자 입력

```gherkin
Scenario: 연속 선택지 클릭 방지
  Given 사용자가 빠르게 2개 선택지 동시 클릭
  When 첫 선택이 처리 중
  Then 두 번째 클릭 무시 (debounce 또는 disabled)

Scenario: 입력 필드 중복 제출
  Given "제출" 버튼 빠른 연속 클릭
  When 첫 제출 처리 중
  Then 버튼 disabled, 중복 제출 방지
```

### EC-6: 0개 문제 처리 (엣지 케이스)

```gherkin
Scenario: 빈 세트에서 시험 시도
  Given 단어 0개 세트
  When "시험 시작" 버튼 클릭
  Then 버튼 비활성화, "단어를 추가하세요" 메시지
```

---

## 성능 기준

### PF-1: 로딩 성능

| 항목 | 기준 | 측정 방법 |
|------|------|----------|
| 문제 로딩 | < 1초 | Lighthouse, 개발자 도구 Performance |
| 채점 피드백 | < 500ms | 사용자 입력 → 메시지 표시 시간 |
| 페이지 초기 로드 | < 3초 | Lighthouse |

### PF-2: 렌더링 성능

```gherkin
Scenario: 60fps 유지 (객관식 선택지 렌더링)
  When 문제 전환 및 선택지 강조 (스타일 변경)
  Then Chrome DevTools Performance에서 60fps 유지

Scenario: 진행률 바 애니메이션 부드러움
  When 300ms transition 적용
  Then 프레임 드롭 없음, 부드러운 애니메이션
```

### PF-3: 번들 크기

```gherkin
Scenario: 번들 크기 증가량
  Given 기존 번들 크기
  When SPEC-EXAM-001 추가
  Then 증가량 < 100KB (권장 < 50KB)
  And 트리 쉐이킹 적용 확인
```

---

## 품질 게이트 (TRUST 5)

### T-1: Test-First (테스트 우선)

**기준**: 단위 테스트 커버리지 90% 이상, E2E 테스트 주요 플로우 100%

**검증**:
```bash
# 단위 테스트 실행
npm test -- --coverage

# 커버리지 리포트 확인
Coverage: 90%+

# E2E 테스트 실행
npm run test:e2e
```

**체크리스트**:
- [ ] 유틸리티 함수 (generateWrongAnswers, validateAnswer, calculateScore, generateQuestions): 100% 커버리지
- [ ] 훅 (useExamSession, useExamSpeech): 95%+ 커버리지
- [ ] 컴포넌트 (ExamConfigScreen, MultipleChoiceQuestion, ShortAnswerQuestion, ExamProgress, ExamResult): 90%+ 커버리지
- [ ] E2E: 주요 여정 (객관식, 주관식, 혼합, 오답 복습, 시험 중단): 100% 커버리지

### R-1: Readable (가독성)

**기준**: 명확한 변수명, 주석, 논리 구조

**검증**:
```typescript
// 나쁜 예
const a = (u, c) => u.toLowerCase().trim() === c.toLowerCase().trim();

// 좋은 예
function validateAnswer(userInput: string, correctAnswer: string): boolean {
  const normalizedUser = userInput.toLowerCase().trim();
  const normalizedCorrect = correctAnswer.toLowerCase().trim();
  return normalizedUser === normalizedCorrect;
}
```

**체크리스트**:
- [ ] 변수명: 의미 있고 일관성 있음 (exam, exam_session, isCorrect)
- [ ] 함수명: 액션 동사 사용 (generate, validate, calculate)
- [ ] 주석: 복잡한 로직에 설명 추가
- [ ] 코드 포맷: ESLint, Prettier 통과

### U-1: Unified (통일성)

**기준**: 일관된 패턴, 스타일, 구조

**검증**:

| 항목 | 기준 |
|------|------|
| 컴포넌트 구조 | SPEC-LEARN-001과 동일 패턴 |
| 타입 정의 | TypeScript 타입 일관성 |
| 에러 처리 | try-catch, optional chaining 일관 사용 |
| 라우팅 | Next.js App Router 규칙 준수 |
| 상태 관리 | 세션 스토리지 키 포맷 일관 (`exam_session_${id}`) |

**체크리스트**:
- [ ] 컴포넌트: React FC 패턴, 프롭스 인터페이스 정의
- [ ] 훅: `useXxx` 명명 규칙, 의존성 배열 명시
- [ ] 에러: 사용자 친화적 메시지 (toasts, dialogs)
- [ ] 테스트: Jest + React Testing Library 패턴 일관

### S-1: Secured (보안)

**기준**: OWASP 기본 준수, 입력 검증, XSS 방지

**검증**:

```typescript
// 입력 검증 (주관식)
function validateAnswer(input: string): boolean {
  // 트림 + 정규화 (주입 방지)
  const sanitized = DOMPurify.sanitize(input); // Optional: XSS 방지
  return sanitized.length > 0 && sanitized.length < 100;
}
```

**체크리스트**:
- [ ] 입력 검증: 길이, 타입 체크 (subm 예: 주관식 입력 < 100자)
- [ ] XSS 방지: 사용자 입력 렌더링 시 이스케이핑 또는 sanitize
- [ ] 로컬 스토리지: 민감 정보 저장 금지 (시험 결과는 OK)
- [ ] API 호출: CSRF 토큰 검증 (향후 확장)

**체크리스트**:
- [ ] 입력 검증 로직 구현
- [ ] sanitize 라이브러리 (선택 사항)
- [ ] ARIA 레이블 및 포커스 관리
- [ ] 색상 대비율 확인 (4.5:1 이상)

### T-1: Trackable (추적성)

**기준**: 요구사항-구현 매핑, TAG 시스템, 코드 변경 히스토리

**검증**:

```typescript
// @SPEC-EXAM-001
// @FR-4 (주관식 풀이)
// @UTILITY-VALIDATE-ANSWER

function validateAnswer(userAnswer: string, correctAnswer: string): boolean {
  // @TEST-UT-2-VALIDATE-ANSWER
  // ...
}
```

**체크리스트**:
- [ ] 모든 요구사항 (FR-1~FR-9)에 대응 구현 확인
- [ ] TAG 주석: 함수, 컴포넌트마다 추가
- [ ] 커밋 메시지: `feat(exam): @FR-3 객관식 문제 컴포넌트 구현`
- [ ] 문서: SPEC-EXAM-001 → 구현 코드 추적 가능

---

## Definition of Done

### 개발 완료 기준

- [ ] **코드 구현**
  - [ ] 6개 컴포넌트 (ExamConfigScreen, MultipleChoiceQuestion, ShortAnswerQuestion, ExamProgress, ExamResult, IncorrectReview)
  - [ ] 4개 유틸리티 함수 (generateWrongAnswers, validateAnswer, calculateScore, generateQuestions)
  - [ ] 2개 훅 (useExamSession, useExamSpeech)
  - [ ] 라우팅 (3개 경로: /exam, /exam/progress, /exam/result)

- [ ] **테스트**
  - [ ] 단위 테스트: 40-50개, 커버리지 90%+
  - [ ] 통합 테스트: 5-8개 (SPEC-LEARN-001 연동)
  - [ ] E2E 테스트: 10-15개 (주요 여정)
  - [ ] 모든 테스트 통과 (npm test, npm run test:e2e)

- [ ] **문서**
  - [ ] 이 acceptance.md 완료
  - [ ] 컴포넌트 JSDoc 주석 추가
  - [ ] 함수 매개변수, 반환값 타입 정의

- [ ] **성능**
  - [ ] 문제 로딩: < 1초
  - [ ] 채점 피드백: < 500ms
  - [ ] 번들 크기 증가: < 100KB

- [ ] **접근성**
  - [ ] WCAG 2.1 AA 준수 (Lighthouse 90+)
  - [ ] 키보드 네비게이션 지원
  - [ ] ARIA 레이블 추가

- [ ] **품질**
  - [ ] TRUST 5 기준 모두 충족
  - [ ] ESLint 통과
  - [ ] TypeScript 타입 체크 통과 (strict mode)

- [ ] **배포**
  - [ ] Git 커밋 (PR 포함)
  - [ ] 개발 브랜치 → develop 병합
  - [ ] 테스트 환경 검증 (QA)

### 검수 체크리스트

**코드 리뷰**:
- [ ] 코드 품질 (TRUST 5)
- [ ] 테스트 커버리지 (90%+)
- [ ] SPEC 요구사항 충족

**기능 검수**:
- [ ] 객관식/주관식/혼합 모드 동작
- [ ] 정방향/역방향 출제 동작
- [ ] 오답 복습 (SPEC-LEARN-001 연동)
- [ ] 역방향 음성 재생 (TTS)
- [ ] 모바일/태블릿/데스크톱 반응형

**성능 검수**:
- [ ] Lighthouse 점수 90+
- [ ] 번들 크기 확인
- [ ] 60fps 애니메이션 확인

---

**END OF ACCEPTANCE-EXAM-001**

