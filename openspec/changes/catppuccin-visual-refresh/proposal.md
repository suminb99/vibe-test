## Why

현재 UI는 Catppuccin Macchiato 팔레트를 사용하지만 단일 Mauve CTA 색상과 평면적인 배경만 사용해 팔레트가 가진 풍부한 색감을 충분히 활용하지 못하고 있다. catppuccin.com처럼 그라데이션과 다양한 악센트 컬러를 적극 활용해 브랜드 아이덴티티를 강화하고 시각적 생동감을 높인다.

## What Changes

- **다크 테마 교체**: Catppuccin Macchiato → **Mocha** (더 어두운 베이스, 더 선명한 악센트)
- **라이트 테마 추가**: Catppuccin **Latte** (토글로 전환 가능)
- **그라데이션 헤딩**: 히어로/페이지 타이틀에 Peach → Mauve 방향 멀티컬러 그라데이션 텍스트
- **컬러풀 버튼**: CTA 버튼을 단일 Mauve에서 각 문맥에 맞는 악센트 컬러(Peach, Green, Blue, Mauve 등)로 분화
- **배경 그라데이션 워시**: 히어로/랜딩 섹션 배경에 미묘한 방사형 혹은 선형 그라데이션 오버레이
- **레인보우 하단 바**: 페이지 최하단에 Catppuccin 팔레트 전체 색상을 가로로 나열한 그라데이션 스트라이프
- **테마 토글 버튼**: AppHeader 우측에 Moon/Sun 아이콘 토글 추가
- **globals.css 변수 재구조화**: Mocha(기본) / Latte(`[data-theme="light"]`) CSS 변수 세트 분리

## Capabilities

### New Capabilities

- `theme-switching`: 다크(Mocha) / 라이트(Latte) 테마 전환 — `data-theme` 속성 기반, `next-themes` 사용, localStorage 영속화
- `gradient-visuals`: 그라데이션 텍스트, 배경 그라데이션 워시, 레인보우 하단 바 — 글로벌 유틸리티 클래스 및 컴포넌트 스타일 패턴

### Modified Capabilities

(없음 — 기존 기능 스펙 변경 없음, 비주얼 레이어만 교체)

## Impact

- `src/app/globals.css` — Mocha/Latte CSS 변수 블록 재작성
- `tailwind.config.ts` — `ctp-*` 토큰을 CSS 변수 참조로 변경하여 테마 자동 전환 지원
- `src/app/layout.tsx` — `next-themes` ThemeProvider 래핑, `suppressHydrationWarning`
- `src/components/layout/AppHeader.tsx` — ThemeToggle 버튼 추가
- `src/components/layout/ThemeToggle.tsx` — 신규 컴포넌트
- `src/app/page.tsx` — 랜딩 히어로 그라데이션 텍스트 및 배경 워시 적용
- `src/app/dashboard/page.tsx`, `src/app/upload/page.tsx` — 페이지 헤딩 그라데이션 적용
- 의존성 추가: `next-themes`
