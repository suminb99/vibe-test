'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/layout/AppHeader';
import FileUploader from '@/features/upload/components/FileUploader';
import { parseExcel } from '@/lib/parser/excelParser';
import { classifyTransactions } from '@/lib/classifier/claudeClassifier';
import { saveStatement } from '@/lib/storage';

export default function UploadPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. 파싱
      const raw = await parseExcel(file);
      if (raw.length === 0) throw new Error('거래 내역이 없습니다.');

      // 2. 분류
      const transactions = await classifyTransactions(raw);

      // 3. Session Storage 저장
      saveStatement({ uploadedAt: new Date().toISOString(), transactions });

      // 4. 대시보드로 이동
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ctp-base">
      <AppHeader />
      <main className="flex flex-col items-center justify-center px-6 py-20 gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ctp-text mb-2">명세서 업로드</h1>
          <p className="text-sm text-ctp-subtext-1">
            신한카드 Excel 명세서(.xlsx)를 업로드하면 자동으로 분석합니다
          </p>
        </div>
        <FileUploader onFile={handleFile} isLoading={isLoading} error={error} />
      </main>
    </div>
  );
}
