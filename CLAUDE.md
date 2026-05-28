# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shinhan Card statement analyzer — users upload a `.xlsx` card statement, Claude API categorizes each merchant, and the dashboard shows spending patterns with drilldown. No auth, no database; all data lives in `sessionStorage` for the session only.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npx playwright test  # E2E tests (Playwright, added in a later phase)
npx playwright test --grep "upload"  # Run a single test by name
```

## Architecture

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Recharts · SheetJS (xlsx) · Anthropic Claude API

**Data flow:**
1. `/upload` — `excelParser.ts` (SheetJS) parses the `.xlsx` file client-side, extracts `{ date, merchant, amount }` rows, deduplicates merchants, then calls `/api/classify`
2. `/api/classify` — Next.js API Route; sends deduplicated merchant names to Claude API (`claude-sonnet-4-6`), returns `{ merchant, category }[]`
3. Classified `Transaction[]` is written to `sessionStorage` as `ParsedStatement`; the user is redirected to `/dashboard`
4. `/dashboard` reads `sessionStorage`, filters by the selected period, aggregates into `CategorySummary[]` via `filterUtils.ts`
5. `/dashboard/category/[id]` re-reads `sessionStorage`, filters to one category, builds `MerchantSummary[]` and the full `Transaction[]` for that category

**Source layout:**
```
src/
  app/                        # Next.js App Router — pages + API route
  components/ui/              # Primitive UI (Button, Card, Badge, EmptyState, ErrorMessage)
  components/layout/          # AppHeader, Breadcrumb
  features/
    upload/                   # FileUploader + upload types
    dashboard/                # PeriodFilter, MonthPicker, SummaryCard,
                              # CategoryFilter, CategoryTable, DonutChart + dashboard types + storage.ts
    category/                 # MerchantTable, TransactionList + category types
  lib/
    parser/excelParser.ts     # SheetJS parsing → raw Transaction[]
    classifier/claudeClassifier.ts  # Calls /api/classify, maps result back to transactions
    utils/formatter.ts        # Amount (KRW) and date formatting
    utils/filterUtils.ts      # Period filter (monthly / 6-month / annual)
```

## Key Types

```typescript
type Category = "식비" | "카페" | "쇼핑" | "교통" | "구독서비스" | "뷰티/헬스"
              | "엔터테인먼트" | "의료" | "교육" | "여행" | "기타";

type Transaction     = { date: string; merchant: string; amount: number; category: Category };
type CategorySummary = { category: Category; totalAmount: number; ratio: number; count: number };
type MerchantSummary = { merchant: string; totalAmount: number; count: number };
type ParsedStatement = { uploadedAt: string; transactions: Transaction[] };
```

## Claude API Integration (`/api/classify`)

- Request: `{ merchants: string[] }` (deduplicated before calling to save tokens)
- Response: `{ result: { merchant: string; category: Category }[] }`
- Model: `claude-sonnet-4-6`; prompt asks for JSON-only response
- Ambiguous merchants → `"기타"`

Environment variable (`.env.local`, never commit):
```
ANTHROPIC_API_KEY=your_api_key_here
```

## Design System

The UI follows the **Catppuccin Macchiato** dark theme documented in `docs/DESIGN.md`. Key tokens:
- Canvas background: `--ctp-base` `#24273a` (deep navy)
- Primary CTA: `--ctp-mauve` `#c6a0f6`, `rounded-[8px]` (`--radius-md`)
- Cards: `--ctp-surface-0` background, `1px solid --ctp-surface-1` border, `rounded-[12px]` (`--radius-lg`)
- Section rhythm: `--space-section` 96px between major page sections
- Fonts: Sora (headings) · DM Sans / Inter (body) · JetBrains Mono (code)
- Cancelled transactions: display with `--ctp-overlay-1` muted color, excluded from amount totals

Responsive breakpoints: mobile < 640px / tablet 640–1024px / desktop ≥ 1024px. Tables become card-list on mobile. All touch targets ≥ 44px.

## Constraints

- No server-side file storage — parsed data stays in `sessionStorage` only
- No auth, no database, no PDF support (MVP scope)
- Mobile-first; all pages must be usable on mobile screens
