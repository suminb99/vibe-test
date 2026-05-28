## 1. 의존성 및 기반 설정

- [x] 1.1 `next-themes` 패키지 설치 (`npm install next-themes`)
- [x] 1.2 `src/app/providers.tsx` 생성: `ThemeProvider` 래핑 (`attribute="data-theme"`, `defaultTheme="dark"`)
- [x] 1.3 `src/app/layout.tsx` 수정: `<html suppressHydrationWarning>` 추가, Providers 래핑

## 2. CSS 변수 재구조화 (Mocha + Latte)

- [x] 2.1 `src/app/globals.css` 수정: 기존 Macchiato 변수 제거, `:root, [data-theme="dark"]` 블록에 Mocha 변수 전체 작성
- [x] 2.2 `src/app/globals.css` 수정: `[data-theme="light"]` 블록에 Latte 변수 전체 작성 (Base, Overlay, Text, Accent 모두 포함)

## 3. Tailwind 토큰 CSS 변수 참조로 변경

- [x] 3.1 `tailwind.config.ts` 수정: `ctp-*` 색상 토큰을 하드코딩 hex에서 `var(--ctp-*)` 참조 방식으로 변경 (테마 자동 반응)

## 4. 테마 토글 컴포넌트

- [x] 4.1 `src/components/layout/ThemeToggle.tsx` 신규 생성: `useTheme` 훅 사용, Moon/Sun 아이콘, aria-label 토글
- [x] 4.2 `src/components/layout/AppHeader.tsx` 수정: 우측 클러스터에 ThemeToggle 버튼 추가

## 5. Button 컴포넌트 악센트 분화

- [x] 5.1 `src/components/ui/Button.tsx` 수정: `primary` variant를 Peach 기반으로 변경 (`bg-ctp-peach text-ctp-crust`)
- [x] 5.2 `src/components/ui/Button.tsx` 수정: `secondary` variant를 Mauve 기반으로 변경 (`bg-ctp-mauve text-ctp-crust`)
- [x] 5.3 기존 페이지들(`page.tsx`, `upload/page.tsx`, `dashboard/page.tsx` 등)에서 Button variant 적용 확인 및 조정

## 6. 랜딩 페이지 그라데이션 비주얼

- [x] 6.1 `src/app/page.tsx` 수정: 히어로 메인 타이틀에 그라데이션 텍스트 적용 (`bg-gradient-to-r from-ctp-peach via-ctp-mauve to-ctp-lavender bg-clip-text text-transparent`)
- [x] 6.2 `src/app/page.tsx` 수정: 히어로 섹션 배경에 반투명 방사형 그라데이션 워시 추가 (Mauve/Blue 계열 10~15% 불투명도)

## 7. 레인보우 하단 그라데이션 바

- [x] 7.1 `src/components/layout/RainbowBar.tsx` 신규 생성: `fixed bottom-0` 4px 높이, Mocha/Latte 악센트 linear-gradient, `[data-theme="light"]` override
- [x] 7.2 `src/app/layout.tsx` 수정: `RainbowBar` 컴포넌트를 body 최하단에 전역 포함

## 8. 페이지별 그라데이션 헤딩 적용

- [x] 8.1 `src/app/upload/page.tsx` 수정: 페이지 타이틀에 그라데이션 텍스트 적용
- [x] 8.2 `src/app/dashboard/page.tsx` 수정: 대시보드 섹션 헤딩에 그라데이션 텍스트 적용

## 9. 검증

- [x] 9.1 `pnpm build` 에러 없음 확인
- [ ] 9.2 다크 모드(Mocha): 그라데이션 텍스트, 버튼 컬러, 레인보우 바 시각 검증
- [ ] 9.3 라이트 모드(Latte): 테마 전환 후 전체 UI 색상 정상 표시 확인
- [ ] 9.4 페이지 새로고침 후 테마 선택 유지 확인 (localStorage 영속화)
- [ ] 9.5 모바일 뷰포트에서 레인보우 바 및 토글 버튼 터치 타겟(44px) 확인
