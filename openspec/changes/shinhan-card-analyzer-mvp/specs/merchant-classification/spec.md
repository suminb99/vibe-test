## ADDED Requirements

### Requirement: 시스템은 가맹점명을 카테고리로 자동 분류한다
`/api/classify` API Route가 중복 제거된 가맹점명 배열을 받아 Claude API(`claude-sonnet-4-20250514`)를 호출하고 카테고리 분류 결과를 반환해야 한다. 분류 가능한 카테고리는 `식비 | 카페 | 쇼핑 | 교통 | 구독서비스 | 뷰티/헬스 | 엔터테인먼트 | 의료 | 교육 | 여행 | 기타`다.

#### Scenario: 정상 분류
- **WHEN** `{ merchants: ["스타벅스코리아", "쿠팡", "카카오택시"] }` 요청이 전달되면
- **THEN** `{ result: [{ merchant: "스타벅스코리아", category: "카페" }, ...] }` 형식으로 반환된다

#### Scenario: 모호한 가맹점 처리
- **WHEN** Claude API가 가맹점의 카테고리를 판단하기 어려운 경우
- **THEN** 해당 가맹점의 category가 `"기타"`로 반환된다

### Requirement: 시스템은 중복 가맹점을 제거한 뒤 일괄 호출한다
클라이언트에서 `/api/classify` 호출 전에 가맹점명 중복을 제거해야 한다. 분류 결과를 원본 Transaction 배열에 매핑하여 모든 거래에 카테고리를 채워야 한다.

#### Scenario: 중복 제거 후 호출
- **WHEN** 동일한 가맹점이 10건의 거래에 존재하면
- **THEN** API 호출 시 해당 가맹점은 1개만 전송된다

#### Scenario: 결과 매핑
- **WHEN** 분류 결과가 반환되면
- **THEN** 원본 Transaction 배열의 모든 항목에 category가 할당된다

### Requirement: 시스템은 해외 결제 플랫폼 접두어를 처리한다
Claude API 시스템 프롬프트에 `"ALP*, Alipay* 접두어는 해외 결제 플랫폼 이름이므로, 접두어를 제외한 나머지 가맹점명으로 카테고리를 분류하라"` 힌트를 포함해야 한다.

#### Scenario: ALP* 접두어 분류
- **WHEN** `"ALP*Starbucks"` 가맹점이 전달되면
- **THEN** category가 `"카페"`로 반환된다

#### Scenario: Alipay* 접두어 분류
- **WHEN** `"Alipay*DIDI TAXI"` 가맹점이 전달되면
- **THEN** category가 `"교통"`으로 반환된다

### Requirement: 시스템은 Claude API 응답을 안전하게 파싱한다
Claude가 JSON을 마크다운 코드 펜스(` ```json ... ``` `)로 감싸서 반환하는 경우에도 정상적으로 파싱해야 한다. 파싱에 실패하거나 유효하지 않은 카테고리 값이 포함된 경우, 해당 가맹점만 '기타'로 처리하고 나머지는 정상 반환해야 한다.

#### Scenario: 마크다운 코드 펜스 제거 후 파싱
- **WHEN** Claude가 ` ```json\n[...]\n``` ` 형식으로 응답하면
- **THEN** 코드 펜스를 제거하고 내부 JSON을 정상 파싱해 카테고리를 반환한다

#### Scenario: 유효하지 않은 카테고리 값 처리
- **WHEN** Claude 응답의 `category` 값이 정해진 11개 카테고리 목록에 없으면
- **THEN** 해당 항목의 category를 `"기타"`로 대체한다

### Requirement: 시스템은 가맹점명 매핑 시 정규화된 비교를 사용한다
Claude가 반환하는 가맹점명과 원본 가맹점명의 대소문자·앞뒤 공백이 다를 경우에도 카테고리 매핑이 정상 작동해야 한다. 정규화는 trim + toLowerCase 기준으로 한다.

#### Scenario: 대소문자 차이로 인한 매핑 실패 방지
- **WHEN** Claude가 `"starbucks"` 를 반환하고 원본 가맹점명이 `"Starbucks"` 인 경우
- **THEN** 대소문자를 무시한 비교로 매핑이 성공하고 올바른 카테고리가 할당된다

### Requirement: 분류 완료 후 Session Storage에 저장하고 대시보드로 이동한다
파싱과 분류가 모두 완료되면 `ParsedStatement` 형태로 Session Storage에 저장하고 `/dashboard`로 자동 이동해야 한다.

#### Scenario: 분류 완료 후 저장 및 이동
- **WHEN** 모든 거래의 카테고리 분류가 완료되면
- **THEN** Session Storage에 `ParsedStatement`가 저장되고 `/dashboard`로 리다이렉트된다
