---
title: Living Documents 인덱스
description: Lang Quiz 애플리케이션의 모든 Living Documents 목록 및 메타데이터 (플립 카드 학습 시스템 추가)
version: 0.2.0
spec: [SPEC-WORDSET-001, SPEC-FOLDER-001, SPEC-UI-001, SPEC-LEARN-001]
lastUpdated: 2025-11-27
maintainer: "@user"
---

# Living Documents 인덱스

**Word Set Management System**의 모든 Living Documents에 대한 중앙 인덱스입니다.

각 문서의 목적, 내용, 유지보수 정보를 한눈에 확인할 수 있습니다.

---

## 문서 목록 (9개)

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
**버전**: 0.2.0
**폴더 기능 추가**: ✅ SPEC-FOLDER-001 (6개 엔드포인트)

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

**마지막 업데이트**: 2025-11-27
**유지보수자**: @user
**버전**: 0.3.0
**최신 버전**: 0.3.0 (SPEC-LEARN-001 추가)

**링크**: [CHANGELOG.md](./CHANGELOG.md)

---

### 5. COMPONENTS_GUIDE.md

**목적**: UI 컴포넌트 및 학습 컴포넌트 라이브러리 가이드

**작성 이유**:
- UI 컴포넌트 사용법
- 학습 컴포넌트 통합
- 디자인 시스템 설명

**주요 섹션**:
- UI 컴포넌트 (Button, Card, Input, Badge, Skeleton)
- 학습 컴포넌트 (FlipCard, LearnNavigation, LearnProgress, LearnComplete)
- Framer Motion 애니메이션 가이드
- Web Speech API 통합
- 베스트 프랙티스

**문서 사양**:
- 라인 수: ~600줄 (확장)
- 섹션 수: 12개
- 코드 예시: 30개 이상
- 컴포넌트: 9개 (5개 UI + 4개 학습)

**사용자**:
- 프론트엔드 개발자
- 컴포넌트 라이브러리 유지보수자

**TAG 매핑**:
- `@UI-COMPONENTS`
- `@LEARN-COMPONENTS`
- `@LEARN-UI`

**마지막 업데이트**: 2025-11-27
**유지보수자**: @user
**버전**: 0.2.0

**링크**: [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)

---

### 6. LEARN_FEATURES.md (신규)

**목적**: 플립 카드 학습 시스템의 사용자 기능 및 워크플로우 설명

**작성 이유**:
- 학습 기능 소개
- 사용자 워크플로우 설명
- API 개요 제공

**주요 섹션**:
- 학습 시스템 개요
- 주요 기능 (3D 플립, TTS, 키보드, 진행률, 세션 저장, 모드)
- 학습 모드 (순차/랜덤)
- 사용자 인터페이스
- 사용 시나리오
- API 및 훅 개요
- 키보드 단축키
- 베스트 프랙티스

**문서 사양**:
- 라인 수: ~350줄
- 섹션 수: 9개
- 코드 예시: 15개
- 다이어그램: 3개

**사용자**:
- 프론트엔드 개발자
- 기능 구현 담당자
- 최종 사용자

**TAG 매핑**:
- `@LEARN-FEATURES`
- `@LEARN-UI`
- `@LEARN-HOOKS`

**마지막 업데이트**: 2025-11-27
**유지보수자**: @user
**버전**: 0.1.0

**링크**: [LEARN_FEATURES.md](./LEARN_FEATURES.md)

---

### 7. LEARN_COMPONENTS_API.md (신규)

**목적**: 학습 컴포넌트 및 Hooks의 상세 API 레퍼런스

**작성 이유**:
- 컴포넌트 API 명세
- Hooks 인터페이스 정의
- 유틸리티 함수 문서화

**주요 섹션**:
- 컴포넌트 개요
- FlipCard 컴포넌트 (Props, 사용법, 애니메이션)
- LearnNavigation 컴포넌트
- LearnProgress 컴포넌트
- LearnComplete 컴포넌트
- useLearnSession Hook
- useSpeech Hook
- useKeyboard Hook
- 유틸리티 함수 (sessionStorage, shuffle)
- 타입 정의
- 완전한 통합 예시

