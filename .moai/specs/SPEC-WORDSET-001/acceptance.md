# SPEC-WORDSET-001 인수 기준 (Acceptance Criteria)

## 목차

1. [인수 기준 개요](#인수-기준-개요)
2. [기능 인수 시나리오](#기능-인수-시나리오)
3. [비기능 인수 기준](#비기능-인수-기준)
4. [품질 게이트](#품질-게이트)
5. [검증 방법 및 도구](#검증-방법-및-도구)
6. [Definition of Done](#definition-of-done)

---

## 인수 기준 개요

**SPEC ID**: SPEC-WORDSET-001
**목표**: 단어 세트 관리 시스템의 모든 기능이 요구사항을 충족하는지 검증

**검증 원칙**:
- 모든 시나리오는 Given-When-Then 형식으로 작성
- 자동화된 테스트로 검증 가능
- 사용자 관점에서 작성
- TRUST 5 기준 준수

---

## 기능 인수 시나리오

### AC-1: 단어 세트 생성 및 즉시 조회

#### 시나리오 1.1: 정상적인 세트 생성
**GIVEN** 사용자가 단어 세트 목록 페이지(`/wordsets`)에 있을 때
**AND** 화면에 "새 세트 만들기" 버튼이 표시되어 있을 때
**WHEN** 사용자가 "새 세트 만들기" 버튼을 클릭하고
**AND** 이름 입력 필드에 "TOEFL 필수 단어"를 입력하고
**AND** 설명 입력 필드에 "TOEFL 시험 대비 필수 단어 모음"을 입력하고
**AND** "생성" 버튼을 클릭하면
**THEN** 시스템은 POST /api/wordsets API를 호출하고
**AND** API 응답 상태 코드가 201이고
**AND** 사용자는 생성된 세트의 상세 페이지(`/wordsets/[id]`)로 자동 이동하고
**AND** 페이지 상단에 "TOEFL 필수 단어" 제목이 표시되고
**AND** 설명 "TOEFL 시험 대비 필수 단어 모음"이 표시되고
**AND** "단어를 추가해보세요" 안내 메시지가 표시된다

**검증 방법**:
- E2E 테스트 (Playwright)
- API 응답 검증 (status: 201, 데이터 구조 확인)
- 데이터베이스 검증 (Prisma 쿼리로 세트 생성 확인)

#### 시나리오 1.2: 입력 검증 - 이름 누락
**GIVEN** 사용자가 세트 생성 폼에 있을 때
**WHEN** 이름 입력 필드를 비워두고
**AND** "생성" 버튼을 클릭하면
**THEN** "이름은 필수입니다" 에러 메시지가 표시되고
**AND** 폼 제출이 차단되고
**AND** API 호출이 발생하지 않는다

**검증 방법**:
- 단위 테스트 (컴포넌트 검증)
- E2E 테스트 (사용자 플로우 검증)

#### 시나리오 1.3: 세트 목록에 새 세트 표시
**GIVEN** 사용자가 "TOEFL 필수 단어" 세트를 생성한 후
**WHEN** 세트 목록 페이지(`/wordsets`)로 이동하면
**THEN** 목록의 최상단에 "TOEFL 필수 단어" 세트 카드가 표시되고
**AND** 카드에 "0개 단어"가 표시되고
**AND** 생성 날짜가 오늘 날짜로 표시된다

**검증 방법**:
- E2E 테스트 (목록 표시 확인)
- TanStack Query 캐시 무효화 검증

---

### AC-2: 단어 추가 및 즉시 반영

#### 시나리오 2.1: 첫 번째 단어 추가
**GIVEN** 사용자가 빈 단어 세트의 상세 페이지에 있을 때
**AND** "단어를 추가해보세요" 안내 메시지가 표시되어 있을 때
**WHEN** 단어 입력 필드에 "apple"을 입력하고
**AND** 뜻 입력 필드에 "사과"를 입력하고
**AND** "추가" 버튼을 클릭하면
**THEN** 시스템은 POST /api/wordsets/[id]/words API를 호출하고
**AND** API 응답 상태 코드가 201이고
**AND** 단어 목록에 "apple - 사과"가 즉시 표시되고
**AND** 입력 폼이 초기화되고 (빈 입력 필드)
**AND** "단어를 추가해보세요" 안내 메시지가 사라지고
**AND** 단어 개수가 "1개 단어"로 업데이트된다

**검증 방법**:
- E2E 테스트 (전체 플로우)
- API 응답 검증
- Optimistic Update 동작 확인

#### 시나리오 2.2: 여러 단어 연속 추가
**GIVEN** 사용자가 단어 세트 상세 페이지에 있을 때
**WHEN** "apple - 사과"를 추가하고
**AND** "banana - 바나나"를 추가하고
**AND** "cat - 고양이"를 추가하면
**THEN** 단어 목록에 3개의 단어가 표시되고
**AND** 단어 개수가 "3개 단어"로 표시되고
**AND** 각 단어가 추가된 순서대로 목록에 표시된다

**검증 방법**:
- E2E 테스트 (반복 동작 검증)
- 단어 순서 검증 (createdAt 기준 정렬)

#### 시나리오 2.3: 단어 입력 검증 - 필수 필드 누락
**GIVEN** 사용자가 단어 추가 폼에 있을 때
**WHEN** 단어 입력 필드만 "apple"을 입력하고 뜻 입력 필드를 비워둔 채
**AND** "추가" 버튼을 클릭하면
**THEN** "뜻은 필수입니다" 에러 메시지가 표시되고
**AND** 폼 제출이 차단되고
**AND** API 호출이 발생하지 않는다

**검증 방법**:
- 단위 테스트 (폼 검증)
- E2E 테스트 (에러 메시지 표시)

---

### AC-3: 단어 수정 및 삭제

#### 시나리오 3.1: 단어 뜻 수정
**GIVEN** 사용자가 "apple - 사과" 단어가 포함된 세트 상세 페이지에 있을 때
**WHEN** "apple" 단어의 "수정" 버튼을 클릭하고
**AND** 뜻 입력 필드를 "사과 (빨간색 과일)"로 변경하고
**AND** "저장" 버튼을 클릭하면
**THEN** 시스템은 PUT /api/words/[id] API를 호출하고
**AND** API 응답 상태 코드가 200이고
**AND** 단어 목록에 "apple - 사과 (빨간색 과일)"이 즉시 표시되고
**AND** 수정 모드가 해제되어 일반 표시 모드로 전환되고
**AND** "수정 완료" 토스트 알림이 표시된다

**검증 방법**:
- E2E 테스트 (수정 플로우)
- API 응답 검증
- 데이터베이스 업데이트 확인

#### 시나리오 3.2: 단어 삭제
**GIVEN** 사용자가 3개의 단어가 있는 세트 상세 페이지에 있을 때
**WHEN** "banana" 단어의 "삭제" 버튼을 클릭하고
**AND** 확인 다이얼로그에서 "확인"을 선택하면
**THEN** 시스템은 DELETE /api/words/[id] API를 호출하고
**AND** API 응답 상태 코드가 204이고
**AND** "banana" 단어가 목록에서 즉시 제거되고
**AND** 단어 개수가 "2개 단어"로 업데이트되고
**AND** "단어가 삭제되었습니다" 토스트 알림이 표시된다

**검증 방법**:
- E2E 테스트 (삭제 플로우)
- API 응답 검증
- 데이터베이스 삭제 확인

---

### AC-4: 단어 세트 수정 및 삭제

#### 시나리오 4.1: 세트 정보 수정
**GIVEN** 사용자가 "TOEFL 필수 단어" 세트의 상세 페이지에 있을 때
**WHEN** "수정" 버튼을 클릭하고
**AND** 이름을 "TOEFL 기본 단어"로 변경하고
**AND** 설명을 "TOEFL 초급 학습자를 위한 기본 단어"로 변경하고
**AND** "저장" 버튼을 클릭하면
**THEN** 시스템은 PUT /api/wordsets/[id] API를 호출하고
**AND** API 응답 상태 코드가 200이고
**AND** 페이지 상단 제목이 "TOEFL 기본 단어"로 변경되고
**AND** 설명이 "TOEFL 초급 학습자를 위한 기본 단어"로 변경되고
**AND** "수정 완료" 토스트 알림이 표시된다

**검증 방법**:
- E2E 테스트 (수정 플로우)
- API 응답 검증
- updatedAt 타임스탬프 갱신 확인

#### 시나리오 4.2: 세트 삭제 및 Cascade 동작 검증
**GIVEN** 사용자가 5개의 단어를 포함한 세트의 상세 페이지에 있을 때
**WHEN** "삭제" 버튼을 클릭하고
**AND** 확인 다이얼로그에 "이 세트와 포함된 모든 단어(5개)가 삭제됩니다. 계속하시겠습니까?" 메시지가 표시되고
**AND** "확인"을 선택하면
**THEN** 시스템은 DELETE /api/wordsets/[id] API를 호출하고
**AND** API 응답 상태 코드가 204이고
**AND** 사용자는 세트 목록 페이지로 자동 이동하고
**AND** 삭제된 세트가 목록에서 제거되고
**AND** "세트가 삭제되었습니다" 토스트 알림이 표시되고
**AND** 데이터베이스에서 세트와 관련된 5개의 단어가 모두 삭제된다 (Cascade)

**검증 방법**:
- E2E 테스트 (삭제 및 리다이렉트)
- API 응답 검증
- 데이터베이스 Cascade 삭제 확인 (Prisma 쿼리)

---

### AC-5: 빈 상태 UI 표시

#### 시나리오 5.1: 세트 목록 빈 상태
**GIVEN** 신규 사용자가 처음 애플리케이션에 접속할 때
**AND** 데이터베이스에 세트가 하나도 없을 때
**WHEN** 홈페이지 또는 세트 목록 페이지에 접근하면
**THEN** "첫 세트를 만들어보세요" 안내 메시지가 표시되고
**AND** "새 세트 만들기" 버튼이 중앙에 크게 표시되고
**AND** 빈 목록 일러스트레이션이 표시된다

**검증 방법**:
- E2E 테스트 (빈 상태 렌더링)
- 단위 테스트 (EmptyState 컴포넌트)

#### 시나리오 5.2: 단어 목록 빈 상태
**GIVEN** 사용자가 단어가 없는 세트의 상세 페이지에 있을 때
**WHEN** 페이지가 로드되면
**THEN** "단어를 추가해보세요" 안내 메시지가 표시되고
**AND** 단어 추가 입력 폼이 강조 표시되고
**AND** 빈 단어 목록 일러스트레이션이 표시된다

**검증 방법**:
- E2E 테스트 (빈 상태 렌더링)
- 단위 테스트 (EmptyState 컴포넌트)

---

### AC-6: 확장성 검증 (폴더 기능 준비)

#### 시나리오 6.1: 데이터베이스 스키마 검증
**GIVEN** 시스템이 배포된 상태일 때
**WHEN** 데이터베이스 스키마를 검사하면
**THEN** `WordSet` 테이블에 `folderId` 컬럼이 존재하고
**AND** `folderId` 컬럼 타입이 `String?` (Nullable)이고
**AND** `folderId`에 인덱스가 생성되어 있고
**AND** `folderId`는 현재 null 값을 허용한다

**검증 방법**:
- Prisma 스키마 검증
- 데이터베이스 마이그레이션 파일 확인
- SQL 쿼리로 인덱스 확인

#### 시나리오 6.2: 향후 폴더 모델 추가 시뮬레이션
**GIVEN** 개발 환경에서 Prisma 스키마를 수정할 때
**WHEN** 다음과 같은 `Folder` 모델을 추가하고
```prisma
model Folder {
  id          String    @id @default(cuid())
  name        String
  wordSets    WordSet[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```
**AND** `WordSet` 모델에 relation을 추가하고
```prisma
model WordSet {
  ...
  folder   Folder? @relation(fields: [folderId], references: [id])
}
```
**AND** `npx prisma migrate dev`를 실행하면
**THEN** 마이그레이션이 성공적으로 완료되고
**AND** 기존 세트 데이터가 손실 없이 유지되고
**AND** 기존 세트의 `folderId`는 모두 null로 유지되고
**AND** 새 `Folder` 테이블이 생성된다

**검증 방법**:
- 마이그레이션 테스트 (개발 환경)
- 데이터 무결성 검증 (기존 데이터 보존)

---

## 비기능 인수 기준

### NFR-1: 성능 요구사항

#### 시나리오 NFR-1.1: API 응답 시간
**GIVEN** 시스템에 100개의 단어 세트와 각 세트당 평균 100개의 단어가 존재할 때
**WHEN** 다음 API를 호출하면
- GET /api/wordsets (세트 목록 조회)
- GET /api/wordsets/[id] (세트 상세 조회)
- POST /api/wordsets (세트 생성)
- POST /api/wordsets/[id]/words (단어 추가)
**THEN** 각 API의 응답 시간이 500ms 미만이어야 한다

**검증 방법**:
- 부하 테스트 (Artillery, k6)
- API 응답 시간 모니터링
- 성능 프로파일링

#### 시나리오 NFR-1.2: 대용량 단어 세트 처리
**GIVEN** 사용자가 1,000개의 단어를 포함한 세트의 상세 페이지에 접근할 때
**WHEN** 페이지가 로드되면
**THEN** 초기 로딩 시간이 2초 미만이고
**AND** 단어 목록이 가상 스크롤(Virtual Scroll)로 렌더링되고
**AND** 스크롤 시 끊김 없이 부드럽게 동작한다 (60fps 유지)

**검증 방법**:
- 성능 프로파일링 (Chrome DevTools)
- FPS 측정
- 대용량 데이터 테스트

---

### NFR-2: 사용성 요구사항

#### 시나리오 NFR-2.1: 반응형 디자인 - 모바일
**GIVEN** 사용자가 모바일 기기 (iPhone 13, 390x844)로 접속할 때
**WHEN** 세트 목록 페이지와 세트 상세 페이지를 탐색하면
**THEN** 모든 UI 요소가 화면에 맞게 조정되고
**AND** 버튼과 입력 필드가 터치 가능한 크기(최소 44x44px)로 표시되고
**AND** 텍스트가 읽기 쉽게 표시되고 (최소 16px)
**AND** 가로 스크롤이 발생하지 않는다

**검증 방법**:
- Playwright Mobile 에뮬레이션 테스트
- 수동 테스트 (실제 기기)

#### 시나리오 NFR-2.2: 접근성 (WCAG 2.1 AA)
**GIVEN** 스크린 리더 사용자가 애플리케이션에 접근할 때
**WHEN** 키보드만으로 모든 기능을 사용하면
**THEN** Tab 키로 모든 인터랙티브 요소에 접근 가능하고
**AND** Enter/Space 키로 버튼을 활성화할 수 있고
**AND** 포커스 표시가 명확하게 보이고
**AND** 모든 폼 입력 필드에 적절한 label이 연결되어 있고
**AND** 에러 메시지가 스크린 리더로 읽히고
**AND** 색상 대비가 WCAG AA 기준을 충족한다 (최소 4.5:1)

**검증 방법**:
- Playwright 접근성 테스트 (axe-core)
- 수동 키보드 내비게이션 테스트
- 색상 대비 검사 (Contrast Checker)

---

### NFR-3: 데이터 무결성

#### 시나리오 NFR-3.1: Cascade 삭제 동작
**GIVEN** 세트 A에 10개의 단어가 연결되어 있을 때
**WHEN** 세트 A를 삭제하면
**THEN** `Word` 테이블에서 해당 세트의 10개 단어가 모두 자동 삭제되고
**AND** 고아 레코드(orphaned records)가 발생하지 않고
**AND** 다른 세트의 단어는 영향을 받지 않는다

**검증 방법**:
- 통합 테스트 (Prisma onDelete: Cascade)
- 데이터베이스 무결성 검증

---

## 품질 게이트

### 자동화된 품질 검증

| 기준 | 목표 | 측정 방법 |
|------|------|----------|
| **테스트 커버리지** | 90% 이상 | Jest Coverage Report |
| **단위 테스트 통과율** | 100% | Jest Test Results |
| **E2E 테스트 통과율** | 100% | Playwright Test Results |
| **TypeScript 컴파일** | 0 에러 | tsc --noEmit |
| **ESLint 검증** | 0 에러 | eslint . |
| **접근성 검증** | 0 critical 이슈 | axe-core (Playwright) |
| **API 응답 시간** | < 500ms (95 percentile) | 성능 테스트 |
| **빌드 성공** | 100% | next build |

---

## 검증 방법 및 도구

### 테스트 도구

| 테스트 유형 | 도구 | 실행 명령 |
|------------|------|----------|
| 단위 테스트 | Jest + React Testing Library | `npm run test:unit` |
| 통합 테스트 | Jest + Prisma | `npm run test:integration` |
| E2E 테스트 | Playwright | `npm run test:e2e` |
| 접근성 테스트 | axe-core (Playwright) | `npm run test:a11y` |
| 성능 테스트 | Artillery | `npm run test:performance` |

### CI/CD 통합

**GitHub Actions 워크플로우**:
```yaml
name: Quality Gate

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Unit Tests
        run: npm run test:unit
      - name: Run E2E Tests
        run: npm run test:e2e
      - name: Check Coverage
        run: npm run test:coverage
      - name: Build
        run: npm run build
```

---

## Definition of Done

**SPEC-WORDSET-001이 완료되었다고 간주하는 기준**:

### 기능 완성도
- ✅ 8개 기능 요구사항 (FR-1 ~ FR-8) 모두 구현 및 검증 완료
- ✅ 5개 비기능 요구사항 (NFR-1 ~ NFR-5) 모두 충족
- ✅ 모든 인수 시나리오 (AC-1 ~ AC-6) 통과

### 테스트 완성도
- ✅ 단위 테스트 커버리지 90% 이상
- ✅ E2E 테스트 100% 통과
- ✅ 접근성 테스트 통과 (0 critical 이슈)
- ✅ 성능 테스트 통과 (API 응답 < 500ms)

### 코드 품질
- ✅ TypeScript 컴파일 에러 0개
- ✅ ESLint 에러 0개
- ✅ Prettier 포맷팅 적용
- ✅ 코드 리뷰 완료

### 문서화
- ✅ README.md 작성 (설치, 실행, 테스트 가이드)
- ✅ API 문서 작성
- ✅ 주요 컴포넌트 주석 작성

### 배포 준비
- ✅ 프로덕션 빌드 성공
- ✅ 환경 변수 설정 가이드 작성
- ✅ 데이터베이스 마이그레이션 준비

---

**END OF ACCEPTANCE CRITERIA**

**검증 완료 후**: SPEC-WORDSET-001 상태를 `draft` → `approved`로 변경
