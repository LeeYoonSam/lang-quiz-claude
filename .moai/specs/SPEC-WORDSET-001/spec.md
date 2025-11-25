---
id: SPEC-WORDSET-001
version: 0.1.0
status: completed
created: 2025-11-24
updated: 2025-11-25
author: "@user"
priority: high
---

# HISTORY

| 버전  | 날짜       | 작성자  | 변경 내용           |
| ----- | ---------- | ------- | ------------------- |
| 0.1.0 | 2025-11-25 | @user   | 구현 및 문서화 완료 |
| 0.1.0 | 2025-11-24 | @user   | 초기 SPEC 생성      |

---

# SPEC-WORDSET-001: 단어 세트 관리 시스템

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
- TypeScript: 최신 stable 버전
- TanStack Query: ^5.59.0 (서버 상태 관리)
- Tailwind CSS: ^3.4.0 (스타일링)

**Backend**
- Next.js API Routes (서버리스 API)
- Node.js: 18.x 이상

**Database**
- PostgreSQL: 16
- Prisma ORM: ^5.22.0

**Development Tools**
- ESLint, Prettier (코드 품질)
- Jest, React Testing Library (테스팅)
- Playwright (E2E 테스팅)

### 배포 환경

- **개발 환경**: localhost:3000
- **프로덕션 환경**: Vercel/AWS/자체 서버
- **데이터베이스**: PostgreSQL 16 (클라우드 호스팅 또는 자체 호스팅)

---

## Assumptions (가정)

### 사용자 컨텍스트

1. **타겟 사용자**: 어휘 학습을 위해 단어 세트를 관리하려는 사용자
2. **사용 시나리오**:
   - 사용자가 학습 목적으로 단어 세트를 생성
   - 단어와 뜻을 반복적으로 추가
   - 향후 폴더 기능을 통해 세트를 체계적으로 분류
3. **기술 수준**: 일반 사용자 (기술적 배경 불필요)

### 시스템 제약사항

1. **확장성 요구사항**: 폴더 기능을 위한 `folderId` 필드 사전 구현
2. **데이터 무결성**: 단어 세트 삭제 시 관련 단어 자동 삭제 (Cascade)
3. **성능 목표**:
   - API 응답 시간 < 500ms
   - 단어 세트당 최대 1,000개 단어 지원
   - 동시 사용자 100명 이상 처리

### 비즈니스 제약사항

1. **MVP 범위**: 단어 세트 CRUD + 단어 CRUD (폴더 기능 제외)
2. **향후 확장**: 폴더 기능, 태그, 공유 기능
3. **데이터 소유권**: 사용자별 단어 세트 관리 (향후 인증 추가 예정)

---

## Requirements (요구사항)

### 기능 요구사항 (Functional Requirements)

#### FR-1: 단어 세트 생성
**WHEN** 사용자가 "새 세트 만들기" 버튼을 클릭하고 이름과 설명을 입력한 후 "생성" 버튼을 클릭하면,
**THE SYSTEM SHALL** 입력된 정보로 새 단어 세트를 데이터베이스에 저장하고,
**THEN** 생성된 세트의 상세 페이지로 이동한다.

**STATE**: 세트 목록에 새 세트가 표시되어야 한다.

#### FR-2: 단어 세트 목록 조회
**WHEN** 사용자가 홈 페이지 또는 세트 목록 페이지에 접근하면,
**THE SYSTEM SHALL** 모든 단어 세트를 생성일 기준 최신순으로 조회하고,
**THEN** 각 세트의 이름, 설명, 단어 개수, 생성일을 카드 형태로 표시한다.

**STATE**: 세트가 없을 경우 "첫 세트를 만들어보세요" 안내 메시지를 표시한다.

#### FR-3: 단어 세트 상세 조회
**WHEN** 사용자가 세트 목록에서 특정 세트를 클릭하면,
**THE SYSTEM SHALL** 해당 세트의 정보와 포함된 모든 단어를 조회하고,
**THEN** 세트 정보(이름, 설명)와 단어 목록(단어, 뜻)을 표시한다.

**STATE**: 단어가 없을 경우 "단어를 추가해보세요" 안내 메시지를 표시한다.

