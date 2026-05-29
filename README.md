# 💳 카드 가계부

> 신한카드 Excel 명세서를 업로드하면 Claude AI가 가맹점을 자동 분류하고, 월간·연간 소비 패턴을 한눈에 보여주는 분석 도구입니다.

---

## 배포 URL

**[https://vibe-test-three.vercel.app](https://vibe-test-three.vercel.app)**

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 📤 명세서 업로드 | `.xlsx` / `.xls` 드래그앤드롭 또는 클릭 선택 |
| 🤖 AI 자동 분류 | Claude API가 가맹점명을 11개 카테고리로 자동 분류 |
| 📊 월간 / 연간 대시보드 | 기간별 총 지출·최다 카테고리 카드 목록 |
| 🍩 도넛 차트 | 카테고리 비율을 시각화 |
| 📂 카테고리 아코디언 | 카테고리별 지출 내역을 인라인으로 펼쳐 확인 |
| ☑️ 항목 선택 합산 | 결제 건을 클릭 선택하면 실시간으로 합산 금액 표시 |
| 🚫 취소 거래 구분 | 취소된 결제는 시각적으로 구분되고 집계에서 자동 제외 |
| 🌙 다크 / 라이트 모드 | Catppuccin Mocha(dark) / Latte(light) 테마 토글 |

---

## 서비스 이용

1. **명세서 다운로드**
   신한카드 앱 → 이용내역 → 기간 선택 → Excel 내보내기 (`.xlsx`)

2. **파일 업로드**
   [업로드 페이지](https://vibe-test-three.vercel.app/upload)에서 파일을 드래그하거나 클릭해 선택

3. **AI 분류 대기**
   Claude API가 가맹점명을 카테고리로 분류하는 동안 로딩 화면 표시 (보통 5–15초)

4. **대시보드 확인**
   월간 / 연간 탭을 전환하며 기간별 카드를 클릭해 상세 내역 확인

5. **항목 합산 (선택)**
   카테고리별 지출 탭에서 결제 건을 클릭하면 우측 패널(데스크톱) 또는 하단 바(모바일)에 합산 금액 표시

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16.2.6 (App Router) |
| 언어 | TypeScript 5 |
| 스타일 | Tailwind CSS v4 + Catppuccin 색상 토큰 |
| 차트 | Recharts 3 |
| Excel 파싱 | SheetJS (xlsx 0.18) |
| AI 분류 | Anthropic Claude API (`claude-sonnet-4-6`) |
| 테마 | next-themes 0.4 |
| E2E 테스트 | Playwright 1.60 |
| 배포 | Vercel |

---

## 실행 방법

### 사전 요구사항

- Node.js 18 이상
- Anthropic API 키 ([console.anthropic.com](https://console.anthropic.com) 에서 발급)

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/suminb99/vibe-test.git
cd vibe-test

# 2. 의존성 설치
npm install

# 3. 환경변수 설정 (.env.local 파일 생성)
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# 4. 개발 서버 시작
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

### 기타 명령어

```bash
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
npx playwright test  # E2E 테스트 전체 실행 (dev 서버 자동 기동)
npx playwright test --grep "업로드"  # 특정 테스트만 실행
```

---

## 테스트 방법

Playwright 기반 E2E 테스트가 포함되어 있습니다.

```bash
# Chromium 브라우저로 전체 테스트 실행
npx playwright test tests/mcp.spec.ts --project="Desktop Chrome"

# 모바일 뷰포트 포함 전체 실행
npx playwright test tests/mcp.spec.ts
```

**테스트 커버리지 (47개):**

| 그룹 | 케이스 수 |
|------|-----------|
| 헤더 (테마 토글 포함) | 3 |
| 랜딩 페이지 | 7 |
| 업로드 페이지 | 8 |
| 대시보드 (빈 상태 / 데이터 있음) | 7 |
| 기간 상세 페이지 | 8 |
| 카테고리 아코디언 | 4 |
| SelectionPanel (데스크톱 1280px) | 6 |
| StickyBar (모바일 390px) | 4 |

---

## 스크린샷 / 데모

### 랜딩 페이지 (다크 모드 기본)
히어로 섹션 · 문제/기능 소개 · CTA 버튼으로 구성됩니다. 우측 상단 버튼으로 라이트 모드 전환 가능합니다.

### 업로드 페이지
드래그앤드롭 영역에 파일을 놓거나 클릭해 선택하면 업로드 버튼이 활성화됩니다. `.xlsx`/`.xls` 외 파일은 에러 메시지가 표시됩니다.

### 대시보드
월간 카드 목록이 최신순으로 표시됩니다. 카드를 클릭하면 해당 월의 상세 분석 페이지로 이동합니다.

### 기간 상세 — 카테고리별 지출
도넛 차트로 카테고리 비율을 확인하고, 아코디언을 펼쳐 결제 건을 클릭하면 오른쪽 패널에 선택 합산 금액이 실시간으로 표시됩니다.

---

## 보안 / 제외 범위

- **데이터 저장:** 분석 결과는 브라우저 `localStorage`에만 보관되며, 서버에 전송·저장되지 않습니다.
- **API 키:** `ANTHROPIC_API_KEY`는 `.env.local`에 보관하고 절대 git에 커밋하지 않습니다.
- **MVP 제외 범위:** 로그인·회원가입 없음 / DB 없음 / PDF 미지원 / 신한카드 외 카드사 미지원
- 상세 보안 점검 결과 → [`docs/SECURITY_REVIEW.md`](docs/SECURITY_REVIEW.md)
