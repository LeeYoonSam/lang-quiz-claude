---
title: Living Documents 인덱스
description: Word Set Management System의 모든 Living Documents 목록 및 메타데이터
version: 0.1.0
spec: SPEC-WORDSET-001
lastUpdated: 2025-11-25
maintainer: "@user"
---

# Living Documents 인덱스

**Word Set Management System**의 모든 Living Documents에 대한 중앙 인덱스입니다.

각 문서의 목적, 내용, 유지보수 정보를 한눈에 확인할 수 있습니다.

---

## 문서 목록 (5개)

### 1. API_REFERENCE.md

**목적**: REST API 엔드포인트의 상세 문서

**작성 이유**:
- 개발자가 API를 사용하기 위한 완전한 참조
- 요청/응답 형식 및 예시 제공
- 에러 처리 방법 설명

**주요 섹션**:
- API 개요 및 기본 정보
- Word Set 엔드포인트 (5개)
  - 1. 단어 세트 생성 (POST)
  - 2. 단어 세트 목록 조회 (GET)
  - 3. 단어 세트 상세 조회 (GET)
  - 4. 단어 세트 수정 (PUT)
  - 5. 단어 세트 삭제 (DELETE)
- Word 엔드포인트 (3개)
  - 6. 단어 추가 (POST)
  - 7. 단어 수정 (PUT)
  - 8. 단어 삭제 (DELETE)
- 에러 처리 및 시나리오
- 성능 최적화
- 버전 관리

**문서 사양**:
- 라인 수: ~430줄
- 섹션 수: 8개 + 부분 섹션
- 코드 예시: 24개 (cURL, JSON)
- 표: 5개

**사용자**:
- 백엔드 개발자
- 프론트엔드 개발자
- API 클라이언트 개발자

**TAG 매핑**:
- `@API-POST-WORDSETS`
- `@API-GET-WORDSETS`
- `@API-GET-WORDSET-DETAIL`
- `@API-PUT-WORDSETS`
- `@API-DELETE-WORDSETS`
- `@API-POST-WORDS`
- `@API-PUT-WORDS`
- `@API-DELETE-WORDS`

**마지막 업데이트**: 2025-11-25
**유지보수자**: @user
**버전**: 0.1.0

**링크**: [API_REFERENCE.md](./API_REFERENCE.md)

---

### 2. PROJECT_STRUCTURE.md

**목적**: 프로젝트 디렉토리 구조 및 파일 조직 설명

**작성 이유**:
- 새 개발자 온보딩
- 코드 탐색 가이드
- 아키텍처 이해

**주요 섹션**:
- 전체 구조도 (트리 형식)
- 주요 디렉토리 상세 설명 (8개)
  - `app/` - Next.js 애플리케이션
  - `lib/` - 유틸리티 및 설정
  - `hooks/` - 커스텀 React Hooks
  - `components/` - React 컴포넌트
  - `prisma/` - 데이터베이스
  - `__tests__/` - 단위 테스트
  - `e2e/` - E2E 테스트
  - `.moai/` - MoAI Framework
- 파일 조직 원칙 (4가지)
- 향후 확장 계획
- 개발 워크플로우
- 성능 최적화 전략

**문서 사양**:
- 라인 수: ~440줄
- 섹션 수: 10개
- 구조도: 1개 (전체), 9개 (세부)
- 표: 4개

**사용자**:
- 신입 개발자
- 프로젝트 리더
- 아키텍처 검토자

**TAG 매핑**:
- `@PROJECT-STRUCTURE`
- `@ARCH-API-LAYER`
- `@ARCH-UI-LAYER`
- `@ARCH-UTIL-LAYER`

**마지막 업데이트**: 2025-11-25
**유지보수자**: @user
**버전**: 0.1.0

