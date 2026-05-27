'use client';

import { useCallback, useState } from 'react';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface FileUploaderProps {
  onFile: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

export default function FileUploader({ onFile, isLoading, error }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validate = (file: File): string | null => {
    if (!file.name.endsWith('.xlsx')) {
      return '.xlsx 파일만 업로드할 수 있습니다. 신한카드 앱에서 Excel 형식으로 다운로드해 주세요.';
    }
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file);
      if (err) return;
      setSelectedFile(file);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {/* Drop zone */}
      <label
        className={[
          'flex flex-col items-center justify-center gap-3',
          'h-44 rounded-[12px] border-2 border-dashed cursor-pointer',
          'transition-colors duration-200',
          isDragging
            ? 'border-ctp-mauve bg-[rgba(198,160,246,0.08)]'
            : 'border-ctp-surface-2 bg-ctp-surface-0 hover:border-ctp-mauve hover:bg-[rgba(198,160,246,0.05)]',
        ].join(' ')}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <span className="text-3xl">{selectedFile ? '✅' : '📂'}</span>
        {selectedFile ? (
          <>
            <p className="text-sm font-medium text-ctp-text">{selectedFile.name}</p>
            <p className="text-xs text-ctp-subtext-1">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-ctp-text">
              파일을 드래그하거나 클릭해서 선택
            </p>
            <p className="text-xs text-ctp-subtext-1">.xlsx 파일만 지원합니다</p>
          </>
        )}
        <input
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={handleChange}
          disabled={isLoading}
          aria-label="신한카드 Excel 명세서 파일 선택"
        />
      </label>

      {/* Error */}
      {error && <ErrorMessage message={error} />}

      {/* Upload button */}
      <Button
        onClick={() => selectedFile && onFile(selectedFile)}
        disabled={!selectedFile || isLoading}
        className="w-full h-11"
      >
        {isLoading ? '분석 중...' : '업로드하고 분석 시작'}
      </Button>

      {/* Guide */}
      <p className="text-xs text-ctp-subtext-0 text-center">
        신한카드 앱 → 이용내역 → 기간 선택 → Excel 내보내기
      </p>
    </div>
  );
}
