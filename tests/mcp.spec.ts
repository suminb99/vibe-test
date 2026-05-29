import { test, expect, type Page } from '@playwright/test';

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────

const STORAGE_KEY = 'shinhan_parsed_statement';

const MOCK_STATEMENT = {
  uploadedAt: new Date().toISOString(),
  transactions: [
    { id: '2024-01-15-스타벅스-0', date: '2024-01-15', merchant: '스타벅스', amount: 6500,  category: '카페', isCancel: false },
    { id: '2024-01-20-쿠팡-1',     date: '2024-01-20', merchant: '쿠팡',     amount: 35000, category: '쇼핑', isCancel: false },
    { id: '2024-01-10-버거킹-2',   date: '2024-01-10', merchant: '버거킹',   amount: 8500,  category: '식비', isCancel: false },
    { id: '2024-01-05-지하철-3',   date: '2024-01-05', merchant: '지하철',   amount: 1400,  category: '교통', isCancel: false },
    { id: '2024-01-22-넷플릭스-4', date: '2024-01-22', merchant: '넷플릭스', amount: 13500, category: '구독서비스', isCancel: false },
    { id: '2024-01-18-마트-5',     date: '2024-01-18', merchant: '이마트',   amount: 52000, category: '쇼핑', isCancel: true  },
  ],
};

/** localStorage에 mock 명세서를 주입하는 헬퍼 (page.goto 전에 호출) */
async function seedStorage(page: Page, data = MOCK_STATEMENT) {
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: data }
  );
}

// ─────────────────────────────────────────────
// Page Object: Locators
// ─────────────────────────────────────────────

const locators = {

  /* ── 전역 헤더 ── */
  header: {
    // AppHeader는 랜딩(/)을 제외한 모든 페이지에 존재 → /upload 기준으로 검증
    appTitle: (page: Page) =>
      page.locator('header').getByRole('link', { name: /카드 가계부/ }),
    themeToggle: (page: Page) =>
      page.locator('header').getByRole('button'),
  },

  /* ── 랜딩 페이지 (/) ── */
  landing: {
    heroTitle:      (page: Page) => page.locator('h1').filter({ hasText: '카드 명세서' }),
    ctaPrimary:     (page: Page) => page.getByRole('button', { name: '명세서 업로드하고 분석 시작하기' }).first(),
    ctaSecondary:   (page: Page) => page.getByRole('button', { name: '대시보드 바로 가기' }),
    problemSection: (page: Page) => page.locator('h2').filter({ hasText: '이런 불편함' }),
    featureSection: (page: Page) => page.locator('h2').filter({ hasText: '이렇게 해결' }),
  },

  /* ── 업로드 페이지 (/upload) ── */
  upload: {
    pageTitle:    (page: Page) => page.locator('h1').filter({ hasText: '명세서 업로드' }),
    dropZone:     (page: Page) => page.locator('label').filter({ hasText: '파일을 드래그하거나' }),
    fileInput:    (page: Page) => page.locator('input[type="file"][accept=".xlsx,.xls"]'),
    uploadButton: (page: Page) => page.getByRole('button', { name: '업로드하고 분석 시작' }),
    dashboardLink:(page: Page) => page.getByRole('button', { name: '대시보드로 이동' }),
    guide:        (page: Page) => page.locator('p').filter({ hasText: '신한카드 앱' }),
    errorMessage: (page: Page) => page.locator('text=.xlsx 또는 .xls 파일만'),
  },

  /* ── 대시보드 (/dashboard) ── */
  dashboard: {
    // 빈 상태
    emptyTitle:     (page: Page) => page.locator('h3').filter({ hasText: '분석할 명세서가 없어요' }),
    uploadButton:   (page: Page) => page.getByRole('button', { name: '명세서 업로드하기' }),
    // 데이터 있는 상태
    newUploadButton:(page: Page) => page.getByRole('button', { name: '새 명세서 업로드' }),
    monthlyToggle:  (page: Page) => page.getByRole('button', { name: '월간' }),
    yearlyToggle:   (page: Page) => page.getByRole('button', { name: '연간' }),
    /** 기간 카드 중 특정 label을 가진 카드 */
    periodCard:     (page: Page, label: string) =>
      page.locator('p').filter({ hasText: label }).locator('../..'),
  },

  /* ── 기간 상세 (/dashboard/[period]) ── */
  period: {
    breadcrumb:          (page: Page) => page.locator('nav[aria-label="breadcrumb"]'),
    breadcrumbDashboard: (page: Page) =>
      page.locator('nav[aria-label="breadcrumb"] button').filter({ hasText: '대시보드' }),
    periodTitle:   (page: Page) => page.locator('h1'),
    totalAmount:   (page: Page) => page.locator('p.text-3xl'),
    txCount:       (page: Page) => page.locator('p').filter({ hasText: '건의 결제' }),
    donutChart:    (page: Page) => page.locator('.recharts-wrapper'),
    tabTransactions:(page: Page) => page.getByRole('button', { name: '전체 결제 내역' }),
    tabCategories: (page: Page) => page.getByRole('button', { name: '카테고리별 지출' }),
  },

  /* ── 카테고리 아코디언 ── */
  accordion: {
    /** 카테고리 헤더 토글 버튼 */
    categoryToggle: (page: Page, category: string) =>
      page.getByRole('button').filter({ hasText: category }).first(),
    /** 아코디언 내 결제 건 버튼 (aria-label에 가맹점명 포함) */
    txItem: (page: Page, merchant: string) =>
      page.locator(`button[aria-label*="${merchant}"]`),
    /** 선택된 결제 건 (aria-pressed="true") */
    selectedItems: (page: Page) =>
      page.locator('button[aria-pressed="true"]'),
    /** 취소 거래는 아코디언에서 제외 — 선택 불가 */
    cancelBadge: (page: Page) =>
      page.locator('span').filter({ hasText: '취소' }),
  },

  /* ── 선택 패널 (데스크톱 우측) ── */
  selectionPanel: {
    /** 선택 없음 안내 텍스트 */
    emptyHint:    (page: Page) => page.locator('p').filter({ hasText: '항목을 클릭하면' }),
    /** "N건 선택됨" 헤더 */
    selectedCount:(page: Page) => page.locator('span').filter({ hasText: '건 선택됨' }),
    /** 초기화 버튼 (패널 내 첫 번째) */
    resetButton:  (page: Page) => page.locator('button[aria-label="선택 초기화"]').first(),
    /** 합산 금액 — '합계' 텍스트 span 바로 다음 형제 span */
    totalAmount:  (page: Page) =>
      page.getByText('합계', { exact: true })
        .locator('xpath=following-sibling::span[1]'),
    /** 선택 항목 리스트 */
    itemList:     (page: Page) => page.locator('ul[role="list"]'),
  },

  /* ── 모바일 하단 Sticky 바 ── */
  stickyBar: {
    /** sticky 바 컨테이너 */
    container:   (page: Page) => page.locator('[role="status"][aria-live="polite"]'),
    /** 초기화 버튼 */
    resetButton: (page: Page) =>
      page.locator('[role="status"] button[aria-label="선택 초기화"]'),
    /** 선택 요약 텍스트 ("N건 선택 · 합계 …") — aria-live="polite"로 Recharts tooltip p와 구분 */
    summary:     (page: Page) =>
      page.locator('[role="status"][aria-live="polite"] p'),
  },
};

