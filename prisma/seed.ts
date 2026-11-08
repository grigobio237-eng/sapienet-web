import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Clean existing data
  await prisma.retailPackProduct.deleteMany();
  await prisma.taxInvoice.deleteMany();
  await prisma.b2bWeightSettlement.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.rfqProposal.deleteMany();
  await prisma.rfqRequest.deleteMany();
  await prisma.meatTraceability.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productSpec.deleteMany();
  await prisma.product.deleteMany();
  await prisma.externalReceipt.deleteMany();
  await prisma.marketPriceHistory.deleteMany();
  await prisma.businessBuyer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.retailBuyer.deleteMany();
  await prisma.user.deleteMany();

  // 2. Users & Personas
  // 2.1 Buyer
  const buyerUser = await prisma.user.create({
    data: {
      loginId: 'buyer1@sapienet.com',
      passwordHash: 'hashed_pw_1234',
      userRole: 'BUSINESS_BUYER',
      status: 'ACTIVE',
      businessBuyer: {
        create: {
          businessNumber: '120-81-49201',
          companyName: '하남돼지집 강남역삼점',
          representativeName: '홍길동',
          businessType: '한식 / 육류구이 전문점',
          storeAddress: '서울시 강남구 테헤란로 123 1층',
          ocrVerifiedAt: new Date(),
        },
      },
    },
    include: { businessBuyer: true },
  });

  // 2.2 Suppliers
  const supplierUser1 = await prisma.user.create({
    data: {
      loginId: 'supplier1@sapienet.com',
      passwordHash: 'hashed_pw_1234',
      userRole: 'SUPPLIER',
      status: 'ACTIVE',
      supplier: {
        create: {
          companyName: '(주)마장동한우미트',
          permitNumber: '서울-2023-가공-0142',
          settlementBank: '기업은행',
          settlementAccount: '010-9283-492011',
          legalDisclaimerAgree: true,
        },
      },
    },
    include: { supplier: true },
  });

  const supplierUser2 = await prisma.user.create({
    data: {
      loginId: 'supplier2@sapienet.com',
      passwordHash: 'hashed_pw_1234',
      userRole: 'SUPPLIER',
      status: 'ACTIVE',
      supplier: {
        create: {
          companyName: '(주)도드람축산가공',
          permitNumber: '경기-2022-유통-0891',
          settlementBank: '농협',
          settlementAccount: '301-4561-789012',
          legalDisclaimerAgree: true,
        },
      },
    },
    include: { supplier: true },
  });

  // 2.3 Admin
  await prisma.user.create({
    data: {
      loginId: 'admin@sapienet.com',
      passwordHash: 'admin_pw_1234',
      userRole: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  // 2.4 Retail Buyer
  await prisma.user.create({
    data: {
      loginId: 'retail@sapienet.com',
      passwordHash: 'retail_pw_1234',
      userRole: 'RETAIL_BUYER',
      status: 'ACTIVE',
      retailBuyer: {
        create: {
          realName: '이소매',
          phoneNumber: '010-5555-1234',
          ciDiHash: 'nice_ci_di_hash_random_string',
          pointBalance: 5000,
        },
      },
    },
  });

  // 3. Products & Specs
  // Product 1: 국내산 한돈 삼겹살 원박스 (Supplier 2)
  const p1 = await prisma.product.create({
    data: {
      supplierId: supplierUser2.supplier!.id,
      categoryCode: 'PORK_BELLY',
      productName: '국내산 한돈 삼겹살 원박스 (A등급)',
      origin: '국내산',
      storageType: 'REFRIGERATED',
      isActive: true,
      specs: {
        create: [
          {
            targetAudience: 'B2B_WHOLESALE',
            specName: '원박스 약 20kg (원물 덩어리)',
            stdWeightKg: 20.0,
            basePricePerKg: 18500,
            estimatedPackPrice: 370000,
            weightTolerancePct: 5.0,
          },
          {
            targetAudience: 'B2B_WHOLESALE',
            specName: '업소용 2cm 세절 10kg',
            stdWeightKg: 10.0,
            basePricePerKg: 19500,
            estimatedPackPrice: 195000,
            weightTolerancePct: 3.0,
          },
        ],
      },
      traceability: {
        create: {
          traceNumber: '002194829101',
          bmsGrade: '한돈 1+ 등급',
          slaughterDate: new Date('2026-11-05'),
          processingDate: new Date('2026-11-06'),
          ekapeApiJson: JSON.stringify({
            slaughterHouse: '도드람안성축산물공판장',
            gradeDecision: '1+ A',
            coldChainStatus: '정상 0.8℃ 유지',
          }),
        },
      },
      inventory: {
        create: {
          stockBoxes: 120,
          alertThreshold: 10,
        },
      },
    },
    include: { specs: true },
  });

  // Product 2: 국내산 한우 1++ 등심 (Supplier 1)
  const p2 = await prisma.product.create({
    data: {
      supplierId: supplierUser1.supplier!.id,
      categoryCode: 'BEEF_SIRLOIN',
      productName: '국내산 한우 1++ BMS 8번 등심 원박스',
      origin: '국내산',
      storageType: 'REFRIGERATED',
      isActive: true,
      specs: {
        create: [
          {
            targetAudience: 'B2B_WHOLESALE',
            specName: '원박스 약 15kg (원물)',
            stdWeightKg: 15.0,
            basePricePerKg: 68000,
            estimatedPackPrice: 1020000,
            weightTolerancePct: 5.0,
          },
          {
            targetAudience: 'B2C_GIFT',
            specName: '프리미엄 1++ 한우 선물세트 3kg',
            stdWeightKg: 3.0,
            basePricePerKg: 80000,
            estimatedPackPrice: 240000,
            weightTolerancePct: 0.0,
          },
        ],
      },
      traceability: {
        create: {
          traceNumber: '002938471928',
          bmsGrade: 'BMS 8번 (1++)',
          slaughterDate: new Date('2026-11-03'),
          processingDate: new Date('2026-11-04'),
          ekapeApiJson: JSON.stringify({
            slaughterHouse: '농협음성축산물공판장',
            gradeDecision: '1++ No.8',
            meatColor: '선홍색 4번',
          }),
        },
      },
      inventory: {
        create: {
          stockBoxes: 45,
          alertThreshold: 5,
        },
      },
    },
    include: { specs: true },
  });

  // Product 3: 호주산 와규 갈비살 (Supplier 1)
  const p3 = await prisma.product.create({
    data: {
      supplierId: supplierUser1.supplier!.id,
      categoryCode: 'BEEF_RIBS',
      productName: '호주산 와규 MB5+ 갈비살 원박스',
      origin: '호주산',
      storageType: 'FROZEN',
      isActive: true,
      specs: {
        create: [
          {
            targetAudience: 'B2B_WHOLESALE',
            specName: '원박스 약 20kg (진공 냉동)',
            stdWeightKg: 20.0,
            basePricePerKg: 29000,
            estimatedPackPrice: 580000,
            weightTolerancePct: 4.0,
          },
        ],
      },
      inventory: {
        create: {
          stockBoxes: 85,
          alertThreshold: 10,
        },
      },
    },
    include: { specs: true },
  });

  // 4. Market Price History (Market Watch)
  await prisma.marketPriceHistory.createMany({
    data: [
      {
        categoryCode: 'PORK_BELLY',
        ekapeMarketAvgPrice: 19400,
        optimalMatchPrice: 18500,
        recordedDate: new Date(),
      },
      {
        categoryCode: 'BEEF_SIRLOIN',
        ekapeMarketAvgPrice: 72500,
        optimalMatchPrice: 68000,
        recordedDate: new Date(),
      },
      {
        categoryCode: 'BEEF_RIBS',
        ekapeMarketAvgPrice: 31000,
        optimalMatchPrice: 29000,
        recordedDate: new Date(),
      },
    ],
  });

  // 5. Existing Completed Order with Weight Settlement
  const order1 = await prisma.order.create({
    data: {
      orderNo: 'ORD-20261107-001',
      buyerId: buyerUser.id,
      supplierId: supplierUser2.supplier!.id,
      channelType: 'B2B_ORDER',
      orderStatus: 'SETTLED',
      totalEstimatedAmt: 370000,
      totalFinalAmt: 358900,
      items: {
        create: {
          specId: p1.specs[0].id,
          boxQty: 1,
          unitPrice: 18500,
          estAmount: 370000,
          finalAmount: 358900,
        },
      },
      weightSettlement: {
        create: {
          boxSerialNo: 'BOX-DODRAM-20261107-8821',
          actualWeightKg: 19.4,
          weightDiffKg: -0.6,
          diffAmount: -11100, // 11,100원 환불
          scaleTicketImgUrl: '/images/scale_ticket_sample.jpg',
          adminApprovedAt: new Date(),
          settledAt: new Date(),
        },
      },
      payment: {
        create: {
          payMethod: 'B2B_ESCROW',
          escrowStatus: 'RELEASED',
          depositAmount: 370000,
          finalPaidAmount: 358900,
        },
      },
      taxInvoice: {
        create: {
          docType: 'TAX_INVOICE_B2B',
          ntsIssueStatus: 'NTS_SENT',
          ntsApprovalNum: 'NTS-20261107-88291039',
          issuedAt: new Date(),
        },
      },
      shipment: {
        create: {
          shipmentType: 'COLD_TRUCK_DIRECT',
          vehicleNumber: '서울 82바 1294 (김기사 010-9988-1234)',
          deliveredAt: new Date(),
        },
      },
    },
  });

  // 6. Active RFQ Request & Proposals
  const rfq1 = await prisma.rfqRequest.create({
    data: {
      buyerId: buyerUser.businessBuyer!.id,
      categoryCode: 'PORK_BELLY',
      targetBoxQty: 50,
      targetPricePerKg: 17800,
      preferredDeliveryDate: new Date('2026-11-15'),
      deliveryAddress: '서울시 강남구 테헤란로 123 1층 하남돼지집',
      cutSpec: '원물 덩어리 진공포장 20kg/box',
      auditStatus: 'APPROVED',
      proposals: {
        create: [
          {
            supplierId: supplierUser2.supplier!.id,
            proposalPricePerKg: 17900,
            packagingType: '개별 진공 스킨 포장',
            deliveryAvailableDate: new Date('2026-11-15'),
            status: 'PROPOSED',
          },
          {
            supplierId: supplierUser1.supplier!.id,
            proposalPricePerKg: 18100,
            packagingType: '표준 원박스 포장 (냉장탑차 당일 새벽배송)',
            deliveryAvailableDate: new Date('2026-11-14'),
            status: 'PROPOSED',
          },
        ],
      },
    },
  });

  // 7. External OCR Receipts for "내 고기 경제실"
  await prisma.externalReceipt.createMany({
    data: [
      {
        buyerId: buyerUser.businessBuyer!.id,
        vendorName: '마장동 대성유통(외부거래처)',
        itemName: '한돈 삼겹살 원물',
        unitPricePerKg: 20500,
        dataSourceTag: 'EXTERNAL_OCR',
        purchaseDate: new Date('2026-10-25'),
      },
      {
        buyerId: buyerUser.businessBuyer!.id,
        vendorName: '독산동 축산물도매(외부거래처)',
        itemName: '한우 등심 1+ 등급',
        unitPricePerKg: 74000,
        dataSourceTag: 'EXTERNAL_OCR',
        purchaseDate: new Date('2026-10-28'),
      },
    ],
  });

  // 8. Sample Retail Pack Products (소매점주 수제/소분 팩 상품)
  await prisma.retailPackProduct.createMany({
    data: [
      {
        businessBuyerId: buyerUser.businessBuyer!.id,
        sourceTraceNumber: '002198450123',
        sourceSlaughterHouse: '도드람안성공판장',
        categoryCode: 'PORK',
        packName: '[하남돼지집] 비법 칼집 생삼겹살 500g 진공스킨팩',
        chefNote: '하남돼지집 셰프의 2.5cm 두툼 컷팅과 300번 수제 칼집. 육즙 보존 스킨팩.',
        portionWeightG: 500,
        salePrice: 14900,
        stockQty: 25,
        meatGrade: '1+ 등급 (도드람한돈)',
        imageUrl: '',
        pickupAvailable: true,
        pickupDiscount: 1000,
        deliveryAvailable: true,
        storeAddress: '서울시 강남구 테헤란로 123 1층 (하남돼지집 강남역삼점)',
        status: 'ACTIVE',
      },
      {
        businessBuyerId: buyerUser.businessBuyer!.id,
        sourceTraceNumber: '002198450992',
        sourceSlaughterHouse: '농협음성축산물공판장',
        categoryCode: 'BEEF',
        packName: '[하남돼지집 마스터셰프] 1++ 한우 웻에이징 깍둑 채끝등심 300g',
        chefNote: '매장 저온숙성고에서 14일 웻에이징 숙성 후 한입 큐브 컷팅.',
        portionWeightG: 300,
        salePrice: 32000,
        stockQty: 12,
        meatGrade: '1++ (No.8 BMS)',
        imageUrl: '',
        pickupAvailable: true,
        pickupDiscount: 1000,
        deliveryAvailable: true,
        storeAddress: '서울시 강남구 테헤란로 123 1층 (하남돼지집 강남역삼점)',
        status: 'ACTIVE',
      },
    ],
  });

  console.log('✅ Database seeded successfully with realistic B2B test data!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
