import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');

    const where: any = {};
    if (buyerId) where.buyerId = parseInt(buyerId);

    const rfqs = await prisma.rfqRequest.findMany({
      where,
      include: {
        buyer: true,
        proposals: {
          include: { supplier: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: rfqs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'CREATE_RFQ') {
      const { buyerId, categoryCode, targetBoxQty, targetPricePerKg, preferredDeliveryDate, deliveryAddress, cutSpec } = body;
      const rfq = await prisma.rfqRequest.create({
        data: {
          buyerId: buyerId || 1,
          categoryCode,
          targetBoxQty: parseInt(targetBoxQty),
          targetPricePerKg: parseInt(targetPricePerKg),
          preferredDeliveryDate: new Date(preferredDeliveryDate || Date.now() + 7 * 86400000),
          deliveryAddress,
          cutSpec,
          auditStatus: 'APPROVED', // Default approved for responsive interaction
        },
      });
      return NextResponse.json({ success: true, data: rfq });
    }

    if (action === 'SUBMIT_PROPOSAL') {
      const { rfqId, supplierId, proposalPricePerKg, packagingType, deliveryAvailableDate } = body;
      const proposal = await prisma.rfqProposal.create({
        data: {
          rfqId: parseInt(rfqId),
          supplierId: parseInt(supplierId) || 1,
          proposalPricePerKg: parseInt(proposalPricePerKg),
          packagingType,
          deliveryAvailableDate: new Date(deliveryAvailableDate || Date.now() + 5 * 86400000),
          status: 'PROPOSED',
        },
      });
      return NextResponse.json({ success: true, data: proposal });
    }

    if (action === 'ACCEPT_PROPOSAL') {
      const { proposalId } = body;
      const proposal = await prisma.rfqProposal.update({
        where: { id: parseInt(proposalId) },
        data: { status: 'ACCEPTED' },
        include: { rfq: true },
      });
      return NextResponse.json({ success: true, data: proposal });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
