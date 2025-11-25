---
title: 변경 로그
description: Word Set Management System의 버전 이력 및 변경 사항
version: 0.1.0
spec: SPEC-WORDSET-001
lastUpdated: 2025-11-25
maintainer: "@user"
---

# 변경 로그 (CHANGELOG)

**Word Set Management System**의 모든 버전 이력, 기능 추가, 개선사항, 버그 수정을 기록합니다.

## 형식

이 CHANGELOG는 [Keep a Changelog](https://keepachangelog.com/ko/) 형식을 따릅니다.

### 섹션 종류

- **Added**: 새로운 기능
- **Changed**: 기존 기능의 변경사항
- **Fixed**: 버그 수정
- **Deprecated**: 곧 제거될 기능
- **Removed**: 제거된 기능
- **Security**: 보안 관련 변경

---

## [0.1.0] - 2025-11-24

### 초기 버전 출시

이 버전에서는 Word Set Management System의 핵심 기능을 구현했습니다.

#### Added

##### 백엔드 기능

- **Word Set CRUD API**
  - `POST /api/wordsets` - 단어 세트 생성
  - `GET /api/wordsets` - 단어 세트 목록 조회 (최신순 정렬)
  - `GET /api/wordsets/[id]` - 단어 세트 상세 조회
  - `PUT /api/wordsets/[id]` - 단어 세트 수정 (이름, 설명)
  - `DELETE /api/wordsets/[id]` - 단어 세트 삭제 (Cascade)

- **Word CRUD API**
  - `POST /api/wordsets/[id]/words` - 단어 추가
  - `PUT /api/words/[id]` - 단어 수정 (텍스트, 뜻)
  - `DELETE /api/words/[id]` - 단어 삭제

- **데이터베이스**
  - Prisma ORM 설정
  - WordSet 모델 (id, name, description, folderId, createdAt, updatedAt)
  - Word 모델 (id, text, meaning, wordSetId, createdAt, updatedAt)
  - Cascade Delete 설정 (WordSet 삭제 시 포함된 Word 자동 삭제)
  - 인덱스 최적화 (folderId, wordSetId)

- **입력 검증**
  - Zod 스키마 기반 검증
  - WordSet 검증: name (1-100자), description (0-500자)
  - Word 검증: text (1-100자), meaning (1-500자)

##### 프론트엔드 기능

- **페이지**
  - 홈페이지 (`/`)
  - Word Set 목록 페이지 (`/wordsets`)
  - Word Set 생성 페이지 (`/wordsets/new`)
  - Word Set 상세 페이지 (`/wordsets/[id]`)

- **컴포넌트**
  - WordSetList - 세트 목록 그리드 (카드 형태)
  - WordSetDetail - 세트 상세 정보 및 단어 목록
  - WordSetForm - 세트 생성/수정 폼
  - WordForm - 단어 추가/수정 폼
  - WordList - 단어 목록 테이블
  - DeleteDialog - 삭제 확인 다이얼로그
  - LoadingSpinner - 로딩 표시기

- **상태 관리**
  - TanStack Query (React Query) 통합
  - useWordSets 커스텀 훅 (CRUD)
  - useWords 커스텀 훅 (CRUD)
  - 자동 캐싱 및 동기화

- **UI/UX**
  - Tailwind CSS 기반 반응형 디자인
  - 모바일, 태블릿, 데스크톱 지원
  - 낙관적 UI 업데이트
  - 실시간 에러 메시지
  - 빈 상태 메시지 ("첫 세트를 만들어보세요", "단어를 추가해보세요")

##### 개발 환경 및 도구

- **기본 설정**
  - Next.js 15 설정
  - React 19 설정
  - TypeScript 설정
  - Tailwind CSS 설정
  - Prisma ORM 설정

- **테스트 환경**
  - Jest 단위 테스트 설정
  - React Testing Library 설정
  - Playwright E2E 테스트 설정
  - 90% 테스트 커버리지 목표

- **코드 품질**
  - ESLint 설정 및 규칙
  - Prettier 코드 포매팅
  - TypeScript 타입 검사

- **스크립트**
  ```json
  {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:push": "prisma db push",
    "prisma:seed": "node prisma/seed.ts",
    "prisma:studio": "prisma studio"
  }
  ```

##### 문서

- **API 문서**
  - API 레퍼런스 (8개 엔드포인트)
  - 요청/응답 예시
  - 에러 처리 가이드
  - cURL 사용 예시

- **프로젝트 문서**
  - README.md (설치, 사용법, 기술 스택)
  - 프로젝트 구조 문서
  - 데이터베이스 스키마 문서
  - 개발 가이드

##### SPEC 및 추적성

- **SPEC-WORDSET-001**
  - FR-1 ~ FR-8: 8개 기능 요구사항
  - NFR-1 ~ NFR-5: 5개 비기능 요구사항
  - AC-1 ~ AC-6: 6개 인수 기준
  - TAG 체계 및 추적성 매트릭스

#### Changed

- N/A (초기 버전)

#### Fixed

- N/A (초기 버전)

#### Deprecated

- N/A (초기 버전)

#### Removed

- N/A (초기 버전)

#### Security

- SQL Injection 방지 (Prisma ORM 사용)
- XSS 방지 (React 자동 이스케이프)
- CSRF 방지 준비 (향후 구현)
- 입력 검증 (모든 엔드포인트)

---

## [Unreleased] (예정)

### 계획 중인 기능

#### [0.2.0] - 예정

- **폴더 기능**
  - Folder 모델 추가
  - 폴더별 Word Set 조직
  - 폴더 생성/수정/삭제
  - 폴더 탐색 UI

- **성능 개선**
  - 가상화 목록 (무한 스크롤)
  - 데이터베이스 쿼리 최적화
  - API 응답 캐싱
  - 번들 사이즈 최적화

- **UX 개선**
  - 일괄 작업 (다중 선택 삭제)
  - 데이터 내보내기 (CSV, JSON)
  - 데이터 가져오기 (CSV, JSON)
  - 검색 및 필터링

#### [0.3.0] - 예정

- **사용자 인증**
  - NextAuth.js 통합
  - 회원가입/로그인
  - 사용자별 데이터 격리
  - 프로필 관리

- **공유 기능**
  - Word Set 공유 링크 생성
  - 읽기 전용 공유
  - 협력 편집 (향후)

- **사용자 경험**
  - 테마 지원 (다크 모드)
  - 언어 지원 (i18n)
  - 접근성 개선 (WCAG 2.1)

#### [0.4.0] - 예정

- **고급 기능**
  - 단어 발음 (음성 지원)
  - 이미지 지원
  - 태그 기능
  - 즐겨찾기

- **학습 기능**
  - 간격 반복 알고리즘
  - 학습 진도 추적
  - 통계 및 분석
  - 학습 목표 설정

#### [0.5.0] - 예정

- **모바일 앱**
  - React Native 앱 개발
  - iOS/Android 배포
  - 오프라인 지원

- **고급 분석**
  - 사용자 행동 분석
  - 학습 효율성 분석
  - 대시보드

---

## 버전 관리 정책

### 버전 번호 (Semantic Versioning)

- **MAJOR** (첫 자리): 호환 불가능한 변경 사항
  - 예: 데이터베이스 스키마 변경, API 엔드포인트 제거
- **MINOR** (둘째 자리): 호환 가능한 기능 추가
  - 예: 새로운 API 엔드포인트, 새로운 기능
- **PATCH** (셋째 자리): 버그 수정
  - 예: 작은 버그 수정, 성능 개선

### 릴리스 프로세스

1. **개발 단계**: `main` 브랜치에서 기능 개발
2. **테스트 단계**: 90% 테스트 커버리지 달성
3. **릴리스 준비**: CHANGELOG 업데이트, 버전 번호 변경
4. **릴리스**: 태그 생성 및 배포
5. **문서 업데이트**: 모든 관련 문서 최신화

### 지원 정책

- **LTS (Long Term Support)**: v0.1.0 이상 (12개월)
- **Current Release**: 최신 마이너 버전 (3개월)

---

## 마이그레이션 가이드

### v0.1.0에서 v0.2.0로 업그레이드 (예정)

```bash
# 1. 코드 업데이트
git pull origin main

# 2. 의존성 업데이트
npm install

# 3. 데이터베이스 마이그레이션
npm run prisma:migrate

# 4. 서버 재시작
npm run dev
```

**주의사항**:
- `folderId` 필드 사용 시작
- Folder 모델 추가로 인한 스키마 변경
- API 응답 형식 변경 없음 (호환성 유지)

---

## 알려진 문제 (Known Issues)

### v0.1.0

- **없음** - 초기 버전은 테스트 완료 상태

---

## 기여 가이드

### 버그 리포트

1. 기존 이슈 검색
2. 재현 단계 작성
3. 예상/실제 결과 설명
4. 스크린샷 또는 로그 첨부

### 기능 요청

1. 기존 요청 검색
2. 명확한 설명 작성
3. 사용 사례 제시
4. 가능한 구현 방법 제안

### 풀 리퀘스트

1. 이슈와 연계
2. 테스트 포함
3. CHANGELOG 업데이트
4. 문서 업데이트

---

## 릴리스 노트

### v0.1.0 - 2025-11-24

**초기 출시**

- 단어 세트 CRUD 기능
- 단어 CRUD 기능
- REST API 8개 엔드포인트
- 반응형 UI
- 테스트 환경 설정
- 문서 완성

**설치**:
```bash
npm install
npm run prisma:migrate
npm run dev
```

**테스트**:
```bash
npm run test
npm run test:e2e
npm run test:coverage
```

---

## 요청 및 피드백

- **GitHub Issues**: [버그 리포트](https://github.com)
- **GitHub Discussions**: [기능 요청](https://github.com)
- **Email**: [support@example.com]

---

## 라이선스

ISC License - [LICENSE](../LICENSE) 파일 참조

---

**마지막 업데이트**: 2025-11-25
**SPEC 참조**: SPEC-WORDSET-001 (v0.1.0)
**작성자**: @user
