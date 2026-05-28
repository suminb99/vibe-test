## Context

현재 앱은 Catppuccin Macchiato 단일 다크 테마로 구현되어 있다. 모든 CTA가 Mauve 단색이고, 그라데이션이나 다양한 악센트 컬러 활용이 없다. 팔레트는 14개의 풍부한 악센트를 제공하지만 실제 UI에서는 Mauve, Red, Green 정도만 쓰인다.

목표: catppuccin.com처럼 그라데이션과 다채로운 악센트를 활용해 브랜드 감성을 강화하면서, 다크(Mocha)/라이트(Latte) 두 가지 테마를 동시에 지원한다.

## Goals / Non-Goals

**Goals:**
- 다크 테마를 Macchiato → Mocha로 교체
- `next-themes` + `data-theme` 속성 기반 라이트(Latte)/다크(Mocha) 전환
- 히어로 헤딩에 멀티컬러 그라데이션 텍스트 적용
- 각 버튼의 역할에 맞는 개별 악센트 컬러 부여 (Peach CTA, Green 성공, Blue 보조 등)
- 페이지 하단 레인보우 그라데이션 스트라이프
- `localStorage`를 통한 테마 선택 영속화

**Non-Goals:**
- 시스템 `prefers-color-scheme` 자동 감지 (사용자 명시적 토글만 지원)
- 테마 전환 크로스페이드 애니메이션
- Frappé, Macchiato 등 다른 Catppuccin 플레이버 지원
- 기능(분류, 파싱, 대시보드 로직) 변경

## Decisions

### D1. CSS 변수 + `data-theme` 속성 방식

**선택**: `:root, [data-theme="dark"]`에 Mocha 변수, `[data-theme="light"]`에 Latte 변수.

**이유**: 컴포넌트 코드가 `--ctp-mauve` 같은 변수만 참조하면 테마와 무관하게 동작한다. Tailwind `ctp-*` 토큰을 CSS 변수 참조(`var(--ctp-mauve)`)로 바꾸면 Tailwind 클래스도 자동으로 테마를 따른다.

**대안**: `prefers-color-scheme` 미디어쿼리만 사용 → 사용자가 직접 토글할 수 없어 기각.

### D2. `next-themes` 패키지 사용

**선택**: `next-themes` (ThemeProvider, `attribute="data-theme"`, `defaultTheme="dark"`).

**이유**: Next.js App Router에서 SSR hydration mismatch를 방지하는 가장 검증된 방법. `suppressHydrationWarning`을 `<html>`에 적용해 초기 깜빡임 제거.

**대안**: 직접 `localStorage` + `useEffect` 구현 → 초기 렌더 깜빡임 발생, 유지보수 비용 높음.

### D3. 그라데이션 텍스트 구현

**선택**: Tailwind `bg-clip-text text-transparent bg-gradient-to-r` 유틸리티 조합.

```
bg-gradient-to-r from-ctp-peach via-ctp-mauve to-ctp-lavender
bg-clip-text text-transparent
```

라이트 모드에서는 동일 클래스지만 CSS 변수 값이 Latte 악센트로 바뀌므로 추가 작업 불필요.

### D4. 버튼 악센트 분화 전략

| 버튼 문맥 | 다크(Mocha) | 라이트(Latte) |
|---|---|---|
| 주 CTA (업로드, 분석 시작) | `ctp-peach` bg | `ctp-peach` bg |
| 보조 CTA (대시보드 이동) | `ctp-mauve` bg | `ctp-mauve` bg |
| Ghost / 네비게이션 | border `ctp-surface-2` | border `ctp-surface-2` |
| 위험 (삭제 계열) | `ctp-red` bg | `ctp-red` bg |

기존 `Button.tsx`의 `primary` variant를 Peach 기반으로 변경. Mauve는 `secondary` variant로 이동.

### D5. 레인보우 하단 바

**선택**: `AppLayout` 또는 `RootLayout`에 고정 `<div>` 추가.

```css
background: linear-gradient(to right,
  #f38ba8, #fab387, #f9e2af, #a6e3a1,
  #94e2d5, #89b4fa, #cba6f7, #f5c2e7
);
height: 4px;
position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
```

라이트 모드에서는 Latte 악센트 hex로 교체. CSS 변수 방식 대신 하드코딩 — 그라데이션의 `linear-gradient`는 CSS 변수 참조가 브라우저마다 다르게 동작하므로 `[data-theme]` 셀렉터로 별도 override.

## Risks / Trade-offs

- **[SSR 깜빡임]** → `next-themes`의 `suppressHydrationWarning` + 서버 기본값 `dark`로 Mocha가 먼저 렌더된 후 Latte로 전환되는 깜빡임 최소화. 완전히 제거 불가.
- **[Tailwind 퍼지 문제]** → CSS 변수를 Tailwind 토큰으로 등록 시 실제 클래스 사용이 없으면 퍼지됨. `safelist`에 동적 클래스 추가 또는 정적 클래스만 사용.
- **[그라데이션 텍스트 접근성]** → `bg-clip-text`는 일부 스크린 리더에서 색상 정보 손실. 헤딩은 구조적 역할로 읽히므로 문제 없음; 다만 색상 단독으로 의미 전달하지 말 것.
- **[Latte 배지 alpha]** → 15% 알파 틴트가 라이트 배경에서 너무 연해 보일 수 있음 → 25%로 올리거나 별도 Latte 값 지정.

## Migration Plan

1. `npm install next-themes`
2. `globals.css` Mocha + Latte 변수 블록 작성
3. `tailwind.config.ts` `ctp-*` 토큰 → `var(--ctp-*)` 참조로 변경
4. `layout.tsx` ThemeProvider 래핑
5. `ThemeToggle.tsx` 컴포넌트 신규 작성
6. `AppHeader.tsx` 토글 버튼 추가
7. `Button.tsx` primary → Peach, secondary → Mauve로 재정의
8. Landing page 히어로 그라데이션 텍스트 + 배경 워시
9. 레인보우 하단 바 추가
10. 빌드 확인 및 라이트/다크 양쪽 수동 검증

**롤백**: `next-themes` 제거, `globals.css` 이전 Macchiato 변수 복원, `ThemeProvider` 제거.

## Open Questions

- 레인보우 바를 `fixed`로 항상 표시할지, 페이지 푸터 안에 포함할지 — catppuccin.com은 `fixed bottom-0` 방식 사용.
- 히어로 배경 그라데이션 워시 강도 — 너무 강하면 텍스트 가독성 저하. 10~15% 불투명도 권장.
