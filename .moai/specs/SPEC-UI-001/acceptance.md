---
id: SPEC-UI-001
version: 0.1.0
status: draft
created: 2025-11-26
updated: 2025-11-26
author: "@user"
priority: high
---

# @SPEC-UI-001 Acceptance Criteria

## 목차

1. [시나리오별 인수 기준](#시나리오별-인수-기준)
2. [테스트 시나리오](#테스트-시나리오)
3. [품질 게이트 기준](#품질-게이트-기준)
4. [검증 방법](#검증-방법)

---

## 시나리오별 인수 기준

### AC-1: 타이포그래피 시스템 적용

**GIVEN** 시스템이 렌더링될 때
**WHEN** 모든 페이지를 확인하면
**THEN**
- Pretendard/Inter 폰트가 적용되어 있다
- 제목, 본문, 캡션 등 계층적 크기가 명확하다
- 행간이 1.5-1.8 범위로 설정되어 가독성이 향상되었다
- 폰트 로딩 시 레이아웃 시프트가 발생하지 않는다 (CLS < 0.1)

**검증 방법**:
```typescript
// E2E 테스트 (Playwright)
test('타이포그래피 폰트 적용 확인', async ({ page }) => {
  await page.goto('/wordsets');
  const heading = page.locator('h1').first();
  const fontFamily = await heading.evaluate((el) =>
    window.getComputedStyle(el).fontFamily
  );
  expect(fontFamily).toContain('Pretendard');
});

// 성능 테스트 (Lighthouse)
test('CLS < 0.1', async () => {
  const report = await lighthouse('http://localhost:3000');
  expect(report.lhr.audits['cumulative-layout-shift'].numericValue).toBeLessThan(0.1);
});
```

**수동 검증**:
- 브라우저 개발자 도구 → Computed 탭 → font-family 확인
- 시각적으로 타이포그래피 계층 확인 (제목 vs 본문)

---

### AC-2: 컬러 시스템 일관성

**GIVEN** 시스템 전체를 확인할 때
**WHEN** UI 요소에 적용된 색상을 검사하면
**THEN**
- Primary 색상이 일관되게 적용되어 있다 (버튼, 링크, 활성 상태)
- Success, Warning, Error 시맨틱 색상이 적절히 사용된다
- 색상 대비율이 WCAG AA 기준(4.5:1 이상)을 충족한다
- 색상만으로 정보를 전달하지 않는다 (아이콘, 텍스트 병행)

**검증 방법**:
```typescript
// 접근성 테스트 (jest-axe)
import { axe, toHaveNoViolations } from 'jest-axe';

test('색상 대비율 WCAG AA 준수', async () => {
  const { container } = render(<Button variant="primary">저장</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// 대비율 계산 유틸리티
function getContrastRatio(foreground: string, background: string): number {
  // WCAG contrast ratio 계산
  // ...
}

test('Primary 버튼 대비율 > 4.5', () => {
  const ratio = getContrastRatio('#ffffff', '#2563eb'); // primary-600
  expect(ratio).toBeGreaterThanOrEqual(4.5);
});
```

**수동 검증**:
- Chrome DevTools → Accessibility → Contrast ratio 확인
- 온라인 도구 (WebAIM Contrast Checker)

---

### AC-3: 버튼 컴포넌트 일관성

**GIVEN** 버튼 컴포넌트가 렌더링될 때
**WHEN** 다양한 변형(primary, outline, ghost)과 크기(sm, md, lg)를 확인하면
**THEN**
- 모든 변형이 일관된 스타일을 갖는다 (패딩, 모서리, 폰트 크기)
- 호버 시 배경색 또는 테두리가 변경된다
- 포커스 시 명확한 아웃라인(ring)이 표시된다
- 클릭 시 시각적 피드백(scale, shadow)이 제공된다
- 비활성화(disabled) 상태가 명확히 표시된다 (투명도, 커서)
- 로딩(loading) 상태 시 스피너가 표시된다

**검증 방법**:
```typescript
// 단위 테스트 (React Testing Library)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('버튼 호버 효과', async () => {
  render(<Button variant="primary">저장</Button>);
  const button = screen.getByRole('button', { name: '저장' });

  await userEvent.hover(button);
  expect(button).toHaveClass('hover:bg-primary-700');
});

test('버튼 비활성화 상태', () => {
  render(<Button disabled>저장</Button>);
  const button = screen.getByRole('button', { name: '저장' });

  expect(button).toBeDisabled();
  expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
});

test('버튼 로딩 상태', () => {
  render(<Button loading>저장 중...</Button>);
  expect(screen.getByRole('status')).toBeInTheDocument(); // 스피너
});
```

**시각적 회귀 테스트**:
```typescript
// Playwright 스크린샷 비교
test('버튼 변형 시각적 회귀', async ({ page }) => {
  await page.goto('/test/buttons');
  await expect(page).toHaveScreenshot('buttons.png');
});
```

---

### AC-4: 카드 컴포넌트 호버 효과

**GIVEN** 단어 세트 또는 폴더 카드가 렌더링될 때
**WHEN** 마우스를 호버하면
**THEN**
- 그림자가 `shadow-sm` → `shadow-lg`로 변경된다
- 트랜지션이 스무스하게 적용된다 (300ms ease-in-out)
- 클릭 가능한 영역이 명확히 표시된다 (cursor-pointer)
- 카드 내부 요소가 정렬되고 여백이 일관적이다

**검증 방법**:
```typescript
// E2E 테스트 (Playwright)
test('카드 호버 효과', async ({ page }) => {
  await page.goto('/wordsets');
  const card = page.locator('.wordset-card').first();

  await card.hover();
  const shadowClass = await card.getAttribute('class');
  expect(shadowClass).toContain('shadow-lg');
});

// 트랜지션 확인
test('카드 트랜지션 스무스', async ({ page }) => {
  await page.goto('/wordsets');
  const card = page.locator('.wordset-card').first();

  const transition = await card.evaluate((el) =>
    window.getComputedStyle(el).transition
  );
  expect(transition).toContain('300ms');
  expect(transition).toContain('ease-in-out');
});
```

---

### AC-5: 입력 필드 에러 상태

**GIVEN** 입력 필드에 유효하지 않은 값이 입력될 때
**WHEN** 에러 상태가 표시되면
**THEN**
- 테두리가 붉은색(`border-error-500`)으로 변경된다
- 에러 메시지가 필드 하단에 표시된다
- ARIA 속성이 추가된다 (`aria-invalid="true"`, `aria-describedby`)
- 스크린 리더가 에러 메시지를 읽는다
- 포커스 시 에러 상태가 유지된다

**검증 방법**:
```typescript
// 단위 테스트 (React Testing Library)
test('입력 필드 에러 상태', () => {
  render(
    <Input
      label="세트 이름"
      error="이름을 입력해주세요"
      value=""
      onChange={() => {}}
    />
  );

  const input = screen.getByLabelText('세트 이름');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveClass('border-error-500');

  const errorMsg = screen.getByText('이름을 입력해주세요');
  expect(errorMsg).toBeInTheDocument();
  expect(errorMsg).toHaveClass('text-error-600');
});

// 접근성 테스트
test('입력 필드 ARIA 속성', () => {
  const { container } = render(
    <Input label="세트 이름" error="에러 메시지" value="" onChange={() => {}} />
  );

  const input = container.querySelector('input');
  expect(input).toHaveAttribute('aria-describedby');

  const errorId = input?.getAttribute('aria-describedby');
  const errorMsg = container.querySelector(`#${errorId}`);
  expect(errorMsg?.textContent).toBe('에러 메시지');
});
```

---

### AC-6: 레이아웃 반응형

**GIVEN** 다양한 화면 크기에서 접근할 때
**WHEN** 모바일(375px), 태블릿(768px), 데스크톱(1920px)을 확인하면
**THEN**
- **모바일 (< 768px)**: 1열 그리드, 패딩 16px
- **태블릿 (768px-1024px)**: 2열 그리드, 패딩 24px
- **데스크톱 (> 1024px)**: 3열 또는 4열 그리드, 패딩 32px
- 모든 요소가 올바르게 정렬되고 잘림이 없다
- 터치 타겟 크기가 최소 44x44px이다 (모바일)

**검증 방법**:
```typescript
// E2E 테스트 (Playwright - 다양한 뷰포트)
test.describe('반응형 레이아웃', () => {
  test('모바일 1열 그리드', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/wordsets');

    const grid = page.locator('.grid');
    const columns = await grid.evaluate((el) =>
      window.getComputedStyle(el).gridTemplateColumns
    );
    expect(columns.split(' ').length).toBe(1); // 1열
  });

  test('태블릿 2열 그리드', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/wordsets');

    const grid = page.locator('.grid');
    const columns = await grid.evaluate((el) =>
      window.getComputedStyle(el).gridTemplateColumns
    );
    expect(columns.split(' ').length).toBe(2); // 2열
  });

  test('데스크톱 3열 그리드', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/wordsets');

    const grid = page.locator('.grid');
    const columns = await grid.evaluate((el) =>
      window.getComputedStyle(el).gridTemplateColumns
    );
    expect(columns.split(' ').length).toBe(3); // 3열
  });
});
```

**시각적 회귀 테스트**:
```typescript
test('반응형 스크린샷 비교', async ({ page }) => {
  await page.goto('/wordsets');

  // 모바일
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot('mobile.png');

  // 태블릿
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page).toHaveScreenshot('tablet.png');

  // 데스크톱
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(page).toHaveScreenshot('desktop.png');
});
```

---

### AC-7: 로딩 스켈레톤 UI

**GIVEN** 데이터 로딩 중일 때
**WHEN** 단어 세트 목록 페이지를 확인하면
**THEN**
- 카드 모양의 스켈레톤 UI가 3개 이상 표시된다
- Pulse 애니메이션이 적용된다
- 실제 데이터 로드 시 스무스하게 전환된다
- 로딩 중임을 나타내는 ARIA 속성이 추가된다 (`aria-busy="true"`)

**검증 방법**:
```typescript
// E2E 테스트 (Playwright - 네트워크 지연 시뮬레이션)
test('로딩 스켈레톤 UI', async ({ page }) => {
  // 네트워크 속도 제한
  await page.route('**/api/wordsets', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 지연
    await route.continue();
  });

  await page.goto('/wordsets');

  // 스켈레톤 UI 확인
  const skeleton = page.locator('[data-testid="skeleton"]');
  await expect(skeleton).toBeVisible();

  // Pulse 애니메이션 확인
  const animation = await skeleton.evaluate((el) =>
    window.getComputedStyle(el).animation
  );
  expect(animation).toContain('pulse');

  // 데이터 로드 후 스켈레톤 사라짐
  await page.waitForSelector('[data-testid="skeleton"]', { state: 'hidden' });
  await expect(page.locator('.wordset-card')).toBeVisible();
});
```

---

### AC-8: 접근성 기준 준수 (WCAG 2.1 AA)

**GIVEN** 시스템 전체를 확인할 때
**WHEN** 접근성 검사를 수행하면
**THEN**
- **색상 대비율**: 일반 텍스트 4.5:1 이상, 큰 텍스트 3:1 이상
- **키보드 네비게이션**: 모든 인터랙티브 요소가 Tab 키로 접근 가능
- **포커스 인디케이터**: 명확한 아웃라인 (ring-2, primary-500)
- **ARIA 레이블**: 버튼, 링크, 입력 필드에 적절한 레이블
- **스크린 리더**: 모든 콘텐츠가 읽기 가능
- **제목 계층**: h1 → h2 → h3 순서 준수

**검증 방법**:
```typescript
// Lighthouse 접근성 점수
test('Lighthouse 접근성 점수 90 이상', async () => {
  const report = await lighthouse('http://localhost:3000');
  const accessibilityScore = report.lhr.categories.accessibility.score * 100;
  expect(accessibilityScore).toBeGreaterThanOrEqual(90);
});

