import * as XLSX from 'xlsx';
import type { Transaction, Category } from '@/types';

const REQUIRED_COLUMNS = ['거래일', '가맹점명', '금액'] as const;

/** 금액 문자열 → 정수 (쉼표 제거) */
function parseAmount(raw: string | number): number {
  if (typeof raw === 'number') return raw;
  return parseInt(String(raw).replace(/,/g, '').trim(), 10) || 0;
}

/** "YYYY.MM.DD HH:MM" → "YYYY-MM-DD" */
function parseDate(raw: string): string {
  const datePart = String(raw).trim().split(' ')[0]; // "2026.05.27"
  return datePart.replace(/\./g, '-');
}

/** YYYY-MM-DD 형식인지 검증 (합계 행 등 비거래 행 제거용) */
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
function isValidDate(date: string): boolean {
  return DATE_PATTERN.test(date);
}

/** 취소 거래 감지 */
function detectCancel(row: Record<string, unknown>, amount: number): boolean {
  if (amount < 0) return true;
  if (String(row['매입구분'] ?? '').trim() === '승인취소') return true;
  if (String(row['취소상태'] ?? '').trim() === '취소') return true;
  return false;
}

export function parseExcel(file: File): Promise<Omit<Transaction, 'category'>[]> {
  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    return Promise.reject(
      new Error('.xlsx 또는 .xls 파일만 지원합니다.')
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

        if (rows.length === 0) {
          throw new Error('명세서에 데이터가 없습니다.');
        }

        // 필수 컬럼 존재 여부 확인
        const firstRow = rows[0];
        for (const col of REQUIRED_COLUMNS) {
          if (!(col in firstRow)) {
            throw new Error(
              `필수 컬럼 "${col}"이 없습니다. 신한카드 Excel 명세서 파일인지 확인해 주세요.`
            );
          }
        }

        const transactions: Omit<Transaction, 'category'>[] = rows
          .filter((row) => row['매입구분'] !== undefined) // 헤더 반복 행 제거
          .map((row, index) => {
            const date = parseDate(row['거래일'] as string);
            const merchant = String(row['가맹점명'] ?? '').trim();
            const amount = parseAmount(row['금액'] as string | number);
            const isCancel = detectCancel(row, amount);
            return {
              id: `${date}-${merchant}-${index}`,
              date,
              merchant,
              amount,
              isCancel,
            };
          })
          .filter((tx) => tx.merchant.length > 0 && isValidDate(tx.date));

        resolve(transactions);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    reader.readAsArrayBuffer(file);
  });
}

/** category placeholder — classify 후 병합용 */
export function mergeCategories(
  transactions: Omit<Transaction, 'category'>[],
  categoryMap: Map<string, Category>
): Transaction[] {
  // 정규화 키(trim + lowercase) 기반 조회용 보조 맵
  const normalizedMap = new Map<string, Category>();
  for (const [key, val] of categoryMap) {
    normalizedMap.set(key.trim().toLowerCase(), val);
  }

  return transactions.map((tx) => ({
    ...tx,
    category:
      categoryMap.get(tx.merchant) ??
      normalizedMap.get(tx.merchant.trim().toLowerCase()) ??
      '기타',
  }));
}