// ─────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────

test.describe('헤더', () => {
  // AppHeader는 /upload, /dashboard 등 서브 페이지에 존재 (랜딩 페이지 제외)
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/upload');
  });

  test('앱 타이틀이 표시되고 홈으로 링크된다', async ({ page }) => {
    await expect(locators.header.appTitle(page)).toBeVisible();
    await expect(locators.header.appTitle(page)).toHaveAttribute('href', '/');
  });

  test('테마 토글 버튼이 존재한다', async ({ page }) => {
    await expect(locators.header.themeToggle(page)).toBeVisible();
  });

  test('테마 토글 클릭 시 data-theme 속성이 바뀐다', async ({ page }) => {
    const html = page.locator('html');
    const before = await html.getAttribute('data-theme');
    await locators.header.themeToggle(page).click();
    const after = await html.getAttribute('data-theme');
    expect(before).not.toBe(after);
  });
});

test.describe('랜딩 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('히어로 타이틀이 렌더링된다', async ({ page }) => {
    await expect(locators.landing.heroTitle(page)).toBeVisible();
  });

  test('기본 CTA 버튼이 보인다', async ({ page }) => {
    await expect(locators.landing.ctaPrimary(page)).toBeVisible();
  });

  test('보조 CTA 버튼이 보인다', async ({ page }) => {
    await expect(locators.landing.ctaSecondary(page)).toBeVisible();
  });

  test('문제 섹션이 표시된다', async ({ page }) => {
    await expect(locators.landing.problemSection(page)).toBeVisible();
  });

  test('기능 소개 섹션이 표시된다', async ({ page }) => {
    await expect(locators.landing.featureSection(page)).toBeVisible();
  });

  test('기본 CTA 클릭 시 /upload 로 이동한다', async ({ page }) => {
    await locators.landing.ctaPrimary(page).click();
    await expect(page).toHaveURL(/\/upload/);
  });

  test('대시보드 바로 가기 클릭 시 /dashboard 로 이동한다', async ({ page }) => {
    await locators.landing.ctaSecondary(page).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe('업로드 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/upload');
  });

  test('페이지 타이틀이 표시된다', async ({ page }) => {
    await expect(locators.upload.pageTitle(page)).toBeVisible();
  });

  test('드롭존이 표시된다', async ({ page }) => {
    await expect(locators.upload.dropZone(page)).toBeVisible();
  });

  test('파일 input이 존재한다 (hidden)', async ({ page }) => {
    await expect(locators.upload.fileInput(page)).toBeAttached();
  });

  test('업로드 버튼이 초기에 비활성화된다', async ({ page }) => {
    await expect(locators.upload.uploadButton(page)).toBeDisabled();
  });

  test('대시보드로 이동 버튼이 표시된다', async ({ page }) => {
    await expect(locators.upload.dashboardLink(page)).toBeVisible();
  });

  test('사용 가이드 텍스트가 표시된다', async ({ page }) => {
    await expect(locators.upload.guide(page)).toBeVisible();
  });

  test('xlsx 외 파일 선택 시 에러 메시지가 나타난다', async ({ page }) => {
    await locators.upload.fileInput(page).setInputFiles({
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake pdf'),
    });
    await expect(locators.upload.errorMessage(page)).toBeVisible();
  });

  test('.xlsx 파일 선택 시 업로드 버튼이 활성화된다', async ({ page }) => {
    await locators.upload.fileInput(page).setInputFiles({
      name: 'test.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from('fake xlsx'),
    });
    await expect(locators.upload.uploadButton(page)).toBeEnabled();
  });
});

