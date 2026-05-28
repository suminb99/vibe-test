## 1. 프로젝트 기반 설정

- [x] 1.1 Next.js 14 프로젝트 생성 (`npx create-next-app@latest`, App Router, TypeScript, Tailwind)
- [x] 1.2 의존성 설치: `xlsx`, `@anthropic-ai/sdk`, `recharts`
- [x] 1.3 `.env.local` 생성 및 `ANTHROPIC_API_KEY` 설정, `.gitignore`에 추가
- [x] 1.4 Catppuccin Macchiato CSS 변수를 `globals.css`에 추가 (`docs/DESIGN.md` 기준)
- [x] 1.5 Tailwind config에 Catppuccin 색상 토큰 확장 설정

## 2. 공통 타입 및 유틸 정의

- [x] 2.1 `src/types/index.ts` 생성: `Transaction`, `Category`, `CategorySummary`, `MerchantSummary`, `ParsedStatement` 타입 정의 (`isCancel: boolean` 포함)
- [x] 2.2 `src/lib/utils/formatter.ts` 생성: KRW 금액 포맷(`1,800원`), 날짜 포맷 유틸
- [x] 2.3 `src/lib/utils/filterUtils.ts` 생성: period 파라미터(`YYYY-MM` / `YYYY`)로 Transaction 필터링 함수
- [x] 2.4 `src/lib/storage.ts` 생성: Session Storage read/write 헬퍼 (`ParsedStatement`)

## 3. Excel 파서 구현

- [x] 3.1 `src/lib/parser/excelParser.ts` 생성: SheetJS로 `.xlsx` 파일 읽기
- [x] 3.2 컬럼 매핑 구현: `거래일` → `date`(YYYY-MM-DD), `가맹점명` → `merchant`, `금액` → `amount`(parseInt)
- [x] 3.3 취소 감지 로직 구현: `amount < 0 || 매입구분 === '승인취소' || 취소상태 === '취소'` → `isCancel: true`
- [x] 3.4 필수 컬럼 누락 시 에러 throw 처리
- [ ] 3.5 파서 유닛 테스트 (mock xlsx 데이터로 정상·취소·해외 케이스 검증)

## 4. Claude API 분류 구현

- [x] 4.1 `src/app/api/classify/route.ts` 생성: `POST { merchants: string[] }` → `{ result: { merchant, category }[] }`
- [x] 4.2 시스템 프롬프트 작성: 카테고리 목록 명시, ALP*/Alipay* 접두어 힌트 포함, JSON-only 응답 요청
- [x] 4.3 `src/lib/classifier/claudeClassifier.ts` 생성: 중복 제거 → `/api/classify` 호출 → Transaction 배열에 category 매핑
- [x] 4.4 API 응답 파싱 실패 시 전체 `"기타"` 폴백 처리

## 5. 공통 UI 컴포넌트

- [x] 5.1 `src/components/ui/Button.tsx`: primary / secondary / ghost 변형, Catppuccin 토큰 적용
- [x] 5.2 `src/components/ui/Card.tsx`: `--ctp-surface-0` 배경, `--radius-lg` 기본값, hover 인터랙션
- [x] 5.3 `src/components/ui/Badge.tsx`: 카테고리별 색상 배지 (Catppuccin alpha-tint 패턴)
- [x] 5.4 `src/components/ui/EmptyState.tsx`: 빈 상태 안내 + CTA 버튼
- [x] 5.5 `src/components/ui/ErrorMessage.tsx`: 에러 메시지 표시
- [x] 5.6 `src/components/layout/AppHeader.tsx`: 상단 네비게이션 (`--ctp-mantle` 배경)

## 6. Landing Page

- [x] 6.1 `src/app/page.tsx` 생성: Hero / Problem / 핵심 기능 / CTA 섹션 구성
- [x] 6.2 CTA 버튼 클릭 시 `/upload` 이동 연결

## 7. Upload Page

- [x] 7.1 `src/app/upload/page.tsx` 생성
- [x] 7.2 `src/features/upload/components/FileUploader.tsx` 생성: 드래그앤드롭 + 클릭 선택, `.xlsx` 유효성 검사
- [x] 7.3 업로드 → 파싱 → 분류 → Session Storage 저장 → `/dashboard` 이동 흐름 연결
- [x] 7.4 로딩 인디케이터 및 업로드 중 버튼 비활성화 처리
- [x] 7.5 파일 형식 오류 / 파싱 실패 / API 오류 에러 메시지 표시

## 8. Dashboard Page (기간 카드 목록)

- [x] 8.1 `src/app/dashboard/page.tsx` 생성: Session Storage에서 데이터 로드, 없으면 EmptyState 표시
- [x] 8.2 `src/features/dashboard/components/PeriodToggle.tsx`: 월간/연간 전환 토글
- [x] 8.3 `src/features/dashboard/components/PeriodCard.tsx`: 기간 카드 (총액 + 최다 카테고리 표시)
- [x] 8.4 월간 모드: 명세서 내 월 목록 추출, 최신순 카드 렌더링
- [x] 8.5 연간 모드: 명세서 내 연도 목록 추출, 최신순 카드 렌더링
- [x] 8.6 카드 클릭 시 `/dashboard/[period]` 이동 연결

## 9. Period Detail Page (기간 상세)

