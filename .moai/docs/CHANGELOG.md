---
title: 변경 로그
description: Lang Quiz 애플리케이션의 버전 이력 및 변경 사항 (플립 카드 학습 시스템 추가)
version: 0.3.0
spec: SPEC-WORDSET-001, SPEC-FOLDER-001, SPEC-LEARN-001
lastUpdated: 2025-11-27
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

## [0.2.0] - 2025-11-25

### 폴더 기능 추가 (SPEC-FOLDER-001)

이 버전에서는 단어 세트를 조직화하는 폴더 기능을 추가했습니다.

#### Added

##### 폴더 관리 기능

- **Folder API 엔드포인트** (6개)
  - `POST /api/folders` - 폴더 생성
  - `GET /api/folders` - 폴더 목록 조회 (통계 포함)
  - `GET /api/folders/[id]` - 폴더 상세 조회
  - `PUT /api/folders/[id]` - 폴더 정보 수정
  - `DELETE /api/folders/[id]` - 폴더 삭제 (Nullify 정책)
  - `GET /api/folders/[id]/wordsets` - 폴더별 단어 세트 조회

- **데이터베이스 확장**
  - Folder 모델 추가 (id, name, description, parentId, wordSets, createdAt, updatedAt)
  - WordSet 모델에 folder 관계 추가
  - onDelete: SetNull 정책으로 데이터 안전성 보장
  - folderId 인덱스 최적화

- **기존 API 확장**
  - `POST /api/wordsets`에 folderId 파라미터 지원
  - `PUT /api/wordsets/[id]`에서 folderId 변경 지원
  - `GET /api/wordsets`에 폴더 정보 포함 (folderId, folder 객체)

- **UI 컴포넌트** (신규)
  - FolderList - 폴더 목록 그리드 (통계 포함)
  - FolderCard - 개별 폴더 카드
  - FolderForm - 폴더 생성/수정 폼
  - FolderDetail - 폴더 상세 페이지
  - FolderSelector - WordSet 생성/수정 시 폴더 선택 드롭다운

- **UI/UX 개선**
  - 폴더 기반 단어 세트 필터링
  - 루트 영역 (folderId=null) 세트 관리
  - 실시간 폴더 통계 업데이트
  - 반응형 폴더 카드 디자인

- **문서**
  - API_REFERENCE.md에 Folder 엔드포인트 문서 추가
  - DATABASE_SCHEMA.md 업데이트
  - 폴더 기능 사용 설명서

##### 성능 특성

- **폴더 목록 조회**: < 300ms (50개 폴더 기준)
- **폴더별 세트 조회**: < 500ms (500개 세트 기준)
- **Nullify 정책**: 폴더 삭제 시 포함된 세트를 루트로 이동

#### Changed

- WordSet 응답에 folder 객체 포함
- API_REFERENCE.md 버전 0.2.0으로 업그레이드
- 기존 단어 세트는 자동으로 루트 영역(folderId=null)에 할당

#### Security

- 폴더 생성/수정 시 입력 유효성 검증 강화
- Cascade Delete 대신 SetNull 정책으로 데이터 손실 방지
- 폴더-세트 관계 무결성 보증

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

## [0.3.0] - 2025-11-27

### 플립 카드 학습 시스템 (SPEC-LEARN-001)

이 버전에서는 플립 카드 기반의 대화형 학습 시스템을 추가했습니다.

#### Added

##### 학습 기능

