import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');

    const receipts = await prisma.externalReceipt.findMany({
      where: buyerId ? { buyerId: parseInt(buyerId) } : undefined,
      orderBy: { purchaseDate: 'desc' },
    });
    return NextResponse.json({ success: true, data: receipts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { buyerId, vendorName, itemName, unitPricePerKg, receiptImgUrl } = body;

    const receipt = await prisma.externalReceipt.create({
      data: {
        buyerId: buyerId || 1,
        vendorName: vendorName || '외부 거래처 (영수증 OCR)',
        itemName: itemName || '한돈 삼겹살',
        unitPricePerKg: parseInt(unitPricePerKg) || 20500,
        dataSourceTag: 'EXTERNAL_OCR',
        receiptImgUrl: receiptImgUrl || '/images/ocr_sample.jpg',
      },
    });

    return NextResponse.json({ success: true, data: receipt });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