**링크**: [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

---

### 3. DATABASE_SCHEMA.md

**목적**: 데이터베이스 설계 및 스키마 상세 문서

**작성 이유**:
- 데이터베이스 이해
- 마이그레이션 가이드
- 쿼리 최적화 팁

**주요 섹션**:
- 개요 (기술 스택, 무결성)
- Prisma 스키마 정의
- 테이블 상세 설명 (2개)
  - WordSet 테이블
  - Word 테이블
- 정규화 (1NF, 2NF, 3NF)
- 데이터 무결성 전략
  - Cascade Delete
  - Foreign Key 제약
  - UNIQUE 제약
- 인덱싱 전략
- 마이그레이션 히스토리
- 데이터베이스 설정 (개발, 프로덕션)
- 쿼리 최적화 팁
- 성능 벤치마크
- 데이터 보호 및 백업
- 보안 고려사항
- 향후 확장 (v0.2.0, v0.3.0)

**문서 사양**:
- 라인 수: ~520줄
- 섹션 수: 15개
- SQL 예시: 15개
- 프리즈마 스키마: 2개
- 표: 8개

**사용자**:
- 데이터베이스 엔지니어
- 백엔드 개발자
- DevOps 엔지니어

**TAG 매핑**:
- `@DB-SCHEMA-WORDSET`
- `@DB-SCHEMA-WORD`
- `@DB-INDEX-WORDSETID`
- `@DB-MIGRATION`

**마지막 업데이트**: 2025-11-25
**유지보수자**: @user
**버전**: 0.1.0

**링크**: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

---

### 4. CHANGELOG.md

**목적**: 버전 이력 및 변경 사항 기록

**작성 이유**:
- 변경 추적
- 마이그레이션 가이드
- 릴리스 노트

**주요 섹션**:
- 형식 설명 (Keep a Changelog)
- v0.1.0 - 초기 출시 (2025-11-24)
  - Added (8개 섹션)
    - 백엔드 기능 (8개 엔드포인트)
    - 프론트엔드 기능 (4개 페이지, 8개 컴포넌트)
    - 개발 환경 및 도구
    - 문서
    - SPEC 및 추적성
  - Security (4가지)
- Unreleased (계획 중)
  - v0.2.0 (폴더, 성능, UX)
  - v0.3.0 (인증, 공유, UX)
  - v0.4.0 (고급 기능, 학습)
  - v0.5.0 (모바일, 분석)
- 버전 관리 정책
- 릴리스 프로세스
- 지원 정책
- 마이그레이션 가이드
- 알려진 문제
- 기여 가이드
- 릴리스 노트

**문서 사양**:
- 라인 수: ~390줄
- 섹션 수: 12개
- 버전: 5개 (v0.1.0 + 계획)
- 코드 예시: 3개

**사용자**:
- 프로젝트 관리자
- 릴리스 엔지니어
- 사용자

**TAG 매핑**:
- `@RELEASE-V0.1.0`
- `@CHANGELOG-FEATURE`
- `@CHANGELOG-BUGFIX`

**마지막 업데이트**: 2025-11-25
**유지보수자**: @user
**버전**: 0.1.0

**링크**: [CHANGELOG.md](./CHANGELOG.md)

---

### 5. index.md (현재 파일)

**목적**: 모든 Living Documents의 중앙 인덱스

**작성 이유**:
- 문서 검색 시작점
- 메타데이터 관리
- 문서 간 참조 관계

**주요 섹션**:
- 문서 목록 (5개)
- 문서 관계도
- SPEC 매핑
- 업데이트 일정
- 유지보수 정책
- 문서 작성 가이드

**문서 사양**:
- 라인 수: 현재 파일
- 섹션 수: 6개
- 참조: 5개 문서

**사용자**:
- 모든 팀 멤버
- 문서 관리자
- 새 개발자

**마지막 업데이트**: 2025-11-25
**유지보수자**: @user
**버전**: 0.1.0

**링크**: [index.md](./index.md)

---

## 문서 관계도

```
index.md (인덱스)
    ├─→ API_REFERENCE.md (API 명세)
    │   └─→ 백엔드 개발자, API 클라이언트
    │
    ├─→ PROJECT_STRUCTURE.md (구조 설명)
    │   └─→ 신입 개발자, 아키텍처 검토
    │
    ├─→ DATABASE_SCHEMA.md (DB 설계)
    │   └─→ DB 엔지니어, 백엔드 개발자
    │
    └─→ CHANGELOG.md (변경 이력)
        └─→ PM, 릴리스 엔지니어, 사용자
```

---

## SPEC 매핑

### SPEC-WORDSET-001 (v0.1.0)

| SPEC 섹션 | Living Document | 대응 TAG |
|---------|----------------|---------|
| Requirements (FR-1~8) | API_REFERENCE.md | @API-* |
| Specifications | API_REFERENCE.md, DATABASE_SCHEMA.md | @API-*, @DB-* |
| Acceptance Criteria | PROJECT_STRUCTURE.md | @PROJECT-STRUCTURE |
| Traceability | CHANGELOG.md | @RELEASE-V0.1.0 |

---

## 문서 업데이트 일정

### 정기 업데이트

| 일정 | 담당 | 확인 항목 |
|------|------|---------|
| 매 커밋 후 | 개발자 | 변경사항 반영 필요 시 |
| 매 버전 릴리스 | PM | CHANGELOG 업데이트 |
| 분기별 | 아키텍트 | 구조 검토 및 최신화 |
| 반기별 | 기술 리더 | 전체 문서 검토 |

### 주요 마일스톤

| 날짜 | 버전 | 작업 |
|------|------|------|
| 2025-11-24 | 0.1.0 | 초기 문서 작성 |
| 2025-12-31 | 0.1.x | 버그 수정 반영 |
| 2026-01-31 | 0.2.0 | 폴더 기능 추가 |
| 2026-03-31 | 0.3.0 | 사용자 인증 추가 |

---

## 유지보수 정책

### 문서 품질 기준

- **정확성**: SPEC 및 구현과 일치
- **완성성**: 모든 기능 포함
- **명확성**: 쉬운 이해
- **최신성**: 3개월 이내 업데이트
- **접근성**: 모든 팀 멤버 접근 가능

### 검토 프로세스

1. **작성**: 개발자가 문서 작성
2. **자체 검토**: 작성자 최종 검토
3. **팀 검토**: 리드 개발자 검토
4. **승인**: PM 또는 기술 리더 승인
5. **배포**: `.moai/docs/`에 커밋

### 버전 관리

- **Major**: 구조 변경 (예: 새 문서 추가)
- **Minor**: 섹션 추가/변경
- **Patch**: 오타, 정확성 개선

---

## 문서 작성 가이드

### 새 문서 추가 시

1. **목적 정의**
   - 왜 필요한가?
   - 누가 사용하나?

2. **템플릿 사용**
   ```yaml
   ---
   title: 문서 제목
   description: 문서 설명
   version: 0.1.0
   spec: SPEC-WORDSET-001
   lastUpdated: YYYY-MM-DD
   maintainer: "@user"
   ---
   ```

3. **구조 설계**
   - 개요
   - 상세 섹션
   - 예시
   - 참고사항

4. **index.md 업데이트**
   - 문서 목록에 추가
   - 메타데이터 기재
   - 관계도 업데이트

### 문서 업데이트 시

1. **변경 사항 확인**
   - 어떤 부분이 바뀌었나?
   - 왜 바뀌었나?

2. **관련 섹션 수정**
   - 본문 업데이트
   - 예시 수정
   - 표 갱신

3. **메타데이터 업데이트**
   - `lastUpdated` 변경
   - `version` 버전 업
   - 필요시 `spec` 업데이트

4. **링크 확인**
   - 내부 링크 확인
   - 외부 링크 검증
   - index.md 동기화

---

## 자주 묻는 질문 (FAQ)

### Q1. 어느 문서부터 읽어야 하나요?

**A**: 역할에 따라 다릅니다:
- **신입 개발자**: PROJECT_STRUCTURE.md → API_REFERENCE.md
- **백엔드 개발자**: API_REFERENCE.md → DATABASE_SCHEMA.md
- **프론트엔드 개발자**: PROJECT_STRUCTURE.md → API_REFERENCE.md
- **PM/릴리스**: CHANGELOG.md → API_REFERENCE.md

### Q2. 문서와 코드가 다르면 어떻게 하나요?

**A**: 반드시 리포트하세요:
1. GitHub Issue 생성
2. 어느 부분이 다른지 명시
3. PR로 수정 제안

### Q3. 문서를 수정하려면?

**A**: 다음 절차를 따르세요:
1. `.moai/docs/`에서 파일 수정
2. `lastUpdated` 날짜 변경
3. `version` 업데이트
4. index.md 동기화
5. PR 생성 및 리뷰

### Q4. 새 기능을 추가했는데 어떤 문서를 수정하나요?

**A**: 다음 순서로 수정하세요:
1. CHANGELOG.md (Added 섹션에 추가)
2. API_REFERENCE.md (새 엔드포인트 추가)
3. PROJECT_STRUCTURE.md (구조 변경 시)
4. DATABASE_SCHEMA.md (DB 변경 시)
5. index.md (메타데이터 동기화)

---

## 문서 통계

### v0.1.0 (2025-11-25)

| 문서 | 라인 수 | 섹션 | 예시 | 표 |
|------|--------|------|------|-----|
| API_REFERENCE.md | 430 | 8 | 24 | 5 |
| PROJECT_STRUCTURE.md | 440 | 10 | 5 | 4 |
| DATABASE_SCHEMA.md | 520 | 15 | 15 | 8 |
| CHANGELOG.md | 390 | 12 | 3 | 3 |
| index.md | 현재 | 6 | 2 | 5 |
| **합계** | **~2,180** | **51** | **49** | **25** |

### 커버리지

- **API 엔드포인트**: 100% (8/8)
- **프로젝트 구조**: 100% (9개 주요 디렉토리)
- **데이터베이스 테이블**: 100% (2/2)
- **SPEC 요구사항**: 100% (FR, NFR, AC)

---

## 참고 자료

### 내부 참조

- [SPEC-WORDSET-001 (전문)](../specs/SPEC-WORDSET-001/spec.md)
- [README.md (프로젝트 개요)](../../README.md)

### 외부 참조

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)

