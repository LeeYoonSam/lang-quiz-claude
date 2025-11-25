---
title: API 레퍼런스
description: Word Set Management System API 엔드포인트 상세 문서 (Folder 기능 포함)
version: 0.2.0
spec: SPEC-WORDSET-001, SPEC-FOLDER-001
lastUpdated: 2025-11-25
maintainer: "@user"
---

# API 레퍼런스

**Word Set Management System**의 모든 API 엔드포인트에 대한 상세한 문서입니다.
본 문서는 요청/응답 형식, 상태 코드, 에러 처리, 그리고 실제 사용 예시를 포함합니다.

## 개요

### 기본 정보

- **Base URL**: `http://localhost:3000` (개발 환경)
- **API 버전**: v0.1.0
- **응답 형식**: JSON
- **날짜 형식**: ISO 8601 (UTC)
- **인증**: 현재 미구현 (향후 추가 예정)

### 상태 코드

| 상태 코드 | 의미                    | 설명                                   |
|----------|------------------------|---------------------------------------|
| 200      | OK                     | 요청 성공                              |
| 201      | Created                | 리소스 생성 성공                       |
| 204      | No Content             | 요청 성공하였으나 응답 본문 없음       |
| 400      | Bad Request            | 잘못된 요청 형식                       |
| 404      | Not Found              | 리소스를 찾을 수 없음                  |
| 500      | Internal Server Error  | 서버 내부 오류                         |

### 공통 에러 응답

모든 에러 응답은 다음 형식을 따릅니다:

```json
{
  "error": "에러 메시지",
  "status": 400,
  "timestamp": "2025-11-24T10:30:00.000Z"
}
```

---

## Word Set 엔드포인트

### 1. 단어 세트 생성

#### 요청

```
POST /api/wordsets
Content-Type: application/json
```

**요청 본문**:

```json
{
  "name": "TOEFL 단어",
  "description": "TOEFL 시험 대비 필수 단어 모음"
}
```

**필드 설명**:

| 필드 | 타입 | 필수 | 제약 조건 | 설명 |
|------|------|------|---------|------|
| name | String | Yes | 1-100자 | 단어 세트의 이름 |
| description | String | No | 0-500자 | 단어 세트의 설명 |

#### 응답

**성공 (201 Created)**:

```json
{
  "id": "clx1a2b3c4d5e6f7g8h9",
  "name": "TOEFL 단어",
  "description": "TOEFL 시험 대비 필수 단어 모음",
  "folderId": null,
  "words": [],
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T10:30:00.000Z"
}
```

**실패 (400 Bad Request)**:

```json
{
  "error": "name 필드는 필수입니다",
  "status": 400
}
```

#### 사용 예시

```bash
curl -X POST http://localhost:3000/api/wordsets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TOEFL 단어",
    "description": "TOEFL 시험 대비 필수 단어 모음"
  }'
```

---

### 2. 단어 세트 목록 조회

#### 요청

```
GET /api/wordsets
```

**쿼리 파라미터**: 없음

#### 응답

**성공 (200 OK)**:

```json
[
  {
    "id": "clx1a2b3c4d5e6f7g8h9",
    "name": "TOEFL 단어",
    "description": "TOEFL 시험 대비 필수 단어 모음",
    "folderId": null,
    "wordCount": 25,
    "createdAt": "2025-11-24T10:30:00.000Z",
    "updatedAt": "2025-11-24T10:30:00.000Z"
  },
  {
    "id": "clx2b3c4d5e6f7g8h9i0",
    "name": "일상 영어",
    "description": "매일 사용하는 기본 영어 단어",
    "folderId": null,
    "wordCount": 50,
    "createdAt": "2025-11-23T15:20:00.000Z",
    "updatedAt": "2025-11-23T15:20:00.000Z"
  }
]
```

