import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 상품 Q&A 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const retailPackId = searchParams.get('retailPackId');

    const where: any = {};
    if (productId) where.productId = Number(productId);
    if (retailPackId) where.retailPackId = Number(retailPackId);

    const inquiries = await prisma.productInquiry.findMany({
      where,
      include: {
        user: { select: { loginId: true, userRole: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: inquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: 상품 Q&A 등록
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, retailPackId, userId, question, isSecret } = body;

    const inquiry = await prisma.productInquiry.create({
      data: {
        productId: productId ? Number(productId) : undefined,
        retailPackId: retailPackId ? Number(retailPackId) : undefined,
        userId: userId || 1,
        question,
        isSecret: !!isSecret,
      },
    });

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
