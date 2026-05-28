export type Category =
  | '식비'
  | '카페'
  | '쇼핑'
  | '교통'
  | '구독서비스'
  | '뷰티/헬스'
  | '엔터테인먼트'
  | '의료'
  | '교육'
  | '여행'
  | '기타';

export type Transaction = {
  id: string;         // "${date}-${merchant}-${index}" — 선택 기능의 고유 key
  date: string;       // "YYYY-MM-DD"
  merchant: string;
  amount: number;     // KRW, 취소 거래는 음수
  category: Category;
  isCancel: boolean;  // 취소 거래 여부 — 집계 제외, 별도 색상 표시
};

export type CategorySummary = {
  category: Category;
  totalAmount: number; // isCancel 제외 합계
  ratio: number;       // 전체 대비 비율 (0~100)
  count: number;       // 결제 건수 (isCancel 제외)
};

export type MerchantSummary = {
  merchant: string;
  totalAmount: number;
  count: number;
};

export type ParsedStatement = {
  uploadedAt: string;           // ISO 8601
  transactions: Transaction[];
};

export type PeriodMode = 'monthly' | 'yearly';

// period 파라미터 포맷: "YYYY-MM" (월간) | "YYYY" (연간)
export type Period = string;
