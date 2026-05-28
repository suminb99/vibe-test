import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Category } from '@/types';

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

/** process.env에 없으면 .env.local 파일을 직접 파싱해 반환 */
function resolveApiKey(): string | undefined {
  if (process.env.ANTHROPIC_API_KEY) {
    return process.env.ANTHROPIC_API_KEY;
  }
  try {
    const envPath = join(process.cwd(), '.env.local');
    const content = readFileSync(envPath, 'utf8');
    const match = content.match(/^ANTHROPIC_API_KEY=(.+)$/m);
    return match?.[1]?.trim();
  } catch {
    return undefined;
  }
}

export async function POST(req: NextRequest) {
  const apiKey = resolveApiKey();

  if (!apiKey) {
    console.error('[classify] ANTHROPIC_API_KEY를 찾을 수 없습니다. .env.local을 확인하세요.');
    return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const { merchants } = (await req.json()) as { merchants: string[] };

    if (!merchants || merchants.length === 0) {
      return NextResponse.json({ result: [] });
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `다음 가맹점들을 카테고리로 분류해 주세요:\n${JSON.stringify(merchants)}`,
        },
      ],
    });

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '[]';

    // 마크다운 코드 펜스 제거 (```json ... ``` 또는 ``` ... ```)
    const text = rawText
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    let result: { merchant: string; category: Category }[];
    try {
      // JSON 배열만 추출 (앞뒤 설명 텍스트가 있어도 파싱 가능)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      result = Array.isArray(parsed) ? parsed : [];
    } catch {
      console.error('[classify] JSON 파싱 실패, 전체 기타 폴백. 원본 응답:', rawText.slice(0, 200));
      result = merchants.map((m) => ({ merchant: m, category: '기타' as Category }));
    }

    // 유효하지 않은 category 값은 '기타'로 대체
    const validResult = result.map((item) => ({
      merchant: item.merchant,
      category: (CATEGORIES.includes(item.category as Category)
        ? item.category
        : '기타') as Category,
    }));

    return NextResponse.json({ result: validResult });
  } catch (error) {
    console.error('[classify] error:', error);
    const msg = error instanceof Error ? error.message : '분류 중 오류가 발생했습니다.';
    const status =
      typeof (error as { status?: number }).status === 'number'
        ? (error as { status: number }).status
        : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
