# Security Review — 신한카드 명세서 분석기 MVP

> 검토일: 2026-05-29  
> 검토 범위: `src/`, `openspec/changes/`, `package.json`, `README.md`

---

## 요약

| 심각도 | 건수 | 항목 |
|--------|------|------|
| 🔴 HIGH | 3 | API 키 남용, SheetJS 취약점, readFileSync 폴백 |
| 🟡 MEDIUM | 4 | Rate limit 없음, 입력 크기 검증 없음, 보안 헤더 없음, 에러 메시지 노출 |
| 🟢 LOW | 3 | localStorage 금융 데이터, 파일 MIME 검증 없음, console.error 내용 |

---

## 🔴 HIGH

### H-1. `/api/classify` 엔드포인트에 인증이 없음

**파일:** `src/app/api/classify/route.ts`

`POST /api/classify`는 인증 없이 누구나 호출할 수 있다. 해당 엔드포인트는 서버의 `ANTHROPIC_API_KEY`를 사용해 Claude API를 호출하므로, 공개된 Vercel URL에 반복 요청을 보내면 API 크레딧이 소진된다.

```
# 공격 예시 — curl로 외부에서 호출 가능
curl -X POST https://vibe-test-three.vercel.app/api/classify \
  -H "Content-Type: application/json" \
  -d '{"merchants": ["가맹점A", "가맹점B", ...]}'
```

**추가 위험:** `merchants` 배열 크기에 제한이 없어 한 번 요청으로 수천 개를 보낼 수 있다.

**권고 조치:**
1. 배포 환경에서는 `ALLOWED_ORIGIN` 환경변수로 허용 출처를 제한하거나, Vercel 환경에서 `x-vercel-protection-bypass` 미들웨어를 적용한다.
2. 단기 대책으로 `merchants.length`에 상한선을 추가한다.

```ts
// src/app/api/classify/route.ts
if (!merchants || merchants.length === 0) return NextResponse.json({ result: [] });
if (merchants.length > 500) {
  return NextResponse.json({ error: '가맹점 수가 너무 많습니다.' }, { status: 400 });
}
```

---

### H-2. SheetJS(`xlsx`) 패키지 알려진 취약점

**파일:** `package.json` → `"xlsx": "^0.18.5"`

`npm audit` 결과 `high` 심각도 취약점 2건 확인됨:

| CVE | 종류 | 설명 |
|-----|------|------|
| GHSA-4r6h-8v6p-xvw6 | Prototype Pollution | 악성 `.xlsx` 파일로 `Object.prototype` 오염 가능 |
| GHSA-5pgg-2g8v-p4x9 | ReDoS | 특정 패턴의 셀 값으로 정규식 실행이 오래 걸림 |

현재 파싱은 클라이언트 사이드에서 실행되므로 서버에 직접 영향은 없다. 그러나 Prototype Pollution은 동일 JavaScript 런타임 내 다른 동작에 영향을 줄 수 있다.

**권고 조치:**
- `npm audit` 상 fix 가용 버전이 없으므로 대안 라이브러리(`exceljs`, `@e965/xlsx`) 마이그레이션을 검토한다.
- 단기 대책: 업로드 파일 크기 상한선(`5 MB`)을 추가해 ReDoS 가능성을 낮춘다.

```ts
// FileUploader.tsx validate()
if (file.size > 5 * 1024 * 1024) return '파일 크기는 5MB 이하여야 합니다.';
```

---

### H-3. `.env.local` 파일을 디스크에서 직접 읽는 폴백 로직

**파일:** `src/app/api/classify/route.ts` (line 27–35)

```ts
function resolveApiKey(): string | undefined {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  try {
    const envPath = join(process.cwd(), '.env.local');  // ← 직접 파일 읽기
    const content = readFileSync(envPath, 'utf8');
    ...
  }
}
```

**문제점:**
- 프로덕션(Vercel)에서는 환경변수가 주입되므로 이 폴백이 실행될 필요가 없다.
- 이 코드는 로컬 개발 편의를 위해 작성됐지만, 서버 파일 시스템에 대한 직접 접근 경로를 남긴다.
- `.env.local`이 프로젝트 루트에 노출된 경우(예: 잘못된 배포 설정), 키가 읽힐 수 있다.