#### FR-4: 단어 세트 수정
**WHEN** 사용자가 세트 상세 페이지에서 "수정" 버튼을 클릭하고 이름 또는 설명을 변경한 후 "저장" 버튼을 클릭하면,
**THE SYSTEM SHALL** 변경된 정보를 데이터베이스에 업데이트하고,
**THEN** 업데이트된 정보를 화면에 반영하며 "수정 완료" 알림을 표시한다.

**STATE**: `updatedAt` 타임스탬프가 현재 시간으로 갱신된다.

#### FR-5: 단어 세트 삭제
**WHEN** 사용자가 세트 상세 페이지에서 "삭제" 버튼을 클릭하고 확인 다이얼로그에서 "확인"을 선택하면,
**THE SYSTEM SHALL** 해당 세트와 관련된 모든 단어를 데이터베이스에서 삭제하고 (Cascade),
**THEN** 세트 목록 페이지로 이동하며 "세트가 삭제되었습니다" 알림을 표시한다.

**STATE**: 삭제된 세트는 목록에서 즉시 제거된다.

#### FR-6: 단어 추가
**WHEN** 사용자가 세트 상세 페이지에서 "단어 추가" 입력 폼에 단어와 뜻을 입력하고 "추가" 버튼을 클릭하면,
**THE SYSTEM SHALL** 입력된 단어와 뜻을 해당 세트에 연결하여 데이터베이스에 저장하고,
**THEN** 단어 목록에 새 단어를 즉시 표시하며 입력 폼을 초기화한다.

**STATE**: 단어 개수 카운터가 1 증가한다.

#### FR-7: 단어 수정
**WHEN** 사용자가 단어 목록에서 특정 단어의 "수정" 버튼을 클릭하고 단어 또는 뜻을 변경한 후 "저장" 버튼을 클릭하면,
**THE SYSTEM SHALL** 변경된 정보를 데이터베이스에 업데이트하고,
**THEN** 수정된 단어 정보를 목록에 반영한다.

**STATE**: 수정 모드가 해제되고 일반 표시 모드로 전환된다.

#### FR-8: 단어 삭제
**WHEN** 사용자가 단어 목록에서 특정 단어의 "삭제" 버튼을 클릭하고 확인하면,
**THE SYSTEM SHALL** 해당 단어를 데이터베이스에서 삭제하고,
**THEN** 단어 목록에서 해당 단어를 즉시 제거한다.

**STATE**: 단어 개수 카운터가 1 감소한다.

### 비기능 요구사항 (Non-Functional Requirements)

#### NFR-1: 성능
**THE SYSTEM SHALL** 모든 API 응답 시간을 500ms 이내로 유지해야 하며, 단어 세트당 최대 1,000개의 단어를 지원해야 한다.

#### NFR-2: 확장성
**THE SYSTEM SHALL** 향후 폴더 기능 추가를 위해 `WordSet` 모델에 `folderId` 필드를 사전 정의하고, 데이터베이스 인덱스를 구성해야 한다.

#### NFR-3: 데이터 무결성
**THE SYSTEM SHALL** 단어 세트 삭제 시 관련된 모든 단어를 자동으로 삭제하여 고아 레코드를 방지해야 한다 (Cascade Delete).

#### NFR-4: 사용성
**THE SYSTEM SHALL** 반응형 디자인을 통해 모바일, 태블릿, 데스크톱 환경에서 일관된 사용자 경험을 제공해야 한다.

#### NFR-5: 테스트 커버리지
**THE SYSTEM SHALL** 단위 테스트 커버리지 90% 이상, E2E 테스트를 통한 주요 사용자 시나리오 100% 커버를 달성해야 한다.

### 인터페이스 요구사항 (Interface Requirements)

#### IR-1: API 엔드포인트
**THE SYSTEM SHALL** RESTful API 설계 원칙을 따르는 다음 엔드포인트를 제공해야 한다:
- `POST /api/wordsets` - 세트 생성
- `GET /api/wordsets` - 세트 목록 조회
- `GET /api/wordsets/[id]` - 세트 상세 조회
- `PUT /api/wordsets/[id]` - 세트 수정
- `DELETE /api/wordsets/[id]` - 세트 삭제
- `POST /api/wordsets/[id]/words` - 단어 추가
- `PUT /api/words/[id]` - 단어 수정
- `DELETE /api/words/[id]` - 단어 삭제

