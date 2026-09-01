import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'SAATHI-AI Backend Simulator - Ready',
    mode: 'mock_data',
  });
}
