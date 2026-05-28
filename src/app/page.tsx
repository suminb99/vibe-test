'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-ctp-base">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 gap-6">
        <span className="text-5xl">💳</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-ctp-text leading-tight max-w-xl">
          카드 명세서 하나로<br />
          <span className="text-ctp-mauve">내 소비 패턴</span>을 한눈에
        </h1>
        <p className="text-base text-ctp-subtext-1 max-w-md">
          엑셀 파일만 올리면 카테고리별 지출을 자동으로 분석해드립니다
        </p>
        <Button
          onClick={() => router.push('/upload')}
          className="mt-2 h-12 px-8 text-base"
        >
          명세서 업로드하고 분석 시작하기
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push('/dashboard')}
          className="h-10 px-6"
        >
          대시보드 바로 가기
        </Button>
      </section>

      {/* Problem */}
      <section className="max-w-2xl mx-auto px-6 py-16 border-t border-ctp-surface-0">
        <h2 className="text-xl font-semibold text-ctp-text mb-6 text-center">
          이런 불편함이 있으셨나요?
        </h2>
        <ul className="flex flex-col gap-4">
          {[
            '매달 카드값 청구서를 봐도 어디서 얼마나 썼는지 파악이 어렵다',
            '카테고리별 지출을 알려면 직접 일일이 계산해야 한다',
            '은행 앱은 단순 내역 조회만 있어 소비 분석이 안 된다',
          ].map((text) => (
            <li
              key={text}
              className="flex items-start gap-3 text-sm text-ctp-subtext-1 bg-ctp-surface-0 rounded-[12px] px-4 py-3 border border-ctp-surface-1"
            >
              <span className="text-ctp-red mt-0.5">✕</span>
              {text}
            </li>
          ))}
        </ul>
      </section>

      {/* Core Features */}
      <section className="max-w-2xl mx-auto px-6 py-16 border-t border-ctp-surface-0">
        <h2 className="text-xl font-semibold text-ctp-text mb-6 text-center">
          이렇게 해결해 드립니다
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '📤', title: '파일 업로드', desc: '신한카드 Excel 명세서를 드래그앤드롭으로 업로드' },
            { icon: '🤖', title: 'AI 자동 분류', desc: 'Claude AI가 가맹점을 카테고리별로 자동 분류' },
            { icon: '📊', title: '소비 시각화', desc: '월간·연간 지출 패턴을 차트와 카드로 한눈에 확인' },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-3 bg-ctp-surface-0 border border-ctp-surface-1 rounded-[12px] p-5"
            >
              <span className="text-3xl">{icon}</span>
              <h3 className="text-sm font-semibold text-ctp-text">{title}</h3>
              <p className="text-xs text-ctp-subtext-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="flex flex-col items-center text-center px-6 py-16 border-t border-ctp-surface-0">
        <p className="text-sm text-ctp-subtext-1 mb-4">지금 바로 시작해보세요</p>
        <Button
          onClick={() => router.push('/upload')}
          className="h-12 px-8 text-base"
        >
          명세서 업로드하고 분석 시작하기
        </Button>
      </section>
    </main>
  );
}
