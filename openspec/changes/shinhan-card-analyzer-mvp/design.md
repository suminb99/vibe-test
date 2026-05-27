## Context

신한카드 Excel 명세서(`.xlsx`)를 브라우저에서 직접 파싱하고, Claude API로 가맹점을 카테고리 분류한 뒤, 월간/연간 소비 패턴을 시각화하는 웹앱 MVP다. 서버 파일 저장 없이 Session Storage만 사용하며, 4회차 수업 안에 배포 가능한 형태로 완성한다.

실제 신한카드 명세서 컬럼 구조가 사전 확인됐다:
`거래일 / 카드구분 / 이용카드 / 가맹점명 / 승인번호 / 금액 / 매입구분 / 이용구분 / 거래통화 / 해외이용금액 / 취소상태`

## Goals / Non-Goals

**Goals:**
- 신한카드 `.xlsx` 파일 하나로 업로드 → 분류 → 시각화 흐름 완성
- 취소 거래 감지 및 금액 집계 분리
- 월간/연간 소비 카드 대시보드 + 기간별 상세 내역
- Catppuccin Macchiato 다크 테마 적용
- 모바일 first 반응형

**Non-Goals:**
- 서버 파일 저장, DB, 로그인
- PDF 파싱, 타 카드사 지원
- 카테고리 수동 수정 (Nice-to-have, MVP 이후)
- 할부 분리 처리, 예산 설정, 리포트 내보내기

## Decisions

### 1. 클라이언트 사이드 파싱 (SheetJS)

**결정:** `.xlsx` 파싱을 서버가 아닌 브라우저에서 수행한다.

**대안:** API Route에서 multer로 파일 수신 후 서버에서 파싱.

**이유:** 명세서에는 개인정보(결제 내역)가 포함된다. 서버로 파일을 전송하지 않으면 데이터가 브라우저 밖으로 나가지 않는다. SheetJS는 브라우저에서 동작하고, Session Storage에 결과만 저장하면 서버 의존성이 없다.

### 2. 취소 거래 감지 전략

**결정:** 세 가지 조건 중 하나라도 해당하면 취소 거래로 분류한다.
```
isCancel = amount < 0 || 매입구분 === '승인취소' || 취소상태 === '취소'
```

**이유:** 실제 명세서 확인 결과, 취소 거래는 금액이 음수이고 `매입구분`이 `승인취소`, `취소상태`가 `취소`로 중복 표시된다. 세 조건 OR로 처리해 어느 하나만 있어도 안전하게 감지한다.

**표시 방식:** 취소 거래는 내역 목록에 포함시키되, `--ctp-overlay-1` 컬러로 구분하고 금액 집계에서 제외한다.

### 3. Claude API 배치 호출 (중복 제거)

**결정:** 분류 전에 가맹점명 중복을 제거하고 배열 하나로 일괄 호출한다.

**이유:** 동일 가맹점이 여러 건 있을 때마다 API를 호출하면 토큰이 낭비된다. 중복 제거 후 배치 호출하면 호출 횟수와 비용이 최소화된다.

**ALP*/Alipay* 처리:** 시스템 프롬프트에 `"ALP*, Alipay* 접두어는 결제 플랫폼 이름이므로 접두어를 제외한 나머지로 카테고리를 분류하라"` 힌트를 포함한다.

### 4. 라우트 구조 — 기간 상세 페이지 분리

**결정:**
```
/dashboard             → 월간/연간 기간 카드 목록
/dashboard/[period]    → 기간 상세 (전체 결제 내역 + 카테고리별 탭)
```
카테고리 상세는 `/dashboard/[period]`의 인라인 accordion으로 처리하며 별도 라우트를 만들지 않는다.

**대안:** 기존 기획의 `/dashboard/category/[id]` 별도 페이지.

**이유:** 카테고리당 평균 거래 건수가 5~15건으로 적어 인라인 accordion이 충분하다. 별도 페이지보다 카테고리 간 비교가 쉽고, 라우트와 상태 관리가 단순해진다.

**period 파라미터 포맷:**
- 월간: `2026-05` (YYYY-MM)
- 연간: `2026` (YYYY)

### 5. Session Storage 스키마

```typescript
type ParsedStatement = {
  uploadedAt: string;       // ISO 8601
  transactions: Transaction[];
};

type Transaction = {
  date: string;             // "YYYY-MM-DD"
  merchant: string;
  amount: number;           // KRW, 음수 가능 (취소)
  category: Category;
  isCancel: boolean;        // 취소 거래 여부
};
```

`isCancel: true`인 항목은 표시하되 합계 집계에서 제외한다.

### 6. 디자인 시스템 — Catppuccin Macchiato

**결정:** `docs/DESIGN.md`의 Catppuccin Macchiato 다크 테마를 전면 적용한다.

**핵심 토큰:**
- Background: `--ctp-base` (#24273a)
- Primary CTA: `--ctp-mauve` (#c6a0f6)
- Cards: `--ctp-surface-0`, border `--ctp-surface-1`, `--radius-lg` (12px)
- 취소 거래 텍스트: `--ctp-overlay-1`
- 차트 색상 순서: Mauve → Blue → Green → Peach → Teal → Yellow → Flamingo → Sky

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| 신한카드 명세서 컬럼 변경 | 파서에 컬럼명 상수 분리, 오류 시 안내 메시지 표시 |
| Claude API 응답 지연 (5초+) | 로딩 인디케이터 표시, 타임아웃 30초 설정 |
| ALP*/Alipay* 분류 오류 | 시스템 프롬프트 힌트 + 테스트용 실제 명세서 검증 |
| Session Storage 용량 초과 | 명세서 1개월치는 ~100KB로 여유 있음, 초과 시 안내 |
| 해외 거래 KRW 환산 오차 | 금액 컬럼의 KRW 값을 그대로 사용, 환율 재계산 없음 |

## Open Questions

- `매입구분: 승인` 상태의 거래를 포함할 때, 아직 취소될 수 있는 경우 UI에서 별도 표시가 필요한가? (현재: 포함, 표시 구분 없음)
- 동일 월에 `ALP*Starbucks`와 `Alipay*Starbucks`가 둘 다 존재할 경우 가맹점별 집계 시 별도 항목으로 처리할 것인가, 병합할 것인가? (현재: 별도 처리)