// jest-axe 자동 테스트
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('접근성 위반 없음', async () => {
  const { container } = render(<WordSetList />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// 키보드 네비게이션 테스트
test('키보드 네비게이션', async ({ page }) => {
  await page.goto('/wordsets');

  // Tab 키로 버튼 포커스
  await page.keyboard.press('Tab');
  const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
  expect(focusedElement).toBe('BUTTON');

  // Enter 키로 클릭
  await page.keyboard.press('Enter');
  await page.waitForURL('**/wordsets/new');
});
```

**수동 검증**:
- 스크린 리더 테스트 (VoiceOver on macOS, NVDA on Windows)
- 키보드만으로 모든 기능 사용 가능 확인
- 색상 대비율 도구 (WebAIM Contrast Checker)

---

### AC-9: 성능 기준 충족

**GIVEN** 프로덕션 빌드를 확인할 때
**WHEN** Lighthouse 성능 검사를 수행하면
**THEN**
- **First Contentful Paint (FCP)**: < 1.5초
- **Largest Contentful Paint (LCP)**: < 2.5초
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5초
- **번들 크기 증가**: < 50KB (gzip)

**검증 방법**:
```typescript
// Lighthouse 성능 테스트
test('Lighthouse 성능 점수 90 이상', async () => {
  const report = await lighthouse('http://localhost:3000');
  const performanceScore = report.lhr.categories.performance.score * 100;
  expect(performanceScore).toBeGreaterThanOrEqual(90);

  // Core Web Vitals
  const metrics = report.lhr.audits;
  expect(metrics['first-contentful-paint'].numericValue).toBeLessThan(1500);
  expect(metrics['largest-contentful-paint'].numericValue).toBeLessThan(2500);
  expect(metrics['cumulative-layout-shift'].numericValue).toBeLessThan(0.1);
});

// 번들 크기 분석
test('번들 크기 증가 < 50KB', async () => {
  const beforeSize = await getBundleSize('before');
  const afterSize = await getBundleSize('after');
  const increase = afterSize - beforeSize;

  expect(increase).toBeLessThan(50 * 1024); // 50KB
});
```

**수동 검증**:
- `npm run build` 후 번들 크기 확인
- Chrome DevTools → Network 탭에서 리소스 크기 확인
- WebPageTest (https://www.webpagetest.org) 성능 측정

---

### AC-10: 기존 기능 호환성 (회귀 테스트)

**GIVEN** SPEC-WORDSET-001, SPEC-FOLDER-001 기능이 구현되어 있을 때
**WHEN** UI 개선 후 모든 기능을 테스트하면
**THEN**
- **단어 세트 CRUD**: 생성, 조회, 수정, 삭제가 정상 동작한다
- **폴더 CRUD**: 생성, 조회, 수정, 삭제가 정상 동작한다
- **폴더 필터링**: 폴더별 단어 세트 조회가 정상 동작한다
- **단어 추가/수정/삭제**: 모든 단어 관리 기능이 정상 동작한다
- **기존 E2E 테스트**: 모두 통과한다

**검증 방법**:
```typescript
// 기존 E2E 테스트 전체 실행
test.describe('회귀 테스트', () => {
  test('단어 세트 생성 및 조회', async ({ page }) => {
    // SPEC-WORDSET-001 기능 테스트
    await page.goto('/wordsets');
    await page.click('text=새 세트 만들기');

    await page.fill('input[name="name"]', 'TOEFL 단어');
    await page.fill('textarea[name="description"]', 'TOEFL 시험 대비');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/wordsets\/\w+/);
    await expect(page.locator('h1')).toContainText('TOEFL 단어');
  });

  test('폴더 생성 및 필터링', async ({ page }) => {
    // SPEC-FOLDER-001 기능 테스트
    await page.goto('/folders');
    await page.click('text=새 폴더 만들기');

    await page.fill('input[name="name"]', 'TOEFL');
    await page.click('button[type="submit"]');

    await expect(page.locator('.folder-card')).toContainText('TOEFL');
  });
});

// API 호출 확인 (변경 없음)
test('API 호출 변경 없음', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));

  await page.goto('/wordsets');

  expect(requests.some((url) => url.includes('/api/wordsets'))).toBe(true);
  expect(requests.some((url) => url.includes('/api/wordsets?folderId='))).toBe(true);
});
```

---

## 테스트 시나리오

### 시나리오 1: 새 사용자의 첫 방문 (빈 상태)
**GIVEN** 신규 사용자가 처음 애플리케이션에 접속할 때
**WHEN** 홈페이지에 접근하면
**THEN**
1. 명확한 제목과 설명이 표시된다
2. "세트 목록으로 이동" 버튼이 Primary 스타일로 표시된다
3. 버튼 클릭 시 `/wordsets` 페이지로 이동한다
4. 빈 상태 메시지와 "세트 생성하기" 버튼이 표시된다

---

### 시나리오 2: 단어 세트 생성 및 조회 (전체 플로우)
**GIVEN** 사용자가 `/wordsets` 페이지에 있을 때
**WHEN** "새 세트 만들기" 버튼을 클릭하고 정보를 입력한 후 저장하면
**THEN**
1. 입력 필드가 포커스 스타일로 표시된다
2. 유효성 검사 에러 시 명확한 에러 메시지가 표시된다
3. 저장 성공 시 세트 상세 페이지로 이동한다
4. 세트 목록에 새 카드가 추가되고 호버 효과가 적용된다

---

### 시나리오 3: 모바일 환경에서 폴더 관리
**GIVEN** 모바일 사용자(375px)가 `/folders` 페이지에 접근할 때
**WHEN** 폴더 목록을 확인하고 새 폴더를 생성하면
**THEN**
1. 폴더 카드가 1열로 정렬된다
2. 터치 타겟이 최소 44x44px이다
3. 입력 폼이 모바일에 최적화되어 표시된다
4. 키보드가 열릴 때 레이아웃 시프트가 없다

---

## 품질 게이트 기준

### Definition of Done (DoD)

- ✅ **기능 완성도**: 모든 FR-1~FR-8 요구사항 구현 완료
- ✅ **테스트 커버리지**: 단위 테스트 90% 이상
- ✅ **E2E 테스트**: 주요 시나리오 100% 커버
- ✅ **접근성**: Lighthouse 접근성 점수 90 이상
- ✅ **성능**: Lighthouse 성능 점수 90 이상
- ✅ **회귀 테스트**: 기존 테스트 모두 통과
- ✅ **시각적 회귀**: Playwright 스크린샷 비교 통과
- ✅ **코드 리뷰**: 최소 1명 이상 승인
- ✅ **문서화**: SPEC, Implementation Summary 업데이트

### TRUST 5 기준 검증

#### 1. Test-first (테스트 우선)
- ✅ TDD 사이클로 개발 (RED → GREEN → REFACTOR)
- ✅ 테스트 커버리지 90% 이상
- ✅ 시각적 회귀 테스트 포함

#### 2. Readable (가독성)
- ✅ 타이포그래피 시스템 적용
- ✅ 명확한 컴포넌트 구조 (Compound Component)
- ✅ TypeScript 타입 안전성

#### 3. Unified (통일성)
- ✅ 재사용 가능한 UI 컴포넌트 라이브러리
- ✅ 일관된 디자인 토큰 (색상, 폰트, 스페이싱)
- ✅ 스타일 가이드 준수

#### 4. Secured (보안)
- ✅ XSS 방지 (React 기본 이스케이프)
- ✅ ARIA 속성으로 접근성 향상
- ✅ 입력 검증 유지

#### 5. Trackable (추적 가능)
- ✅ Git 커밋 히스토리 명확
- ✅ SPEC → Implementation 매핑
- ✅ 변경 이력 문서화

---

## 검증 방법

### 자동화 테스트

**단위 테스트 (Jest + React Testing Library)**:
```bash
npm run test
npm run test:coverage
```

**E2E 테스트 (Playwright)**:
```bash
npm run test:e2e
```

**접근성 테스트 (jest-axe)**:
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
```

**성능 테스트 (Lighthouse CI)**:
```bash
npm run lighthouse
```

---

### 수동 테스트

**브라우저 테스트**:
- Chrome, Firefox, Safari, Edge (최신 2개 버전)
- 모바일 브라우저 (iOS Safari, Chrome on Android)

**반응형 테스트**:
- 모바일: 375px, 414px
- 태블릿: 768px, 1024px
- 데스크톱: 1920px, 2560px

**접근성 테스트**:
- 키보드 네비게이션 (Tab, Enter, Esc)
- 스크린 리더 (VoiceOver, NVDA, JAWS)
- 색상 대비율 도구 (WebAIM Contrast Checker)

**성능 테스트**:
- Chrome DevTools → Lighthouse
- WebPageTest (https://www.webpagetest.org)
- Bundle Analyzer (next build --analyze)

---

**END OF ACCEPTANCE CRITERIA**
