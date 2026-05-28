## ADDED Requirements

### Requirement: 다크/라이트 테마 전환 토글
앱은 Catppuccin Mocha(다크)와 Catppuccin Latte(라이트) 두 가지 테마를 SHALL 지원한다. 사용자는 AppHeader의 토글 버튼으로 언제든지 전환할 수 있어야 한다.

#### Scenario: 초기 진입 시 다크 테마 적용
- **WHEN** 사용자가 테마를 설정한 적이 없는 상태로 앱에 처음 접속할 때
- **THEN** Catppuccin Mocha(다크) 테마가 기본으로 적용된다

#### Scenario: 토글 버튼으로 라이트 모드 전환
- **WHEN** 다크 모드 상태에서 AppHeader의 테마 토글 버튼을 클릭할 때
- **THEN** 앱 전체가 Catppuccin Latte(라이트) 테마로 즉시 전환된다

#### Scenario: 토글 버튼으로 다크 모드 재전환
- **WHEN** 라이트 모드 상태에서 AppHeader의 테마 토글 버튼을 클릭할 때
- **THEN** 앱 전체가 Catppuccin Mocha(다크) 테마로 즉시 전환된다

### Requirement: 테마 선택 영속화
선택된 테마는 localStorage에 SHALL 저장되어 페이지 새로고침 또는 재방문 시에도 유지된다.

#### Scenario: 라이트 모드 선택 후 새로고침
- **WHEN** 사용자가 라이트 모드로 전환한 뒤 페이지를 새로고침할 때
- **THEN** 라이트(Latte) 테마가 유지된 상태로 페이지가 로드된다

#### Scenario: 다크 모드 선택 후 탭 재방문
- **WHEN** 사용자가 다크 모드로 전환한 뒤 탭을 닫고 다시 열었을 때
- **THEN** 다크(Mocha) 테마가 유지된 상태로 페이지가 로드된다

### Requirement: 테마 토글 버튼 UI
AppHeader 우측에 현재 테마를 나타내는 아이콘 버튼이 SHALL 표시된다.

#### Scenario: 다크 모드일 때 아이콘
- **WHEN** 현재 테마가 다크(Mocha)일 때
- **THEN** 토글 버튼에 Moon 아이콘이 표시되고, aria-label은 "라이트 모드로 전환"이어야 한다

#### Scenario: 라이트 모드일 때 아이콘
- **WHEN** 현재 테마가 라이트(Latte)일 때
- **THEN** 토글 버튼에 Sun 아이콘이 표시되고, aria-label은 "다크 모드로 전환"이어야 한다

### Requirement: SSR 하이드레이션 깜빡임 방지
테마 초기화로 인한 레이아웃 시프트나 색상 깜빡임이 SHALL 최소화되어야 한다.

#### Scenario: 초기 로드 시 깜빡임 없음
- **WHEN** 저장된 테마(라이트 또는 다크)가 있는 상태에서 페이지를 로드할 때
- **THEN** 테마가 로드 직후 유지되며, 눈에 띄는 색상 전환 깜빡임이 발생하지 않는다
