import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 배송지 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get('userId')) || 1;

    let addresses = await prisma.userAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    // 기본 시드 주소
    if (addresses.length === 0) {
      await prisma.userAddress.create({
        data: {
          userId,
          addressName: '하남돼지집 마포직영점 (기본 매장)',
          receiverName: '홍길동 점주',
          phoneNumber: '010-8888-9999',
          zonecode: '04123',
          address: '서울 마포구 독막로 123',
          detailAddress: '지상 1층 주방 후문',
          isDefault: true,
          deliveryMemo: '새벽 배송 시 주방 후문 냉동고 앞 적치 부탁드립니다.',
        },
      });
      addresses = await prisma.userAddress.findMany({
        where: { userId },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      });
    }

    return NextResponse.json({ success: true, data: addresses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: 신규 배송지 등록
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      addressName,
      receiverName,
      phoneNumber,
      zonecode,
      address,
      detailAddress,
      isDefault,
      deliveryMemo,
    } = body;

    const targetUserId = userId || 1;

    // 만약 기본 배송지로 설정하는 경우 기존 기본 배송지 해제
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId: targetUserId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const created = await prisma.userAddress.create({
      data: {
        userId: targetUserId,
        addressName,
        receiverName,
        phoneNumber,
        zonecode,
        address,
        detailAddress,
        isDefault: !!isDefault,
        deliveryMemo,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
