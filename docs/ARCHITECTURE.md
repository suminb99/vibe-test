## Service Structure

User
→ Landing Page (/)
→ Upload Page (/upload) — SheetJS로 .xlsx 파싱, Claude API로 카테고리 분류
→ Session Storage (파싱 결과 임시 저장)
→ Dashboard Page (/dashboard) — 기간별 소비 현황
→ Category Detail Page (/dashboard/category/[id]) — 카테고리 상세 내역

## Planned Routes

- `/` : Landing Page
- `/upload` : 명세서 업로드 및 파싱
- `/dashboard` : 소비 대시보드
- `/dashboard/category/[id]` : 카테고리 상세
- `/api/classify` : Claude API 카테고리 분류 엔드포인트

## Source Structure

- `src/app/` : Next.js App Router 페이지 및 API Route
- `src/components/` : 공통 UI 컴포넌트 (ui/, layout/)
- `src/features/` : 기능별 컴포넌트 및 타입 (upload/, dashboard/, category/)
- `src/lib/` : 파서, 분류기, 유틸 함수
- `docs/` : 프로젝트 문서
- `planning/` : 설계 문서

## State Management

- Client state : React useState / useContext
- Session persistence : Session Storage (ParsedStatement)
- Server state 없음 (DB 미사용)
