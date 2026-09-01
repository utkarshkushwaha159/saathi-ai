import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const operatorName = params.get('operator_name') || 'Operator 1';

  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return NextResponse.json({
    session_id: sessionId,
    status: 'started',
    operator_name: operatorName,
    timestamp: new Date().toISOString(),
    message: 'Live session initialized (mock mode)',
  });
}