- [x] 9.1 `src/app/dashboard/[period]/page.tsx` 생성: URL params에서 period 파싱, 데이터 필터링
- [x] 9.2 `src/features/dashboard/components/DonutChart.tsx`: Recharts 도넛 차트, Catppuccin 색상 순서 적용
- [x] 9.3 탭 전환 UI 구현: `전체 결제 내역` (default) / `카테고리별 지출`
- [x] 9.4 `src/features/period/components/TransactionList.tsx`: 날짜 내림차순 전체 내역, 취소 거래 `--ctp-overlay-1` + `취소` 배지 표시
- [x] 9.5 `src/features/period/components/CategoryAccordion.tsx`: 카테고리별 합계·비율 목록, 펼치기 버튼으로 인라인 거래 내역 표시
- [x] 9.6 브레드크럼 (`대시보드 > YYYY년 MM월`) 및 뒤로가기 연결

## 10. 반응형 및 QA

- [ ] 10.1 모바일(< 640px) 레이아웃 점검: 카드 1열, 탭 가로 스크롤, 터치 타겟 44px
- [ ] 10.2 실제 신한카드 명세서 파일로 전체 흐름(업로드 → 분류 → 대시보드 → 상세) 수동 검증
- [ ] 10.3 취소 거래 포함 명세서로 집계 제외 및 색상 구분 검증
- [ ] 10.4 해외 거래(ALP*/Alipay*) 포함 명세서로 분류 결과 검증
- [x] 10.5 `pnpm build` 에러 없음 확인

## 11. .xls 지원 확장

- [x] 11.1 `src/features/upload/components/FileUploader.tsx`: `accept=".xlsx"` → `accept=".xlsx,.xls"`, 유효성 검사 조건에 `.xls` 추가
- [x] 11.2 `src/lib/parser/excelParser.ts`: `.xls` 확장자 허용, XLSX.read 호출은 동일하게 유지 (SheetJS가 두 형식 모두 지원)
- [x] 11.3 에러 메시지 문구 업데이트: `.xlsx 파일만 지원` → `.xlsx 또는 .xls 파일만 지원`

## 12. 페이지 간 네비게이션 버튼

- [x] 12.1 `src/app/page.tsx`: "대시보드 바로 가기" secondary 버튼 추가 → `/dashboard` 이동 (FR-014)
- [x] 12.2 `src/app/dashboard/page.tsx`: "새 명세서 업로드" 버튼 추가 → `/upload` 이동, 헤더 우측 또는 EmptyState 외 항상 표시 (FR-015)
- [x] 12.3 `src/app/upload/page.tsx`: "대시보드로 이동" secondary 버튼 추가 → `/dashboard` 이동 (FR-016)

## 13. 결제 건 선택 및 합산 (transaction-selection)

- [x] 13.1 `src/features/period/components/CategoryAccordion.tsx`: `expanded` 상태를 `string | null` → `Set<string>`으로 변경하여 다중 열기 지원
- [x] 13.2 `src/types/index.ts`: `Transaction`에 `id: string` 필드 추가 (파서에서 할당, 선택 key로 사용)
- [x] 13.3 `src/lib/parser/excelParser.ts`: 각 Transaction 생성 시 `id` 할당 (`${date}-${merchant}-${index}` 패턴)
- [x] 13.4 `src/app/dashboard/[period]/page.tsx`: `selectedIds: Set<string>` 상태 추가, `handleToggleSelect` / `handleResetSelection` 핸들러 구현, `selectedTransactions`(selectedIds로 필터링한 Transaction[]) · `selectedTotal`(금액 합산) 파생값 계산, 카테고리 탭 레이아웃을 `lg:grid-cols-[1fr_280px]` 2열로 변경 (`max-w-4xl`)
- [x] 13.5 `src/features/period/components/CategoryAccordion.tsx`: `selectedIds`, `onToggleSelect` props 추가, 결제 건 행에 클릭 핸들러·선택 하이라이트(`--ctp-mauve` tint) 적용
- [x] 13.6 `src/features/period/components/SelectionPanel.tsx` 생성: 데스크톱용 우측 고정 패널 — 선택 건수·항목 리스트·합산 금액·초기화 버튼 (FR-018, FR-019)
- [x] 13.7 `src/features/period/components/StickySelectionBar.tsx` 생성: 모바일용 하단 sticky 바 — "N건 선택 · 합계 X,XXX원 | 초기화", 선택 0건일 때 hidden (FR-018, FR-019)

## 14. 카테고리 분류 버그 수정 (classify-fix)

- [x] 14.1 `src/app/api/classify/route.ts`: Claude 응답에서 마크다운 코드 펜스(` ```json ... ``` `) 제거 후 JSON 파싱 — 현재 펜스가 포함되면 `JSON.parse` 실패 → 전체 '기타' 폴백되는 버그 수정
- [x] 14.2 `src/app/api/classify/route.ts`: Claude 응답의 `category` 값이 유효한 11개 카테고리 목록에 없으면 해당 항목만 `'기타'`로 대체 (유효하지 않은 값 필터링)
- [x] 14.3 `src/lib/parser/excelParser.ts` `mergeCategories`: `categoryMap`을 정규화 키(`.trim().toLowerCase()`) 기반으로 조회하도록 변경 — Claude가 merchant 이름 대소문자·공백을 원본과 다르게 반환해도 매핑 성공 보장
