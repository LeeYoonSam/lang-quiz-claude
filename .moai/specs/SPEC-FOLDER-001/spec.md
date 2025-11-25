---
id: SPEC-FOLDER-001
version: 1.0.0
status: completed
created: 2025-11-25
updated: 2025-11-25
author: "@user"
priority: high
dependencies:
  - SPEC-WORDSET-001
---

# HISTORY

| 버전  | 날짜       | 작성자 | 변경 내용      |
| ----- | ---------- | ------ | -------------- |
| 0.1.0 | 2025-11-25 | @user  | 초기 SPEC 생성 |

---

# SPEC-FOLDER-001: 폴더 기능 구현

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
- SQLite (개발), PostgreSQL 16 (프로덕션)
- Prisma ORM: ^5.22.0

**Development Tools**
- ESLint, Prettier (코드 품질)
- Jest, React Testing Library (테스팅)
- Playwright (E2E 테스팅)

### 배포 환경

- **개발 환경**: localhost:3000
- **프로덕션 환경**: Vercel/AWS/자체 서버
- **데이터베이스**: SQLite (개발), PostgreSQL 16 (프로덕션)

### 기존 시스템 상태

- ✅ **SPEC-WORDSET-001 완료**: 단어 세트 CRUD 및 단어 관리 기능 구현 완료
- ✅ **folderId 필드 준비**: `WordSet` 모델에 `folderId String?` 및 인덱스 설정 완료
- ✅ **확장 준비**: 폴더 기능 추가를 위한 스키마 준비 완료

---

## Assumptions (가정)

### 사용자 컨텍스트

1. **타겟 사용자**: 단어 세트를 체계적으로 분류하고 관리하려는 사용자
2. **사용 시나리오**:
   - 사용자가 학습 목적별로 폴더를 생성 (예: "TOEFL", "비즈니스 영어", "일상 회화")
   - 기존 단어 세트를 폴더에 할당하거나 새 세트 생성 시 폴더 지정
   - 폴더별로 단어 세트를 필터링하여 조회
3. **기술 수준**: 일반 사용자 (파일 시스템의 폴더 개념 이해)

### 시스템 제약사항

1. **기존 데이터 호환성**: SPEC-WORDSET-001로 생성된 기존 단어 세트(folderId=null)는 "루트" 영역에 유지
2. **폴더 구조**: 단일 레벨 폴더 (1단계만, 중첩 폴더 미지원 - 향후 확장 가능)
3. **성능 목표**:
   - 폴더 목록 조회 API 응답 시간 < 300ms
   - 폴더별 세트 필터링 API 응답 시간 < 500ms
   - 폴더당 최대 500개 단어 세트 지원

### 비즈니스 제약사항

1. **MVP 범위**: 폴더 CRUD + 단어 세트 연결 + 기본 통계 (세트 개수)
2. **향후 확장**: 중첩 폴더, 색상 태그, 공유 기능, 드래그 앤 드롭
3. **데이터 안전성**: 폴더 삭제 시 포함된 단어 세트는 루트로 이동 (Nullify 정책, 데이터 손실 방지)

---

## Requirements (요구사항)

### 기능 요구사항 (Functional Requirements)

#### FR-1: 폴더 생성
**WHEN** 사용자가 "새 폴더 만들기" 버튼을 클릭하고 이름과 설명을 입력한 후 "생성" 버튼을 클릭하면,
**THE SYSTEM SHALL** 입력된 정보로 새 폴더를 데이터베이스에 저장하고,
**THEN** 폴더 목록에 새 폴더를 즉시 표시한다.

**STATE**: 폴더 목록에 새 폴더가 추가되며, 초기 단어 세트 개수는 0이다.

#### FR-2: 폴더 목록 조회
**WHEN** 사용자가 홈 페이지 또는 폴더 목록 영역에 접근하면,
**THE SYSTEM SHALL** 모든 폴더를 생성일 기준 최신순으로 조회하고,
**THEN** 각 폴더의 이름, 설명, 포함된 단어 세트 개수를 카드 형태로 표시한다.

**STATE**: 폴더가 없을 경우 "폴더를 만들어 단어 세트를 정리하세요" 안내 메시지를 표시한다.

#### FR-3: 폴더 상세 조회
**WHEN** 사용자가 폴더 목록에서 특정 폴더를 클릭하면,
**THE SYSTEM SHALL** 해당 폴더의 정보와 포함된 모든 단어 세트를 조회하고,
**THEN** 폴더 정보(이름, 설명)와 단어 세트 목록을 표시한다.