#### IR-2: 데이터 형식
**THE SYSTEM SHALL** 모든 API 요청과 응답에 JSON 형식을 사용하고, ISO 8601 형식의 날짜 표준을 준수해야 한다.

### 설계 제약사항 (Design Constraints)

#### DC-1: 기술 스택 고정
**THE SYSTEM SHALL** Next.js 15, React 19, PostgreSQL 16, Prisma ORM 5.22.0을 사용해야 한다.

#### DC-2: 데이터베이스 스키마
**THE SYSTEM SHALL** 제공된 Prisma 스키마 구조를 준수하고, 마이그레이션을 통해 스키마 변경을 관리해야 한다.

---

## Specifications (명세)

### 데이터 모델

```prisma
model WordSet {
  id          String   @id @default(cuid())
  name        String
  description String?
  folderId    String?  // 향후 폴더 기능을 위한 필드
  words       Word[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([folderId])
}

model Word {
  id          String   @id @default(cuid())
  text        String   // 단어
  meaning     String   // 뜻
  wordSetId   String
  wordSet     WordSet  @relation(fields: [wordSetId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([wordSetId])
}
```

### API 명세

#### POST /api/wordsets
**요청**:
```json
{
  "name": "일상 영어 단어",
  "description": "매일 사용하는 기본 영어 단어 모음"
}
```

**응답** (201 Created):
```json
{
  "id": "clx1a2b3c4d5e6f7g8h9",
  "name": "일상 영어 단어",
  "description": "매일 사용하는 기본 영어 단어 모음",
  "folderId": null,
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T10:30:00.000Z",
  "words": []
}
```

#### GET /api/wordsets
**응답** (200 OK):
```json
[
  {
    "id": "clx1a2b3c4d5e6f7g8h9",
    "name": "일상 영어 단어",
    "description": "매일 사용하는 기본 영어 단어 모음",
    "folderId": null,
    "wordCount": 25,
    "createdAt": "2025-11-24T10:30:00.000Z",
    "updatedAt": "2025-11-24T10:30:00.000Z"
  }
]
```

#### GET /api/wordsets/[id]
**응답** (200 OK):
```json
{
  "id": "clx1a2b3c4d5e6f7g8h9",
  "name": "일상 영어 단어",
  "description": "매일 사용하는 기본 영어 단어 모음",
  "folderId": null,
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T10:30:00.000Z",
  "words": [
    {
      "id": "clx2b3c4d5e6f7g8h9i0",
      "text": "apple",
      "meaning": "사과",
      "createdAt": "2025-11-24T10:35:00.000Z",
      "updatedAt": "2025-11-24T10:35:00.000Z"
    }
  ]
}
```

#### PUT /api/wordsets/[id]
**요청**:
```json
{
  "name": "기본 영어 단어",
  "description": "초급 영어 학습자를 위한 단어 모음"
}
```

**응답** (200 OK):
```json
{
  "id": "clx1a2b3c4d5e6f7g8h9",
  "name": "기본 영어 단어",
  "description": "초급 영어 학습자를 위한 단어 모음",
  "folderId": null,
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T11:00:00.000Z"
}
```

#### DELETE /api/wordsets/[id]
**응답** (204 No Content)

#### POST /api/wordsets/[id]/words
**요청**:
```json
{
  "text": "banana",
  "meaning": "바나나"
}
```

**응답** (201 Created):
```json
{
  "id": "clx3c4d5e6f7g8h9i0j1",
  "text": "banana",
  "meaning": "바나나",
  "wordSetId": "clx1a2b3c4d5e6f7g8h9",
  "createdAt": "2025-11-24T11:05:00.000Z",
  "updatedAt": "2025-11-24T11:05:00.000Z"
}
```

#### PUT /api/words/[id]
**요청**:
```json
{
  "text": "banana",
  "meaning": "바나나 (열대 과일)"
}
```

**응답** (200 OK):
```json
{
  "id": "clx3c4d5e6f7g8h9i0j1",
  "text": "banana",
  "meaning": "바나나 (열대 과일)",
  "wordSetId": "clx1a2b3c4d5e6f7g8h9",
  "createdAt": "2025-11-24T11:05:00.000Z",
  "updatedAt": "2025-11-24T11:10:00.000Z"
}
```

