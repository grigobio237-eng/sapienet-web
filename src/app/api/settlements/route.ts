import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, boxSerialNo, actualWeightKg, scaleTicketImgUrl } = body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { spec: true },
        },
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const firstItem = order.items[0];
    const stdWeight = firstItem.spec.stdWeightKg * firstItem.boxQty;
    const unitPrice = firstItem.unitPrice; // kg당 단가

    const weightDiffKg = actualWeightKg - stdWeight;
    const diffAmount = Math.round(weightDiffKg * unitPrice);
    const finalAmount = order.totalEstimatedAmt + diffAmount;

    // Create or update weight settlement
    const settlement = await prisma.b2bWeightSettlement.upsert({
      where: { orderId },
      update: {
        boxSerialNo,
        actualWeightKg,
        weightDiffKg,
        diffAmount,
        scaleTicketImgUrl: scaleTicketImgUrl || '/images/scale_ticket_sample.jpg',
        adminApprovedAt: new Date(),
        settledAt: new Date(),
      },
      create: {
        orderId,
        boxSerialNo,
        actualWeightKg,
        weightDiffKg,
        diffAmount,
        scaleTicketImgUrl: scaleTicketImgUrl || '/images/scale_ticket_sample.jpg',
        adminApprovedAt: new Date(),
        settledAt: new Date(),
      },
    });

    // Update order status and final amount
    await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 'SETTLED',
        totalFinalAmt: finalAmount,
      },
    });

    // Update payment
    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          escrowStatus: 'RELEASED',
          finalPaidAmount: finalAmount,
        },
      });
    }

    // Auto issue Tax Invoice
    await prisma.taxInvoice.upsert({
      where: { orderId },
      update: {
        ntsIssueStatus: 'NTS_SENT',
        ntsApprovalNum: `NTS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10000000 + Math.random() * 90000000)}`,
        issuedAt: new Date(),
      },
      create: {
        orderId,
        docType: 'TAX_INVOICE_B2B',
        ntsIssueStatus: 'NTS_SENT',
        ntsApprovalNum: `NTS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10000000 + Math.random() * 90000000)}`,
        issuedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        settlement,
        stdWeight,
        actualWeightKg,
        weightDiffKg,
        diffAmount,
        finalAmount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