---

## 문서 마이그레이션 (향후)

### v0.2.0 추가 문서 (계획)

- `FOLDER_FEATURE.md` - 폴더 기능 명세
- `PERFORMANCE_GUIDE.md` - 성능 최적화 가이드
- `UI_COMPONENTS.md` - UI 컴포넌트 카탈로그

### v0.3.0 추가 문서 (계획)

- `AUTHENTICATION.md` - 인증 시스템
- `DEPLOYMENT_GUIDE.md` - 배포 가이드
- `SECURITY_GUIDE.md` - 보안 가이드

---

## 피드백 및 개선

### 문서 개선 요청

- **GitHub Issues**: 문서 개선 사항 제시
- **Pull Requests**: 직접 수정 및 개선
- **Discussions**: 아이디어 공유

### 문서 번역

현재 **한국어**로만 제공됩니다.
향후 다국어 지원 예정 (영어, 일본어 등)

---

**마지막 업데이트**: 2025-11-25
**SPEC 참조**: SPEC-WORDSET-001 (v0.1.0)
**유지보수자**: @user

---

## 빠른 링크

| 역할 | 추천 문서 |
|------|---------|
| 신입 개발자 | [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) |
| 백엔드 개발자 | [API_REFERENCE.md](./API_REFERENCE.md) → [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) |
| 프론트엔드 개발자 | [API_REFERENCE.md](./API_REFERENCE.md) → [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) |
| 프로젝트 매니저 | [CHANGELOG.md](./CHANGELOG.md) → [API_REFERENCE.md](./API_REFERENCE.md) |
| 데이터베이스 엔지니어 | [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) |
