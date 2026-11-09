import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 공지사항 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = category;
    }

    let notices = await prisma.notice.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });

    // 데이터가 없으면 초기 기본 공지 시드 제공
    if (notices.length === 0) {
      await prisma.notice.createMany({
        data: [
          {
            category: 'SHIPPING',
            title: '[배송] 2026 동절기 냉동탑차 직배송 및 온도 유지 관리 안내',
            content: '동절기 영하권 기온에 따른 냉동/냉장 탑차 온도 기록계 의무 부착 및 배송 지침입니다. 모든 탑차는 심야 배송 시 -18℃ 이하 냉동 및 0~2℃ 냉장 상태를 원격 관제합니다.',
            isPinned: true,
          },
          {
            category: 'PRICE_TREND',
            title: '[시세] 축평원 기준 한우/한돈 11월 2주차 도매시장 평균가 동향 공지',
            content: '전국 축산물 도매시장 경락가격 동향 분석 결과, 한우 1++ 등심 부위의 도축 물량 증가로 kg당 기준가가 전주 대비 3.2% 안정화되었습니다. 상세 시세는 매킷와치(Market Watch)에서 확인 가능합니다.',
            isPinned: false,
          },
          {
            category: 'SYSTEM',
            title: '[정산] B2B 원박스 실중량(근량) 차액 자동 환불 시스템 오픈 안내',
            content: '원박스 출고 시 공인 계량표 오차 범위에 따른 선결제 차액이 당일 정산 승인 즉시 예치금/카드 환불되는 자동화 시스템이 적용되었습니다.',
            isPinned: false,
          },
        ],
      });
      notices = await prisma.notice.findMany({
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      });
    }

    return NextResponse.json({ success: true, data: notices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: 신규 공지사항 등록 (관리자용)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, title, content, isPinned, bannerUrl } = body;

    const notice = await prisma.notice.create({
      data: {
        category: category || 'ALL',
        title,
        content,
        isPinned: !!isPinned,
        bannerUrl,
      },
    });

    return NextResponse.json({ success: true, data: notice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