**STATE**: 단어 세트가 없을 경우 "이 폴더에 단어 세트를 추가해보세요" 안내 메시지를 표시한다.

#### FR-4: 폴더 수정
**WHEN** 사용자가 폴더 상세 페이지에서 "수정" 버튼을 클릭하고 이름 또는 설명을 변경한 후 "저장" 버튼을 클릭하면,
**THE SYSTEM SHALL** 변경된 정보를 데이터베이스에 업데이트하고,
**THEN** 업데이트된 정보를 화면에 반영하며 "수정 완료" 알림을 표시한다.

**STATE**: `updatedAt` 타임스탬프가 현재 시간으로 갱신된다.

#### FR-5: 폴더 삭제 (Nullify 정책)
**WHEN** 사용자가 폴더 상세 페이지에서 "삭제" 버튼을 클릭하고 확인 다이얼로그에서 "확인"을 선택하면,
**THE SYSTEM SHALL** 해당 폴더를 데이터베이스에서 삭제하되, 포함된 모든 단어 세트의 `folderId`를 `null`로 변경하여 루트 영역으로 이동시키고,
**THEN** 폴더 목록 페이지로 이동하며 "폴더가 삭제되었습니다. N개의 단어 세트가 루트로 이동되었습니다." 알림을 표시한다.

**STATE**: 삭제된 폴더는 목록에서 제거되고, 단어 세트는 루트 영역에 표시된다.

#### FR-6: 단어 세트에 폴더 할당
**WHEN** 사용자가 단어 세트 생성/수정 폼에서 폴더 드롭다운 메뉴를 열고 특정 폴더를 선택한 후 저장하면,
**THE SYSTEM SHALL** 해당 단어 세트의 `folderId`를 선택한 폴더의 ID로 업데이트하고,
**THEN** 단어 세트가 해당 폴더에 표시되며 루트 영역에서 제거된다.

**STATE**: 폴더의 단어 세트 개수가 1 증가한다.

#### FR-7: 단어 세트에서 폴더 제거
**WHEN** 사용자가 단어 세트 수정 폼에서 폴더를 "없음"으로 선택하고 저장하면,
**THE SYSTEM SHALL** 해당 단어 세트의 `folderId`를 `null`로 업데이트하고,
**THEN** 단어 세트가 루트 영역에 표시되며 기존 폴더에서 제거된다.

**STATE**: 기존 폴더의 단어 세트 개수가 1 감소한다.

#### FR-8: 폴더별 단어 세트 필터링
**WHEN** 사용자가 폴더 목록에서 특정 폴더를 클릭하면,
**THE SYSTEM SHALL** 해당 폴더에 속한 단어 세트만 필터링하여 조회하고,
**THEN** 폴더 이름과 함께 필터링된 단어 세트 목록을 표시한다.

**STATE**: 루트 영역(folderId=null) 클릭 시 폴더에 속하지 않은 모든 단어 세트를 표시한다.

#### FR-9: 폴더 통계 표시
**WHEN** 사용자가 폴더 목록을 조회하면,
**THE SYSTEM SHALL** 각 폴더에 포함된 단어 세트 개수를 계산하고,
**THEN** 폴더 카드에 "N개의 세트" 형태로 통계를 표시한다.

**STATE**: 단어 세트 추가/제거 시 통계가 실시간으로 업데이트된다.

### 비기능 요구사항 (Non-Functional Requirements)

#### NFR-1: 성능
**THE SYSTEM SHALL** 폴더 목록 조회 API 응답 시간을 300ms 이내로 유지하고, 폴더별 세트 필터링 API 응답 시간을 500ms 이내로 유지해야 한다.

#### NFR-2: 확장성
**THE SYSTEM SHALL** 향후 중첩 폴더 기능 추가를 위해 `Folder` 모델에 `parentId` 필드를 옵션으로 정의하되, MVP에서는 사용하지 않는다.

#### NFR-3: 데이터 무결성
**THE SYSTEM SHALL** 폴더 삭제 시 포함된 단어 세트의 `folderId`를 `null`로 변경하여 고아 레코드를 방지하고, 데이터 손실을 최소화해야 한다 (Nullify 정책).

#### NFR-4: 사용성
**THE SYSTEM SHALL** 폴더 선택 UI를 직관적으로 제공하여 단어 세트 생성/수정 시 폴더를 쉽게 할당할 수 있도록 해야 한다.

