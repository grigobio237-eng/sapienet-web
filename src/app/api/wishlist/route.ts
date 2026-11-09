import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 찜한 상품 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get('userId')) || 1;

    const wishlists = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { specs: true, traceability: true },
        },
        retailPack: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: wishlists });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: 찜하기 토글 (추가/삭제)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId, retailPackId } = body;
    const targetUserId = userId || 1;

    const where: any = { userId: targetUserId };
    if (productId) where.productId = Number(productId);
    if (retailPackId) where.retailPackId = Number(retailPackId);

    const existing = await prisma.wishlist.findFirst({ where });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, action: 'REMOVED' });
    } else {
      const created = await prisma.wishlist.create({
        data: {
          userId: targetUserId,
          productId: productId ? Number(productId) : undefined,
          retailPackId: retailPackId ? Number(retailPackId) : undefined,
        },
      });
      return NextResponse.json({ success: true, action: 'ADDED', data: created });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