**응답 필드**:

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String | 고유 식별자 (CUID) |
| name | String | 세트 이름 |
| description | String | 세트 설명 |
| folderId | String \| null | 향후 폴더 기능용 필드 |
| wordCount | Number | 세트에 포함된 단어의 개수 |
| createdAt | DateTime | 생성 시간 |
| updatedAt | DateTime | 마지막 업데이트 시간 |

#### 사용 예시

```bash
curl http://localhost:3000/api/wordsets
```

---

### 3. 단어 세트 상세 조회

#### 요청

```
GET /api/wordsets/[id]
```

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | String | 단어 세트 고유 식별자 |

#### 응답

**성공 (200 OK)**:

```json
{
  "id": "clx1a2b3c4d5e6f7g8h9",
  "name": "TOEFL 단어",
  "description": "TOEFL 시험 대비 필수 단어 모음",
  "folderId": null,
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T10:30:00.000Z",
  "words": [
    {
      "id": "clx2b3c4d5e6f7g8h9i0",
      "text": "apple",
      "meaning": "사과",
      "wordSetId": "clx1a2b3c4d5e6f7g8h9",
      "createdAt": "2025-11-24T10:35:00.000Z",
      "updatedAt": "2025-11-24T10:35:00.000Z"
    },
    {
      "id": "clx3c4d5e6f7g8h9i0j1",
      "text": "banana",
      "meaning": "바나나",
      "wordSetId": "clx1a2b3c4d5e6f7g8h9",
      "createdAt": "2025-11-24T10:40:00.000Z",
      "updatedAt": "2025-11-24T10:40:00.000Z"
    }
  ]
}
```

**실패 (404 Not Found)**:

```json
{
  "error": "단어 세트를 찾을 수 없습니다",
  "status": 404
}
```

#### 사용 예시

```bash
curl http://localhost:3000/api/wordsets/clx1a2b3c4d5e6f7g8h9
```

---

### 4. 단어 세트 수정

#### 요청

```
PUT /api/wordsets/[id]
Content-Type: application/json
```

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | String | 단어 세트 고유 식별자 |

**요청 본문**:

```json
{
  "name": "TOEFL 필수 단어",
  "description": "TOEFL 시험 대비 필수 영어 단어 최종 정리"
}
```

**필드 설명**:

| 필드 | 타입 | 필수 | 제약 조건 | 설명 |
|------|------|------|---------|------|
| name | String | No | 1-100자 | 변경할 세트 이름 |
| description | String | No | 0-500자 | 변경할 세트 설명 |

#### 응답

**성공 (200 OK)**:

```json
{
  "id": "clx1a2b3c4d5e6f7g8h9",
  "name": "TOEFL 필수 단어",
  "description": "TOEFL 시험 대비 필수 영어 단어 최종 정리",
  "folderId": null,
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T11:00:00.000Z"
}
```

**실패 (404 Not Found)**:

```json
{
  "error": "단어 세트를 찾을 수 없습니다",
  "status": 404
}
```

#### 사용 예시

```bash
curl -X PUT http://localhost:3000/api/wordsets/clx1a2b3c4d5e6f7g8h9 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TOEFL 필수 단어",
    "description": "TOEFL 시험 대비 필수 영어 단어 최종 정리"
  }'
```

---

### 5. 단어 세트 삭제

#### 요청

```
DELETE /api/wordsets/[id]
```

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | String | 단어 세트 고유 식별자 |

#### 응답

**성공 (204 No Content)**:

응답 본문 없음

**실패 (404 Not Found)**:

```json
{
  "error": "단어 세트를 찾을 수 없습니다",
  "status": 404
}
```

#### 주의사항

- 단어 세트를 삭제하면 포함된 모든 단어가 자동으로 삭제됩니다 (Cascade Delete)
- 이 작업은 되돌릴 수 없습니다

#### 사용 예시

```bash
curl -X DELETE http://localhost:3000/api/wordsets/clx1a2b3c4d5e6f7g8h9
```

---