**문서 사양**:
- 라인 수: ~400줄
- 섹션 수: 10개
- 코드 예시: 25개 이상
- 표: 12개

**사용자**:
- 백엔드 개발자
- API 통합 담당자
- 프론트엔드 개발자

**TAG 매핑**:
- `@LEARN-COMPONENTS`
- `@LEARN-HOOKS`
- `@LEARN-UTILS`

**마지막 업데이트**: 2025-11-27
**유지보수자**: @user
**버전**: 0.1.0

**링크**: [LEARN_COMPONENTS_API.md](./LEARN_COMPONENTS_API.md)

---

### 8. LEARN_SESSION_MANAGEMENT.md (신규)

**목적**: 학습 세션 상태 관리, 데이터 구조, 저장소 메커니즘 상세 설명

**작성 이유**:
- 세션 관리 아키텍처 이해
- 데이터 구조 상세 설명
- 저장소 메커니즘 설명

**주요 섹션**:
- 세션 관리 개요
- 세션 데이터 구조 (LearnSession 인터페이스)
- useLearnSession Hook 상세
- sessionStorage 유틸리티
- 세션 생명주기
- 데이터 처리 흐름
- 에러 처리 및 복구 전략
- 성능 최적화
- 보안 고려사항
- 모니터링 및 디버깅

**문서 사양**:
- 라인 수: ~320줄
- 섹션 수: 9개
- 코드 예시: 20개 이상
- 다이어그램: 5개

**사용자**:
- 백엔드 개발자
- 데이터 모델링 담당자
- DevOps 엔지니어

**TAG 매핑**:
- `@LEARN-SESSION`
- `@LEARN-STORAGE`
- `@LEARN-DATA`

**마지막 업데이트**: 2025-11-27
**유지보수자**: @user
**버전**: 0.1.0

**링크**: [LEARN_SESSION_MANAGEMENT.md](./LEARN_SESSION_MANAGEMENT.md)

---

### 9. index.md (현재 파일)

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
index.md (중앙 인덱스)
    │
    ├─→ API_REFERENCE.md (REST API 명세)
    │   └─→ 백엔드 개발자, API 클라이언트
    │
    ├─→ PROJECT_STRUCTURE.md (디렉토리 구조)
    │   └─→ 신입 개발자, 아키텍처 검토
    │
    ├─→ DATABASE_SCHEMA.md (데이터베이스 설계)
    │   └─→ DB 엔지니어, 백엔드 개발자
    │
    ├─→ CHANGELOG.md (버전 이력)
    │   └─→ PM, 릴리스 엔지니어, 사용자
    │
    ├─→ COMPONENTS_GUIDE.md (UI & 학습 컴포넌트)
    │   └─→ 프론트엔드 개발자, 컴포넌트 유지보수
    │
    └─→ 학습 시스템 문서
        ├─→ LEARN_FEATURES.md (기능 설명)
        │   └─→ 프론트엔드 개발자, 기능 구현자
        │
        ├─→ LEARN_COMPONENTS_API.md (API 레퍼런스)
        │   └─→ 백엔드 개발자, API 통합
        │
        └─→ LEARN_SESSION_MANAGEMENT.md (세션 관리)
            └─→ 데이터 모델링, 아키텍처 검토
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

### SPEC-FOLDER-001 (v1.0.0)

| SPEC 섹션 | Living Document | 대응 TAG |
|---------|----------------|---------|
| Requirements (FR-1~9) | API_REFERENCE.md | @API-POST-FOLDERS, @API-GET-FOLDERS, ... |
| Specifications | API_REFERENCE.md, DATABASE_SCHEMA.md | @API-*, @DB-FOLDER-* |
| Acceptance Criteria | CHANGELOG.md (v0.2.0) | @RELEASE-V0.2.0 |
| Traceability | TAG_MAPPING.md (계획) | @SPEC-FOLDER-001 |

