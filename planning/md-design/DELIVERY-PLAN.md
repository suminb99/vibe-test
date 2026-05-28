# Delivery Plan

## 1. 문서 목적

이 문서는 2회차 후반부터 3회차까지의 개발 실행 계획을 정리한다.
전체 MVP를 한 번에 구현하지 않고, 공통 베이스와 핵심 기능을 단계적으로 구현하기 위한 기준으로 사용한다.

---

## 2. 전체 개발 목표

최종 목표는 4회차 종료 시 배포 가능한 카드 가계부 웹앱 MVP를 완성하는 것이다.

최종 산출물:
- Landing Page
- Upload Page
- Dashboard Page (월간/연간 기간 카드 목록)
- Period Detail Page (전체 내역 탭 + 카테고리별 지출 탭 — 카테고리 상세는 인라인 accordion으로 표시, 별도 라우트 없음)
- 핵심 기능 (명세서 파싱, 카테고리 자동 분류, 시각화)
- GitHub 저장소
- 테스트 또는 수동 QA 결과
- 배포 가능한 URL
- README

---

## 3. Session 2 Goal

2회차에서는 전체 프로젝트의 약 20~30%를 완성한다.

### 2회차 완료 기준
- Next.js 프로젝트가 준비되어 있다
- `/` route가 존재한다
- `/upload` route가 존재한다
- `/dashboard` route가 존재한다
- Landing Page 초안이 있다
- Upload Page shell이 있다
- Dashboard Page shell이 있다
- 핵심 타입이 정의되어 있다
- 주요 컴포넌트 placeholder가 있다
- mock data 또는 빈 상태가 준비되어 있다
- `pnpm dev`로 실행 가능하다

---

## 4. Session 2 Must Have

| Task | Description | Done When |
|---|---|---|
| Project scaffold | Next.js 프로젝트 준비 | `pnpm dev` 실행 가능 |
| Landing route | `/` 페이지 생성 | 브라우저에서 `/` 접속 가능 |
| Upload route | `/upload` 페이지 생성 | 브라우저에서 `/upload` 접속 가능 |
| Dashboard route | `/dashboard` 페이지 생성 | 브라우저에서 `/dashboard` 접속 가능 |
| Period Detail route | `/dashboard/[period]` 페이지 생성 | 브라우저에서 `/dashboard/2026-05` 접속 가능 |
| Type definition | 핵심 타입 정의 (Transaction+isCancel, Category, CategorySummary 등) | `types.ts` 작성 완료 |
| Component placeholders | 주요 컴포넌트 파일 생성 | FileUploader, PeriodToggle, PeriodCard, DonutChart, CategoryAccordion 구조 존재 |
| Mock data | 샘플 거래 내역 데이터 작성 (취소 거래 포함) | 대시보드에서 샘플 데이터 확인 가능 |
| Empty state | 데이터가 없을 때 화면 | 기본 안내 문구 표시 |

---

## 5. Session 2 Should Have

| Task | Description | Done When |
|---|---|---|
| Basic layout | Header, main layout 구성 | 화면이 큰 틀에서 정돈됨 |
| Basic styling | Tailwind 기반 최소 스타일 | 화면이 읽을 수 있는 수준 |
| Period filter placeholder | 기간 필터 UI 자리 생성 | 아직 로직은 없어도 UI 표시 |
| Category filter placeholder | 카테고리 필터 UI 자리 생성 | 아직 로직은 없어도 UI 표시 |
| Responsive base | mobile-first 기본 레이아웃 | 모바일 너비에서 큰 깨짐 없음 |

---

## 6. Session 2 Not Today

2회차에서는 아래 기능을 구현하지 않는다.
- 실제 Excel 파싱 구현
- Claude API 연동
- 실제 카테고리 분류 로직
- Session Storage 연동
- 복잡한 상태 관리
- DB 연동
- 로그인
- 결제
- Playwright 테스트 코드 작성
- 배포

---

## 7. Session 3 Goal

3회차에서는 같은 요구사항을 두 방식으로 구현하고 비교한다.

### 비교 방식
1. MD 설계 문서 기반 개발
2. OpenSpec change 기반 개발

### 3회차 목표
- 핵심 기능 구현
- 요구사항 반영도 비교
- 범위 통제 비교
- 코드 구조 비교
- Claude Code 응답 품질 비교

---

## 8. Session 3 Must Have

| Task | Related Requirement | Done When |
|---|---|---|
| Excel 파일 업로드 | FR-001 | .xlsx 파일을 선택하고 업로드할 수 있음 |
| 명세서 파싱 + 취소 감지 | FR-002, FR-013 | 거래 내역(날짜, 가맹점명, 금액, isCancel)이 추출됨 |
| 카테고리 자동 분류 | FR-003 | Claude API 호출 후 카테고리가 분류됨 |
| 대시보드 기간 카드 목록 | FR-004, FR-006 | 월간/연간 토글 + 기간 카드 목록이 표시됨 |
| 기간 상세 — 전체 내역 탭 | FR-007, FR-013 | 날짜 내림차순 전체 거래 내역 + 취소 거래 구분 표시 |
| 기간 상세 — 카테고리별 탭 | FR-005, FR-008, FR-009 | 도넛 차트 + 카테고리별 합계 + 인라인 accordion |

---

## 9. Session 3 Should Have

