import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role')?.toUpperCase() || 'BUYER'; // 'RETAIL', 'BUYER', 'SUPPLIER'

    let targetRole = 'BUSINESS_BUYER';
    if (role === 'RETAIL' || role === 'RETAIL_BUYER') targetRole = 'RETAIL_BUYER';
    if (role === 'SUPPLIER') targetRole = 'SUPPLIER';

    // 해당 역할의 기본 사용자 조회
    const user = await prisma.user.findFirst({
      where: { userRole: targetRole },
      include: {
        businessBuyer: true,
        supplier: true,
        retailBuyer: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          loginId: user.loginId,
          userRole: user.userRole,
          status: user.status,
          profileImageUrl: user.profileImageUrl,
          createdAt: user.createdAt,
        },
        persona: user.businessBuyer || user.supplier || user.retailBuyer,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, role, profileImageUrl, personaData } = body;

    let targetUserId = userId;
    if (!targetUserId) {
      let targetRole = 'BUSINESS_BUYER';
      if (role === 'RETAIL') targetRole = 'RETAIL_BUYER';
      if (role === 'SUPPLIER') targetRole = 'SUPPLIER';

      const found = await prisma.user.findFirst({ where: { userRole: targetRole } });
      if (found) targetUserId = found.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // 1. 프로필 이미지 업데이트 (WebP 데이터 URL or 링크)
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        profileImageUrl: profileImageUrl !== undefined ? profileImageUrl : undefined,
      },
      include: {
        businessBuyer: true,
        supplier: true,
        retailBuyer: true,
      },
    });

    // 2. 페르소나별 세부정보 업데이트
    if (personaData) {
      if (updatedUser.businessBuyer && role === 'BUYER') {
        await prisma.businessBuyer.update({
          where: { id: updatedUser.businessBuyer.id },
          data: {
            companyName: personaData.companyName || updatedUser.businessBuyer.companyName,
            representativeName: personaData.representativeName || updatedUser.businessBuyer.representativeName,
            storeAddress: personaData.storeAddress || updatedUser.businessBuyer.storeAddress,
            businessType: personaData.businessType || updatedUser.businessBuyer.businessType,
          },
        });
      } else if (updatedUser.supplier && role === 'SUPPLIER') {
        await prisma.supplier.update({
          where: { id: updatedUser.supplier.id },
          data: {
            companyName: personaData.companyName || updatedUser.supplier.companyName,
            permitNumber: personaData.permitNumber || updatedUser.supplier.permitNumber,
            settlementBank: personaData.settlementBank || updatedUser.supplier.settlementBank,
            settlementAccount: personaData.settlementAccount || updatedUser.supplier.settlementAccount,
          },
        });
      } else if (updatedUser.retailBuyer && role === 'RETAIL') {
        await prisma.retailBuyer.update({
          where: { id: updatedUser.retailBuyer.id },
          data: {
            realName: personaData.realName || updatedUser.retailBuyer.realName,
            phoneNumber: personaData.phoneNumber || updatedUser.retailBuyer.phoneNumber,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: '환경설정이 안전하게 저장되었습니다.',
      data: {
        userId: targetUserId,
        profileImageUrl: profileImageUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