## Folder 엔드포인트 (SPEC-FOLDER-001)

### 1. 폴더 생성

#### 요청

```
POST /api/folders
Content-Type: application/json
```

**요청 본문**:

```json
{
  "name": "TOEFL 단어",
  "description": "TOEFL 시험 대비를 위한 폴더"
}
```

**필드 설명**:

| 필드 | 타입 | 필수 | 제약 조건 | 설명 |
|------|------|------|---------|------|
| name | String | Yes | 1-100자 | 폴더 이름 |
| description | String | No | 0-500자 | 폴더 설명 |

#### 응답

**성공 (201 Created)**:

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

#### 사용 예시

```bash
curl -X POST http://localhost:3000/api/folders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TOEFL 단어",
    "description": "TOEFL 시험 대비를 위한 폴더"
  }'
```

#### 성능 특성

- **응답 시간**: < 100ms
- **통계 계산**: 자동 포함

---

### 2. 폴더 목록 조회 (통계 포함)

#### 요청

```
GET /api/folders
```

#### 응답

**성공 (200 OK)**:

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
  },
  {
    "id": "clx6g7h8i9j0k1l2m3n4",
    "name": "비즈니스 영어",
    "description": "비즈니스 환경에서 필요한 영어",
    "parentId": null,
    "createdAt": "2025-11-25T09:30:00.000Z",
    "updatedAt": "2025-11-25T09:30:00.000Z",
    "_count": {
      "wordSets": 3
    }
  }
]
```

#### 응답 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String | 폴더 고유 식별자 |
| name | String | 폴더 이름 |
| description | String | 폴더 설명 |
| parentId | String \| null | 향후 중첩 폴더용 필드 |
| createdAt | DateTime | 생성 시간 |
| updatedAt | DateTime | 마지막 업데이트 시간 |
| _count.wordSets | Number | 폴더에 포함된 단어 세트 개수 |

#### 사용 예시

```bash
curl http://localhost:3000/api/folders
```

#### 성능 특성

- **응답 시간**: < 300ms (50개 폴더 기준)
- **조회 순서**: 생성일 기준 최신순

---

### 3. 폴더 상세 조회

#### 요청

```
GET /api/folders/[id]
```

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | String | 폴더 고유 식별자 |

#### 응답

**성공 (200 OK)**:

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

**실패 (404 Not Found)**:

```json
{
  "error": "폴더를 찾을 수 없습니다",
  "status": 404
}
```

#### 사용 예시

```bash
curl http://localhost:3000/api/folders/clx5f6g7h8i9j0k1l2m3
```

---

### 4. 폴더 수정

#### 요청

```
PUT /api/folders/[id]
Content-Type: application/json
```

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | String | 폴더 고유 식별자 |

**요청 본문**:

```json
{
  "name": "TOEFL 필수 단어",
  "description": "TOEFL 시험 필수 단어 모음"
}
```

#### 응답

**성공 (200 OK)**:

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

#### 사용 예시

```bash
curl -X PUT http://localhost:3000/api/folders/clx5f6g7h8i9j0k1l2m3 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TOEFL 필수 단어",
    "description": "TOEFL 시험 필수 단어 모음"
  }'
```

---

### 5. 폴더 삭제 (Nullify 정책)

#### 요청

```
DELETE /api/folders/[id]
```

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | String | 폴더 고유 식별자 |

#### 응답

**성공 (200 OK)**:

```json
{
  "message": "폴더가 삭제되었습니다.",
  "movedWordSets": 5
}
```

#### 주의사항

- **Nullify 정책**: 폴더 삭제 시 포함된 단어 세트는 **루트 영역(folderId=null)으로 이동**됨
- 단어 세트는 **삭제되지 않음** (데이터 안전성 보장)
- 응답의 `movedWordSets` 필드로 이동된 세트 개수 확인 가능

#### 사용 예시

```bash
curl -X DELETE http://localhost:3000/api/folders/clx5f6g7h8i9j0k1l2m3
```

---

### 6. 폴더별 단어 세트 조회

#### 요청

```
GET /api/folders/[id]/wordsets
```

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | String | 폴더 고유 식별자 |

#### 응답

**성공 (200 OK)**:

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
  },
  {
    "id": "clx2b3c4d5e6f7g8h9i0",
    "name": "Listening 단어",
    "description": "TOEFL Listening 섹션 단어",
    "folderId": "clx5f6g7h8i9j0k1l2m3",
    "wordCount": 30,
    "createdAt": "2025-11-25T10:10:00.000Z",
    "updatedAt": "2025-11-25T10:10:00.000Z"
  }
]
```

