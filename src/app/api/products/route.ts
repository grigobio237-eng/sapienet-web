import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const audience = searchParams.get('audience');
    const category = searchParams.get('category');
    const storage = searchParams.get('storage');

    const whereClause: any = { isActive: true };
    if (category && category !== 'ALL') whereClause.categoryCode = category;
    if (storage && storage !== 'ALL') whereClause.storageType = storage;

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        supplier: true,
        specs: {
          where: audience && audience !== 'ALL' ? { targetAudience: audience } : undefined,
        },
        traceability: true,
        inventory: true,
      },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      supplierId = 1,
      categoryCode,
      productName,
      brandName = '도드람한돈',
      origin = '국내산',
      storageType = 'REFRIGERATED',
      imageUrl,
      photoGallery,
      trimSpec = '원물 진공포장 (떡지방 90% 정선)',
      specName = '원박스 약 20kg',
      targetAudience = 'B2B_WHOLESALE',
      stdWeightKg = 20.0,
      basePricePerKg = 18500,
      traceNumber = '002198450123',
      bmsGrade = '1+등급 (A등급)',
      slaughterHouseName = '농협음성축산물공판장',
      stockBoxes = 50,
    } = body;

    const priceKg = parseInt(basePricePerKg);
    const weightKg = parseFloat(stdWeightKg);
    const estimatedPackPrice = Math.round(priceKg * weightKg);

    const product = await prisma.product.create({
      data: {
        supplierId: parseInt(supplierId),
        categoryCode,
        productName,
        brandName,
        origin,
        storageType,
        imageUrl: imageUrl || null,
        photoGallery: photoGallery || null,
        trimSpec,
        specs: {
          create: {
            targetAudience,
            specName,
            stdWeightKg: weightKg,
            basePricePerKg: priceKg,
            estimatedPackPrice,
            weightTolerancePct: 5.0,
          },
        },
        traceability: {
          create: {
            traceNumber,
            bmsGrade,
            slaughterHouseName,
            slaughterDate: new Date(),
            processingDate: new Date(),
            ekapeApiJson: JSON.stringify({
              verified: true,
              traceNumber,
              bmsGrade,
              slaughterHouseName,
              verifiedAt: new Date().toISOString(),
            }),
          },
        },
        inventory: {
          create: {
            stockBoxes: parseInt(stockBoxes) || 20,
            alertThreshold: 5,
          },
        },
      },
      include: {
        specs: true,
        traceability: true,
        inventory: true,
        supplier: true,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
