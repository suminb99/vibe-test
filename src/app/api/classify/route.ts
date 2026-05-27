import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import type { Category } from '@/types';

const client = new Anthropic();

const CATEGORIES: Category[] = [
  '식비', '카페', '쇼핑', '교통', '구독서비스',
  '뷰티/헬스', '엔터테인먼트', '의료', '교육', '여행', '기타',
];

const SYSTEM_PROMPT = `당신은 신용카드 가맹점명을 카테고리로 분류하는 전문가입니다.
사용 가능한 카테고리: ${CATEGORIES.join(', ')}

규칙:
- ALP*, Alipay* 접두어는 해외 결제 플랫폼 이름입니다. 접두어를 제외한 나머지 가맹점명으로 분류하세요.
  예: "ALP*Starbucks" → 카페, "Alipay*DIDI TAXI" → 교통
- 판단이 어려운 가맹점은 "기타"로 분류하세요.
- 반드시 JSON 배열만 반환하세요. 설명이나 마크다운 없이 순수 JSON만 출력하세요.

응답 형식:
[{"merchant": "가맹점명", "category": "카테고리"}]`;

export async function POST(req: NextRequest) {
  try {
    const { merchants } = (await req.json()) as { merchants: string[] };

    if (!merchants || merchants.length === 0) {
      return NextResponse.json({ result: [] });
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `다음 가맹점들을 카테고리로 분류해 주세요:\n${JSON.stringify(merchants)}`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '[]';

    let result: { merchant: string; category: Category }[];
    try {
      const parsed = JSON.parse(text.trim());
      result = Array.isArray(parsed) ? parsed : [];
    } catch {
      // 파싱 실패 시 전체 기타 폴백
      result = merchants.map((m) => ({ merchant: m, category: '기타' as Category }));
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('[classify] error:', error);
    return NextResponse.json({ error: '분류 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