#### NFR-5: 테스트 커버리지
**THE SYSTEM SHALL** 단위 테스트 커버리지 90% 이상, E2E 테스트를 통한 주요 사용자 시나리오 100% 커버를 달성해야 한다.

### 인터페이스 요구사항 (Interface Requirements)

#### IR-1: API 엔드포인트
**THE SYSTEM SHALL** RESTful API 설계 원칙을 따르는 다음 엔드포인트를 제공해야 한다:
- `POST /api/folders` - 폴더 생성
- `GET /api/folders` - 폴더 목록 조회 (통계 포함)
- `GET /api/folders/[id]` - 폴더 상세 조회
- `PUT /api/folders/[id]` - 폴더 수정
- `DELETE /api/folders/[id]` - 폴더 삭제 (Nullify)
- `GET /api/folders/[id]/wordsets` - 폴더별 단어 세트 조회

#### IR-2: 기존 API 확장
**THE SYSTEM SHALL** 기존 단어 세트 API를 확장하여 폴더 정보를 포함해야 한다:
- `GET /api/wordsets` - 폴더 정보 포함 (folderId, folderName)
- `POST /api/wordsets` - 요청 시 folderId 수용
- `PUT /api/wordsets/[id]` - folderId 업데이트 지원

#### IR-3: 데이터 형식
**THE SYSTEM SHALL** 모든 API 요청과 응답에 JSON 형식을 사용하고, ISO 8601 형식의 날짜 표준을 준수해야 한다.

### 설계 제약사항 (Design Constraints)

#### DC-1: 기술 스택 고정
**THE SYSTEM SHALL** Next.js 15, React 19, SQLite/PostgreSQL 16, Prisma ORM 5.22.0을 사용해야 한다.

#### DC-2: 데이터베이스 스키마
**THE SYSTEM SHALL** 제공된 Prisma 스키마 구조를 준수하고, 마이그레이션을 통해 스키마 변경을 관리해야 한다.

#### DC-3: 기존 SPEC 호환성
**THE SYSTEM SHALL** SPEC-WORDSET-001의 기능을 유지하며, 폴더 기능을 추가적으로 구현해야 한다 (하위 호환성).

---

## Specifications (명세)

### 데이터 모델

#### Folder 모델 (신규 추가)
```prisma
model Folder {
  id          String    @id @default(cuid())
  name        String
  description String?
  parentId    String?   // 향후 중첩 폴더 지원 (MVP에서는 미사용)
  wordSets    WordSet[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([parentId])
}
```

#### WordSet 모델 (기존, folderId 관계 활성화)
```prisma
model WordSet {
  id          String   @id @default(cuid())
  name        String
  description String?
  folderId    String?
  folder      Folder?  @relation(fields: [folderId], references: [id], onDelete: SetNull)
  words       Word[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([folderId])
}
```

**주요 변경사항**:
- `folder` 관계 추가: `Folder?  @relation(fields: [folderId], references: [id], onDelete: SetNull)`
- **onDelete: SetNull** → 폴더 삭제 시 단어 세트의 `folderId`를 `null`로 설정 (Nullify 정책)

### API 명세

#### POST /api/folders
**요청**:
```json
{
  "name": "TOEFL 단어",
  "description": "TOEFL 시험 대비를 위한 폴더"
}
```

**응답** (201 Created):
```json
{
  "id": "clx5f6g7h8i9j0k1l2m3",
  "name": "TOEFL 단어",
  "description": "TOEFL 시험 대비를 위한 폴더",
  "parentId": null,
  "createdAt": "2025-11-25T10:00:00.000Z",
  "updatedAt": "2025-11-25T10:00:00.000Z",
  "_count": {
    "wordSets": 0
  }
}
```

#### GET /api/folders
**응답** (200 OK):
```json
[
  {
    "id": "clx5f6g7h8i9j0k1l2m3",
    "name": "TOEFL 단어",
    "description": "TOEFL 시험 대비를 위한 폴더",
    "parentId": null,
    "createdAt": "2025-11-25T10:00:00.000Z",
    "updatedAt": "2025-11-25T10:00:00.000Z",
    "_count": {
      "wordSets": 5
    }
  }
]
```

#### GET /api/folders/[id]
**응답** (200 OK):
```json
{
  "id": "clx5f6g7h8i9j0k1l2m3",
  "name": "TOEFL 단어",
  "description": "TOEFL 시험 대비를 위한 폴더",
  "parentId": null,
  "createdAt": "2025-11-25T10:00:00.000Z",
  "updatedAt": "2025-11-25T10:00:00.000Z",
  "_count": {
    "wordSets": 5
  }
}
```

