---
title: 데이터베이스 스키마
description: Word Set Management System의 데이터베이스 설계 및 스키마 상세 문서
version: 0.1.0
spec: SPEC-WORDSET-001
lastUpdated: 2025-11-25
maintainer: "@user"
---

# 데이터베이스 스키마

**Word Set Management System**의 데이터베이스 설계 및 각 테이블의 상세 스키마를 설명합니다.

## 개요

### 기술 스택

- **데이터베이스**: PostgreSQL 16 (프로덕션), SQLite (개발)
- **ORM**: Prisma 5.22.0
- **마이그레이션**: Prisma Migrations

### 데이터 무결성

- **Cascade Delete**: 단어 세트 삭제 시 포함된 모든 단어 자동 삭제
- **인덱싱**: 자주 조회되는 필드에 인덱스 생성
- **타입 안정성**: TypeScript와 Prisma를 통한 타입 검증

---

## Prisma 스키마

### 전체 스키마 정의

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model WordSet {
  id          String   @id @default(cuid())
  name        String
  description String?
  folderId    String?  // Future folder feature support
  words       Word[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([folderId])
}

model Word {
  id          String   @id @default(cuid())
  text        String   // English word
  meaning     String   // Korean meaning
  wordSetId   String
  wordSet     WordSet  @relation(fields: [wordSetId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([wordSetId])
}
```

---

## 테이블 상세 설명

### 1. WordSet 테이블

**목적**: 사용자의 단어 세트 정보 저장

#### 컬럼 정의

| 컬럼명 | 타입 | 제약 조건 | 설명 |
|--------|------|---------|------|
| id | String | PK, UNIQUE | CUID 형식 고유 식별자 |
| name | String | NOT NULL | 세트의 이름 (1-100자) |
| description | String | NULLABLE | 세트의 설명 (0-500자) |
| folderId | String | NULLABLE, INDEX | 향후 폴더 기능용 필드 |
| createdAt | DateTime | NOT NULL, DEFAULT(now()) | 생성 시간 |
| updatedAt | DateTime | NOT NULL, AUTO_UPDATE | 마지막 수정 시간 |

#### 인덱스

```sql
-- Primary Key Index
CREATE UNIQUE INDEX "WordSet_pkey" ON "WordSet"(id);

-- Foreign Key Index (향후 폴더 기능)
CREATE INDEX "WordSet_folderId_idx" ON "WordSet"(folderId);
```

#### 관계

- **Word (1:N)**: 하나의 WordSet은 여러 Word를 포함
- **Folder (1:N)**: 향후 구현 - 하나의 Folder는 여러 WordSet을 포함 (예정)

#### 예시 데이터

```json
{
  "id": "clx1a2b3c4d5e6f7g8h9",
  "name": "TOEFL 단어",
  "description": "TOEFL 시험 대비 필수 단어 모음",
  "folderId": null,
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T11:00:00.000Z"
}
```

#### SQL 생성 쿼리

```sql
CREATE TABLE "WordSet" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "folderId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "WordSet_folderId_idx" ON "WordSet"("folderId");
```

---

### 2. Word 테이블

**목적**: 단어 세트에 포함된 개별 단어 정보 저장

#### 컬럼 정의

| 컬럼명 | 타입 | 제약 조건 | 설명 |
|--------|------|---------|------|
| id | String | PK, UNIQUE | CUID 형식 고유 식별자 |
| text | String | NOT NULL | 영어 단어 (1-100자) |
| meaning | String | NOT NULL | 한국어 뜻 (1-500자) |
| wordSetId | String | NOT NULL, FK, INDEX | 포함된 WordSet의 ID |
| createdAt | DateTime | NOT NULL, DEFAULT(now()) | 생성 시간 |
| updatedAt | DateTime | NOT NULL, AUTO_UPDATE | 마지막 수정 시간 |

#### 인덱스

```sql
-- Primary Key Index
CREATE UNIQUE INDEX "Word_pkey" ON "Word"(id);

-- Foreign Key Index
CREATE INDEX "Word_wordSetId_idx" ON "Word"(wordSetId);
```

#### 관계

- **WordSet (N:1)**: 여러 Word는 하나의 WordSet에 속함
  - Cascade Delete: WordSet 삭제 시 Word도 자동 삭제

#### 제약 조건

```sql
-- Foreign Key Constraint
ALTER TABLE "Word"
ADD CONSTRAINT "Word_wordSetId_fkey"
FOREIGN KEY ("wordSetId") REFERENCES "WordSet"("id")
ON DELETE CASCADE;
```

#### 예시 데이터

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

#### SQL 생성 쿼리

```sql
CREATE TABLE "Word" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "text" TEXT NOT NULL,
  "meaning" TEXT NOT NULL,
  "wordSetId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("wordSetId") REFERENCES "WordSet"("id") ON DELETE CASCADE
);

CREATE INDEX "Word_wordSetId_idx" ON "Word"("wordSetId");
```

---

## 정규화 (Normalization)

### 제1정규형 (1NF)

- 모든 컬럼은 원자적 값(atomic values)을 포함
- 중복되는 그룹 없음

**확인**:
- WordSet: ✅ 모든 컬럼이 원자적 값
- Word: ✅ 모든 컬럼이 원자적 값

### 제2정규형 (2NF)

- 1NF 만족
- 모든 비키 속성이 주키에 완전히 함수 종속

**확인**:
- WordSet: ✅ id가 주키, 모든 속성이 id에 종속
- Word: ✅ id가 주키, 모든 속성이 id에 종속

### 제3정규형 (3NF)

- 2NF 만족
- 비키 속성 간에 이행적 함수 종속 없음

**확인**:
- WordSet: ✅ 비키 속성(name, description) 간 종속성 없음
- Word: ✅ 비키 속성(text, meaning) 간 종속성 없음

**결론**: 두 테이블 모두 3NF 만족 ✅

---

## 데이터 무결성 전략

### 1. Cascade Delete

WordSet 삭제 시 관련된 모든 Word 자동 삭제

```prisma
model Word {
  wordSet     WordSet  @relation(fields: [wordSetId], references: [id], onDelete: Cascade)
}
```

**SQL 레벨**:
```sql
FOREIGN KEY ("wordSetId") REFERENCES "WordSet"("id") ON DELETE CASCADE
```

**동작 예시**:
```sql
-- WordSet 삭제
DELETE FROM "WordSet" WHERE id = 'clx1a2b3c4d5e6f7g8h9';

-- 결과: 이 WordSet에 포함된 모든 Word도 자동 삭제됨
-- Word 테이블에서 wordSetId = 'clx1a2b3c4d5e6f7g8h9'인 레코드 모두 삭제
```

### 2. Foreign Key 제약

Word는 반드시 유효한 WordSet을 참조해야 함

```prisma
model Word {
  wordSetId   String
  wordSet     WordSet  @relation(fields: [wordSetId], references: [id])
}
```

**검증**:
```sql
-- 유효한 wordSetId만 허용
INSERT INTO "Word" (id, text, meaning, wordSetId)
VALUES ('clx3c4d5e6f7g8h9i0j1', 'apple', '사과', 'clx1a2b3c4d5e6f7g8h9');
-- ✅ 성공 (WordSet 존재)

-- 유효하지 않은 wordSetId
INSERT INTO "Word" (id, text, meaning, wordSetId)
VALUES ('clx3c4d5e6f7g8h9i0j2', 'banana', '바나나', 'invalid-id');
-- ❌ 실패 (Foreign Key 제약 위반)
```

### 3. UNIQUE 제약

Primary Key로 ID 중복 방지

```prisma
model WordSet {
  id  String  @id @default(cuid())
}
```

---

## 인덱싱 전략

### 1. Primary Key 인덱스

**목적**: ID로 레코드 빠르게 조회

```sql
CREATE UNIQUE INDEX "WordSet_pkey" ON "WordSet"("id");
CREATE UNIQUE INDEX "Word_pkey" ON "Word"("id");
```

**쿼리**:
```sql
-- Very Fast (인덱스 사용)
SELECT * FROM "WordSet" WHERE id = 'clx1a2b3c4d5e6f7g8h9';

-- Execution Plan: Index Seek
```

### 2. Foreign Key 인덱스

**목적**: Word 조회 시 wordSetId로 빠른 필터링

```sql
CREATE INDEX "Word_wordSetId_idx" ON "Word"("wordSetId");
```

**쿼리**:
```sql
-- Fast (인덱스 사용)
SELECT * FROM "Word" WHERE wordSetId = 'clx1a2b3c4d5e6f7g8h9';

-- Execution Plan: Index Seek -> Key Lookup
```

### 3. 향후 인덱스 (folderId)

**목적**: 폴더별 세트 조회 최적화 (구현 예정)

```sql
CREATE INDEX "WordSet_folderId_idx" ON "WordSet"("folderId");
```

**예상 쿼리**:
```sql
-- Folder 기능 추가 후
SELECT * FROM "WordSet" WHERE folderId = 'folder-id';
```

---

## 마이그레이션 히스토리

### v0.1.0 - 초기 스키마 (2025-11-24)

**마이그레이션 이름**: `20250124_init`

**변경 사항**:
1. WordSet 테이블 생성
2. Word 테이블 생성
3. Foreign Key 관계 설정
4. 인덱스 생성

**마이그레이션 SQL**:
```sql
-- CreateWordSet
CREATE TABLE "WordSet" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "folderId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "WordSet_folderId_idx" ON "WordSet"("folderId");

-- CreateWord
CREATE TABLE "Word" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "text" TEXT NOT NULL,
  "meaning" TEXT NOT NULL,
  "wordSetId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Word_wordSetId_fkey"
    FOREIGN KEY ("wordSetId") REFERENCES "WordSet"("id") ON DELETE CASCADE
);

CREATE INDEX "Word_wordSetId_idx" ON "Word"("wordSetId");
```

**마이그레이션 실행**:
```bash
npm run prisma:migrate deploy
```

---

## 데이터베이스 설정

### 개발 환경

```env
# .env
DATABASE_URL="file:./dev.db"
```

**특징**:
- SQLite 사용 (파일 기반)
- 로컬 개발에 최적
- 마이그레이션 테스트 용이

**명령어**:
```bash
# Prisma Client 생성
npm run prisma:generate

# 마이그레이션 실행
npm run prisma:migrate dev --name init

# 데이터베이스 푸시 (개발용)
npm run prisma:push

# 테스트 데이터 시드
npm run prisma:seed

# Prisma Studio (GUI)
npm run prisma:studio
```

### 프로덕션 환경

```env
# .env.production
DATABASE_URL="postgresql://user:password@host:5432/wordset_db"
```

**특징**:
- PostgreSQL 16 사용
- 고성능, 확장성
- 자동 백업 권장

**설정**:
```bash
# 프로덕션 마이그레이션
npm run prisma:migrate deploy

# 스키마 푸시
npm run prisma:push
```

---

## 쿼리 최적화 팁

### 1. N+1 쿼리 방지

**❌ 나쁜 예시** (N+1 문제):
```javascript
// Word 목록 조회 후 각 Word마다 WordSet 조회
const words = await prisma.word.findMany();
for (const word of words) {
  const wordSet = await prisma.wordSet.findUnique({
    where: { id: word.wordSetId }
  });
  console.log(word.text, wordSet.name);
}
// 쿼리 발생: 1 (Word 목록) + N (WordSet 조회) = N+1
```

**✅ 좋은 예시** (Join 사용):
```javascript
// Relation 포함하여 한 번에 조회
const words = await prisma.word.findMany({
  include: {
    wordSet: true  // WordSet 정보 포함
  }
});
// 쿼리 발생: 1 (Join 쿼리)
```

### 2. 페이지네이션

```javascript
// 대량 데이터 조회 시 페이지네이션
const wordSets = await prisma.wordSet.findMany({
  skip: 0,         // 시작 위치
  take: 10,        // 가져올 개수
  orderBy: {
    createdAt: 'desc'  // 정렬
  }
});
```

### 3. 선택적 필드 조회

```javascript
// 필요한 필드만 조회 (불필요한 컬럼 제외)
const wordSets = await prisma.wordSet.findMany({
  select: {
    id: true,
    name: true,
    wordCount: false  // description 제외
  }
});
```

### 4. 배치 작업

```javascript
// 다중 레코드 생성
const words = await prisma.word.createMany({
  data: [
    { text: 'apple', meaning: '사과', wordSetId: 'id1' },
    { text: 'banana', meaning: '바나나', wordSetId: 'id1' }
  ],
  skipDuplicates: true  // 중복 스킵
});
```

---

## 데이터 카운팅

### Word Count 계산

단어 세트 조회 시 단어 개수 포함:

```javascript
// Prisma의 count 기능 활용
const wordSets = await prisma.wordSet.findMany({
  include: {
    _count: {
      select: { words: true }  // 단어 개수 계산
    }
  }
});

// 응답
[
  {
    id: 'clx1a2b3c4d5e6f7g8h9',
    name: 'TOEFL 단어',
    _count: {
      words: 25
    }
  }
]
```

---

## 성능 벤치마크

### 쿼리 성능 기준

| 작업 | 예상 시간 | 기준 데이터 |
|------|---------|-----------|
| WordSet 조회 (ID) | < 1ms | - |
| Word 목록 조회 | < 50ms | 1000개 |
| WordSet 상세 조회 | < 100ms | 1000개 단어 |
| Word 추가 | < 10ms | - |
| WordSet 삭제 (Cascade) | < 100ms | 1000개 단어 |

### 부하 테스트

100명의 동시 사용자 기준:
- 응답 시간: < 500ms
- 처리량: > 1000 requests/sec
- 에러율: < 0.1%

---

## 데이터 보호 및 백업

### 백업 전략

```bash
# SQLite 개발 DB 백업
cp dev.db dev.db.backup

# PostgreSQL 백업
pg_dump wordset_db > backup.sql

# 자동 백업 (프로덕션)
# AWS RDS, Google Cloud SQL 등의 자동 백업 설정
```

### 복구 방법

```bash
# SQLite 복구
cp dev.db.backup dev.db

# PostgreSQL 복구
psql wordset_db < backup.sql
```

---

## 보안 고려사항

### 1. SQL Injection 방지

Prisma ORM 사용으로 자동 방지:
```javascript
// Prisma는 Prepared Statements 사용
// SQL Injection 불가능
const word = await prisma.word.findUnique({
  where: { id: userInput }  // 안전함
});
```

### 2. 데이터 암호화

민감한 데이터(향후 추가):
```prisma
model User {
  password  String  @db.Text  // 해싱됨
}
```

### 3. 접근 제어

Prisma Row-Level Security (향후):
```sql
-- PostgreSQL RLS 정책 (향후 인증 추가)
ALTER TABLE "WordSet" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own wordsets"
ON "WordSet"
FOR SELECT
USING (userId = current_user_id());
```

---

## 향후 확장

### v0.2.0 - 폴더 기능

```prisma
model Folder {
  id        String   @id @default(cuid())
  name      String
  userId    String
  wordSets  WordSet[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model WordSet {
  // ... 기존 필드
  folder    Folder?  @relation(fields: [folderId], references: [id])
}
```

### v0.3.0 - 사용자 인증

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // 해시됨
  wordSets  WordSet[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model WordSet {
  // ... 기존 필드
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

---

**마지막 업데이트**: 2025-11-25
**SPEC 참조**: SPEC-WORDSET-001 (v0.1.0)
