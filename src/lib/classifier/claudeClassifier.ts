import type { Transaction, Category } from '@/types';
import { mergeCategories } from '@/lib/parser/excelParser';

/** 가맹점명 중복 제거 */
function deduplicateMerchants(transactions: Omit<Transaction, 'category'>[]): string[] {
  return Array.from(new Set(transactions.map((tx) => tx.merchant)));
}

/** /api/classify 호출 → 카테고리 맵 반환 */
async function fetchCategories(merchants: string[]): Promise<Map<string, Category>> {
  const res = await fetch('/api/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merchants }),
  });

  if (!res.ok) throw new Error('카테고리 분류 API 호출에 실패했습니다.');

  const data = (await res.json()) as {
    result: { merchant: string; category: Category }[];
  };

  const map = new Map<string, Category>();
  for (const item of data.result ?? []) {
    map.set(item.merchant, item.category);
  }
  return map;
}

/** 파싱된 거래 내역을 분류해 완전한 Transaction[] 반환 */
export async function classifyTransactions(
  transactions: Omit<Transaction, 'category'>[]
): Promise<Transaction[]> {
  if (transactions.length === 0) return [];

  const merchants = deduplicateMerchants(transactions);
  const categoryMap = await fetchCategories(merchants);
  return mergeCategories(transactions, categoryMap);
}
