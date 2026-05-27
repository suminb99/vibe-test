import type { Transaction, CategorySummary, Category } from '@/types';

/** period 파라미터(YYYY-MM 또는 YYYY)로 거래 내역 필터링 */
export function filterByPeriod(transactions: Transaction[], period: string): Transaction[] {
  return transactions.filter((tx) => tx.date.startsWith(period));
}

/** 거래 내역에서 중복 없는 월 목록을 최신순으로 반환 */
export function extractMonths(transactions: Transaction[]): string[] {
  const months = new Set(transactions.map((tx) => tx.date.slice(0, 7)));
  return Array.from(months).sort((a, b) => b.localeCompare(a));
}

/** 거래 내역에서 중복 없는 연도 목록을 최신순으로 반환 */
export function extractYears(transactions: Transaction[]): string[] {
  const years = new Set(transactions.map((tx) => tx.date.slice(0, 4)));
  return Array.from(years).sort((a, b) => b.localeCompare(a));
}

/** isCancel 제외 합계 */
export function sumAmount(transactions: Transaction[]): number {
  return transactions
    .filter((tx) => !tx.isCancel)
    .reduce((acc, tx) => acc + tx.amount, 0);
}

/** 카테고리별 집계 (isCancel 제외, 비율 포함) */
export function aggregateByCategory(transactions: Transaction[]): CategorySummary[] {
  const valid = transactions.filter((tx) => !tx.isCancel);
  const total = valid.reduce((acc, tx) => acc + tx.amount, 0);

  const map = new Map<Category, { totalAmount: number; count: number }>();
  for (const tx of valid) {
    const existing = map.get(tx.category) ?? { totalAmount: 0, count: 0 };
    map.set(tx.category, {
      totalAmount: existing.totalAmount + tx.amount,
      count: existing.count + 1,
    });
  }

  return Array.from(map.entries())
    .map(([category, { totalAmount, count }]) => ({
      category,
      totalAmount,
      ratio: total > 0 ? Math.round((totalAmount / total) * 100) : 0,
      count,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

/** 특정 기간의 최다 지출 카테고리 반환 */
export function topCategory(transactions: Transaction[]): Category | null {
  const summaries = aggregateByCategory(transactions);
  return summaries.length > 0 ? summaries[0].category : null;
}
