# UX / UI Spec

## 1. Design Reference
Follow:
- docs/DESIGN.md (Catppuccin Macchiato 다크 테마)

---

## 2. Screen Map
| Screen | Route | Purpose |
|---|---|---|
| Landing Page | `/` | 서비스 소개와 앱 진입 |
| Upload Page | `/upload` | 명세서 파일 업로드 |
| Dashboard Page | `/dashboard` | 월간/연간 기간 카드 목록 |
| Period Detail Page | `/dashboard/[period]` | 기간 상세 (전체 내역 + 카테고리별) |

---

## 3. Landing Page

### Purpose
서비스의 문제, 가치, 핵심 기능을 설명하고 사용자를 업로드 화면으로 이동시킨다.

### Required Sections
- Hero
- Problem
- Core Features
- CTA Button

### Key Copy
- **Headline:** 카드 명세서 하나로 내 소비 패턴을 한눈에
- **Subheadline:** 엑셀 파일만 올리면 카테고리별 지출을 자동으로 분석해드립니다
- **CTA:** 명세서 업로드하고 분석 시작하기

---

## 4. Upload Page

### Purpose
사용자가 신한카드 Excel 명세서를 업로드하는 전용 화면이다.
업로드 완료 후 Dashboard Page로 자동 이동한다.

### Required Areas

#### 업로드 영역
- 파일 드래그앤드롭 또는 클릭으로 Excel 파일 선택
- 업로드 가능한 파일 형식 안내 (.xlsx)
- 업로드 진행 상태 표시 (로딩 인디케이터)
- 업로드 성공 시 Dashboard Page로 자동 이동
- 업로드 실패 시 에러 메시지 표시 및 재업로드 안내

#### 안내 영역
- 신한카드 명세서 다운로드 방법 간단 안내 (텍스트 또는 이미지)

---

## 5. Dashboard Page

### Purpose
업로드된 명세서를 기반으로 월간 또는 연간 단위의 기간 카드 목록을 표시하는 진입 화면이다.

### Required Areas

#### 기간 토글 영역
- 월간 / 연간 토글 버튼
- 선택된 모드가 시각적으로 강조 표시
- 전환 시 카드 목록 즉시 갱신

#### 기간 카드 목록
- 명세서 내 기간(월 또는 연도)을 최신순으로 카드 형태로 나열
- 각 카드: 기간명 (예: 2026년 5월) / 총 지출액 (취소 거래 제외) / 최다 지출 카테고리명
- 카드 클릭 시 Period Detail Page로 이동
- 모바일에서 1열, 데스크톱에서 2~3열 그리드

#### 빈 상태 (Empty State)
- Session Storage에 데이터가 없을 때 업로드 안내 메시지 + `/upload` 이동 버튼

---

## 6. Period Detail Page

### Purpose
특정 기간의 전체 결제 내역과 카테고리별 지출을 상세히 확인하는 화면이다.

### Required Areas

#### 브레드크럼 영역
- 대시보드 > YYYY년 MM월 (또는 YYYY년) 형태
- 대시보드 클릭 시 Dashboard Page로 이동

#### 도넛 차트 영역
- 해당 기간 카테고리별 지출 비율 시각화 (취소 거래 제외)
- Catppuccin 팔레트 순서로 색상 적용 (Mauve → Blue → Green → Peach → ...)

#### 탭 영역
- **전체 결제 내역** (default): 날짜 내림차순 거래 목록
  - 취소 거래: `--ctp-overlay-1` 색상 + `취소` 배지 표시
- **카테고리별 지출**: 카테고리별 합계·비율 목록
  - 각 카테고리 행에 펼치기 버튼
  - 펼치기 클릭 시 해당 카테고리 거래 내역 인라인 accordion으로 표시
  - 여러 카테고리 동시 펼치기 가능

---

## 7. Component Plan
| Component | Purpose | Requirement Link |
|---|---|---|
| AppHeader | 서비스 로고 및 현재 페이지 표시 | - |
| FileUploader | Excel 명세서 업로드 및 상태 표시 | FR-001, FR-002 |
| PeriodToggle | 월간 / 연간 전환 토글 | FR-006 |
| PeriodCard | 기간 카드 (총액 + 최다 카테고리) | FR-004 |
| DonutChart | 기간 상세의 카테고리별 비율 시각화 | FR-005 |
| TransactionList | 전체 결제 내역 목록 (취소 거래 구분 표시) | FR-007, FR-013 |
| CategoryAccordion | 카테고리별 합계·비율 + 인라인 펼치기 | FR-008, FR-009 |
| Breadcrumb | 현재 위치 표시 (대시보드 > 기간) | - |
| EmptyState | 데이터 없음 안내 | FR-010 |
| ErrorMessage | 파일 오류 안내 메시지 | FR-010 |

---

## 8. Interaction Rules
- Excel 파일 업로드 완료 후 Dashboard Page로 자동 이동한다
- 월간 / 연간 토글 전환 시 기간 카드 목록이 즉시 갱신된다
- 기간 카드 클릭 시 `/dashboard/[period]` Period Detail Page로 이동한다
- Period Detail Page에서 뒤로가기 또는 브레드크럼 클릭 시 Dashboard Page로 돌아간다
- 카테고리 펼치기 버튼 클릭 시 해당 카테고리 거래 내역이 인라인으로 펼쳐진다 (페이지 이동 없음)
- 파일 업로드 중에는 업로드 버튼이 비활성화된다
- 잘못된 파일 형식 업로드 시 에러 메시지를 표시하고 재업로드를 안내한다

---

## 9. Responsive Design Rules
- **Breakpoint 기준:** mobile (~ 768px) / desktop (769px ~)
- 모든 페이지는 mobile-first로 설계한다
- 테이블은 모바일에서 카드형 리스트로 전환한다
- 도넛 차트는 모바일에서 테이블 아래로 배치한다
- 기간 필터와 카테고리 필터는 모바일에서 가로 스크롤 형태로 표시한다
- 터치 영역은 최소 44px 이상을 확보한다

---

## 10. Accessibility Rules
- 모든 입력 필드에는 label이 있어야 한다
- 버튼 텍스트는 기능을 설명해야 한다
- 색상만으로 카테고리를 구분하지 않고 텍스트 레이블을 병행 표시한다
- 주요 영역은 heading 구조를 가진다
- 파일 업로드 영역은 키보드로도 접근 가능해야 한다
- 차트는 스크린 리더를 위한 대체 텍스트를 제공한다
