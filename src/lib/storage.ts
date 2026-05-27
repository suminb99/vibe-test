import type { ParsedStatement } from '@/types';

const STORAGE_KEY = 'shinhan_parsed_statement';

export function saveStatement(statement: ParsedStatement): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(statement));
}

export function loadStatement(): ParsedStatement | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ParsedStatement;
  } catch {
    return null;
  }
}

export function clearStatement(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}
