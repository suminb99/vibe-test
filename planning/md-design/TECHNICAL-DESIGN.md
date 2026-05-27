# Technical Design

## 1. Architecture Overview

```
User
→ Next.js App (Frontend)
→ UI Components
→ Client State (React useState / useContext)
→ Session Storage (업로드된 명세서 파싱 결과 임시 저장)
→ API Routes (Next.js API Routes)
→ Claude API (카테고리 자동 분류)
```

---

## 2. Tech Stack
| Area | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React |
| Language | TypeScript |
| Style | Tailwind CSS |
| Chart | Recharts |
| Excel 파싱 | SheetJS (xlsx) |
| AI 분류 | Anthropic Claude API |
| AI Coding | Claude Code |
| Test | Playwright (later) |
| Version Control | GitHub |

---

## 3. Route Design
| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Landing Page |
| `/upload` | `src/app/upload/page.tsx` | Upload Page |
| `/dashboard` | `src/app/dashboard/page.tsx` | 월간/연간 기간 카드 목록 |
| `/dashboard/[period]` | `src/app/dashboard/[period]/page.tsx` | 기간 상세 (전체 내역 + 카테고리별 탭) |
| `/api/classify` | `src/app/api/classify/route.ts` | Claude API 카테고리 분류 엔드포인트 |

---

## 4. Source Structure

```text
src/
  app/
    page.tsx                          # Landing Page
    upload/
      page.tsx                        # Upload Page
    dashboard/
      page.tsx                        # 월간/연간 기간 카드 목록
      [period]/
        page.tsx                      # 기간 상세 (전체 내역 + 카테고리별 탭)
    api/
      classify/
        route.ts                      # Claude API 카테고리 분류 API Route
  components/
    ui/
      Button.tsx
      Card.tsx
      Badge.tsx
      EmptyState.tsx
      ErrorMessage.tsx
    layout/
      AppHeader.tsx
      Breadcrumb.tsx
  features/
    upload/
      types.ts
      components/
        FileUploader.tsx
    dashboard/
      types.ts
      storage.ts                      # Session Storage 처리
      components/
        PeriodToggle.tsx              # 월간/연간 전환 토글
        PeriodCard.tsx                # 기간 카드 (총액 + 최다 카테고리)
    period/
      types.ts
      components/
        DonutChart.tsx                # 카테고리별 비율 도넛 차트
        TransactionList.tsx           # 전체 결제 내역 (취소 거래 구분)
        CategoryAccordion.tsx         # 카테고리별 합계 + 인라인 펼치기
  lib/
    parser/
      excelParser.ts                  # SheetJS 기반 Excel 파싱
    classifier/
      claudeClassifier.ts             # Claude API 호출 및 분류 처리
    utils/
      formatter.ts                    # 금액, 날짜 포맷 유틸
      filterUtils.ts                  # 기간(YYYY-MM / YYYY) 필터 처리 유틸
      storage.ts                      # Session Storage read/write 헬퍼
```

---

## 5. Data Flow

```
[Upload Page]
  사용자가 .xlsx 파일 업로드
  → excelParser.ts: SheetJS로 거래 내역 파싱
    (거래일→date, 가맹점명→merchant, 금액→amount, isCancel 감지)
  → claudeClassifier.ts: 중복 제거 후 가맹점명 배열을 Claude API에 전달
  → 카테고리 분류 결과 반환 → Transaction 배열에 category 매핑
  → ParsedStatement를 Session Storage에 저장
  → /dashboard로 자동 이동

[Dashboard Page]
  Session Storage에서 데이터 로드 (없으면 EmptyState 표시)
  → PeriodToggle: 월간 / 연간 전환
  → 기간 목록 추출 → PeriodCard 목록 렌더링
    (각 카드: 총액(isCancel 제외) + 최다 카테고리)
  → 카드 클릭 → /dashboard/[period]로 이동

[Period Detail Page]
  URL params에서 period 추출 (YYYY-MM 또는 YYYY)
  → filterUtils.ts: Session Storage에서 해당 기간 데이터 필터링
  → DonutChart: 카테고리별 비율 시각화 (isCancel 제외)
  → 탭 전환:
    - 전체 결제 내역: TransactionList (날짜 내림차순, 취소 거래 구분 표시)
    - 카테고리별 지출: CategoryAccordion (합계·비율 + 인라인 펼치기)
```

---

## 6. Key Data Types

```typescript
// 거래 내역 단건
type Transaction = {
  date: string;           // "2024-03-15"
  merchant: string;       // "스타벅스 강남점"
  amount: number;         // 6500 (취소 거래는 음수)
  category: Category;     // "카페"
  isCancel: boolean;      // 취소 거래 여부 (집계 제외, 별도 색상 표시)
};

// 카테고리 타입
type Category =
  | "식비"
  | "카페"
  | "쇼핑"
  | "교통"
  | "구독서비스"
  | "뷰티/헬스"
  | "엔터테인먼트"
  | "의료"
  | "교육"
  | "여행"
  | "기타";

// 카테고리별 집계
type CategorySummary = {
  category: Category;
  totalAmount: number;    // 총 지출 금액
  ratio: number;          // 전체 대비 비율 (%)
  count: number;          // 결제 건수
};

// 가맹점별 집계
type MerchantSummary = {
  merchant: string;
  totalAmount: number;
  count: number;
};

// Session Storage 저장 구조
type ParsedStatement = {
  uploadedAt: string;
  transactions: Transaction[];
};
```

---

## 7. Claude API 연동

```typescript
// src/app/api/classify/route.ts
// 가맹점명 배열을 받아 카테고리 분류 결과를 반환하는 API Route

Request Body:
{
  "merchants": ["스타벅스 강남점", "쿠팡", "카카오택시"]
}

Response Body:
{
  "result": [
    { "merchant": "스타벅스 강남점", "category": "카페" },
    { "merchant": "쿠팡", "category": "쇼핑" },
    { "merchant": "카카오택시", "category": "교통" }
  ]
}
```

- 중복 가맹점 제거 후 배치로 Claude API 호출해 토큰 절약
- 모델: `claude-sonnet-4-20250514`
- 응답은 JSON only로 요청

---

## 8. Environment Variables

```bash
# .env.local (GitHub에 커밋하지 않음)
ANTHROPIC_API_KEY=your_api_key_here
```

---

## 9. Non-goals (기술 범위 제외)
- 데이터베이스 연동 (Session Storage로 대체)
- 로그인 / 인증
- 서버사이드 파일 저장
- PDF 파싱
- 타 카드사 파서
