---
title: TAG 매핑 및 요구사항 추적성
description: SPEC 요구사항에서 구현, 테스트까지의 전체 추적성 맵
version: 1.0.0
spec: SPEC-WORDSET-001, SPEC-FOLDER-001
lastUpdated: 2025-11-25
maintainer: "@user"
---

# TAG 매핑 및 요구사항 추적성

**Word Set Management System**의 모든 SPEC 요구사항과 구현, 테스트 간의 추적성을 문서화합니다.

이 문서는 다음을 추적합니다:
- **SPEC 요구사항** (FR, NFR, AC)
- **API 구현** (엔드포인트)
- **UI 컴포넌트** (페이지, 컴포넌트)
- **테스트 커버리지** (단위, E2E)
- **문서 참조** (API 문서, 가이드)

---

## SPEC-WORDSET-001: 단어 세트 관리 (v0.1.0)

### 요구사항 → 구현 매핑

#### FR-1: 단어 세트 생성

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-1 | SPEC-WORDSET-001 | [SPEC](../specs/SPEC-WORDSET-001/spec.md) |
| **API** | @API-POST-WORDSETS | `POST /api/wordsets` | [API_REFERENCE.md](./API_REFERENCE.md#1-단어-세트-생성) |
| **UI 컴포넌트** | @UI-WORDSET-FORM | `WordSetForm` | - |
| **UI 페이지** | @PAGE-WORDSETS-NEW | `/wordsets/new` | - |
| **단위 테스트** | @TEST-WORDSET-CREATE | `__tests__/api/wordsets.test.ts` | - |
| **E2E 테스트** | @E2E-WORDSET-CREATE | `e2e/wordsets.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.1.0 |

#### FR-2: 단어 세트 목록 조회

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-2 | SPEC-WORDSET-001 | [SPEC](../specs/SPEC-WORDSET-001/spec.md) |
| **API** | @API-GET-WORDSETS | `GET /api/wordsets` | [API_REFERENCE.md](./API_REFERENCE.md#2-단어-세트-목록-조회) |
| **UI 컴포넌트** | @UI-WORDSET-LIST | `WordSetList` | - |
| **UI 페이지** | @PAGE-WORDSETS | `/wordsets` | - |
| **단위 테스트** | @TEST-WORDSET-LIST | `__tests__/api/wordsets.test.ts` | - |
| **E2E 테스트** | @E2E-WORDSET-LIST | `e2e/wordsets.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.1.0 |

#### FR-3: 단어 세트 상세 조회

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-3 | SPEC-WORDSET-001 | [SPEC](../specs/SPEC-WORDSET-001/spec.md) |
| **API** | @API-GET-WORDSET-DETAIL | `GET /api/wordsets/[id]` | [API_REFERENCE.md](./API_REFERENCE.md#3-단어-세트-상세-조회) |
| **UI 컴포넌트** | @UI-WORDSET-DETAIL | `WordSetDetail` | - |
| **UI 페이지** | @PAGE-WORDSET-DETAIL | `/wordsets/[id]` | - |
| **단위 테스트** | @TEST-WORDSET-DETAIL | `__tests__/api/wordsets.test.ts` | - |
| **E2E 테스트** | @E2E-WORDSET-DETAIL | `e2e/wordsets.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.1.0 |

#### FR-4: 단어 세트 수정

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-4 | SPEC-WORDSET-001 | [SPEC](../specs/SPEC-WORDSET-001/spec.md) |
| **API** | @API-PUT-WORDSETS | `PUT /api/wordsets/[id]` | [API_REFERENCE.md](./API_REFERENCE.md#4-단어-세트-수정) |
| **UI 컴포넌트** | @UI-WORDSET-FORM | `WordSetForm` | - |
| **단위 테스트** | @TEST-WORDSET-UPDATE | `__tests__/api/wordsets.test.ts` | - |
| **E2E 테스트** | @E2E-WORDSET-UPDATE | `e2e/wordsets.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.1.0 |

#### FR-5: 단어 세트 삭제

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-5 | SPEC-WORDSET-001 | [SPEC](../specs/SPEC-WORDSET-001/spec.md) |
| **API** | @API-DELETE-WORDSETS | `DELETE /api/wordsets/[id]` | [API_REFERENCE.md](./API_REFERENCE.md#5-단어-세트-삭제) |
| **UI 컴포넌트** | @UI-DELETE-DIALOG | `DeleteDialog` | - |
| **단위 테스트** | @TEST-WORDSET-DELETE | `__tests__/api/wordsets.test.ts` | - |
| **E2E 테스트** | @E2E-WORDSET-DELETE | `e2e/wordsets.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.1.0 |

#### FR-6: 단어 추가

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-6 | SPEC-WORDSET-001 | [SPEC](../specs/SPEC-WORDSET-001/spec.md) |
| **API** | @API-POST-WORDS | `POST /api/wordsets/[id]/words` | [API_REFERENCE.md](./API_REFERENCE.md#6-단어-추가) |
| **UI 컴포넌트** | @UI-WORD-FORM | `WordForm` | - |
| **단위 테스트** | @TEST-WORD-CREATE | `__tests__/api/words.test.ts` | - |
| **E2E 테스트** | @E2E-WORD-CREATE | `e2e/words.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.1.0 |

#### FR-7: 단어 수정

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-7 | SPEC-WORDSET-001 | [SPEC](../specs/SPEC-WORDSET-001/spec.md) |
| **API** | @API-PUT-WORDS | `PUT /api/words/[id]` | [API_REFERENCE.md](./API_REFERENCE.md#7-단어-수정) |
| **UI 컴포넌트** | @UI-WORD-FORM | `WordForm` | - |
| **단위 테스트** | @TEST-WORD-UPDATE | `__tests__/api/words.test.ts` | - |
| **E2E 테스트** | @E2E-WORD-UPDATE | `e2e/words.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.1.0 |

#### FR-8: 단어 삭제

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-8 | SPEC-WORDSET-001 | [SPEC](../specs/SPEC-WORDSET-001/spec.md) |
| **API** | @API-DELETE-WORDS | `DELETE /api/words/[id]` | [API_REFERENCE.md](./API_REFERENCE.md#8-단어-삭제) |
| **UI 컴포넌트** | @UI-DELETE-DIALOG | `DeleteDialog` | - |
| **단위 테스트** | @TEST-WORD-DELETE | `__tests__/api/words.test.ts` | - |
| **E2E 테스트** | @E2E-WORD-DELETE | `e2e/words.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.1.0 |

---

## SPEC-FOLDER-001: 폴더 관리 (v1.0.0)

### 요구사항 → 구현 매핑

#### FR-1: 폴더 생성

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-1 | SPEC-FOLDER-001 | [SPEC](../specs/SPEC-FOLDER-001/spec.md) |
| **API** | @API-POST-FOLDERS | `POST /api/folders` | [API_REFERENCE.md](./API_REFERENCE.md#folder-엔드포인트-spec-folder-001) |
| **UI 컴포넌트** | @UI-FOLDER-FORM | `FolderForm` | - |
| **UI 페이지** | @PAGE-FOLDERS-NEW | `/folders/new` | - |
| **단위 테스트** | @TEST-FOLDER-CREATE | `__tests__/api/folders.test.ts` | - |
| **E2E 테스트** | @E2E-FOLDER-CREATE | `e2e/folders.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.2.0 |

#### FR-2: 폴더 목록 조회

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-2 | SPEC-FOLDER-001 | [SPEC](../specs/SPEC-FOLDER-001/spec.md) |
| **API** | @API-GET-FOLDERS | `GET /api/folders` | [API_REFERENCE.md](./API_REFERENCE.md#2-폴더-목록-조회-통계-포함) |
| **UI 컴포넌트** | @UI-FOLDER-LIST | `FolderList` | - |
| **UI 페이지** | @PAGE-FOLDERS | `/folders` | - |
| **단위 테스트** | @TEST-FOLDER-LIST | `__tests__/api/folders.test.ts` | - |
| **E2E 테스트** | @E2E-FOLDER-LIST | `e2e/folders.spec.ts` | - |
| **성능** | < 300ms | 50개 폴더 기준 | [API_REFERENCE.md](./API_REFERENCE.md) |
| **상태** | ✅ | 완료 | v0.2.0 |

#### FR-3: 폴더 상세 조회

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-3 | SPEC-FOLDER-001 | [SPEC](../specs/SPEC-FOLDER-001/spec.md) |
| **API** | @API-GET-FOLDER-DETAIL | `GET /api/folders/[id]` | [API_REFERENCE.md](./API_REFERENCE.md#3-폴더-상세-조회) |
| **UI 컴포넌트** | @UI-FOLDER-DETAIL | `FolderDetail` | - |
| **UI 페이지** | @PAGE-FOLDER-DETAIL | `/folders/[id]` | - |
| **단위 테스트** | @TEST-FOLDER-DETAIL | `__tests__/api/folders.test.ts` | - |
| **E2E 테스트** | @E2E-FOLDER-DETAIL | `e2e/folders.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.2.0 |

#### FR-4: 폴더 수정

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-4 | SPEC-FOLDER-001 | [SPEC](../specs/SPEC-FOLDER-001/spec.md) |
| **API** | @API-PUT-FOLDERS | `PUT /api/folders/[id]` | [API_REFERENCE.md](./API_REFERENCE.md#4-폴더-수정) |
| **UI 컴포넌트** | @UI-FOLDER-FORM | `FolderForm` | - |
| **단위 테스트** | @TEST-FOLDER-UPDATE | `__tests__/api/folders.test.ts` | - |
| **E2E 테스트** | @E2E-FOLDER-UPDATE | `e2e/folders.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.2.0 |

#### FR-5: 폴더 삭제 (Nullify 정책)

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-5 | SPEC-FOLDER-001 | [SPEC](../specs/SPEC-FOLDER-001/spec.md) |
| **API** | @API-DELETE-FOLDERS | `DELETE /api/folders/[id]` | [API_REFERENCE.md](./API_REFERENCE.md#5-폴더-삭제-nullify-정책) |
| **정책** | @NULLIFY-POLICY | SetNull 관계 설정 | [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) |
| **UI 컴포넌트** | @UI-DELETE-DIALOG | `DeleteDialog` | - |
| **단위 테스트** | @TEST-FOLDER-DELETE-NULLIFY | `__tests__/api/folders.test.ts` | - |
| **E2E 테스트** | @E2E-FOLDER-DELETE-NULLIFY | `e2e/folders.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.2.0 |

#### FR-6: 단어 세트에 폴더 할당

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-6 | SPEC-FOLDER-001 | [SPEC](../specs/SPEC-FOLDER-001/spec.md) |
| **API** | @API-PUT-WORDSETS-FOLDER | `PUT /api/wordsets/[id]` (folderId) | [API_REFERENCE.md](./API_REFERENCE.md#put-apiworsetsid-폴더-할당변경-지원) |
| **UI 컴포넌트** | @UI-FOLDER-SELECTOR | `FolderSelector` | - |
| **단위 테스트** | @TEST-WORDSET-FOLDER-ASSIGN | `__tests__/api/wordsets-folder.test.ts` | - |
| **E2E 테스트** | @E2E-WORDSET-FOLDER-ASSIGN | `e2e/folders.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.2.0 |

#### FR-7: 단어 세트에서 폴더 제거

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-7 | SPEC-FOLDER-001 | [SPEC](../specs/SPEC-FOLDER-001/spec.md) |
| **API** | @API-PUT-WORDSETS | `PUT /api/wordsets/[id]` (folderId: null) | [API_REFERENCE.md](./API_REFERENCE.md#put-apiworsetsid-폴더-할당변경-지원) |
| **UI 컴포넌트** | @UI-FOLDER-SELECTOR | `FolderSelector` | - |
| **단위 테스트** | @TEST-WORDSET-FOLDER-REMOVE | `__tests__/api/wordsets-folder.test.ts` | - |
| **E2E 테스트** | @E2E-WORDSET-FOLDER-REMOVE | `e2e/folders.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.2.0 |

#### FR-8: 폴더별 단어 세트 필터링

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-8 | SPEC-FOLDER-001 | [SPEC](../specs/SPEC-FOLDER-001/spec.md) |
| **API** | @API-GET-FOLDERS-WORDSETS | `GET /api/folders/[id]/wordsets` | [API_REFERENCE.md](./API_REFERENCE.md#6-폴더별-단어-세트-조회) |
| **UI 컴포넌트** | @UI-FOLDER-FILTER | `FolderFilter` | - |
| **단위 테스트** | @TEST-FOLDER-FILTER | `__tests__/api/folders.test.ts` | - |
| **E2E 테스트** | @E2E-FOLDER-FILTER | `e2e/folders.spec.ts` | - |
| **성능** | < 500ms | 500개 세트 기준 | [API_REFERENCE.md](./API_REFERENCE.md) |
| **상태** | ✅ | 완료 | v0.2.0 |

#### FR-9: 폴더 통계 표시

| 구성 요소 | TAG | 구현 위치 | 문서 참조 |
|---------|-----|---------|----------|
| **요구사항** | @FR-9 | SPEC-FOLDER-001 | [SPEC](../specs/SPEC-FOLDER-001/spec.md) |
| **API** | @API-FOLDERS-COUNT | `GET /api/folders` (_count) | [API_REFERENCE.md](./API_REFERENCE.md#2-폴더-목록-조회-통계-포함) |
| **UI 컴포넌트** | @UI-FOLDER-STATS | `FolderCard` | - |
| **단위 테스트** | @TEST-FOLDER-STATS | `__tests__/api/folders.test.ts` | - |
| **E2E 테스트** | @E2E-FOLDER-STATS | `e2e/folders.spec.ts` | - |
| **상태** | ✅ | 완료 | v0.2.0 |

---

## 비기능 요구사항 추적

### NFR-1: 성능

| 요구사항 | API | 목표 | 구현 | 문서 |
|---------|-----|------|------|------|
| 폴더 목록 조회 | GET /api/folders | < 300ms | 데이터베이스 인덱스 | [API_REFERENCE.md](./API_REFERENCE.md) |
| 폴더별 세트 조회 | GET /api/folders/[id]/wordsets | < 500ms | 쿼리 최적화 | [API_REFERENCE.md](./API_REFERENCE.md) |

### NFR-2: 확장성

| 요구사항 | 구현 | 상태 |
|---------|------|------|
| parentId 필드 준비 (중첩 폴더용) | Folder 모델에 포함 | ✅ 완료 |
| 향후 중첩 폴더 확장 가능 | 구조 설계 완료 | ✅ 완료 |

### NFR-3: 데이터 무결성

| 요구사항 | 구현 | 상태 | 문서 |
|---------|------|------|------|
| Nullify 정책 | onDelete: SetNull | ✅ 완료 | [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) |
| 고아 레코드 방지 | FK 제약 조건 | ✅ 완료 | [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) |

### NFR-4: 사용성

| 요구사항 | UI 컴포넌트 | 상태 |
|---------|-----------|------|
| 직관적 폴더 선택 UI | FolderSelector | ✅ 완료 |
| 반응형 디자인 | FolderList, FolderCard | ✅ 완료 |

### NFR-5: 테스트 커버리지

| 요구사항 | 목표 | 구현 | 상태 |
|---------|------|------|------|
| 단위 테스트 커버리지 | 90%+ | 60개 테스트 | ✅ 완료 |
| E2E 테스트 커버리지 | 100% 주요 시나리오 | 전체 사용자 흐름 | ✅ 완료 |

---

## 인수 기준 추적

### SPEC-WORDSET-001 인수 기준

| AC | 요구사항 | 검증 방법 | 상태 |
|----|---------|---------|------|
| AC-1 | 세트 생성 및 조회 | API 응답 + DB 확인 | ✅ |
| AC-2 | 단어 추가 | UI 렌더링 + 데이터 동기화 | ✅ |
| AC-3 | 세트 삭제 및 Cascade | 데이터 일관성 | ✅ |
| AC-4 | 단어 검색 | 필터링 기능 | ✅ |

### SPEC-FOLDER-001 인수 기준

| AC | 요구사항 | 검증 방법 | 상태 |
|----|---------|---------|------|
| AC-1 | 폴더 생성 및 조회 | API 응답 + DB 확인 | ✅ |
| AC-2 | 세트에 폴더 할당 | 관계 설정 확인 | ✅ |
| AC-3 | 폴더 삭제 및 Nullify | SetNull 정책 검증 | ✅ |
| AC-4 | 폴더별 필터링 | WHERE 쿼리 검증 | ✅ |
| AC-5 | 루트 영역 관리 | folderId=null 세트 조회 | ✅ |
| AC-6 | 폴더 수정 및 통계 유지 | 업데이트 후 통계 확인 | ✅ |
| AC-7 | 성능 기준 충족 | API 응답 시간 측정 | ✅ |
| AC-8 | 기존 호환성 | SPEC-WORDSET-001 기능 검증 | ✅ |

---

## TAG 인덱스

### API TAG

- @API-POST-WORDSETS - 세트 생성
- @API-GET-WORDSETS - 세트 목록
- @API-GET-WORDSET-DETAIL - 세트 상세
- @API-PUT-WORDSETS - 세트 수정
- @API-DELETE-WORDSETS - 세트 삭제
- @API-POST-WORDS - 단어 추가
- @API-PUT-WORDS - 단어 수정
- @API-DELETE-WORDS - 단어 삭제
- @API-POST-FOLDERS - 폴더 생성
- @API-GET-FOLDERS - 폴더 목록
- @API-GET-FOLDER-DETAIL - 폴더 상세
- @API-PUT-FOLDERS - 폴더 수정
- @API-DELETE-FOLDERS - 폴더 삭제
- @API-GET-FOLDERS-WORDSETS - 폴더별 세트
- @API-PUT-WORDSETS-FOLDER - 세트 폴더 할당

### UI TAG

- @UI-WORDSET-FORM - 세트 폼
- @UI-WORDSET-LIST - 세트 목록
- @UI-WORDSET-DETAIL - 세트 상세
- @UI-WORD-FORM - 단어 폼
- @UI-WORD-LIST - 단어 목록
- @UI-DELETE-DIALOG - 삭제 다이얼로그
- @UI-FOLDER-FORM - 폴더 폼
- @UI-FOLDER-LIST - 폴더 목록
- @UI-FOLDER-DETAIL - 폴더 상세
- @UI-FOLDER-SELECTOR - 폴더 선택
- @UI-FOLDER-FILTER - 폴더 필터
- @UI-FOLDER-STATS - 폴더 통계

### 테스트 TAG

- @TEST-WORDSET-CREATE - 세트 생성
- @TEST-WORDSET-LIST - 세트 목록
- @TEST-WORDSET-DETAIL - 세트 상세
- @TEST-WORDSET-UPDATE - 세트 수정
- @TEST-WORDSET-DELETE - 세트 삭제
- @TEST-WORD-CREATE - 단어 추가
- @TEST-WORD-UPDATE - 단어 수정
- @TEST-WORD-DELETE - 단어 삭제
- @TEST-FOLDER-CREATE - 폴더 생성
- @TEST-FOLDER-LIST - 폴더 목록
- @TEST-FOLDER-DETAIL - 폴더 상세
- @TEST-FOLDER-UPDATE - 폴더 수정
- @TEST-FOLDER-DELETE-NULLIFY - 폴더 삭제
- @TEST-FOLDER-FILTER - 폴더 필터
- @TEST-FOLDER-STATS - 폴더 통계
- @TEST-WORDSET-FOLDER-ASSIGN - 세트 폴더 할당
- @TEST-WORDSET-FOLDER-REMOVE - 세트 폴더 제거

### 정책 TAG

- @NULLIFY-POLICY - SetNull 삭제 정책
- @CASCADE-POLICY - Cascade 삭제 정책

---

## 추적성 품질 지표

### 요구사항 커버리지

| 카테고리 | 총 개수 | 구현 완료 | 커버리지 |
|---------|--------|---------|---------|
| SPEC-WORDSET-001 FR | 8 | 8 | 100% |
| SPEC-FOLDER-001 FR | 9 | 9 | 100% |
| NFR | 5 | 5 | 100% |
| AC | 16 | 16 | 100% |
| **합계** | **38** | **38** | **100%** |

### 문서 추적성

| 문서 | 참조 수 | 상태 |
|----|--------|------|
| API_REFERENCE.md | 14개 엔드포인트 | ✅ 완료 |
| DATABASE_SCHEMA.md | 3개 모델 | ✅ 완료 |
| CHANGELOG.md | v0.1.0, v0.2.0 | ✅ 완료 |

---

**마지막 업데이트**: 2025-11-25
**SPEC 참조**: SPEC-WORDSET-001 (v0.1.0), SPEC-FOLDER-001 (v1.0.0)
**유지보수자**: @user

---

## 참고 자료

- [SPEC-WORDSET-001](../specs/SPEC-WORDSET-001/spec.md) - 단어 세트 관리 명세
- [SPEC-FOLDER-001](../specs/SPEC-FOLDER-001/spec.md) - 폴더 관리 명세
- [API_REFERENCE.md](./API_REFERENCE.md) - API 엔드포인트 문서
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - 데이터베이스 스키마
- [CHANGELOG.md](./CHANGELOG.md) - 변경 이력
