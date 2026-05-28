## ADDED Requirements

### Requirement: 그라데이션 헤딩 텍스트
랜딩 페이지 히어로 제목 및 주요 섹션 h1/h2 헤딩에 SHALL Catppuccin 팔레트 기반 멀티컬러 그라데이션 텍스트가 적용된다.

#### Scenario: 랜딩 히어로 제목 그라데이션
- **WHEN** 사용자가 랜딩 페이지(`/`)를 열 때
- **THEN** 히어로 제목이 Peach → Mauve → Lavender 방향의 그라데이션 색상으로 표시된다

#### Scenario: 다크/라이트 모드에서 그라데이션 자동 전환
- **WHEN** 사용자가 테마를 다크 → 라이트로 전환할 때
- **THEN** 그라데이션 텍스트의 색상이 Mocha 악센트 → Latte 악센트로 자동 변경된다 (추가 코드 없이 CSS 변수로 처리)

### Requirement: 히어로 섹션 배경 그라데이션 워시
랜딩 페이지 히어로 섹션에 SHALL 미묘한 방사형 또는 선형 그라데이션 오버레이가 배경에 적용된다.

#### Scenario: 다크 모드 히어로 배경
- **WHEN** 다크 테마에서 랜딩 페이지를 볼 때
- **THEN** Mocha Base(`#1e1e2e`) 위에 Mauve/Blue 계열 반투명 방사형 그라데이션이 겹쳐 보인다 (불투명도 10~20% 이하로 제한)

#### Scenario: 라이트 모드 히어로 배경
- **WHEN** 라이트 테마에서 랜딩 페이지를 볼 때
- **THEN** Latte Base(`#eff1f5`) 위에 Lavender/Pink 계열 반투명 그라데이션이 겹쳐 보인다

### Requirement: 컬러풀 버튼 악센트 분화
주요 CTA 버튼은 SHALL 문맥에 따라 서로 다른 Catppuccin 악센트 컬러를 사용한다. 모든 CTA가 동일한 Mauve여선 안 된다.

#### Scenario: 랜딩 페이지 주 CTA 버튼
- **WHEN** 사용자가 랜딩 페이지의 "명세서 업로드" 등 주 CTA를 볼 때
- **THEN** 버튼은 Peach(`ctp-peach`) 배경으로 표시된다

#### Scenario: 보조 이동 버튼
- **WHEN** 사용자가 "대시보드 바로 가기" 등 보조 CTA를 볼 때
- **THEN** 버튼은 Mauve(`ctp-mauve`) 또는 Sky(`ctp-sky`) 계열로 표시된다

#### Scenario: 버튼 호버 인터랙션
- **WHEN** 사용자가 컬러 CTA 버튼에 마우스를 올릴 때
- **THEN** 버튼이 동일 색상 계열에서 살짝 밝아지거나 투명도가 변하며 인터랙션이 느껴진다

### Requirement: 레인보우 하단 그라데이션 바
모든 페이지 최하단에 SHALL Catppuccin 팔레트 전체 악센트 색상을 가로로 나열한 얇은 그라데이션 스트라이프가 표시된다.

#### Scenario: 하단 바 항상 표시
- **WHEN** 사용자가 어느 페이지에 있든 (랜딩, 업로드, 대시보드, 상세)
- **THEN** 화면 최하단에 4px 높이의 레인보우 그라데이션 바가 고정(fixed) 표시된다

#### Scenario: 다크 모드 레인보우 바 색상
- **WHEN** 다크 테마일 때
- **THEN** 바는 Mocha 악센트 순서(Red → Peach → Yellow → Green → Teal → Blue → Mauve → Pink)로 표시된다

#### Scenario: 라이트 모드 레인보우 바 색상
- **WHEN** 라이트 테마일 때
- **THEN** 바는 Latte 악센트 색상으로 교체되어 표시된다

### Requirement: Tailwind 테마 토큰 자동 전환
`tailwind.config.ts`의 `ctp-*` 색상 토큰은 SHALL CSS 변수를 참조하도록 변경되어, 테마 전환 시 Tailwind 클래스가 자동으로 올바른 색상을 사용한다.

#### Scenario: Tailwind 클래스 테마 반응
- **WHEN** `bg-ctp-mauve` 클래스를 사용한 요소가 있고 테마가 라이트로 전환될 때
- **THEN** 해당 요소의 배경색이 자동으로 Latte Mauve(`#8839ef`)로 변경된다
