import { NextResponse } from 'next/server';

// Reuse the same distress keywords logic from segment endpoint
const DISTRESS_KEYWORDS: { [key: string]: { weight: number; category: string } } = {
  'dhamki': { weight: 25, category: 'threat' },
  'threat': { weight: 25, category: 'threat' },
  'maarenge': { weight: 20, category: 'threat' },
  'maar': { weight: 20, category: 'threat' },
  'darr': { weight: 20, category: 'fear' },
  'dar': { weight: 20, category: 'fear' },
  'lagta': { weight: 15, category: 'fear' },
  'scared': { weight: 20, category: 'fear' },
  'afraid': { weight: 20, category: 'fear' },
  'terrified': { weight: 25, category: 'fear' },
  'suicide': { weight: 40, category: 'critical' },
  'kill': { weight: 30, category: 'threat' },
  'murder': { weight: 30, category: 'threat' },
  'akela': { weight: 15, category: 'isolation' },
  'alone': { weight: 15, category: 'isolation' },
  'nobody': { weight: 12, category: 'isolation' },
  'koyi nahi': { weight: 15, category: 'isolation' },
  'mere ghar': { weight: 18, category: 'proximity' },
  'bahar': { weight: 12, category: 'proximity' },
  'outside': { weight: 12, category: 'proximity' },
  'near': { weight: 10, category: 'proximity' },
  'paas': { weight: 12, category: 'proximity' },
  'safe': { weight: -15, category: 'calming' },
  'police': { weight: -20, category: 'calming' },
  'aa gayi': { weight: -18, category: 'calming' },
  'hospital': { weight: -10, category: 'calming' },
  'help': { weight: -5, category: 'calming' },
  'better': { weight: -10, category: 'calming' },
  'okay': { weight: -8, category: 'calming' },
};

function calculateSVIFromText(text: string): {
  svi_increase: number;
  indicators: Array<{ phrase: string; weight: number; category: string }>;
} {
  const lowerText = text.toLowerCase();
  const foundIndicators: Array<{ phrase: string; weight: number; category: string }> = [];
  let totalSVIIncrease = 0;

  for (const [keyword, data] of Object.entries(DISTRESS_KEYWORDS)) {
    if (lowerText.includes(keyword)) {
      foundIndicators.push({
        phrase: keyword,
        weight: data.weight,
        category: data.category,
      });
      totalSVIIncrease += data.weight;
    }
  }

  return {
    svi_increase: Math.max(-30, Math.min(40, totalSVIIncrease)),
    indicators: foundIndicators,
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const formData = await request.formData();
  const chunkDuration = (formData.get('chunk_duration') as string) || '4.0';

  // In production, this would use Whisper API to transcribe audio
  // For mock, we'll return empty (the Web Speech API is already transcribing)
  const transcribedText: string = '';

  let newSVI = 10;
  let svi_label = 'LOW';
  const indicatorItems: any[] = [];

  if (transcribedText) {
    const { svi_increase, indicators } = calculateSVIFromText(transcribedText);
    const previousSVI = 10;
    newSVI = Math.min(100, Math.max(10, previousSVI + svi_increase));

    if (newSVI >= 70) svi_label = 'CRITICAL';
    else if (newSVI >= 50) svi_label = 'HIGH';
    else if (newSVI >= 30) svi_label = 'MODERATE';

    indicators.forEach((ind) => {
      indicatorItems.push({
        category: ind.category,
        ui_label: ind.phrase.toUpperCase(),
        matched_phrase: ind.phrase,
        evidence_snippet: transcribedText.substring(0, 100),
        weight: ind.weight,
        is_calming: ind.weight < 0,
      });
    });
  }

  return NextResponse.json({
    session_id: sessionId,
    chunk_duration: parseFloat(chunkDuration),
    new_text: transcribedText,
    svi: newSVI,
    svi_label: svi_label,
    indicators: indicatorItems,
  });
}