#### 응답 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String | 단어 세트 고유 식별자 |
| name | String | 단어 세트 이름 |
| description | String | 단어 세트 설명 |
| folderId | String | 폴더 ID |
| wordCount | Number | 세트 내 단어 개수 |
| createdAt | DateTime | 생성 시간 |
| updatedAt | DateTime | 마지막 업데이트 시간 |

#### 사용 예시

```bash
curl http://localhost:3000/api/folders/clx5f6g7h8i9j0k1l2m3/wordsets
```

#### 성능 특성

- **응답 시간**: < 500ms (500개 단어 세트 기준)

---

## Word Set 엔드포인트 (Folder 지원 추가)

### 기존 엔드포인트 확장

#### POST /api/wordsets (folderId 지원 추가)

**요청 본문** (업데이트):

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
  "words": [],
  "createdAt": "2025-11-25T10:10:00.000Z",
  "updatedAt": "2025-11-25T10:10:00.000Z"
}
```

#### GET /api/wordsets (폴더 정보 포함)

**응답** (200 OK):

```json
[
  {
    "id": "clx1a2b3c4d5e6f7g8h9",
    "name": "TOEFL 단어",
    "description": "TOEFL 시험 대비 필수 단어 모음",
    "folderId": "clx5f6g7h8i9j0k1l2m3",
    "folder": {
      "id": "clx5f6g7h8i9j0k1l2m3",
      "name": "TOEFL 단어"
    },
    "wordCount": 25,
    "createdAt": "2025-11-25T10:30:00.000Z",
    "updatedAt": "2025-11-25T10:30:00.000Z"
  },
  {
    "id": "clx2b3c4d5e6f7g8h9i0",
    "name": "일상 영어",
    "description": "매일 사용하는 기본 영어 단어",
    "folderId": null,
    "folder": null,
    "wordCount": 50,
    "createdAt": "2025-11-25T15:20:00.000Z",
    "updatedAt": "2025-11-25T15:20:00.000Z"
  }
]
```

#### PUT /api/wordsets/[id] (폴더 할당/변경 지원)

**요청 본문** (업데이트):

```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "folderId": "clx5f6g7h8i9j0k1l2m3"
}
```

---

## Word 엔드포인트

### 6. 단어 추가

#### 요청

```
POST /api/wordsets/[id]/words
Content-Type: application/json
```

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | String | 단어를 추가할 세트의 고유 식별자 |

**요청 본문**:

```json
{
  "text": "apple",
  "meaning": "사과"
}
```

**필드 설명**:

| 필드 | 타입 | 필수 | 제약 조건 | 설명 |
|------|------|------|---------|------|
| text | String | Yes | 1-100자 | 단어 (영어) |
| meaning | String | Yes | 1-500자 | 뜻 (한국어) |

#### 응답

**성공 (201 Created)**:

```json
{
  "id": "clx2b3c4d5e6f7g8h9i0",
  "text": "apple",
  "meaning": "사과",
  "wordSetId": "clx1a2b3c4d5e6f7g8h9",
  "createdAt": "2025-11-24T10:35:00.000Z",
  "updatedAt": "2025-11-24T10:35:00.000Z"
}
```

**실패 (404 Not Found)**:

```json
{
  "error": "단어 세트를 찾을 수 없습니다",
  "status": 404
}
```

**실패 (400 Bad Request)**:

```json
{
  "error": "text와 meaning 필드는 필수입니다",
  "status": 400
}
```

#### 사용 예시

```bash
curl -X POST http://localhost:3000/api/wordsets/clx1a2b3c4d5e6f7g8h9/words \
  -H "Content-Type: application/json" \
  -d '{
    "text": "apple",
    "meaning": "사과"
  }'