#### PUT /api/folders/[id]
**요청**:
```json
{
  "name": "TOEFL 필수 단어",
  "description": "TOEFL 시험 필수 단어 모음"
}
```

**응답** (200 OK):
```json
{
  "id": "clx5f6g7h8i9j0k1l2m3",
  "name": "TOEFL 필수 단어",
  "description": "TOEFL 시험 필수 단어 모음",
  "parentId": null,
  "createdAt": "2025-11-25T10:00:00.000Z",
  "updatedAt": "2025-11-25T10:30:00.000Z"
}
```

#### DELETE /api/folders/[id]
**응답** (200 OK):
```json
{
  "message": "폴더가 삭제되었습니다.",
  "movedWordSets": 5
}
```

**설명**: 폴더 삭제 시 포함된 5개의 단어 세트가 루트 영역으로 이동됨 (folderId=null)

#### GET /api/folders/[id]/wordsets
**응답** (200 OK):
```json
[
  {
    "id": "clx1a2b3c4d5e6f7g8h9",
    "name": "Reading 단어",
    "description": "TOEFL Reading 섹션 단어",
    "folderId": "clx5f6g7h8i9j0k1l2m3",
    "wordCount": 50,
    "createdAt": "2025-11-25T10:05:00.000Z",
    "updatedAt": "2025-11-25T10:05:00.000Z"
  }
]
```

#### 확장: POST /api/wordsets (folderId 지원)
**요청**:
```json
{
  "name": "Listening 단어",
  "description": "TOEFL Listening 섹션 단어",
  "folderId": "clx5f6g7h8i9j0k1l2m3"
}
```

**응답** (201 Created):
```json
{
  "id": "clx6g7h8i9j0k1l2m3n4",
  "name": "Listening 단어",
  "description": "TOEFL Listening 섹션 단어",
  "folderId": "clx5f6g7h8i9j0k1l2m3",
  "folder": {
    "id": "clx5f6g7h8i9j0k1l2m3",
    "name": "TOEFL 단어"
  },
  "createdAt": "2025-11-25T10:10:00.000Z",
  "updatedAt": "2025-11-25T10:10:00.000Z"
}
```

### UI 컴포넌트 명세

#### FolderList (폴더 목록)
- **경로**: `/folders` 또는 사이드바
- **컴포넌트**:
  - 폴더 카드 그리드 (반응형)
  - "새 폴더 만들기" 버튼
  - 각 카드: 이름, 설명, 단어 세트 개수
  - "루트 영역" 특수 카드 (folderId=null 세트 표시)
- **상태 관리**: TanStack Query로 폴더 목록 캐싱

#### FolderDetail (폴더 상세)
- **경로**: `/folders/[id]`
- **컴포넌트**:
  - 폴더 정보 헤더 (이름, 설명, 수정/삭제 버튼)
  - 폴더 내 단어 세트 목록 (WordSetCard 재사용)
  - 빈 상태 메시지 ("이 폴더에 단어 세트를 추가해보세요")
- **상태 관리**: TanStack Query로 폴더 상세 및 단어 세트 캐싱

#### FolderForm (폴더 생성/수정 폼)
- **입력 필드**:
  - 이름 (필수, max 100자)
  - 설명 (선택, max 500자)
- **검증**:
  - 이름: 최소 1자, 최대 100자
  - 설명: 최대 500자

#### FolderSelector (폴더 선택 드롭다운)
- **위치**: WordSetForm 컴포넌트 내
- **기능**:
  - 폴더 목록 드롭다운
  - "없음" 옵션 (루트 영역, folderId=null)
  - 선택한 폴더 표시
- **사용 예**:
  - 단어 세트 생성 시 폴더 선택
  - 단어 세트 수정 시 폴더 변경

#### WordSetList 확장 (폴더 필터링 지원)
- **기존 기능 유지**: SPEC-WORDSET-001의 세트 목록 표시
- **신규 기능**:
  - 폴더 필터 탭 ("전체", "루트", 폴더별)
  - 선택한 폴더에 속한 세트만 표시
  - 각 세트 카드에 폴더 이름 배지 표시

---

## Acceptance Criteria (인수 기준)

