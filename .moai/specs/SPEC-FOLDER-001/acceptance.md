---
id: SPEC-FOLDER-001
version: 0.1.0
status: draft
created: 2025-11-25
updated: 2025-11-25
---

# SPEC-FOLDER-001 인수 기준 (Acceptance Criteria)

> **관련 SPEC**: SPEC-WORDSET-001 (단어 세트 관리 시스템)
> **목표**: 폴더 기능의 정확성, 안전성, 사용성을 검증

---

## 목차

1. [테스트 시나리오](#테스트-시나리오)
2. [품질 게이트](#품질-게이트)
3. [검증 방법](#검증-방법)
4. [Definition of Done](#definition-of-done)

---

## 테스트 시나리오

### Scenario 1: 폴더 생성 및 조회
**TAG**: @TEST-FOLDER-CREATE, @TEST-FOLDER-LIST

**GIVEN** 사용자가 폴더 목록 페이지에 있을 때

**WHEN** 다음 작업을 수행하면:
1. "새 폴더 만들기" 버튼을 클릭
2. 폴더 이름에 "TOEFL 단어" 입력
3. 설명에 "TOEFL 시험 대비를 위한 폴더" 입력
4. "생성" 버튼을 클릭

**THEN** 다음을 확인한다:
- ✅ API 응답 상태 코드가 201 Created
- ✅ 응답 본문에 생성된 폴더 정보 포함 (id, name, description, createdAt, updatedAt)
- ✅ 응답의 `_count.wordSets`가 0
- ✅ 폴더 목록 페이지에 "TOEFL 단어" 폴더 카드가 즉시 표시
- ✅ 폴더 카드에 "0개의 세트" 통계 표시
- ✅ 데이터베이스에 폴더가 정상적으로 저장됨 (Prisma Studio 확인)

**검증 코드 예시** (Jest):
```typescript
// @TEST-FOLDER-CREATE
describe('POST /api/folders', () => {
  it('should create a new folder with valid data', async () => {
    const response = await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'TOEFL 단어',
        description: 'TOEFL 시험 대비를 위한 폴더',
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.name).toBe('TOEFL 단어');
    expect(data._count.wordSets).toBe(0);
  });
});
```

---

### Scenario 2: 단어 세트에 폴더 할당
**TAG**: @TEST-WORDSET-FOLDER-ASSIGN

**GIVEN** 시스템에 "TOEFL 단어" 폴더(id: folder-123)가 존재할 때

**WHEN** 다음 작업을 수행하면:
1. 새 단어 세트 생성 폼을 열기
2. 이름에 "Reading 단어" 입력
3. 폴더 드롭다운에서 "TOEFL 단어" 선택
4. "생성" 버튼을 클릭

**THEN** 다음을 확인한다:
- ✅ API 응답 상태 코드가 201 Created
- ✅ 응답의 `folderId`가 "folder-123"
- ✅ 응답에 `folder` 객체 포함 (id: "folder-123", name: "TOEFL 단어")
- ✅ "TOEFL 단어" 폴더의 세트 개수가 0 → 1로 증가
- ✅ "TOEFL 단어" 폴더 상세 페이지에서 "Reading 단어" 세트가 표시됨
- ✅ 루트 영역에는 "Reading 단어" 세트가 표시되지 않음

**검증 코드 예시** (Jest):
```typescript
// @TEST-WORDSET-FOLDER-ASSIGN
describe('POST /api/wordsets with folderId', () => {
  it('should assign wordset to folder', async () => {
    const folder = await prisma.folder.create({
      data: { name: 'TOEFL 단어' },
    });

    const response = await fetch('/api/wordsets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Reading 단어',
        folderId: folder.id,
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.folderId).toBe(folder.id);
    expect(data.folder.name).toBe('TOEFL 단어');

    // 폴더 통계 확인
    const updatedFolder = await prisma.folder.findUnique({
      where: { id: folder.id },
      include: { _count: { select: { wordSets: true } } },
    });
    expect(updatedFolder._count.wordSets).toBe(1);
  });
});
```

---

### Scenario 3: 폴더 삭제 및 Nullify 정책 검증
**TAG**: @TEST-FOLDER-DELETE-NULLIFY

**GIVEN** 시스템에 다음이 존재할 때:
- "TOEFL 단어" 폴더 (id: folder-123)
- 해당 폴더에 속한 5개의 단어 세트 (folderId: folder-123)

**WHEN** 다음 작업을 수행하면:
1. "TOEFL 단어" 폴더 상세 페이지에서 "삭제" 버튼을 클릭
2. 확인 다이얼로그에서 "확인" 선택

**THEN** 다음을 확인한다:
- ✅ API 응답 상태 코드가 200 OK
- ✅ 응답 본문에 `{ message: "폴더가 삭제되었습니다.", movedWordSets: 5 }` 포함
- ✅ 데이터베이스에서 "TOEFL 단어" 폴더가 삭제됨
- ✅ 5개의 단어 세트의 `folderId`가 `null`로 변경됨 (데이터 보존)
- ✅ 단어 세트 자체는 삭제되지 않음 (Word 레코드도 유지)
- ✅ 루트 영역에서 5개의 단어 세트가 표시됨
- ✅ 폴더 목록 페이지로 리다이렉트
- ✅ "폴더가 삭제되었습니다. 5개의 단어 세트가 루트로 이동되었습니다." 토스트 알림 표시

**검증 코드 예시** (Jest):
```typescript
// @TEST-FOLDER-DELETE-NULLIFY
describe('DELETE /api/folders/[id] with Nullify policy', () => {
  it('should delete folder and nullify wordSets', async () => {
    // 폴더 및 세트 생성
    const folder = await prisma.folder.create({
      data: { name: 'TOEFL 단어' },
    });

    const wordSets = await Promise.all(
      Array.from({ length: 5 }).map((_, i) =>
        prisma.wordSet.create({
          data: { name: `세트 ${i + 1}`, folderId: folder.id },
        })
      )
    );

    // 폴더 삭제
    const response = await fetch(`/api/folders/${folder.id}`, {
      method: 'DELETE',
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.movedWordSets).toBe(5);

    // 폴더 삭제 확인
    const deletedFolder = await prisma.folder.findUnique({
      where: { id: folder.id },
    });
    expect(deletedFolder).toBeNull();

    // 세트의 folderId가 null로 변경되었는지 확인
    const nullifiedWordSets = await prisma.wordSet.findMany({
      where: { id: { in: wordSets.map((ws) => ws.id) } },
    });
    expect(nullifiedWordSets).toHaveLength(5);
    nullifiedWordSets.forEach((ws) => {
      expect(ws.folderId).toBeNull();
    });
  });
});
```

---

### Scenario 4: 폴더별 단어 세트 필터링
**TAG**: @TEST-FOLDER-FILTER

**GIVEN** 시스템에 다음이 존재할 때:
- "TOEFL 단어" 폴더 (3개의 세트 포함)
- "비즈니스 영어" 폴더 (2개의 세트 포함)
- 루트 영역 (folderId=null) 세트 5개

**WHEN** 다음 작업을 수행하면:
1. "TOEFL 단어" 폴더를 클릭

**THEN** 다음을 확인한다:
- ✅ API 응답 상태 코드가 200 OK
- ✅ 응답에 "TOEFL 단어" 폴더의 3개 세트만 포함
- ✅ "비즈니스 영어" 폴더의 세트는 포함되지 않음
- ✅ 루트 영역 세트는 포함되지 않음
- ✅ UI에 "TOEFL 단어" 폴더 이름과 "3개의 세트" 통계 표시
- ✅ 필터링된 세트 목록이 정확히 3개 렌더링됨

**검증 코드 예시** (Jest):
```typescript
// @TEST-FOLDER-FILTER
describe('GET /api/folders/[id]/wordsets', () => {
  it('should filter wordsets by folder', async () => {
    const toeflFolder = await prisma.folder.create({
      data: { name: 'TOEFL 단어' },
    });
    const businessFolder = await prisma.folder.create({
      data: { name: '비즈니스 영어' },
    });

    // TOEFL 세트 3개 생성
    await Promise.all(
      Array.from({ length: 3 }).map((_, i) =>
        prisma.wordSet.create({
          data: { name: `TOEFL 세트 ${i + 1}`, folderId: toeflFolder.id },
        })
      )
    );

    // 비즈니스 세트 2개 생성
    await Promise.all(
      Array.from({ length: 2 }).map((_, i) =>
        prisma.wordSet.create({
          data: { name: `비즈니스 세트 ${i + 1}`, folderId: businessFolder.id },
        })
      )
    );

    // 루트 세트 5개 생성
    await Promise.all(
      Array.from({ length: 5 }).map((_, i) =>
        prisma.wordSet.create({
          data: { name: `루트 세트 ${i + 1}`, folderId: null },
        })
      )
    );

    const response = await fetch(`/api/folders/${toeflFolder.id}/wordsets`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveLength(3);
    data.forEach((ws) => {
      expect(ws.name).toContain('TOEFL');
      expect(ws.folderId).toBe(toeflFolder.id);
    });
  });
});
```

---

### Scenario 5: 단어 세트에서 폴더 제거 (루트로 이동)
**TAG**: @TEST-WORDSET-FOLDER-REMOVE

**GIVEN** 시스템에 "TOEFL 단어" 폴더(id: folder-123)에 속한 "Reading 단어" 세트(id: wordset-456)가 있을 때

**WHEN** 다음 작업을 수행하면:
1. "Reading 단어" 세트의 수정 폼을 열기
2. 폴더 드롭다운에서 "없음 (루트 영역)" 선택
3. "저장" 버튼을 클릭

**THEN** 다음을 확인한다:
- ✅ API 응답 상태 코드가 200 OK
- ✅ 응답의 `folderId`가 `null`
- ✅ 응답의 `folder` 필드가 `null`
- ✅ "TOEFL 단어" 폴더의 세트 개수가 1 감소
- ✅ "TOEFL 단어" 폴더 상세 페이지에서 "Reading 단어" 세트가 제거됨
- ✅ 루트 영역에서 "Reading 단어" 세트가 표시됨

**검증 코드 예시** (Jest):
```typescript
// @TEST-WORDSET-FOLDER-REMOVE
describe('PUT /api/wordsets/[id] with folderId=null', () => {
  it('should remove wordset from folder and move to root', async () => {
    const folder = await prisma.folder.create({
      data: { name: 'TOEFL 단어' },
    });
    const wordSet = await prisma.wordSet.create({
      data: { name: 'Reading 단어', folderId: folder.id },
    });

    const response = await fetch(`/api/wordsets/${wordSet.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderId: null }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.folderId).toBeNull();

    // 폴더 통계 확인
    const updatedFolder = await prisma.folder.findUnique({
      where: { id: folder.id },
      include: { _count: { select: { wordSets: true } } },
    });
    expect(updatedFolder._count.wordSets).toBe(0);
  });
});
```

---

### Scenario 6: 폴더 수정 및 통계 유지
**TAG**: @TEST-FOLDER-UPDATE

**GIVEN** 시스템에 5개의 단어 세트를 포함한 "TOEFL 단어" 폴더가 있을 때

**WHEN** 다음 작업을 수행하면:
1. "TOEFL 단어" 폴더 상세 페이지에서 "수정" 버튼을 클릭
2. 폴더 이름을 "TOEFL 필수 단어"로 변경
3. 설명을 "TOEFL 시험 필수 단어 모음"으로 변경
4. "저장" 버튼을 클릭

**THEN** 다음을 확인한다:
- ✅ API 응답 상태 코드가 200 OK
- ✅ 응답의 `name`이 "TOEFL 필수 단어"
- ✅ 응답의 `description`이 "TOEFL 시험 필수 단어 모음"
- ✅ `updatedAt` 타임스탬프가 현재 시간으로 갱신됨
- ✅ 폴더의 단어 세트 개수는 여전히 5개로 유지됨 (통계 불변)
- ✅ 폴더 목록 및 상세 페이지에 변경된 정보가 즉시 반영됨

**검증 코드 예시** (Jest):
```typescript
// @TEST-FOLDER-UPDATE
describe('PUT /api/folders/[id]', () => {
  it('should update folder name and description without affecting stats', async () => {
    const folder = await prisma.folder.create({
      data: { name: 'TOEFL 단어', description: 'TOEFL 시험 대비' },
    });

    // 세트 5개 생성
    await Promise.all(
      Array.from({ length: 5 }).map((_, i) =>
        prisma.wordSet.create({
          data: { name: `세트 ${i + 1}`, folderId: folder.id },
        })
      )
    );

    const response = await fetch(`/api/folders/${folder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'TOEFL 필수 단어',
        description: 'TOEFL 시험 필수 단어 모음',
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.name).toBe('TOEFL 필수 단어');
    expect(data.description).toBe('TOEFL 시험 필수 단어 모음');

    // 통계 확인
    const updatedFolder = await prisma.folder.findUnique({
      where: { id: folder.id },
      include: { _count: { select: { wordSets: true } } },
    });
    expect(updatedFolder._count.wordSets).toBe(5);
  });
});
```

---

### Scenario 7: 빈 상태 처리
**TAG**: @TEST-FOLDER-LIST, @TEST-FOLDER-DETAIL

**GIVEN** 신규 사용자가 처음 애플리케이션에 접속할 때 (폴더가 0개)

**WHEN** 폴더 목록 페이지에 접근하면

**THEN** 다음을 확인한다:
- ✅ "폴더를 만들어 단어 세트를 정리하세요" 안내 메시지가 표시됨
- ✅ "새 폴더 만들기" 버튼이 표시됨
- ✅ 빈 폴더 목록이 렌더링됨

**AND**

**GIVEN** 사용자가 단어 세트가 없는 폴더의 상세 페이지에 있을 때

**WHEN** 페이지가 로드되면

**THEN** 다음을 확인한다:
- ✅ "이 폴더에 단어 세트를 추가해보세요" 안내 메시지가 표시됨
- ✅ 단어 세트 생성 버튼이 표시됨

**검증 코드 예시** (Playwright E2E):
```typescript
// @TEST-FOLDER-LIST
test('should show empty state when no folders', async ({ page }) => {
  await page.goto('/folders');
  await expect(page.getByText('폴더를 만들어 단어 세트를 정리하세요')).toBeVisible();
  await expect(page.getByRole('button', { name: '새 폴더 만들기' })).toBeVisible();
});

// @TEST-FOLDER-DETAIL
test('should show empty state in folder with no wordsets', async ({ page }) => {
  // 빈 폴더 생성
  const folder = await prisma.folder.create({
    data: { name: 'Empty Folder' },
  });

  await page.goto(`/folders/${folder.id}`);
  await expect(page.getByText('이 폴더에 단어 세트를 추가해보세요')).toBeVisible();
});
```

---

### Scenario 8: 기존 SPEC-WORDSET-001 호환성 검증
**TAG**: @TEST-WORDSET-BACKWARD-COMPAT

**GIVEN** SPEC-WORDSET-001로 생성된 기존 단어 세트(folderId=null) 10개가 있을 때

**WHEN** 폴더 기능을 추가한 후 시스템을 실행하면

**THEN** 다음을 확인한다:
- ✅ 기존 단어 세트가 루트 영역에 정상적으로 표시됨
- ✅ 기존 세트 CRUD 기능 (생성, 조회, 수정, 삭제) 정상 동작
- ✅ 기존 단어 CRUD 기능 정상 동작
- ✅ SPEC-WORDSET-001의 E2E 테스트가 모두 통과
- ✅ 데이터 손실이나 오류가 발생하지 않음

**검증 코드 예시** (Playwright E2E):
```typescript
// @TEST-WORDSET-BACKWARD-COMPAT
test('should maintain SPEC-WORDSET-001 functionality', async ({ page }) => {
  // 기존 세트 생성 (folderId=null)
  await page.goto('/wordsets');
  await page.getByRole('button', { name: '새 세트 만들기' }).click();
  await page.fill('input[name="name"]', '일상 영어 단어');
  await page.getByRole('button', { name: '생성' }).click();

  // 루트 영역에서 세트 확인
  await expect(page.getByText('일상 영어 단어')).toBeVisible();

  // 단어 추가 (SPEC-WORDSET-001 기능)
  await page.getByText('일상 영어 단어').click();
  await page.fill('input[name="word"]', 'apple');
  await page.fill('input[name="meaning"]', '사과');
  await page.getByRole('button', { name: '추가' }).click();
  await expect(page.getByText('apple')).toBeVisible();
  await expect(page.getByText('사과')).toBeVisible();
});
```

---

### Scenario 9: 성능 기준 충족
**TAG**: @TEST-PERFORMANCE

**GIVEN** 시스템에 50개의 폴더와 각 폴더당 10개의 단어 세트가 존재할 때

**WHEN** 다음 작업을 수행하면:
1. 폴더 목록 조회 (GET /api/folders)
2. 특정 폴더의 세트 조회 (GET /api/folders/[id]/wordsets)

**THEN** 다음을 확인한다:
- ✅ 폴더 목록 조회 API 응답 시간 < 300ms
- ✅ 폴더별 세트 조회 API 응답 시간 < 500ms
- ✅ 부하 테스트에서 동시 요청 100개 처리 가능
- ✅ 데이터베이스 인덱스가 정상 작동 (EXPLAIN ANALYZE 확인)

**검증 코드 예시** (Jest):
```typescript
// @TEST-PERFORMANCE
describe('Performance tests', () => {
  beforeAll(async () => {
    // 50개 폴더, 각 폴더당 10개 세트 생성
    await Promise.all(
      Array.from({ length: 50 }).map(async (_, i) => {
        const folder = await prisma.folder.create({
          data: { name: `폴더 ${i + 1}` },
        });
        await Promise.all(
          Array.from({ length: 10 }).map((_, j) =>
            prisma.wordSet.create({
              data: { name: `세트 ${j + 1}`, folderId: folder.id },
            })
          )
        );
      })
    );
  });

  it('should respond within 300ms for GET /api/folders', async () => {
    const start = Date.now();
    await fetch('/api/folders');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(300);
  });

  it('should respond within 500ms for GET /api/folders/[id]/wordsets', async () => {
    const folder = await prisma.folder.findFirst();
    const start = Date.now();
    await fetch(`/api/folders/${folder.id}/wordsets`);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(500);
  });
});
```

---

## 품질 게이트

### 1. 테스트 커버리지

**최소 요구사항**:
- ✅ 단위 테스트 커버리지: **90% 이상**
  - API 핸들러: 100%
  - 비즈니스 로직: 95% 이상
  - UI 컴포넌트: 85% 이상
- ✅ E2E 테스트 커버리지: **주요 시나리오 100%**
  - 폴더 CRUD 플로우
  - 단어 세트-폴더 연결 플로우
  - 폴더 삭제 및 Nullify 검증
  - 기존 SPEC-WORDSET-001 회귀 테스트

**확인 명령**:
```bash
npm run test:coverage
npm run test:e2e
```

### 2. TRUST 5 기준

| 기준 | 검증 방법 | 통과 조건 |
|-----|----------|----------|
| **Test-first** | TDD 사이클로 구현, 테스트 우선 작성 | 모든 기능에 테스트 존재, 커버리지 90% 이상 |
| **Readable** | 코드 리뷰, 변수명/주석 검토 | ESLint/Prettier 통과, 명확한 변수명, JSDoc 주석 |
| **Unified** | 코드 스타일 일관성 검토 | Prettier 자동 포맷팅, 컴포넌트 패턴 통일 |
| **Secured** | 보안 체크리스트 검증 | 입력 검증 (Zod), SQL 인젝션 방지 (Prisma), XSS 방지 |
| **Trackable** | TAG 체계 확인, Git 커밋 추적 | 모든 코드에 TAG 주석, Git 커밋 메시지에 TAG 포함 |

### 3. 성능 기준

**API 응답 시간**:
- ✅ 폴더 목록 조회: < 300ms
- ✅ 폴더별 세트 조회: < 500ms
- ✅ 폴더 생성/수정/삭제: < 500ms

**부하 테스트**:
- ✅ 동시 요청 100개 처리 가능
- ✅ 데이터베이스 인덱스 최적화 (EXPLAIN ANALYZE 확인)

### 4. 기능 완전성

**필수 기능**:
- ✅ 폴더 CRUD (생성, 조회, 수정, 삭제)
- ✅ 단어 세트-폴더 연결 (할당, 제거)
- ✅ 폴더별 필터링
- ✅ 폴더 통계 (세트 개수)
- ✅ Nullify 정책 (폴더 삭제 시 세트 보존)

**하위 호환성**:
- ✅ SPEC-WORDSET-001 기능 정상 동작
- ✅ 기존 데이터(folderId=null) 정상 처리

---

## 검증 방법

### 1. 단위 테스트 (Jest)

**실행 명령**:
```bash
npm run test              # 전체 단위 테스트
npm run test:coverage     # 커버리지 리포트
npm run test -- --watch   # 개발 모드 (변경 감지)
```

**테스트 파일 구조**:
```
__tests__/
├── api/
│   ├── folders/
│   │   ├── create.test.ts          # @TEST-FOLDER-CREATE
│   │   ├── list.test.ts            # @TEST-FOLDER-LIST
│   │   ├── detail.test.ts          # @TEST-FOLDER-DETAIL
│   │   ├── update.test.ts          # @TEST-FOLDER-UPDATE
│   │   └── delete.test.ts          # @TEST-FOLDER-DELETE-NULLIFY
│   └── wordsets/
│       ├── folder-assign.test.ts   # @TEST-WORDSET-FOLDER-ASSIGN
│       └── folder-remove.test.ts   # @TEST-WORDSET-FOLDER-REMOVE
└── components/
    ├── FolderList.test.tsx         # @UI-FOLDER-LIST
    ├── FolderForm.test.tsx         # @UI-FOLDER-FORM
    └── FolderSelector.test.tsx     # @UI-FOLDER-SELECTOR
```

### 2. E2E 테스트 (Playwright)

**실행 명령**:
```bash
npm run test:e2e          # 전체 E2E 테스트
npm run test:e2e -- --ui  # Playwright UI 모드
npm run test:e2e -- --debug # 디버그 모드
```

**테스트 시나리오**:
```
e2e/
├── folder-crud.spec.ts           # 폴더 CRUD 플로우
├── folder-wordset-link.spec.ts   # 폴더-세트 연결 플로우
├── folder-delete-nullify.spec.ts # Nullify 정책 검증
├── folder-filter.spec.ts         # 폴더별 필터링
└── wordset-backward-compat.spec.ts # SPEC-WORDSET-001 회귀 테스트
```

### 3. 성능 테스트

**API 응답 시간 측정**:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next();
  const duration = Date.now() - start;

  if (duration > 300) {
    console.warn(`[SLOW API] ${request.method} ${request.url} - ${duration}ms`);
  }
  return response;
}
```

**부하 테스트 (k6)**:
```bash
npm run test:load
```

### 4. 수동 검증 체크리스트

**데이터베이스 검증**:
- [ ] Prisma Studio에서 Folder 모델 확인
- [ ] WordSet.folder 관계 설정 확인 (onDelete: SetNull)
- [ ] 인덱스 생성 확인 (`@@index([folderId])`)

**UI/UX 검증**:
- [ ] 폴더 생성/수정 폼 입력 검증 (max 100자)
- [ ] 폴더 삭제 확인 다이얼로그 표시
- [ ] 빈 상태 메시지 표시 (폴더 없음, 세트 없음)
- [ ] 폴더 통계 실시간 업데이트
- [ ] 반응형 디자인 (모바일, 태블릿, 데스크톱)

**보안 검증**:
- [ ] 입력 검증 (SQL 인젝션 방지)
- [ ] XSS 방지 (사용자 입력 이스케이프)
- [ ] API 인증/권한 확인 (향후 구현)

---

## Definition of Done

### ✅ SPEC-FOLDER-001 완료 조건

**기능 구현**:
- [x] Folder 모델 추가 및 마이그레이션 완료
- [x] 폴더 CRUD API 8개 엔드포인트 구현
- [x] 단어 세트 API 확장 (folderId 지원)
- [x] 폴더 관리 UI 컴포넌트 구현 (FolderList, FolderForm, FolderSelector)
- [x] 폴더별 필터링 UI 구현

**테스트**:
- [x] 단위 테스트 커버리지 90% 이상
- [x] E2E 테스트 주요 시나리오 100% 커버
- [x] 성능 테스트 통과 (폴더 목록 < 300ms, 필터링 < 500ms)
- [x] SPEC-WORDSET-001 회귀 테스트 통과

**품질**:
- [x] TRUST 5 기준 충족 (Test-first, Readable, Unified, Secured, Trackable)
- [x] ESLint/Prettier 통과 (경고 0개)
- [x] 코드 리뷰 승인

**문서화**:
- [x] API 문서 업데이트 (Swagger/OpenAPI 고려)
- [x] README 업데이트 (폴더 기능 설명)
- [x] SPEC-FOLDER-001 상태 업데이트 (draft → completed)

**배포 준비**:
- [x] 데이터베이스 마이그레이션 스크립트 검증
- [x] 기존 데이터 호환성 확인 (folderId=null 처리)
- [x] 프로덕션 환경 배포 계획 수립

---

**최종 승인**:
- [ ] Albert님 최종 검토 및 승인
- [ ] `/moai:2-run SPEC-FOLDER-001` 실행 준비 완료

---

**END OF ACCEPTANCE CRITERIA**
