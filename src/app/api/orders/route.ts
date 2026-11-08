import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');
    const supplierId = searchParams.get('supplierId');

    const where: any = {};
    if (buyerId) where.buyerId = parseInt(buyerId);
    if (supplierId) where.supplierId = parseInt(supplierId);

    const orders = await prisma.order.findMany({
      where,
      include: {
        buyer: {
          include: { businessBuyer: true, retailBuyer: true },
        },
        supplier: true,
        items: {
          include: {
            spec: {
              include: { product: true },
            },
          },
        },
        weightSettlement: true,
        payment: true,
        taxInvoice: true,
        shipment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { buyerId, supplierId, channelType, specId, boxQty, shipmentType, deliveryAddress } = body;

    const spec = await prisma.productSpec.findUnique({
      where: { id: specId },
      include: { product: true },
    });

    if (!spec) {
      return NextResponse.json({ success: false, error: 'Product spec not found' }, { status: 404 });
    }

    const orderNo = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
    const totalEstimatedAmt = spec.estimatedPackPrice * boxQty;

    const order = await prisma.order.create({
      data: {
        orderNo,
        buyerId: buyerId || 1,
        supplierId: supplierId || spec.product.supplierId,
        channelType: channelType || 'B2B_ORDER',
        orderStatus: 'DEPOSITED',
        totalEstimatedAmt,
        items: {
          create: {
            specId,
            boxQty,
            unitPrice: spec.basePricePerKg,
            estAmount: totalEstimatedAmt,
          },
        },
        payment: {
          create: {
            payMethod: 'B2B_ESCROW',
            escrowStatus: 'HELD',
            depositAmount: totalEstimatedAmt,
          },
        },
        shipment: {
          create: {
            shipmentType: shipmentType || 'COLD_TRUCK_DIRECT',
          },
        },
      },
      include: {
        items: true,
        payment: true,
        shipment: true,
      },
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
