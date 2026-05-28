## ADDED Requirements

### Requirement: Landing Page에서 대시보드로 바로 이동할 수 있다
Landing Page는 업로드 CTA 외에 기존 사용자가 대시보드로 바로 진입할 수 있는 secondary 버튼을 제공해야 한다.

#### Scenario: Landing Page에서 대시보드 이동
- **WHEN** 사용자가 Landing Page의 "대시보드 바로 가기" 버튼을 클릭하면
- **THEN** `/dashboard` 페이지로 이동한다

### Requirement: Dashboard Page에서 명세서 업로드 페이지로 이동할 수 있다
Dashboard Page는 새 명세서를 업로드할 수 있도록 `/upload`로 이동하는 버튼을 항상 표시해야 한다. 데이터가 있을 때도 없을 때도 표시된다.

#### Scenario: Dashboard에서 업로드 페이지 이동
- **WHEN** 사용자가 Dashboard Page의 "새 명세서 업로드" 버튼을 클릭하면
- **THEN** `/upload` 페이지로 이동한다

### Requirement: Upload Page에서 대시보드로 이동할 수 있다
Upload Page는 업로드 없이 대시보드로 돌아갈 수 있는 버튼을 제공해야 한다.

#### Scenario: Upload Page에서 대시보드 이동
- **WHEN** 사용자가 Upload Page의 "대시보드로 이동" 버튼을 클릭하면
- **THEN** `/dashboard` 페이지로 이동한다
