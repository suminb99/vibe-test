/** KRW 금액을 "1,800원" 형식으로 포맷 */
export function formatAmount(amount: number): string {
  const abs = Math.abs(amount);
  return abs.toLocaleString('ko-KR') + '원';
}

/** "YYYY-MM-DD" → "YYYY년 MM월 DD일" */
export function formatDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
}

/** "YYYY-MM" → "YYYY년 MM월" */
export function formatMonthLabel(period: string): string {
  const [year, month] = period.split('-');
  return `${year}년 ${parseInt(month)}월`;
}

/** "YYYY" → "YYYY년" */
export function formatYearLabel(period: string): string {
  return `${period}년`;
}

/** period 파라미터가 월간인지 연간인지 판별 */
export function isMonthlyPeriod(period: string): boolean {
  return period.includes('-');
}

/** period label 반환 (월간/연간 자동 판별) */
export function formatPeriodLabel(period: string): string {
  return isMonthlyPeriod(period) ? formatMonthLabel(period) : formatYearLabel(period);
}