### AC-1: 폴더 생성 및 조회
**GIVEN** 사용자가 폴더 목록 페이지에 있을 때
**WHEN** "새 폴더 만들기" 버튼을 클릭하고 이름을 "TOEFL 단어", 설명을 "TOEFL 시험 대비"로 입력한 후 "생성" 버튼을 클릭하면
**THEN**
- 시스템은 새 폴더를 데이터베이스에 저장한다
- 폴더 목록에 새 폴더가 즉시 표시된다
- 폴더의 초기 단어 세트 개수는 0이다

**검증 방법**:
- API 응답 상태 코드가 201이다
- 데이터베이스에 새 폴더가 저장되었다 (Prisma 쿼리 확인)
- 폴더 목록에 새 폴더가 포함되어 있다

### AC-2: 단어 세트에 폴더 할당
**GIVEN** 사용자가 새 단어 세트 생성 폼을 열었을 때
**WHEN** 이름을 "Reading 단어", 폴더를 "TOEFL 단어"로 선택하고 "생성" 버튼을 클릭하면
**THEN**
- 단어 세트가 생성되며 `folderId`가 "TOEFL 단어" 폴더의 ID로 설정된다
- "TOEFL 단어" 폴더의 단어 세트 개수가 1 증가한다
- "TOEFL 단어" 폴더 상세 페이지에서 해당 세트가 표시된다

**검증 방법**:
- API 응답에 `folderId`와 `folder` 객체가 포함되어 있다
- 데이터베이스에서 단어 세트의 `folderId`가 올바르게 설정되었다
- 폴더 통계가 실시간으로 업데이트되었다

### AC-3: 폴더 삭제 및 Nullify 정책
**GIVEN** 사용자가 5개의 단어 세트를 포함한 "TOEFL 단어" 폴더의 상세 페이지에 있을 때
**WHEN** "삭제" 버튼을 클릭하고 확인 다이얼로그에서 "확인"을 선택하면
**THEN**
- "TOEFL 단어" 폴더가 데이터베이스에서 삭제된다
- 포함된 5개의 단어 세트의 `folderId`가 `null`로 변경된다
- 단어 세트가 루트 영역에 표시된다
- "폴더가 삭제되었습니다. 5개의 단어 세트가 루트로 이동되었습니다." 알림이 표시된다

**검증 방법**:
- 데이터베이스에서 폴더가 삭제되었다
- 단어 세트의 `folderId`가 `null`이다
- 단어 세트는 여전히 존재하며 데이터 손실이 없다
- API 응답에 이동된 세트 개수가 포함되어 있다

### AC-4: 폴더별 단어 세트 필터링
**GIVEN** 시스템에 2개의 폴더("TOEFL 단어", "비즈니스 영어")와 각각 3개, 2개의 단어 세트가 있을 때
**WHEN** 사용자가 "TOEFL 단어" 폴더를 클릭하면
**THEN**
- "TOEFL 단어" 폴더에 속한 3개의 단어 세트만 표시된다
- "비즈니스 영어" 폴더의 세트는 표시되지 않는다
- 폴더 이름과 통계가 함께 표시된다

**검증 방법**:
- API 응답에 해당 폴더의 세트만 포함되어 있다
- UI에 3개의 세트만 렌더링되었다
- 폴더 필터가 활성화되어 있다

### AC-5: 루트 영역 세트 조회
**GIVEN** 시스템에 폴더 없이 생성된 단어 세트(folderId=null) 10개가 있을 때
**WHEN** 사용자가 "루트 영역" 또는 "전체" 탭을 클릭하면
**THEN**
- `folderId`가 `null`인 10개의 단어 세트가 표시된다
- 폴더에 속한 세트는 표시되지 않는다 (루트 필터 선택 시)

**검증 방법**:
- API 쿼리에 `WHERE folderId IS NULL` 조건이 적용되었다
- 루트 영역 세트만 렌더링되었다

### AC-6: 폴더 수정 및 통계 유지
**GIVEN** 사용자가 5개의 단어 세트를 포함한 폴더의 상세 페이지에 있을 때
**WHEN** 폴더 이름을 "TOEFL 필수 단어"로 변경하고 "저장" 버튼을 클릭하면
**THEN**
- 폴더 이름이 업데이트된다
- 단어 세트 개수는 여전히 5개로 유지된다
- `updatedAt` 타임스탬프가 현재 시간으로 갱신된다

**검증 방법**:
- API 응답에 업데이트된 폴더 정보가 포함되어 있다
- 데이터베이스에서 폴더 이름이 변경되었다
- 통계는 변경되지 않았다

