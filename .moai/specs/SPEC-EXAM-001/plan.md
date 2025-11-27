# SPEC-EXAM-001: 영어 단어 시험 시스템 - 구현 계획 (초안)

**Status**: DRAFT
**Created**: 2025-11-27
**Author**: GOOS

---

## 📋 개요

영어 단어 세트에 대한 시험 기능을 추가합니다. 사용자는 객관식, 주관식, 혼합 모드 중 선택하여 시험을 진행하고, 정방향(뜻→단어) 또는 역방향(단어→뜻) 출제 방향을 선택할 수 있습니다.

---

## 🎯 핵심 요구사항

### 1. 시험 모드 선택
- **객관식**: 뜻을 보여주고 4지선다 보기 제공
- **주관식**: 뜻을 보여주고 단어 입력
- **혼합**: 객관식/주관식 문제를 5:5 비율로 랜덤 출제

### 2. 출제 방향 선택
- **정방향**: 뜻 → 단어
- **역방향**: 단어(음성 재생) → 뜻

### 3. 시험 진행 방식
- 단어 세트 내에서 "시험 시작" 버튼 클릭
- 문제 제시 → 답변 선택/입력 → 제출 → 다음 문제
- 모든 문제 완료 시 결과 화면 표시

### 4. 시험 결과
- 정답/오답 개수 표시
- 정답률 표시
- 오답 목록 표시
- "오답 다시 보기" 버튼 제공

### 5. 오답 복습
- 오답 단어만 필터링하여 학습 모드로 전환
- SPEC-LEARN-001의 플립 카드 학습 재사용

---

## 🏗️ 구현 범위

### 신규 UI 컴포넌트
1. **ExamConfigScreen**: 시험 설정 화면
2. **MultipleChoiceQuestion**: 객관식 문제 컴포넌트
3. **ShortAnswerQuestion**: 주관식 문제 컴포넌트
4. **ExamProgress**: 시험 진행률 표시
5. **ExamResult**: 시험 결과 화면
6. **IncorrectWordReview**: 오답 복습 버튼

### 라우팅
- `/wordsets/[id]/exam` - 시험 화면
- `/wordsets/[id]/exam/result` - 결과 화면

### 데이터 모델 (세션 스토리지)
```typescript
interface ExamSession {
  wordSetId: string;
  mode: 'multiple-choice' | 'short-answer' | 'mixed';
  direction: 'forward' | 'reverse';
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  startTime: number;
}

interface Question {
  wordId: string;
  type: 'multiple-choice' | 'short-answer';
  prompt: string;
  correctAnswer: string;
  choices?: string[];
}

interface Answer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
}
```

---

## ⚙️ 구현 방식 (기본 설정)

1. **객관식 오답 생성**: 같은 세트 내 랜덤 선택 (3개)
2. **주관식 정답 판정**: 완전 일치 (대소문자 무시, 공백 무시)
3. **시험 결과 저장**: 세션 스토리지만 사용
4. **혼합 모드 비율**: 고정 5:5
5. **답변 피드백**: 시험 완료 후 표시

---

## 🔗 의존성

- **SPEC-WORDSET-001**: 단어 데이터 제공
- **SPEC-LEARN-001**: 오답 복습 시 학습 모드 재사용
- **SPEC-UI-001**: UI 컴포넌트 재사용

---

## 📅 예상 일정

- **총 예상 시간**: 3-5일 (TDD 포함)
- **우선순위**: High

---

## 📝 주요 기술 스택

- Next.js 15.1.0
- React 19
- TypeScript 5.9.3
- TanStack Query 5.90.10
- Tailwind CSS 4.1.17
- Web Speech API (역방향 모드)

---

**다음 단계**: `/moai:1-plan resume SPEC-EXAM-001`로 초안을 재개하고 SPEC 문서를 완성하세요.
