# SPEC-STATS-001 구현 계획 (초안)

**상태**: Draft
**생성일**: 2025-11-27
**작성자**: spec-builder agent

---

## 📋 개요

**SPEC ID**: SPEC-STATS-001
**제목**: 시험 통계 및 분석 대시보드
**우선순위**: High
**예상 작업 시간**: 8-12시간
**의존성**: SPEC-EXAM-001 (시험 결과 데이터 제공)

---

## 🎯 핵심 목표

완료된 시험 결과를 기반으로 다차원 통계 분석 및 시각화 대시보드를 제공하여 학습 효율성을 극대화합니다.

---

## 🏗️ 기술 스택

### Frontend
- **Framework**: Next.js 15 + React 19
- **차트 라이브러리**: Recharts (latest stable)
- **스타일링**: Tailwind CSS (SPEC-UI-001 디자인 시스템)
- **상태 관리**: React Context API

### 데이터 저장
- **단기**: Local Storage (브라우저 기반)
- **장기**: 향후 백엔드 DB 마이그레이션 고려

---

## 📦 핵심 기능

### 1. 통계 데이터 수집 및 저장
- 완료된 시험 결과를 로컬 스토리지에 영구 저장
- 데이터 구조:
  ```typescript
  interface ExamResult {
    id: string;
    setId: string;
    date: string;
    correctCount: number;
    incorrectCount: number;
    totalCount: number;
    duration: number; // seconds
    words: {
      wordId: string;
      isCorrect: boolean;
    }[];
  }
  ```

### 2. 대시보드 화면
- **개요 카드**: 총 시험 횟수, 평균 정답률, 최근 학습 날짜
- **기간별 통계**: 일별/주별/월별 시험 횟수 및 정답률 그래프
- **세트별 성과**: 각 단어 세트의 정답률 비교 막대 그래프
- **취약 단어 TOP 10**: 오답률 높은 단어 목록 + "복습하기" 버튼

### 3. 다차원 필터링
- 기간 선택: 최근 7일, 30일, 90일, 전체
- 세트 선택: 특정 세트 또는 전체 세트
- 시험 모드: 객관식, 주관식, 혼합 (SPEC-EXAM-001 완료 후)

### 4. 시각화 그래프
- **라인 차트**: 시간에 따른 정답률 추이
- **막대 차트**: 세트별 정답률 비교
- **파이 차트**: 정답/오답 비율
- **히트맵** (선택): 요일별/시간대별 학습 패턴

### 5. 학습 가이드
- 취약 단어 복습 링크 (SPEC-LEARN-001 연동)
- 추천 학습 세트 (오답률 높은 세트)

---

## 🔗 의존성 및 통합

### 필수 선행 작업
- **SPEC-EXAM-001**: 시험 결과 데이터 제공 (완료 필요)

### 연동 기능
- **SPEC-LEARN-001**: 취약 단어 복습 기능 연동
- **SPEC-UI-001**: 디자인 시스템 적용

---

## 📐 구현 단계

### Phase 1: 데이터 레이어
1. Local Storage 스키마 설계
2. ExamResult 타입 정의
3. 데이터 저장/조회 유틸리티 함수 작성
4. 테스트 데이터 생성

### Phase 2: 통계 계산 로직
1. 정답률 계산 함수
2. 기간별 데이터 집계 함수
3. 세트별 성과 계산 함수
4. 취약 단어 추출 로직

### Phase 3: UI 컴포넌트
1. 대시보드 레이아웃
2. 개요 카드 컴포넌트
3. 필터링 컴포넌트
4. 그래프 컴포넌트 (Recharts)

### Phase 4: 통합 및 최적화
1. SPEC-EXAM-001 연동
2. SPEC-LEARN-001 연동
3. 성능 최적화 (메모이제이션)
4. 접근성 개선

---

## ⚠️ 기술적 제약사항

1. **Local Storage 용량 제한**: 5-10MB (브라우저별 상이)
   - 해결책: 오래된 데이터 자동 삭제 옵션 제공

2. **SPEC-EXAM-001 의존성**: 시험 결과 데이터 구조 확정 필요
   - 해결책: SPEC-EXAM-001 완료 후 착수 또는 Mock 데이터 사용

3. **Recharts SSR 이슈**: Next.js 15 dynamic import 필요
   - 해결책: `next/dynamic`으로 클라이언트 사이드 렌더링

---

## 📊 예상 산출물

- `app/stats/page.tsx`: 통계 대시보드 페이지
- `components/stats/`: 통계 컴포넌트 폴더
  - `StatsOverview.tsx`: 개요 카드
  - `StatsChart.tsx`: 그래프 컴포넌트
  - `StatsFilter.tsx`: 필터링 컴포넌트
  - `WeakWordsList.tsx`: 취약 단어 목록
- `lib/stats/`: 통계 유틸리티 폴더
  - `statsStorage.ts`: Local Storage 관리
  - `statsCalculator.ts`: 통계 계산 로직
  - `types.ts`: 타입 정의

---

## 🧪 테스트 전략

### 단위 테스트 (Jest)
- 통계 계산 로직 검증
- Local Storage 유틸리티 테스트

### 통합 테스트 (React Testing Library)
- 컴포넌트 렌더링 검증
- 필터링 동작 검증

### E2E 테스트 (Playwright)
- 대시보드 전체 흐름 검증
- 복습하기 버튼 연동 검증

---

## 🎯 성공 기준

1. ✅ 시험 결과 데이터가 영구 저장됨
2. ✅ 기간별/세트별 필터링이 정상 동작함
3. ✅ 4가지 그래프 유형이 정확하게 표시됨
4. ✅ 취약 단어 TOP 10이 정확하게 추출됨
5. ✅ 테스트 커버리지 90% 이상 달성
6. ✅ SPEC-LEARN-001 복습 기능 연동 완료
7. ✅ WCAG 2.1 AA 접근성 기준 준수

---

## 🔄 다음 단계

1. **SPEC-EXAM-001 완료 여부 확인**
   - 완료됨: SPEC-STATS-001 본격 착수
   - 미완료: Mock 데이터로 병렬 개발 또는 대기

2. **사용자 승인 후**:
   ```bash
   /moai:1-plan resume SPEC-STATS-001  # 초안을 정식 SPEC으로 전환
   /moai:2-run SPEC-STATS-001          # TDD 구현 시작
   ```

---

**Note**: 이 문서는 초안 상태입니다. `/moai:1-plan resume SPEC-STATS-001` 실행 시 정식 SPEC 문서로 전환됩니다.