test.describe('대시보드 — 데이터 없음', () => {
  test.beforeEach(async ({ page }) => {
    // localStorage 비워서 빈 상태 재현
    await page.goto('http://localhost:3000/dashboard');
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
  });

  test('빈 상태 메시지가 표시된다', async ({ page }) => {
    await expect(locators.dashboard.emptyTitle(page)).toBeVisible();
  });

  test('업로드하기 버튼이 표시된다', async ({ page }) => {
    await expect(locators.dashboard.uploadButton(page)).toBeVisible();
  });

  test('업로드 버튼 클릭 시 /upload 로 이동한다', async ({ page }) => {
    await locators.dashboard.uploadButton(page).click();
    await expect(page).toHaveURL(/\/upload/);
  });
});

test.describe('대시보드 — 데이터 있음', () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page);
    await page.goto('http://localhost:3000/dashboard');
  });

  test('새 명세서 업로드 버튼이 표시된다', async ({ page }) => {
    await expect(locators.dashboard.newUploadButton(page)).toBeVisible();
  });

  test('월간/연간 토글이 표시된다', async ({ page }) => {
    await expect(locators.dashboard.monthlyToggle(page)).toBeVisible();
    await expect(locators.dashboard.yearlyToggle(page)).toBeVisible();
  });

  test('기간 카드가 1개 이상 렌더링된다', async ({ page }) => {
    const cards = page.locator('[class*="rounded"]').filter({ hasText: '원' });
    await expect(cards.first()).toBeVisible();
  });

  test('localStorage 새로고침 후에도 데이터가 유지된다', async ({ page }) => {
    await page.reload();
    await expect(locators.dashboard.newUploadButton(page)).toBeVisible();
  });
});

test.describe('기간 상세 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page);
    await page.goto('http://localhost:3000/dashboard/2024-01');
  });

  test('브레드크럼이 표시된다', async ({ page }) => {
    await expect(locators.period.breadcrumb(page)).toBeVisible();
  });

  test('대시보드 브레드크럼 클릭 시 /dashboard 로 이동한다', async ({ page }) => {
    await locators.period.breadcrumbDashboard(page).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('기간 제목이 표시된다', async ({ page }) => {
    await expect(locators.period.periodTitle(page)).toContainText('2024년');
  });

  test('총 지출 금액이 표시된다', async ({ page }) => {
    await expect(locators.period.totalAmount(page)).toBeVisible();
  });

  test('결제 건수가 표시된다', async ({ page }) => {
    await expect(locators.period.txCount(page)).toBeVisible();
  });

  test('도넛 차트가 렌더링된다', async ({ page }) => {
    await expect(locators.period.donutChart(page)).toBeVisible();
  });

  test('탭 버튼 두 개가 표시된다', async ({ page }) => {
    await expect(locators.period.tabTransactions(page)).toBeVisible();
    await expect(locators.period.tabCategories(page)).toBeVisible();
  });

  test('기본 탭은 전체 결제 내역이다', async ({ page }) => {
    const tab = locators.period.tabTransactions(page);
    await expect(tab).toHaveClass(/bg-ctp-mauve/);
  });
});