**권고 조치:** 폴백 로직 전체를 제거하고, Vercel 대시보드의 환경변수 설정만 사용한다.

```ts
// 변경 후
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
  }
  ...
}
```

---

## 🟡 MEDIUM

### M-1. Rate Limiting 없음

**파일:** `src/app/api/classify/route.ts`

동일 IP에서 초당 수백 회 요청을 보내도 제한이 없다. H-1(인증 없음)과 결합 시 API 크레딧 소진 속도가 빠르다.

**권고 조치:** Vercel의 WAF(Web Application Firewall) 또는 미들웨어로 IP별 요청 빈도를 제한한다.

```ts
// middleware.ts (예시)
import { NextResponse } from 'next/server';
// Upstash Rate Limit 또는 Vercel KV 기반 구현 권장
```

---

### M-2. API 요청 입력값 크기 및 타입 검증 부재

**파일:** `src/app/api/classify/route.ts`

```ts
const { merchants } = (await req.json()) as { merchants: string[] };
```

- `merchants`가 배열이 아니거나 `null`일 때 런타임 오류가 발생할 수 있다.
- 개별 가맹점명 길이에 상한이 없어 매우 긴 문자열이 Claude 프롬프트에 주입될 수 있다 (토큰 낭비 + 프롬프트 인젝션 위험).

**권고 조치:**

```ts
if (!Array.isArray(merchants)) {
  return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
}
const sanitized = merchants
  .filter((m): m is string => typeof m === 'string')
  .map((m) => m.slice(0, 100));  // 가맹점명 100자 상한
if (sanitized.length > 500) {
  return NextResponse.json({ error: '가맹점 수가 너무 많습니다.' }, { status: 400 });
}
```

---

### M-3. 보안 HTTP 헤더 미설정

**파일:** `next.config.ts`

현재 `nextConfig`가 빈 객체다. 다음 헤더가 없다:

| 헤더 | 누락 시 위험 |
|------|------------|
| `X-Frame-Options: DENY` | 클릭재킹 |
| `X-Content-Type-Options: nosniff` | MIME 스니핑 |
| `Referrer-Policy: strict-origin-when-cross-origin` | Referer 정보 노출 |
| `Content-Security-Policy` | XSS 방어 심층화 |

**권고 조치:** `next.config.ts`에 헤더를 추가한다.

```ts
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};
```

---

### M-4. API 에러 메시지가 클라이언트에 그대로 노출됨

**파일:** `src/app/api/classify/route.ts` (line 98–103)

```ts
const msg = error instanceof Error ? error.message : '분류 중 오류가 발생했습니다.';
return NextResponse.json({ error: msg }, { status });
```

Anthropic SDK가 던지는 예외 메시지(예: `"invalid_api_key"`, `"rate_limit_exceeded: X requests/min"`)가 클라이언트 응답에 그대로 포함된다. 이는 내부 상태나 API 한도를 외부에 노출한다.

**권고 조치:** 내부 에러는 서버 로그에만 남기고, 클라이언트에는 범용 메시지만 반환한다.

```ts
console.error('[classify] error:', error);
return NextResponse.json({ error: '분류 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }, { status });
```

---

## 🟢 LOW

### L-1. localStorage에 금융 거래 데이터 저장

**파일:** `src/lib/storage.ts`

`ParsedStatement`(날짜·가맹점·금액 등 카드 거래 내역 전체)가 `localStorage`에 평문 JSON으로 저장된다.

**현재 상태:**
- `dangerouslySetInnerHTML`이 없고, 외부 스크립트도 없으므로 현재는 XSS 위험이 낮다.
- 브라우저 확장 프로그램(host_permissions 보유 시) 및 동일 출처의 JavaScript는 이 데이터에 접근 가능하다.
- `localStorage`는 탭/세션이 닫혀도 영구 보존된다 — 의도치 않게 데이터가 남을 수 있다.