### SPEC-LEARN-001 (v0.1.0) - NEW

| SPEC 섹션 | Living Document | 대응 TAG |
|---------|----------------|---------|
| Features | LEARN_FEATURES.md | @LEARN-FEATURES |
| Components | LEARN_COMPONENTS_API.md | @LEARN-COMPONENTS, @LEARN-UI |
| Hooks | LEARN_COMPONENTS_API.md | @LEARN-HOOKS |
| Session Management | LEARN_SESSION_MANAGEMENT.md | @LEARN-SESSION, @LEARN-STORAGE |
| UI | COMPONENTS_GUIDE.md | @LEARN-UI |
| Traceability | CHANGELOG.md (v0.3.0) | @RELEASE-V0.3.0 |

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

### v0.3.0 (2025-11-27) - SPEC-LEARN-001 추가

| 문서 | 라인 수 | 섹션 | 예시 | 표 |
|------|--------|------|------|-----|
| API_REFERENCE.md | ~850 | 14 | 45 | 12 |
| PROJECT_STRUCTURE.md | 460 | 10 | 5 | 4 |
| DATABASE_SCHEMA.md | 520 | 15 | 15 | 8 |
| CHANGELOG.md | ~580 | 14 | 3 | 5 |
| COMPONENTS_GUIDE.md | ~600 | 12 | 30 | 6 |
| LEARN_FEATURES.md | ~350 | 9 | 15 | 3 |
| LEARN_COMPONENTS_API.md | ~400 | 10 | 25 | 12 |
| LEARN_SESSION_MANAGEMENT.md | ~320 | 9 | 20 | 5 |
| index.md | ~850 | 10 | 2 | 8 |
| **합계** | **~4,930** | **103** | **160** | **63** |

### v0.1.0 (2025-11-25) - 초기 버전

| 문서 | 라인 수 | 섹션 | 예시 | 표 |
|------|--------|------|------|-----|
| API_REFERENCE.md | 430 | 8 | 24 | 5 |
| PROJECT_STRUCTURE.md | 440 | 10 | 5 | 4 |
| DATABASE_SCHEMA.md | 520 | 15 | 15 | 8 |
| CHANGELOG.md | 390 | 12 | 3 | 3 |
| index.md | 현재 | 6 | 2 | 5 |
| **합계** | **~2,180** | **51** | **49** | **25** |

### 커버리지 (v0.2.0)

- **API 엔드포인트**: 100% (14/14) - WordSet 8개 + Folder 6개
- **프로젝트 구조**: 100% (9개 주요 디렉토리)
- **데이터베이스 테이블**: 100% (3/3) - WordSet, Word, Folder
- **SPEC 요구사항**: 100% (WORDSET 8 FR + FOLDER 9 FR)
- **SPEC 문서**: 100% (2개 SPEC 완료)

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

## 문서 마이그레이션

### v0.2.0 추가 예정 (SPEC-FOLDER-001)

- ✅ `API_REFERENCE.md` - Folder 엔드포인트 추가 (완료)
- ✅ `CHANGELOG.md` - v0.2.0 항목 추가 (완료)
- 📝 `INTEGRATION_GUIDE.md` - 폴더 기능 통합 가이드 (예정)
- 📝 `NULLIFY_POLICY_GUIDE.md` - Nullify 정책 상세 설명 (예정)
- 📝 `TAG_MAPPING.md` - 요구사항별 구현 매핑 (예정)

### v0.3.0 추가 문서 (계획)

- `AUTHENTICATION.md` - 인증 시스템
- `DEPLOYMENT_GUIDE.md` - 배포 가이드
- `SECURITY_GUIDE.md` - 보안 가이드
- `PERFORMANCE_GUIDE.md` - 성능 최적화 가이드
- `UI_COMPONENTS.md` - UI 컴포넌트 카탈로그

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
