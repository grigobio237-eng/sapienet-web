import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const marketPrices = await prisma.marketPriceHistory.findMany({
      orderBy: { recordedDate: 'desc' },
      take: 10,
    });
    return NextResponse.json({ success: true, data: marketPrices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