test.describe('카테고리별 지출 탭 — 아코디언', () => {
  test.beforeEach(async ({ page }) => {
    await seedStorage(page);
    await page.goto('http://localhost:3000/dashboard/2024-01');
    await locators.period.tabCategories(page).click();
  });

  test('카테고리 목록이 렌더링된다', async ({ page }) => {
    await expect(locators.accordion.categoryToggle(page, '쇼핑')).toBeVisible();
  });

  test('카테고리 클릭 시 결제 내역이 펼쳐진다', async ({ page }) => {
    await locators.accordion.categoryToggle(page, '카페').click();
    await expect(locators.accordion.txItem(page, '스타벅스')).toBeVisible();
  });

  test('여러 카테고리를 동시에 펼칠 수 있다', async ({ page }) => {
    await locators.accordion.categoryToggle(page, '카페').click();
    await locators.accordion.categoryToggle(page, '식비').click();
    await expect(locators.accordion.txItem(page, '스타벅스')).toBeVisible();
    await expect(locators.accordion.txItem(page, '버거킹')).toBeVisible();
  });

  test('취소 거래(이마트)는 아코디언 내역에 표시되지 않는다', async ({ page }) => {
    await locators.accordion.categoryToggle(page, '쇼핑').click();
    const iemartItem = locators.accordion.txItem(page, '이마트');
    await expect(iemartItem).not.toBeVisible();
  });
});

test.describe('결제 건 선택 — SelectionPanel (데스크톱)', () => {
  test.beforeEach(async ({ page }) => {
    // 데스크톱 뷰포트 (SelectionPanel 표시)
    await page.setViewportSize({ width: 1280, height: 800 });
    await seedStorage(page);
    await page.goto('http://localhost:3000/dashboard/2024-01');
    await locators.period.tabCategories(page).click();
    // 카페 아코디언 열기
    await locators.accordion.categoryToggle(page, '카페').click();
  });

  test('초기 상태: 패널에 안내 메시지가 표시된다', async ({ page }) => {
    await expect(locators.selectionPanel.emptyHint(page)).toBeVisible();
  });

  test('결제 건 클릭 시 패널에 선택 카운트가 표시된다', async ({ page }) => {
    await locators.accordion.txItem(page, '스타벅스').click();
    await expect(locators.selectionPanel.selectedCount(page)).toContainText('1건 선택됨');
  });

  test('결제 건 클릭 시 합산 금액이 표시된다', async ({ page }) => {
    await locators.accordion.txItem(page, '스타벅스').click();
    await expect(locators.selectionPanel.totalAmount(page)).toContainText('6,500');
  });

  test('선택된 결제 건은 aria-pressed="true"가 된다', async ({ page }) => {
    const item = locators.accordion.txItem(page, '스타벅스');
    await item.click();
    await expect(item).toHaveAttribute('aria-pressed', 'true');
  });

  test('다시 클릭하면 선택 해제된다', async ({ page }) => {
    const item = locators.accordion.txItem(page, '스타벅스');
    await item.click();
    await item.click();
    await expect(item).toHaveAttribute('aria-pressed', 'false');
    await expect(locators.selectionPanel.emptyHint(page)).toBeVisible();
  });

  test('초기화 버튼 클릭 시 선택이 모두 해제된다', async ({ page }) => {
    await locators.accordion.txItem(page, '스타벅스').click();
    await locators.selectionPanel.resetButton(page).click();
    await expect(locators.selectionPanel.emptyHint(page)).toBeVisible();
  });
});

test.describe('결제 건 선택 — StickyBar (모바일)', () => {
  test.beforeEach(async ({ page }) => {
    // 모바일 뷰포트 (StickySelectionBar 표시)
    await page.setViewportSize({ width: 390, height: 844 });
    await seedStorage(page);
    await page.goto('http://localhost:3000/dashboard/2024-01');
    await locators.period.tabCategories(page).click();
    await locators.accordion.categoryToggle(page, '카페').click();
  });

  test('선택 없으면 sticky 바가 보이지 않는다', async ({ page }) => {
    await expect(locators.stickyBar.container(page)).not.toBeVisible();
  });

  test('결제 건 선택 시 sticky 바가 나타난다', async ({ page }) => {
    await locators.accordion.txItem(page, '스타벅스').click();
    await expect(locators.stickyBar.container(page)).toBeVisible();
  });

  test('sticky 바에 선택 건수와 합계가 표시된다', async ({ page }) => {
    await locators.accordion.txItem(page, '스타벅스').click();
    await expect(locators.stickyBar.summary(page)).toContainText('1건');
    await expect(locators.stickyBar.summary(page)).toContainText('6,500');
  });

  test('sticky 바 초기화 클릭 시 선택 해제 및 바 숨김', async ({ page }) => {
    await locators.accordion.txItem(page, '스타벅스').click();
    await locators.stickyBar.resetButton(page).click();
    await expect(locators.stickyBar.container(page)).not.toBeVisible();
  });
});
