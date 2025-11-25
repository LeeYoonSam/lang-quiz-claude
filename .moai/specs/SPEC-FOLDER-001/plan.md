---
id: SPEC-FOLDER-001
version: 0.1.0
status: draft
created: 2025-11-25
updated: 2025-11-25
---

# SPEC-FOLDER-001 구현 계획

> **관련 SPEC**: SPEC-WORDSET-001 (단어 세트 관리 시스템)
> **목표**: 단어 세트를 폴더로 그룹화하여 체계적인 관리 지원

---

## 목차

1. [개요](#개요)
2. [기술 아키텍처](#기술-아키텍처)
3. [구현 마일스톤](#구현-마일스톤)
4. [리스크 및 대응 방안](#리스크-및-대응-방안)
5. [품질 보증 전략](#품질-보증-전략)

---

## 개요

### 구현 목표

SPEC-WORDSET-001에서 준비한 `folderId` 필드를 활용하여 폴더 기능을 구현합니다. 사용자는 단어 세트를 폴더로 그룹화하여 학습 목적별로 체계적으로 관리할 수 있습니다.

### 핵심 기능

1. **폴더 CRUD**: 폴더 생성, 조회, 수정, 삭제
2. **단어 세트-폴더 연결**: 세트에 폴더 할당/제거
3. **폴더별 필터링**: 폴더별 세트 조회 및 루트 영역 관리
4. **통계 표시**: 폴더 내 세트 개수 실시간 표시
5. **안전한 삭제**: Nullify 정책으로 데이터 손실 방지

### 기술적 제약사항

- **DB 마이그레이션**: Folder 모델 추가, WordSet 관계 설정 (onDelete: SetNull)
- **API 확장**: 기존 wordsets API에 folderId 파라미터 추가
- **하위 호환성**: SPEC-WORDSET-001 기능 유지 (folderId=null 허용)
- **성능**: 폴더 목록 < 300ms, 필터링 < 500ms

---

## 기술 아키텍처

### 1. 데이터베이스 설계

#### Prisma 스키마 변경

**신규 모델**: Folder
```prisma
model Folder {
  id          String    @id @default(cuid())
  name        String
  description String?
  parentId    String?   // 향후 중첩 폴더 지원 (MVP 미사용)
  wordSets    WordSet[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([parentId])
}
```

**기존 모델 확장**: WordSet
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

**주요 변경**:
- `folder` 관계 추가
- `onDelete: SetNull` → 폴더 삭제 시 세트는 루트로 이동 (데이터 보존)

#### 마이그레이션 전략

1. **Phase 1**: Folder 모델 생성
   ```bash
   npx prisma migrate dev --name add_folder_model
   ```

2. **Phase 2**: WordSet 관계 설정
   ```bash
   npx prisma migrate dev --name add_wordset_folder_relation
   ```

3. **Phase 3**: 인덱스 최적화 검증
   ```sql
   EXPLAIN ANALYZE SELECT * FROM "WordSet" WHERE "folderId" = 'clx...';
   ```

### 2. API 설계

#### 신규 API 엔드포인트

| Method | Endpoint | 설명 | 응답 시간 목표 |
|--------|----------|------|---------------|
| POST | /api/folders | 폴더 생성 | < 300ms |
| GET | /api/folders | 폴더 목록 조회 (통계 포함) | < 300ms |
| GET | /api/folders/[id] | 폴더 상세 조회 | < 300ms |
| PUT | /api/folders/[id] | 폴더 수정 | < 300ms |
| DELETE | /api/folders/[id] | 폴더 삭제 (Nullify) | < 500ms |
| GET | /api/folders/[id]/wordsets | 폴더별 세트 조회 | < 500ms |

#### 기존 API 확장

**POST /api/wordsets** (folderId 추가)
```typescript
// 요청 타입
interface CreateWordSetRequest {
  name: string;
  description?: string;
  folderId?: string; // 신규 필드
}
```

**PUT /api/wordsets/[id]** (folderId 수정 지원)
```typescript
// 요청 타입
interface UpdateWordSetRequest {
  name?: string;
  description?: string;
  folderId?: string | null; // null → 루트로 이동
}
```

**GET /api/wordsets** (폴더 정보 포함)
```typescript
// 응답 타입
interface WordSetWithFolder {
  id: string;
  name: string;
  description?: string;
  folderId?: string;
  folder?: {
    id: string;
    name: string;
  };
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}
```

#### API 구현 패턴 (TDD)

**Example: DELETE /api/folders/[id]** (Nullify 정책)
```typescript
// @TEST-FOLDER-DELETE-NULLIFY
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 폴더에 속한 세트 개수 확인
    const folder = await prisma.folder.findUnique({
      where: { id: params.id },
      include: { _count: { select: { wordSets: true } } }
    });

    if (!folder) {
      return NextResponse.json(
        { error: "폴더를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 폴더 삭제 (onDelete: SetNull로 자동 Nullify)
    await prisma.folder.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: "폴더가 삭제되었습니다.",
      movedWordSets: folder._count.wordSets
    });
  } catch (error) {
    return NextResponse.json(
      { error: "폴더 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
```

### 3. 프론트엔드 아키텍처

#### 컴포넌트 구조

```
app/
├── folders/
│   ├── page.tsx                    # 폴더 목록 페이지 @UI-FOLDER-LIST
│   ├── [id]/
│   │   └── page.tsx                # 폴더 상세 페이지 @UI-FOLDER-DETAIL
│   └── components/
│       ├── FolderList.tsx          # 폴더 목록 컴포넌트
│       ├── FolderCard.tsx          # 폴더 카드
│       ├── FolderForm.tsx          # 폴더 생성/수정 폼 @UI-FOLDER-FORM
│       └── FolderSelector.tsx      # 폴더 선택 드롭다운 @UI-FOLDER-SELECTOR
├── wordsets/
│   └── components/
│       └── WordSetForm.tsx         # 확장: FolderSelector 포함
└── components/
    └── ui/
        └── FolderFilter.tsx        # 폴더 필터 탭 @UI-FOLDER-FILTER
```

#### 상태 관리 (TanStack Query)

**폴더 목록 쿼리**
```typescript
// @API-GET-FOLDERS
export function useFolders() {
  return useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const res = await fetch('/api/folders');
      if (!res.ok) throw new Error('폴더 목록 조회 실패');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
}
```

**폴더별 세트 쿼리**
```typescript
// @API-GET-FOLDERS-WORDSETS
export function useFolderWordSets(folderId: string | null) {
  return useQuery({
    queryKey: ['wordsets', { folderId }],
    queryFn: async () => {
      const url = folderId
        ? `/api/folders/${folderId}/wordsets`
        : `/api/wordsets?folderId=null`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('세트 조회 실패');
      return res.json();
    },
  });
}
```

**폴더 삭제 뮤테이션** (Nullify)
```typescript
// @TEST-FOLDER-DELETE-NULLIFY
export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folderId: string) => {
      const res = await fetch(`/api/folders/${folderId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('폴더 삭제 실패');
      return res.json();
    },
    onSuccess: (data) => {
      // 폴더 목록 무효화
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      // 루트 영역 세트 무효화 (이동된 세트 반영)
      queryClient.invalidateQueries({ queryKey: ['wordsets', { folderId: null }] });

      toast.success(
        `폴더가 삭제되었습니다. ${data.movedWordSets}개의 단어 세트가 루트로 이동되었습니다.`
      );
    },
  });
}
```

#### UI 컴포넌트 예시

**FolderSelector** (단어 세트 폼 내 폴더 선택)
```typescript
// @UI-FOLDER-SELECTOR
interface FolderSelectorProps {
  value: string | null;
  onChange: (folderId: string | null) => void;
}

export function FolderSelector({ value, onChange }: FolderSelectorProps) {
  const { data: folders, isLoading } = useFolders();

  return (
    <Select value={value ?? 'none'} onValueChange={(v) => onChange(v === 'none' ? null : v)}>
      <SelectTrigger>
        <SelectValue placeholder="폴더 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">없음 (루트 영역)</SelectItem>
        {folders?.map((folder) => (
          <SelectItem key={folder.id} value={folder.id}>
            {folder.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

---

## 구현 마일스톤

### Phase 1: 데이터베이스 및 기본 API (우선순위: 높음)

**목표**: Folder 모델 추가 및 CRUD API 구현

**작업 항목**:
- ✅ Prisma 스키마 확장 (Folder 모델, WordSet 관계)
- ✅ 데이터베이스 마이그레이션 실행
- ✅ POST /api/folders (폴더 생성) @API-POST-FOLDERS
- ✅ GET /api/folders (폴더 목록 조회, 통계 포함) @API-GET-FOLDERS
- ✅ GET /api/folders/[id] (폴더 상세 조회) @API-GET-FOLDER-DETAIL
- ✅ PUT /api/folders/[id] (폴더 수정) @API-PUT-FOLDERS
- ✅ DELETE /api/folders/[id] (Nullify 정책 구현) @API-DELETE-FOLDERS
- ✅ 단위 테스트 작성 (API 핸들러) @TEST-FOLDER-CREATE, @TEST-FOLDER-DELETE-NULLIFY

**완료 조건**:
- Prisma Studio에서 Folder 모델 확인 가능
- Postman/curl로 모든 API 엔드포인트 정상 동작 확인
- 폴더 삭제 시 세트의 folderId가 null로 변경됨 검증
- 단위 테스트 커버리지 90% 이상

### Phase 2: 단어 세트-폴더 연결 API (우선순위: 높음)

**목표**: 단어 세트 API 확장 및 폴더 할당 기능 구현

**작업 항목**:
- ✅ POST /api/wordsets (folderId 파라미터 추가)
- ✅ PUT /api/wordsets/[id] (folderId 수정 지원)
- ✅ GET /api/wordsets (폴더 정보 포함)
- ✅ GET /api/folders/[id]/wordsets (폴더별 세트 조회) @API-GET-FOLDERS-WORDSETS
- ✅ 단위 테스트 작성 @TEST-WORDSET-FOLDER-ASSIGN, @TEST-WORDSET-FOLDER-REMOVE

**완료 조건**:
- 단어 세트 생성 시 폴더 지정 가능
- 단어 세트 수정 시 폴더 변경/제거 가능
- 기존 SPEC-WORDSET-001 테스트 통과 (하위 호환성)
- 단위 테스트 커버리지 90% 이상

### Phase 3: 프론트엔드 UI 구현 (우선순위: 중간)

**목표**: 폴더 관리 UI 및 단어 세트 연결 UI 구현

**작업 항목**:
- ✅ FolderList 컴포넌트 @UI-FOLDER-LIST
- ✅ FolderCard 컴포넌트 (통계 표시)
- ✅ FolderForm 컴포넌트 @UI-FOLDER-FORM
- ✅ FolderDetail 페이지 @UI-FOLDER-DETAIL
- ✅ FolderSelector 컴포넌트 @UI-FOLDER-SELECTOR
- ✅ WordSetForm 확장 (FolderSelector 포함)
- ✅ FolderFilter 컴포넌트 @UI-FOLDER-FILTER
- ✅ TanStack Query 훅 구현 (useFolders, useFolderWordSets, etc.)
- ✅ React Testing Library 단위 테스트

**완료 조건**:
- 폴더 CRUD UI 정상 동작
- 단어 세트 생성/수정 시 폴더 선택 가능
- 폴더별 필터링 UI 동작
- 컴포넌트 단위 테스트 커버리지 85% 이상

### Phase 4: E2E 테스트 및 통합 검증 (우선순위: 높음)

**목표**: 전체 사용자 시나리오 E2E 테스트 작성

**작업 항목**:
- ✅ Playwright E2E 테스트: 폴더 CRUD 플로우
- ✅ E2E 테스트: 단어 세트-폴더 연결 플로우
- ✅ E2E 테스트: 폴더 삭제 및 Nullify 검증
- ✅ E2E 테스트: 폴더별 필터링
- ✅ E2E 테스트: 기존 SPEC-WORDSET-001 회귀 테스트
- ✅ 성능 테스트 (폴더 목록 < 300ms, 필터링 < 500ms)

**완료 조건**:
- 모든 E2E 테스트 통과
- 기존 SPEC-WORDSET-001 기능 정상 동작 (회귀 없음)
- 성능 기준 충족
- E2E 커버리지: 주요 시나리오 100%

### Phase 5: 문서화 및 최종 검토 (우선순위: 중간)

**목표**: 코드 문서화 및 품질 게이트 통과

**작업 항목**:
- ✅ API 문서 업데이트 (Swagger/OpenAPI 고려)
- ✅ README 업데이트 (폴더 기능 설명)
- ✅ 코드 리뷰 및 리팩토링
- ✅ TRUST 5 품질 게이트 검증
- ✅ SPEC-FOLDER-001 상태를 draft → completed로 업데이트

**완료 조건**:
- 모든 문서 업데이트 완료
- TRUST 5 기준 충족 (Test-first, Readable, Unified, Secured, Trackable)
- 테스트 커버리지 90% 이상
- 코드 리뷰 승인

---

## 리스크 및 대응 방안

### 1. 기존 데이터 마이그레이션 리스크

**리스크**: SPEC-WORDSET-001로 생성된 기존 단어 세트(folderId=null)가 폴더 기능 추가 후 정상 동작하지 않을 가능성

**대응 방안**:
- **Null 허용 설계**: `folderId String?` 유지, 루트 영역 개념 도입
- **마이그레이션 검증**: 기존 데이터 백업 후 마이그레이션 실행, 롤백 계획 수립
- **회귀 테스트**: SPEC-WORDSET-001 E2E 테스트 재실행으로 하위 호환성 검증

### 2. Nullify 정책 구현 복잡도

**리스크**: Prisma의 `onDelete: SetNull` 동작이 예상과 다를 가능성

**대응 방안**:
- **단위 테스트**: 폴더 삭제 시 세트의 folderId가 null로 변경되는지 검증
- **통합 테스트**: 실제 DB에서 CASCADE/Nullify 동작 확인
- **수동 검증**: Prisma Studio로 삭제 후 데이터 상태 직접 확인

### 3. 성능 저하 리스크

**리스크**: 폴더 목록 조회 시 통계 계산(_count)으로 인한 성능 저하

**대응 방안**:
- **인덱스 최적화**: `@@index([folderId])` 활용, EXPLAIN ANALYZE로 쿼리 최적화
- **캐싱**: TanStack Query의 staleTime 설정으로 불필요한 재조회 방지
- **페이지네이션**: 폴더 개수가 많아질 경우 향후 페이지네이션 추가 고려

### 4. UI/UX 복잡도 증가

**리스크**: 폴더 기능 추가로 단어 세트 관리 UI가 복잡해질 가능성

**대응 방안**:
- **직관적인 디자인**: 파일 시스템과 유사한 폴더 구조 적용 (사용자 친숙도)
- **빈 상태 처리**: "폴더를 만들어보세요" 안내 메시지로 온보딩 개선
- **사용자 피드백**: 베타 테스트를 통해 UI/UX 개선점 수집

---

## 품질 보증 전략

### 1. TDD (Test-Driven Development)

**RED-GREEN-REFACTOR 사이클 적용**:
- **RED**: 실패하는 테스트 먼저 작성
- **GREEN**: 최소한의 코드로 테스트 통과
- **REFACTOR**: 코드 품질 개선 (중복 제거, 가독성 향상)

**테스트 작성 순서**:
1. API 단위 테스트 (Jest)
2. 컴포넌트 단위 테스트 (React Testing Library)
3. E2E 통합 테스트 (Playwright)

### 2. TRUST 5 품질 기준

| 기준 | 적용 방안 |
|-----|----------|
| **Test-first** | TDD 사이클로 모든 기능 구현, 테스트 커버리지 90% 이상 |
| **Readable** | 명확한 변수명, JSDoc 주석, 컴포넌트 Props 타입 문서화 |
| **Unified** | Prettier/ESLint로 코드 스타일 통일, PR 리뷰로 일관성 검증 |
| **Secured** | 입력 검증 (Zod), SQL 인젝션 방지 (Prisma ORM), XSS 방지 |
| **Trackable** | TAG 체계로 요구사항-구현 추적, Git 커밋 메시지에 TAG 포함 |

### 3. 테스트 커버리지 목표

- **단위 테스트**: 90% 이상 (API, 비즈니스 로직)
- **통합 테스트**: 주요 API 엔드포인트 100%
- **E2E 테스트**: 핵심 사용자 시나리오 100%

**커버리지 확인 명령**:
```bash
npm run test:coverage
```

### 4. 성능 모니터링

**API 응답 시간 측정**:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next();
  const duration = Date.now() - start;

  console.log(`[${request.method}] ${request.url} - ${duration}ms`);
  return response;
}
```

**성능 기준**:
- 폴더 목록 조회: < 300ms
- 폴더별 세트 조회: < 500ms

---

## 다음 단계

### SPEC 승인 후 실행할 명령

```bash
# 1. SPEC 승인 확인
# Albert님의 최종 확인 후 status를 draft → approved로 변경

# 2. TDD 구현 시작
/moai:2-run SPEC-FOLDER-001

# 3. 구현 완료 후 문서화
/moai:3-sync SPEC-FOLDER-001
```

### 예상 구현 범위

- **Phase 1-2**: Backend API 및 데이터베이스 (핵심)
- **Phase 3**: Frontend UI (사용자 경험)
- **Phase 4**: E2E 테스트 (품질 검증)
- **Phase 5**: 문서화 및 최종 검토

---

**END OF PLAN**