#### DELETE /api/words/[id]
**응답** (204 No Content)

### UI 컴포넌트 명세

#### WordSetList (단어 세트 목록)
- **경로**: `/wordsets` 또는 홈페이지
- **컴포넌트**:
  - 세트 카드 그리드 (반응형)
  - "새 세트 만들기" 버튼
  - 각 카드: 이름, 설명, 단어 개수, 생성일
- **상태 관리**: TanStack Query로 세트 목록 캐싱

#### WordSetDetail (단어 세트 상세)
- **경로**: `/wordsets/[id]`
- **컴포넌트**:
  - 세트 정보 헤더 (이름, 설명, 수정/삭제 버튼)
  - 단어 추가 입력 폼 (단어, 뜻)
  - 단어 목록 테이블 (단어, 뜻, 수정/삭제 버튼)
- **상태 관리**: TanStack Query로 세트 상세 및 단어 목록 캐싱

#### WordSetForm (세트 생성/수정 폼)
- **입력 필드**:
  - 이름 (필수, max 100자)
  - 설명 (선택, max 500자)
- **검증**:
  - 이름: 최소 1자, 최대 100자
  - 설명: 최대 500자

#### WordForm (단어 추가/수정 폼)
- **입력 필드**:
  - 단어 (필수, max 100자)
  - 뜻 (필수, max 500자)
- **검증**:
  - 단어: 최소 1자, 최대 100자
  - 뜻: 최소 1자, 최대 500자

---

## Acceptance Criteria (인수 기준)

### AC-1: 단어 세트 생성 및 조회
**GIVEN** 사용자가 단어 세트 목록 페이지에 있을 때
**WHEN** "새 세트 만들기" 버튼을 클릭하고 이름을 "TOEFL 단어", 설명을 "TOEFL 시험 대비 단어 모음"으로 입력한 후 "생성" 버튼을 클릭하면
**THEN**
- 시스템은 새 세트를 데이터베이스에 저장한다
- 사용자는 생성된 세트의 상세 페이지로 이동한다
- 세트 목록 페이지에 새 세트가 표시된다

**검증 방법**:
- API 응답 상태 코드가 201이다
- 데이터베이스에 새 세트가 저장되었다 (Prisma 쿼리 확인)
- 세트 목록에 새 세트가 포함되어 있다

### AC-2: 단어 추가 및 수정
**GIVEN** 사용자가 특정 단어 세트의 상세 페이지에 있을 때
**WHEN** 단어 입력 폼에 "apple"과 "사과"를 입력하고 "추가" 버튼을 클릭한 후, 추가된 단어의 "수정" 버튼을 클릭하고 뜻을 "사과 (빨간색 과일)"로 변경하고 "저장" 버튼을 클릭하면
**THEN**
- 단어 "apple"이 단어 목록에 즉시 표시된다
- 수정 후 뜻이 "사과 (빨간색 과일)"로 업데이트된다
- 단어 개수가 1 증가한다

**검증 방법**:
- API 응답 상태 코드가 201 (추가), 200 (수정)이다
- 데이터베이스에 단어가 정확히 저장되고 업데이트되었다
- UI에 변경사항이 즉시 반영된다

### AC-3: 단어 세트 삭제 및 Cascade 동작
**GIVEN** 사용자가 5개의 단어를 포함한 단어 세트의 상세 페이지에 있을 때
**WHEN** "삭제" 버튼을 클릭하고 확인 다이얼로그에서 "확인"을 선택하면
**THEN**
- 해당 세트와 관련된 모든 단어 (5개)가 데이터베이스에서 삭제된다
- 사용자는 세트 목록 페이지로 리다이렉트된다
- 삭제된 세트는 목록에서 제거된다
- "세트가 삭제되었습니다" 알림이 표시된다

**검증 방법**:
- 데이터베이스에서 세트와 연관된 단어가 모두 삭제되었다
- API 응답 상태 코드가 204이다
- 세트 목록에서 삭제된 세트가 보이지 않는다

### AC-4: 빈 상태 처리
**GIVEN** 신규 사용자가 처음 애플리케이션에 접속할 때
**WHEN** 홈페이지 또는 세트 목록 페이지에 접근하면
**THEN**
- "첫 세트를 만들어보세요" 안내 메시지가 표시된다
- "새 세트 만들기" 버튼이 표시된다

