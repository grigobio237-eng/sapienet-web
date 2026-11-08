import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');
    const sourceOrders = searchParams.get('sourceOrders');

    // 점주가 가공 팩을 만들 수 있는 본인의 발주 내역(원물 재고) 조회
    if (sourceOrders === 'true') {
      const orders = await prisma.order.findMany({
        where: {
          buyer: { userRole: 'BUSINESS_BUYER' },
        },
        include: {
          items: {
            include: {
              spec: {
                include: {
                  product: {
                    include: {
                      traceability: true,
                      supplier: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { id: 'desc' },
      });

      return NextResponse.json({ success: true, data: orders });
    }

    // 소매몰 또는 점주 관리용 소분 팩 목록 조회
    const whereClause: any = {};
    if (buyerId) {
      whereClause.businessBuyerId = parseInt(buyerId, 10);
    } else {
      whereClause.status = 'ACTIVE';
    }

    const packs = await prisma.retailPackProduct.findMany({
      where: whereClause,
      include: {
        businessBuyer: {
          include: {
            user: {
              select: { profileImageUrl: true },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: packs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      businessBuyerId = 1,
      sourceOrderId,
      sourceTraceNumber,
      sourceSlaughterHouse,
      categoryCode = 'PORK',
      packName,
      chefNote,
      portionWeightG = 500,
      salePrice = 15900,
      stockQty = 15,
      meatGrade = '1+ 등급',
      imageUrl,
      pickupAvailable = true,
      pickupDiscount = 1000,
      deliveryAvailable = true,
      storeAddress,
    } = body;

    if (!packName || !sourceTraceNumber) {
      return NextResponse.json(
        { success: false, error: '상품명과 축산물 이력번호는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    // 기본 매장 주소 매핑
    let finalStoreAddress = storeAddress;
    if (!finalStoreAddress) {
      const buyer = await prisma.businessBuyer.findUnique({
        where: { id: businessBuyerId },
      });
      if (buyer) {
        finalStoreAddress = buyer.storeAddress;
      }
    }

    const createdPack = await prisma.retailPackProduct.create({
      data: {
        businessBuyerId,
        sourceOrderId: sourceOrderId ? parseInt(String(sourceOrderId), 10) : null,
        sourceTraceNumber,
        sourceSlaughterHouse: sourceSlaughterHouse || '농협음성축산물공판장',
        categoryCode,
        packName,
        chefNote,
        portionWeightG: parseInt(String(portionWeightG), 10),
        salePrice: parseInt(String(salePrice), 10),
        stockQty: parseInt(String(stockQty), 10),
        meatGrade,
        imageUrl: imageUrl || null,
        pickupAvailable: Boolean(pickupAvailable),
        pickupDiscount: parseInt(String(pickupDiscount), 10) || 1000,
        deliveryAvailable: Boolean(deliveryAvailable),
        storeAddress: finalStoreAddress || '서울시 강남구 테헤란로 123 1층',
      },
      include: {
        businessBuyer: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: '소매 소분 팩상품이 성공적으로 등록되어 B2C 소매몰에 노출되었습니다.',
      data: createdPack,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