**허용된 설계 결정:** MVP 범위 내 서버 저장 없음. 단, 사용 후 삭제 안내 및 자동 만료를 고려할 수 있다.

**권고 조치 (선택):**
- 명세서 조회 후 일정 시간(`7일`) 지나면 자동 삭제하는 로직 추가.
- 업로드 페이지에 "분석 후 데이터는 이 기기에만 보관됩니다" 안내 문구 추가.

---

### L-2. 파일 MIME 타입 검증 없음

**파일:** `src/features/upload/components/FileUploader.tsx`

확장자(`.xlsx`, `.xls`)만 검사하고 실제 파일 매직 바이트(CFBF: `D0 CF 11 E0`, ZIP: `50 4B`)는 확인하지 않는다. 확장자를 변조한 파일 업로드가 가능하다.

클라이언트 사이드 파싱이므로 서버에 파일이 저장되지 않아 직접적인 서버 위험은 없지만, SheetJS의 H-2 취약점과 결합 시 악성 파일 처리 가능성이 있다.

**권고 조치 (선택):** ArrayBuffer의 첫 4바이트를 읽어 XLSX(ZIP) 시그니처 여부를 확인한다.

```ts
function hasXlsxSignature(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer.slice(0, 4));
  // ZIP(xlsx): 50 4B 03 04 | CFBF(xls): D0 CF 11 E0
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4B;
  const isCfb = bytes[0] === 0xD0 && bytes[1] === 0xCF;
  return isZip || isCfb;
}
```

---

### L-3. `console.error`에 내부 경로 및 응답 내용 노출

**파일:** `src/app/api/classify/route.ts`

```ts
console.error('[classify] ANTHROPIC_API_KEY를 찾을 수 없습니다. .env.local을 확인하세요.');
console.error('[classify] JSON 파싱 실패, 전체 기타 폴백. 원본 응답:', rawText.slice(0, 200));
```

- 첫 번째: `.env.local` 경로명이 로그에 노출됨. Vercel 로그 접근 권한이 있는 인원에게 내부 설정 정보가 노출된다.
- 두 번째: Claude API 원본 응답 일부(200자)가 로그에 기록됨. 운영 환경에서는 필요 이상의 정보.

**권고 조치:** 로그 메시지에서 파일 경로와 외부 API 응답 내용을 제거한다.

```ts
console.error('[classify] API 키가 설정되지 않았습니다.');
console.error('[classify] JSON 파싱 실패, 기타 폴백 처리됨.');
```

---

## 배포 전 체크리스트

| 항목 | 상태 | 비고 |
|------|------|------|
| `ANTHROPIC_API_KEY`가 `.env.local`에만 있고 git에 커밋되지 않았는가 | ✅ | `.gitignore`에 `.env*` 포함 확인 |
| Vercel 환경변수에 `ANTHROPIC_API_KEY` 등록됐는가 | ✅ | Vercel 대시보드에서 확인 필요 |
| `dangerouslySetInnerHTML` 사용 없음 | ✅ | 전체 `src/` 검색 결과 없음 |
| 외부 링크에 `rel="noopener noreferrer"` 적용됐는가 | ✅ | 외부 링크 없음 |
| `npm audit` 고위험 취약점 인지 | ⚠️ | `xlsx` High 2건 — fix 가용 버전 없음 (H-2 참고) |
| `/api/classify` 가맹점 수 상한 추가됐는가 | ❌ | H-1 조치 필요 |
| `readFileSync` 폴백 제거됐는가 | ❌ | H-3 조치 필요 |
| 보안 HTTP 헤더 설정됐는가 | ❌ | M-3 조치 필요 |
| 파일 크기 업로드 제한 추가됐는가 | ❌ | 5MB 상한 권장 |

---

## 점검 범위 외 사항 (MVP 의도적 제외)

- **인증/세션 관리**: 로그인 없는 단일 사용자 앱 — 해당 없음
- **SQL Injection / CSRF**: DB 없음, 폼 제출 없음 — 해당 없음
- **서버 파일 저장**: 업로드 파일이 서버에 저장되지 않음 — 해당 없음
- **PDF/다른 카드사 지원**: MVP 범위 밖