### AC-7: 성능 기준 충족
**GIVEN** 시스템에 50개의 폴더와 각 폴더당 10개의 단어 세트가 존재할 때
**WHEN** 사용자가 폴더 목록 조회 및 특정 폴더의 세트 조회를 수행하면
**THEN**
- 폴더 목록 조회 API 응답 시간이 300ms 미만이다
- 폴더별 세트 조회 API 응답 시간이 500ms 미만이다

**검증 방법**:
- API 응답 시간을 측정하여 목표치 이하인지 확인
- 부하 테스트를 통해 성능 저하 없음을 검증

### AC-8: 기존 SPEC-WORDSET-001 호환성
**GIVEN** SPEC-WORDSET-001로 생성된 기존 단어 세트(folderId=null)가 10개 있을 때
**WHEN** 폴더 기능을 추가한 후 시스템을 실행하면
**THEN**
- 기존 단어 세트는 루트 영역에 정상적으로 표시된다
- 기존 CRUD 기능(생성, 조회, 수정, 삭제)이 정상 동작한다
- 데이터 손실이나 오류가 발생하지 않는다

**검증 방법**:
- 기존 세트 조회 시 정상 렌더링 확인
- 기존 API 테스트 통과 확인
- E2E 테스트로 전체 흐름 검증

---

## Traceability (추적성)

### TAG 체계

```
@SPEC-FOLDER-001
  ├─ @FR-1 (폴더 생성)
  │   ├─ @API-POST-FOLDERS
  │   ├─ @UI-FOLDER-FORM
  │   └─ @TEST-FOLDER-CREATE
  ├─ @FR-2 (폴더 목록 조회)
  │   ├─ @API-GET-FOLDERS
  │   ├─ @UI-FOLDER-LIST
  │   └─ @TEST-FOLDER-LIST
  ├─ @FR-3 (폴더 상세 조회)
  │   ├─ @API-GET-FOLDER-DETAIL
  │   ├─ @UI-FOLDER-DETAIL
  │   └─ @TEST-FOLDER-DETAIL
  ├─ @FR-4 (폴더 수정)
  │   ├─ @API-PUT-FOLDERS
  │   └─ @TEST-FOLDER-UPDATE
  ├─ @FR-5 (폴더 삭제 - Nullify)
  │   ├─ @API-DELETE-FOLDERS
  │   └─ @TEST-FOLDER-DELETE-NULLIFY
  ├─ @FR-6 (단어 세트에 폴더 할당)
  │   ├─ @API-PUT-WORDSETS-FOLDER
  │   ├─ @UI-FOLDER-SELECTOR
  │   └─ @TEST-WORDSET-FOLDER-ASSIGN
  ├─ @FR-7 (단어 세트에서 폴더 제거)
  │   └─ @TEST-WORDSET-FOLDER-REMOVE
  ├─ @FR-8 (폴더별 단어 세트 필터링)
  │   ├─ @API-GET-FOLDERS-WORDSETS
  │   ├─ @UI-FOLDER-FILTER
  │   └─ @TEST-FOLDER-FILTER
  └─ @FR-9 (폴더 통계 표시)
      ├─ @API-FOLDERS-COUNT
      └─ @TEST-FOLDER-STATS
```

### 요구사항 → 구현 매핑

| 요구사항 | API | UI 컴포넌트 | 테스트 |
|---------|-----|------------|--------|
| FR-1 | POST /api/folders | FolderForm | unit, e2e |
| FR-2 | GET /api/folders | FolderList | unit, e2e |
| FR-3 | GET /api/folders/[id] | FolderDetail | unit, e2e |
| FR-4 | PUT /api/folders/[id] | FolderForm | unit, e2e |
| FR-5 | DELETE /api/folders/[id] | DeleteButton + Dialog | unit, e2e |
| FR-6 | PUT /api/wordsets/[id] | FolderSelector | unit, e2e |
| FR-7 | PUT /api/wordsets/[id] | FolderSelector | unit, e2e |
| FR-8 | GET /api/folders/[id]/wordsets | FolderFilter | unit, e2e |
| FR-9 | GET /api/folders (_count) | FolderList | unit, e2e |

### SPEC 의존성

- **SPEC-WORDSET-001**: 폴더 기능의 기반이 되는 단어 세트 CRUD 시스템
  - `WordSet.folderId` 필드 활용
  - 기존 API 확장 (folderId 파라미터 추가)
  - 기존 UI 컴포넌트 재사용 (WordSetCard)

---

**END OF SPEC-FOLDER-001**
