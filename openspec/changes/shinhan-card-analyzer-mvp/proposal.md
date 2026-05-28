## Why

신한카드 명세서는 단순 결제 내역 나열만 제공해 카테고리별 소비 패턴을 파악하기 어렵다. `.xlsx` 파일 하나를 업로드하면 Claude API가 가맹점을 자동 분류하고, 월간/연간 소비 현황을 즉시 시각화하는 MVP가 필요하다.

## What Changes

- 신한카드 `.xlsx` 명세서를 SheetJS로 파싱해 거래 내역(날짜·가맹점·금액)을 추출
- Claude API로 가맹점명을 카테고리(식비·카페·쇼핑 등)로 자동 분류
- 취소 거래는 내역에 표시하되 금액 집계에서 제외, 시각적으로 구분
- 대시보드: 월간/연간 토글 + 기간 카드 목록(카드당 총액 + 최다 지출 카테고리)
- 기간 상세: 전체 결제 내역(시간순, default) + 카테고리별 지출 탭(인라인 accordion)
- 해외 거래 포함(금액 컬럼이 이미 KRW 환산값), ALP*/Alipay* 접두어 분류 힌트 처리
- 데이터는 Session Storage에만 저장, 서버 보관 없음

## Capabilities

### New Capabilities

- `excel-upload-parse`: 신한카드 `.xlsx` 업로드, SheetJS 파싱, 취소 거래 감지(음수 금액·매입구분·취소상태), 거래일 포맷 정규화
- `merchant-classification`: 중복 제거된 가맹점 배열을 `/api/classify`로 전달해 Claude API가 카테고리 반환, ALP*/Alipay* 접두어 처리 힌트 포함
- `spending-dashboard`: 월간/연간 토글, 기간별 카드 목록(총액 + 최다 카테고리), Session Storage에서 데이터 로드
- `period-detail`: 기간 카드 클릭 시 전체 결제 내역(시간순)과 카테고리별 지출(인라인 accordion) 탭 제공
- `transaction-selection`: 카테고리 accordion 내 결제 건 다중 선택 + 실시간 합산 표시. 여러 카테고리 동시 열기. 데스크톱 우측 패널 / 모바일 sticky 하단 바. 초기화 버튼

### Modified Capabilities

## Impact

- **신규 라우트**: `/upload`, `/dashboard`, `/dashboard/[period]`, `/api/classify`
- **신규 의존성**: `xlsx` (SheetJS), `@anthropic-ai/sdk`, `recharts`
- **환경변수**: `ANTHROPIC_API_KEY` (.env.local, 커밋 금지)
- **데이터 저장**: Session Storage만 사용, DB·서버 파일 저장 없음
- **미지원**: PDF, 타 카드사, 로그인, 결제, 할부 분리, 카테고리 수동 수정(Nice-to-have)