```

---

### 7. 단어 수정

#### 요청

```
PUT /api/words/[id]
Content-Type: application/json
```

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | String | 수정할 단어의 고유 식별자 |

**요청 본문**:

```json
{
  "text": "apple",
  "meaning": "사과 (빨간색 과일)"
}
```

**필드 설명**:

| 필드 | 타입 | 필수 | 제약 조건 | 설명 |
|------|------|------|---------|------|
| text | String | No | 1-100자 | 변경할 단어 |
| meaning | String | No | 1-500자 | 변경할 뜻 |

#### 응답

**성공 (200 OK)**:

```json
{
  "id": "clx2b3c4d5e6f7g8h9i0",
  "text": "apple",
  "meaning": "사과 (빨간색 과일)",
  "wordSetId": "clx1a2b3c4d5e6f7g8h9",
  "createdAt": "2025-11-24T10:35:00.000Z",
  "updatedAt": "2025-11-24T10:40:00.000Z"
}
```

**실패 (404 Not Found)**:

```json
{
  "error": "단어를 찾을 수 없습니다",
  "status": 404
}
```

#### 사용 예시

```bash
curl -X PUT http://localhost:3000/api/words/clx2b3c4d5e6f7g8h9i0 \
  -H "Content-Type: application/json" \
  -d '{
    "text": "apple",
    "meaning": "사과 (빨간색 과일)"
  }'
```

---

### 8. 단어 삭제

#### 요청

```
DELETE /api/words/[id]
```

**경로 파라미터**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | String | 삭제할 단어의 고유 식별자 |

#### 응답

**성공 (204 No Content)**:

응답 본문 없음

**실패 (404 Not Found)**:

```json
{
  "error": "단어를 찾을 수 없습니다",
  "status": 404
}
```

#### 사용 예시

```bash
curl -X DELETE http://localhost:3000/api/words/clx2b3c4d5e6f7g8h9i0
```

---

## 에러 처리

### 일반적인 에러 시나리오

**1. 필수 필드 누락**

```json
{
  "error": "name 필드는 필수입니다",
  "status": 400
}
```

**2. 리소스를 찾을 수 없음**

```json
{
  "error": "단어 세트를 찾을 수 없습니다",
  "status": 404
}
```

**3. 잘못된 입력 형식**

```json
{
  "error": "유효하지 않은 요청 형식입니다",
  "status": 400
}
```

**4. 서버 오류**

```json
{
  "error": "서버 오류가 발생했습니다",
  "status": 500
}
```

---

## 성능 최적화

### 응답 시간 기준

- **단어 세트 목록 조회**: < 100ms
- **단어 세트 상세 조회**: < 200ms
- **단어 추가/수정/삭제**: < 150ms

### 캐싱 전략

클라이언트에서는 TanStack Query를 사용하여:
- 단어 세트 목록: 5분 캐싱
- 단어 세트 상세: 3분 캐싱
- 리스트 갱신 후 자동 무효화

---

## 버전 관리

| 버전 | 릴리스 날짜 | 변경 사항 |
|------|-----------|---------|
| 0.1.0 | 2025-11-24 | 초기 API 출시 |

---

**마지막 업데이트**: 2025-11-25
**SPEC 참조**: SPEC-WORDSET-001 (v0.1.0), SPEC-FOLDER-001 (v1.0.0)
**문서 버전**: 0.2.0