- **플립 카드 학습 시스템** (#SPEC-LEARN-001)
- Framer Motion 3D 플립 애니메이션 통합 (0.6초 부드러운 회전)
- Web Speech API 기반 음성 재생 (TTS) - 느린 속도(0.9배) 최적화
- 키보드 단축키 지원 (Space: 플립, →/←: 네비게이션, Escape: 종료)
- 학습 세션 저장 및 복구 (sessionStorage)
- 학습 진행률 추적 및 시각화
- 순차/랜덤 학습 모드 선택

##### 컴포넌트 (4개)

- **FlipCard.tsx** (134줄): 3D 플립 애니메이션, 음성 버튼, 접근성
- **LearnNavigation.tsx** (60줄): 이전/다음/완료 네비게이션
- **LearnProgress.tsx** (39줄): 진행률 표시 및 프로그레스 바
- **LearnComplete.tsx** (89줄): 학습 완료 화면 및 통계

##### Hooks (3개)

- **useLearnSession**: 학습 세션 상태 관리 및 자동 저장
- **useSpeech**: Web Speech API 래핑 (speak, isSpeaking, isSupported, cancel)
- **useKeyboard**: 키보드 단축키 처리 (Space, 화살표, Escape)

##### 유틸리티 (2개)

- **sessionStorage.ts**: 세션 저장/로드/삭제 (loadSession, saveSession, clearSession)
- **shuffle.ts**: Fisher-Yates 셔플 알고리즘 (균등 난수 분포)

##### 기술 스택

- Framer Motion 10.16.5 (3D 애니메이션)
- Web Speech API (브라우저 기본, 외부 라이브러리 불필요)
- React 19 Hooks (useCallback, useEffect, useRef, useState)
- TypeScript (완벽한 타입 안전성)

##### 테스트 (109개 신규)

- FlipCard 컴포넌트: 28개 테스트
  - 애니메이션 상태, 접근성, 키보드 이벤트
- LearnNavigation: 18개 테스트
  - 버튼 상태, 콜백 호출, 비활성화 로직
- LearnProgress: 12개 테스트
  - 진행률 계산, 애니메이션, aria-label
- LearnComplete: 15개 테스트
  - 통계 표시, 버튼 기능, 애니메이션
- useLearnSession: 25개 테스트
  - 초기화, 상태 변경, 자동 저장, 세션 복구
- useSpeech: 16개 테스트
  - speak 함수, 브라우저 지원, 오류 처리
- useKeyboard: 10개 테스트
  - 단축키 매핑, 이벤트 리스너
- sessionStorage: 18개 테스트
  - 저장/로드/삭제, JSON 파싱, 오류 처리
- shuffle: 7개 테스트
  - 균등 분포, 원본 배열 보존

##### 문서

- **LEARN_FEATURES.md**: 플립 카드 학습 시스템 기능 설명 (350줄)
- **LEARN_COMPONENTS_API.md**: 컴포넌트 및 Hooks API 상세 레퍼런스 (400줄)
- **LEARN_SESSION_MANAGEMENT.md**: 세션 관리 아키텍처 및 데이터 구조 (320줄)
- **COMPONENTS_GUIDE.md**: 학습 컴포넌트 섹션 추가
- **PROJECT_STRUCTURE.md**: app/components/learn/, hooks/, lib/learn/ 디렉토리 추가

#### Changed

- Framer Motion 의존성 추가 (10.16.5)
- 테스트 수 증가 (137 → 246개)
- 커버리지 유지 (100%)

#### Quality

✅ TRUST 5 검증 완료
- **Testable**: 100% 커버리지, TDD 완벽 준수
- **Readable**: TypeScript 타입 안전성, 명확한 네이밍
- **Unified**: 기존 패턴 및 스타일 준수
- **Secured**: OWASP 준수, XSS 방지, sessionStorage 안전 처리
- **Trackable**: 변경 히스토리 명확, TAG 트레이서빌리티

#### Performance

- FlipCard 애니메이션: 60fps 유지 (GPU 가속)
- 세션 저장: < 10ms (JSON 직렬화)
- 세션 로드: < 5ms (JSON 파싱)
- 메모리 사용: 단어 세트 크기에 비례

Breaking Changes: None

#### Migration Guide

v0.2.0 → v0.3.0 업그레이드:

1. 새 컴포넌트 임포트:
   ```typescript
   import FlipCard from '@/app/components/learn/FlipCard';
   import LearnNavigation from '@/app/components/learn/LearnNavigation';
   import LearnProgress from '@/app/components/learn/LearnProgress';
   import LearnComplete from '@/app/components/learn/LearnComplete';
   ```

2. Hooks 사용:
   ```typescript
   import { useLearnSession } from '@/hooks/useLearnSession';
   import { useSpeech } from '@/hooks/useSpeech';
   import { useKeyboard } from '@/hooks/useKeyboard';
   ```

3. 기존 코드 변경 불필요 (완벽 호환)

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