| Task | Description |
|---|---|
| 전체 결제 내역 목록 | 드릴다운 1단계 전체 결제 내역 확인 |
| 카테고리 필터 버튼 | 대시보드에서 카테고리 필터 버튼 동작 |
| Session Storage 저장 | 새로고침 후에도 파싱 데이터 유지 |
| 에러 메시지 | 잘못된 파일 업로드 시 안내 메시지 표시 |
| 모바일 카드형 리스트 | 테이블이 모바일에서 카드형으로 전환 |

---

## 10. Session 4 Goal

4회차에서는 테스트, 리팩토링, 배포를 진행한다.

### 4회차 목표
- Playwright 테스트 작성
- TDD 흐름 체험
- 리팩토링
- README 정리
- 배포
- 최종 발표

---

## 11. Manual QA for Session 2

2회차 종료 전 확인할 항목:
- [ ] `pnpm dev`로 앱이 실행된다
- [ ] `/` 페이지가 열린다
- [ ] `/upload` 페이지가 열린다
- [ ] `/dashboard` 페이지가 열린다
- [ ] 큰 TypeScript 오류가 없다
- [ ] Landing Page에 서비스 설명이 보인다
- [ ] Upload Page shell이 보인다
- [ ] Dashboard Page shell이 보인다
- [ ] 주요 placeholder 컴포넌트가 표시된다
- [ ] mock data가 대시보드에 표시된다
- [ ] 모바일 너비에서 큰 깨짐이 없다
- [ ] 오늘 구현 범위를 넘는 기능이 들어가지 않았다

---

## 12. Verification Commands

```bash
pnpm dev
pnpm build
git status
```

선택적으로 실행:

```bash
pnpm lint
```

---

## 13. Branch Plan

3회차 비교 실험을 위해 브랜치를 나눈다.

```text
main
├── md-driven-dev
└── openspec-driven-dev
```

### MD 기반 개발 브랜치

```bash
git checkout -b md-driven-dev
```

### OpenSpec 기반 개발 브랜치

```bash
git checkout main
git checkout -b openspec-driven-dev
```

---

## 14. Development Prompts

### 공통 베이스 구현 프롬프트

```text
planning/md-design와 OpenSpec change를 모두 참고해서
오늘 구현할 공통 베이스 20~30%만 제안해 주세요.

조건:
- MD 기반 개발과 OpenSpec 기반 개발 비교를 방해하지 않는 공통 구조만 만드세요.
- Excel 파싱, Claude API 연동은 하지 마세요.
- 로그인, DB, 외부 API는 넣지 마세요.
- route, shell, type, placeholder 중심으로 계획하세요.
- 아직 파일은 수정하지 말고 수정할 파일과 구현 순서만 제안하세요.
```

### 구현 승인 프롬프트

```text
좋습니다. 제안한 계획대로 구현해 주세요.

조건:
- planning/md-design 문서의 범위를 벗어나지 마세요.
- 복잡한 기능은 만들지 마세요.
- Excel 파싱과 Claude API 연동은 구현하지 마세요.
- 오늘은 route, 화면 shell, 타입, placeholder까지만 구현하세요.
- 구현 후 변경 파일과 실행 방법을 요약해 주세요.
```

---

## 15. Comparison Criteria for Session 3

3회차에서 두 방식의 결과를 비교할 때 볼 기준:

| Criteria | Question |
|---|---|
| Requirement Coverage | 요구사항이 빠짐없이 구현되었는가? |
| Scope Control | 불필요한 기능이 추가되지 않았는가? |
| Implementation Order | 구현 순서가 자연스러웠는가? |
| File Structure | 파일 위치가 적절한가? |
| Code Quality | 중복과 복잡도가 적절한가? |
| UI Consistency | UI Spec과 DESIGN.md를 따랐는가? |
| Verifiability | 테스트 또는 QA로 확인하기 쉬운가? |
| Claude Response Quality | 계획, 요약, 검증 설명이 명확했는가? |

---

## 16. Risks

| Risk | Mitigation |
|---|---|
| 기능 범위가 커짐 | Must / Should / Nice로 분리 |
| 구현 시간이 부족함 | 2회차는 베이스 구현까지만 |
| 문서와 구현이 어긋남 | 구현 전 planning-review 실행 |
| OpenSpec이 과하게 커짐 | tasks를 10~20분 단위로 제한 |
| 신한카드 명세서 컬럼 구조 불일치 | 실제 명세서로 파서 사전 검증 |
| Claude API 응답 지연 | 로딩 인디케이터 및 타임아웃 처리 |
| Next.js 설치 이슈 | 템플릿 repo 사용 |

---

## 17. Commit Plan

2회차 종료 시 커밋:

```bash
git add .
git commit -m "session-2: add planning docs and baseline scaffold"
git push
```

3회차 MD 기반 개발 커밋:

```bash
git commit -m "session-3a: implement from MD design"
```

3회차 OpenSpec 기반 개발 커밋:

```bash
git commit -m "session-3b: implement from OpenSpec design"
```

---

## 18. Final Checklist

2회차 종료 전 확인:
- [ ] MD 설계 문서 5개 작성 (Product Brief, Requirements Spec, UX/UI Spec, Technical Design, Delivery Plan)
- [ ] OpenSpec change 생성
- [ ] 공통 베이스 구현
- [ ] `/` route 확인
- [ ] `/upload` route 확인
- [ ] `/dashboard` route 확인
- [ ] 주요 타입 정의 (Transaction, Category, CategorySummary 등)
- [ ] placeholder 컴포넌트 생성
- [ ] mock data 확인
- [ ] `pnpm dev` 실행 확인
- [ ] Git commit / push 완료
