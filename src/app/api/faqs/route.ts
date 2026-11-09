import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: FAQ 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: any = { isActive: true };
    if (category && category !== 'ALL') {
      where.category = category;
    }

    let faqs = await prisma.faqItem.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    // 기본 시드 데이터
    if (faqs.length === 0) {
      await prisma.faqItem.createMany({
        data: [
          {
            category: 'PAY_SETTLE',
            question: '원박스 고기의 실중량 차액 정산 및 환불은 언제 이루어지나요?',
            answer: '원박스 육류는 개체별 무게 차이가 있으므로, 출고 시 도축/가공장의 공인 계량표에 의해 실중량이 확정됩니다. 기준 중량보다 가볍게 출고된 경우(차액 발생 시), 관리자 정산 승인 즉시 당일 내로 선결제 수단(예치금 환불 또는 카드 부분취소)으로 자동 환불됩니다.',
            sortOrder: 1,
          },
          {
            category: 'JOIN_VERIFY',
            question: '사업자등록증 OCR 검증은 얼마나 걸리나요?',
            answer: '사피에넷 미트는 국세청 휴폐업 조회 API와 OCR 실시간 연동을 지원하여, 정상적인 사업자등록증 이미지 첨부 시 10초 이내에 자동 승인되어 즉시 B2B 발주가 가능합니다.',
            sortOrder: 2,
          },
          {
            category: 'DELIVERY',
            question: '지정 냉동탑차 직배송과 BWT 창고 명의이전의 차이는 무엇인가요?',
            answer: '냉동탑차 직배송은 점주님의 매장 앞 또는 주방 냉동고까지 직접 배송되는 방식이며, BWT(보세/수도권 냉동창고 명의이전)는 창고에 보관된 대량 원박스의 소유자 명의를 점주님 계좌로 이전하여 원할 때 출고하는 B2B 대량 거래 전용 방식입니다.',
            sortOrder: 3,
          },
          {
            category: 'CLAIM_REFUND',
            question: '고기가 변질되었거나 진공이 풀려 배송된 경우 어떻게 하나요?',
            answer: '신선 축산물 특성상 수령 후 24시간 이내에 [주문내역] 또는 고객센터를 통해 사진(라벨, 고기 상태, 박스)을 등록해 주시면, 확인 즉시 100% 무상 교환 또는 전액 환불을 보장해 드립니다.',
            sortOrder: 4,
          },
        ],
      });
      faqs = await prisma.faqItem.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
      });
    }

    return NextResponse.json({ success: true, data: faqs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
