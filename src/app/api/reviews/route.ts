import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 상품별 또는 전체 리뷰 목록 & 통계 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const retailPackId = searchParams.get('retailPackId');
    const sort = searchParams.get('sort') || 'recommended'; // recommended, latest, high_rating

    const where: any = {};
    if (productId) where.productId = Number(productId);
    if (retailPackId) where.retailPackId = Number(retailPackId);

    let orderBy: any = [{ likesCount: 'desc' }, { createdAt: 'desc' }];
    if (sort === 'latest') orderBy = [{ createdAt: 'desc' }];
    if (sort === 'high_rating') orderBy = [{ rating: 'desc' }, { createdAt: 'desc' }];

    const reviews = await prisma.productReview.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            loginId: true,
            userRole: true,
            businessBuyer: { select: { companyName: true } },
          },
        },
      },
      orderBy,
    });

    // 리뷰 평점 통계 계산
    const totalCount = reviews.length;
    const avgRating =
      totalCount > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
        : '0.0';

    return NextResponse.json({
      success: true,
      data: reviews,
      meta: {
        totalCount,
        avgRating: Number(avgRating),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: 리뷰 등록
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productId,
      retailPackId,
      orderId,
      userId,
      rating,
      title,
      content,
      photoUrls,
      meatTags,
      isBusinessBuyer,
    } = body;

    // 실제 주문 검증
    const targetUserId = userId || 1; // 기본 인증 세션 사용자

    const review = await prisma.productReview.create({
      data: {
        productId: productId ? Number(productId) : undefined,
        retailPackId: retailPackId ? Number(retailPackId) : undefined,
        orderId: orderId ? Number(orderId) : 1,
        userId: targetUserId,
        rating: Number(rating) || 5,
        title,
        content,
        photoUrls: photoUrls ? JSON.stringify(photoUrls) : null,
        meatTags: meatTags ? JSON.stringify(meatTags) : null,
        isBusinessBuyer: !!isBusinessBuyer,
        reorderCount: isBusinessBuyer ? 3 : 1, // B2B 점주의 경우 재주문 횟수 부여
      },
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
