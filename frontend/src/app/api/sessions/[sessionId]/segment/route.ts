import { NextResponse } from 'next/server';

// Distress keywords and their SVI impact
const DISTRESS_KEYWORDS: { [key: string]: { weight: number; category: string } } = {
  // Hindi/Hinglish threat indicators
  'dhamki': { weight: 25, category: 'threat' },
  'threat': { weight: 25, category: 'threat' },
  'maarenge': { weight: 20, category: 'threat' },
  'maar': { weight: 20, category: 'threat' },
  
  // Hindi/Hinglish fear/distress indicators
  'darr': { weight: 20, category: 'fear' },
  'dar': { weight: 20, category: 'fear' },
  'lagta': { weight: 15, category: 'fear' },
  'scared': { weight: 20, category: 'fear' },
  'afraid': { weight: 20, category: 'fear' },
  'terrified': { weight: 25, category: 'fear' },
  'suicide': { weight: 40, category: 'critical' },
  'kill': { weight: 30, category: 'threat' },
  'murder': { weight: 30, category: 'threat' },
  
  // Isolation indicators
  'akela': { weight: 15, category: 'isolation' },
  'alone': { weight: 15, category: 'isolation' },
  'nobody': { weight: 12, category: 'isolation' },
  'koyi nahi': { weight: 15, category: 'isolation' },
  
  // Proximity/immediate threat
  'mere ghar': { weight: 18, category: 'proximity' },
  'bahar': { weight: 12, category: 'proximity' },
  'outside': { weight: 12, category: 'proximity' },
  'near': { weight: 10, category: 'proximity' },
  'paas': { weight: 12, category: 'proximity' },
  
  // Calming/de-escalation indicators (negative weight)
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
    svi_increase: Math.max(-30, Math.min(40, totalSVIIncrease)), // Cap between -30 and +40
    indicators: foundIndicators,
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const formData = await request.formData();
  const text = formData.get('text') as string || '';
  const chunkDuration = formData.get('chunk_duration') as string || '3.5';
  const sttSource = formData.get('stt_source') as string || 'live_speech';

  const { svi_increase, indicators } = calculateSVIFromText(text);

  // Calculate new SVI (simulated, would come from backend in production)
  // Start at 10, can go up to 100
  const previousSVI = 10; // In production, would track this per session
  const newSVI = Math.min(100, Math.max(10, previousSVI + svi_increase));

  // Determine SVI label
  let svi_label = 'LOW';
  if (newSVI >= 70) svi_label = 'CRITICAL';
  else if (newSVI >= 50) svi_label = 'HIGH';
  else if (newSVI >= 30) svi_label = 'MODERATE';

  // Create indicator items for UI display
  const indicatorItems = indicators.map((ind) => ({
    category: ind.category,
    ui_label: ind.phrase.toUpperCase(),
    matched_phrase: ind.phrase,
    evidence_snippet: text.substring(0, 100),
    weight: ind.weight,
    is_calming: ind.weight < 0,
  }));

  return NextResponse.json({
    session_id: sessionId,
    chunk_duration: parseFloat(chunkDuration),
    stt_source: sttSource,
    new_text: text,
    svi: newSVI,
    svi_label: svi_label,
    svi_increase: svi_increase,
    indicators: indicatorItems,
    metric_bars: [
      { name: 'Voice tone', score: Math.min(100, 8 + Math.abs(svi_increase)) },
      { name: 'Distress keywords', score: Math.max(0, 5 + svi_increase / 2) },
      { name: 'Speech pace', score: 12 },
      { name: 'Isolation signal', score: Math.max(0, 4 + svi_increase / 4) },
    ],
  });
}