**AND**

**GIVEN** 사용자가 단어가 없는 세트의 상세 페이지에 있을 때
**WHEN** 페이지가 로드되면
**THEN**
- "단어를 추가해보세요" 안내 메시지가 표시된다
- 단어 추가 입력 폼이 표시된다

**검증 방법**:
- 빈 상태 메시지가 올바르게 렌더링된다
- 사용자가 즉시 액션을 취할 수 있는 UI가 제공된다

### AC-5: 확장성 검증 (폴더 기능 준비)
**GIVEN** 시스템이 운영 중일 때
**WHEN** 데이터베이스 스키마를 검사하면
**THEN**
- `WordSet` 모델에 `folderId` 필드가 존재한다
- `folderId`에 인덱스가 설정되어 있다
- 향후 `Folder` 모델 추가 시 마이그레이션만으로 연결 가능하다

**검증 방법**:
- Prisma 스키마에 `folderId String?` 필드가 정의되어 있다
- 데이터베이스 인덱스가 생성되어 있다 (`@@index([folderId])`)

### AC-6: 성능 기준 충족
**GIVEN** 시스템에 100개의 단어 세트와 각 세트당 100개의 단어가 존재할 때
**WHEN** 사용자가 세트 목록 조회 및 특정 세트 상세 조회를 수행하면
**THEN**
- 세트 목록 조회 API 응답 시간이 500ms 미만이다
- 세트 상세 조회 API 응답 시간이 500ms 미만이다

**검증 방법**:
- API 응답 시간을 측정하여 500ms 이하인지 확인
- 부하 테스트를 통해 동시 사용자 100명 처리 가능 확인

---

## Traceability (추적성)

### TAG 체계

```
@SPEC-WORDSET-001
  ├─ @FR-1 (단어 세트 생성)
  │   ├─ @API-POST-WORDSETS
  │   ├─ @UI-WORDSET-FORM
  │   └─ @TEST-WORDSET-CREATE
  ├─ @FR-2 (단어 세트 목록 조회)
  │   ├─ @API-GET-WORDSETS
  │   ├─ @UI-WORDSET-LIST
  │   └─ @TEST-WORDSET-LIST
  ├─ @FR-3 (단어 세트 상세 조회)
  │   ├─ @API-GET-WORDSET-DETAIL
  │   ├─ @UI-WORDSET-DETAIL
  │   └─ @TEST-WORDSET-DETAIL
  ├─ @FR-4 (단어 세트 수정)
  │   ├─ @API-PUT-WORDSETS
  │   └─ @TEST-WORDSET-UPDATE
  ├─ @FR-5 (단어 세트 삭제)
  │   ├─ @API-DELETE-WORDSETS
  │   └─ @TEST-WORDSET-DELETE-CASCADE
  ├─ @FR-6 (단어 추가)
  │   ├─ @API-POST-WORDS
  │   ├─ @UI-WORD-FORM
  │   └─ @TEST-WORD-CREATE
  ├─ @FR-7 (단어 수정)
  │   ├─ @API-PUT-WORDS
  │   └─ @TEST-WORD-UPDATE
  └─ @FR-8 (단어 삭제)
      ├─ @API-DELETE-WORDS
      └─ @TEST-WORD-DELETE
```

### 요구사항 → 구현 매핑

| 요구사항 | API | UI 컴포넌트 | 테스트 |
|---------|-----|------------|--------|
| FR-1 | POST /api/wordsets | WordSetForm | unit, e2e |
| FR-2 | GET /api/wordsets | WordSetList | unit, e2e |
| FR-3 | GET /api/wordsets/[id] | WordSetDetail | unit, e2e |
| FR-4 | PUT /api/wordsets/[id] | WordSetForm | unit, e2e |
| FR-5 | DELETE /api/wordsets/[id] | DeleteButton + Dialog | unit, e2e |
| FR-6 | POST /api/wordsets/[id]/words | WordForm | unit, e2e |
| FR-7 | PUT /api/words/[id] | WordForm | unit, e2e |
| FR-8 | DELETE /api/words/[id] | DeleteButton | unit, e2e |

---

**END OF SPEC-WORDSET-001**
