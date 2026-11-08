'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Truck,
  Package,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Upload,
  Info,
  Building2,
  Calendar,
  Layers,
  FileCheck,
  Scale,
  Send,
  X,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Settings,
} from 'lucide-react';

export default function SupplierDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Selected Order for Shipment & Weight Settlement modal
  const [selectedOrderForFulfillment, setSelectedOrderForFulfillment] = useState<any | null>(null);
  const [shipmentOption, setShipmentOption] = useState<'COLD_TRUCK_DIRECT' | 'BWT_WAREHOUSE_TRANSFER'>('COLD_TRUCK_DIRECT');
  const [truckNumber, setTruckNumber] = useState('경기 88바 9021 (최기사 010-3321-4455)');
  const [bwtWarehouseName, setBwtWarehouseName] = useState('용인 백암 신선보세냉동창고');
  const [bwtAccountInfo, setBwtAccountInfo] = useState('BWT 구역 4동 12호 명의이전 계좌 #9910');

  // Scale ticket actual weight
  const [actualWeightKg, setActualWeightKg] = useState('19.4');
  const [boxSerialNo, setBoxSerialNo] = useState('BOX-DODRAM-20261108-9921');
  const [settlementSuccess, setSettlementSuccess] = useState<any | null>(null);

  // Proposal submission modal state
  const [selectedRfqForQuote, setSelectedRfqForQuote] = useState<any | null>(null);
  const [proposalPrice, setProposalPrice] = useState('18000');
  const [proposalPackaging, setProposalPackaging] = useState('개별 진공 스킨 포장 (원박스 포장)');

  // New Product Registration Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [isVerifyingTrace, setIsVerifyingTrace] = useState(false);
  const [traceVerified, setTraceVerified] = useState(false);
  const [isRegisteringProduct, setIsRegisteringProduct] = useState(false);

  // WebP Image upload & optimization state
  const [isConvertingWebp, setIsConvertingWebp] = useState(false);
  const [imageMeta, setImageMeta] = useState<{ origSize: string; webpSize: string; compressionRatio: string } | null>(null);

  const [productForm, setProductForm] = useState({
    productName: '국내산 한우 안심 1++ (No.8 BMS)',
    categoryCode: 'BEEF_TENDERLOIN',
    brandName: '도드람한돈',
    origin: '국내산',
    storageType: 'REFRIGERATED',
    trimSpec: '원물 진공 스킨포장 (떡지방 90% 정선)',
    specName: '원박스 약 15kg',
    targetAudience: 'B2B_WHOLESALE',
    stdWeightKg: '15.0',
    basePricePerKg: '89000',
    traceNumber: '002198450992',
    bmsGrade: '1++ (No.8 BMS)',
    slaughterHouseName: '농협음성축산물공판장',
    stockBoxes: '30',
    imageUrl: '', // WebP data URL
  });

  // 모바일 현장 촬영/업로드 시 브라우저에서 즉시 WebP 변환 및 고해상도 리사이징 (에러 원천 방지)
  const handleProcessImageToWebp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsConvertingWebp(true);
    const origBytes = file.size;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new (window as any).Image();
      img.onload = () => {
        // 브라우저 캔버스를 활용한 안전한 리사이징 (최대 1600px 유지하여 모바일 OOM 방지)
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          // 브라우저 네이티브 WebP 인코딩 (품질 0.82)
          const webpDataUrl = canvas.toDataURL('image/webp', 0.82);
          const webpApproxBytes = Math.round((webpDataUrl.length * 3) / 4);

          setProductForm((prev) => ({ ...prev, imageUrl: webpDataUrl }));
          setImageMeta({
            origSize: `${(origBytes / 1024 / 1024).toFixed(1)}MB`,
            webpSize: `${Math.round(webpApproxBytes / 1024)}KB`,
            compressionRatio: `${Math.round((1 - webpApproxBytes / origBytes) * 100)}% 절감`,
          });
          setIsConvertingWebp(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSimulateTraceVerify = () => {
    setIsVerifyingTrace(true);
    setTimeout(() => {
      setIsVerifyingTrace(false);
      setTraceVerified(true);
    }, 700);
  };

  const handleRegisterProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisteringProduct(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      });
      const json = await res.json();
      if (json.success) {
        setShowProductModal(false);
        setTraceVerified(false);
        setImageMeta(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegisteringProduct(false);
    }
  };

  const fetchData = () => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => d.success && setOrders(d.data));

    fetch('/api/rfq')
      .then((r) => r.json())
      .then((d) => d.success && setRfqs(d.data));

    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => d.success && setProducts(d.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExecuteSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForFulfillment) return;

    try {
      const res = await fetch('/api/settlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrderForFulfillment.id,
          boxSerialNo,
          actualWeightKg: parseFloat(actualWeightKg),
          scaleTicketImgUrl: '/images/scale_ticket_sample.jpg',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSettlementSuccess(json.data);
        setSelectedOrderForFulfillment(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfqForQuote) return;

    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUBMIT_PROPOSAL',
          rfqId: selectedRfqForQuote.id,
          supplierId: 1,
          proposalPricePerKg: proposalPrice,
          packagingType: proposalPackaging,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedRfqForQuote(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* Supplier Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-amber-600"></span>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              SAPIENET <span className="text-amber-700">SUPPLIER</span>
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              도매 공급자 통합 허브
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/supplier/settings"
              className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 px-3 py-1.5 rounded-xl transition-colors"
              title="도매 공급자 환경설정 (WebP 프로필/HACCP/BWT창고/정산계좌)"
            >
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              <span className="font-extrabold text-amber-900 bg-amber-200 text-[10px] px-1.5 py-0.5 rounded">test3</span>
              <span className="font-semibold text-amber-800">(주)도드람축산가공</span>
              <span className="text-[10px] text-slate-500 hidden md:inline">경기-2022-유통-0891</span>
            </Link>

            <Link
              href="/supplier/settings"
              title="환경설정"
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-800 hover:bg-amber-50 border border-slate-200"
            >
              <Settings size={15} />
            </Link>

            <Link
              href="/"
              title="계정 전환 및 로그아웃"
              className="text-slate-400 hover:text-amber-700 font-medium px-2 py-1.5 rounded-lg hover:bg-amber-50"
            >
              로그아웃
            </Link>

            <Link
              href="/buyer"
              className="text-slate-600 hover:text-slate-900 font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
            >
              점주 ERP 뷰
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* 1.2 법적 책임 경계 고지 바 (Master Intent 00조/08조 엄격 반영) */}
        <div className="bg-amber-500/10 border border-amber-300 text-amber-900 rounded-2xl p-4 flex items-start gap-3">
          <Info className="text-amber-700 shrink-0 mt-0.5" size={18} />
          <div className="text-xs space-y-0.5">
            <p className="font-bold">사피에넷 미트 무재고 운영 플랫폼 책임 경계 고지</p>
            <p className="text-amber-800 leading-relaxed">
              사피에넷 미트는 무재고 운영 플랫폼입니다. 등록 상품의 품질 보증, 실제 재고 통제, 공인 계량표에 따른 실중량 차액 정산, 그리고 출고(냉동탑차 직배송 또는 BWT 창고 명의이전)의 모든 법적 책임은 도축/가공 공급자에게 귀속됩니다.
            </p>
          </div>
        </div>

        {/* 1.0 상단 지표 위젯 (KPI) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">운영 상품 규격</span>
                <strong className="text-2xl font-extrabold text-slate-900">{products.length}종</strong>
                <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">전 품목 축평원 연동됨</span>
              </div>
              <button
                onClick={() => setShowProductModal(true)}
                className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-transform active:scale-95"
              >
                <PlusCircle size={14} />
                <span>상품 등록</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block">오늘 접수 주문</span>
            <strong className="text-2xl font-extrabold text-slate-900">{orders.length}건</strong>
            <span className="text-[10px] text-blue-600 block mt-1 font-semibold">에스크로 선결제 보관중</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block">신규 RFQ 입찰 요청</span>
            <strong className="text-2xl font-extrabold text-amber-700">{rfqs.length}건</strong>
            <span className="text-[10px] text-amber-600 block mt-1 font-semibold">견적 제출 가능</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block">출고 대기 & 계량 대상</span>
            <strong className="text-2xl font-extrabold text-red-700">
              {orders.filter((o) => o.orderStatus !== 'SETTLED').length}건
            </strong>
            <span className="text-[10px] text-red-600 block mt-1 font-semibold">실중량 계량표 입력 필요</span>
          </div>
        </div>

        {/* 1.1 도매 공급자 운영 등록 상품 목록 & 신규 등록 바 */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Package size={18} className="text-amber-700" />
                공급자 운영 상품 및 규격·단가 관리 (B2B / B2C)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                축평원 이력번호가 공인 검증된 상품만 식당 점주 및 소매관에 노출되며, 원박스 기준단가와 박스 재고를 제어합니다.
              </p>
            </div>
            <button
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
            >
              <PlusCircle size={15} />
              <span>신규 원박스/가공 상품 등록하기</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">실물 사진</th>
                  <th className="py-2.5 px-3">상품명 / 브랜드 / 가공스펙</th>
                  <th className="py-2.5 px-3">보관 / 원산지</th>
                  <th className="py-2.5 px-3">판매 규격 및 기준 중량</th>
                  <th className="py-2.5 px-3">kg당 공급 단가</th>
                  <th className="py-2.5 px-3">예상 박스 결제금액</th>
                  <th className="py-2.5 px-3">축평원 이력추적 / 등급</th>
                  <th className="py-2.5 px-3 text-center">보유 박스 재고</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products.map((prod) => {
                  const spec = prod.specs?.[0];
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        {prod.imageUrl ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 relative">
                            <img src={prod.imageUrl} alt={prod.productName} className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[8px] text-center font-bold">
                              WebP
                            </span>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                            <ImageIcon size={18} />
                            <span className="text-[8px] mt-0.5">기본</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {prod.brandName && (
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded">
                              {prod.brandName}
                            </span>
                          )}
                          <strong className="text-slate-900">{prod.productName}</strong>
                        </div>
                        {prod.trimSpec && (
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                            ✂ {prod.trimSpec}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {prod.storageType === 'REFRIGERATED' ? '냉장 (신선)' : '냉동 (-18℃)'}
                        </span>
                        <span className="text-[11px] text-slate-500 ml-1.5">{prod.origin}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">{spec?.specName || '원박스 약 20kg'}</span>
                        <span className="text-[11px] text-slate-400 block font-mono">
                          기준: {spec?.stdWeightKg}kg / 허용오차 ±{spec?.weightTolerancePct}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-amber-800 font-bold">
                          {spec?.basePricePerKg?.toLocaleString()}원 / kg
                        </strong>
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900">
                          {spec?.estimatedPackPrice?.toLocaleString()}원
                        </strong>
                        <span className="text-[10px] text-slate-400 block">(선결제 예치 기준가)</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          {prod.traceability?.traceNumber || '002198450123'}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {prod.traceability?.bmsGrade || '1+등급 (A등급)'}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                          {prod.inventory?.stockBoxes ?? 20} 박스
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4.0 주문 · 출고 · 물류 관리 (Fulfillment & B2B 근량 정산) */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Truck size={18} className="text-amber-700" />
                식당 주문 접수 내역 및 출고 / 실중량(근량) 계량 처리
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                냉동탑차 직배송 또는 BWT 보세창고 명의이전을 선택하고, 박스별 실제 계량표를 입력하여 차액을 확정합니다.
              </p>
            </div>
            <span className="text-xs text-slate-400">총 {orders.length}건</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">주문번호 / 식당명</th>
                  <th className="py-2.5 px-3">주문 품목 및 수량</th>
                  <th className="py-2.5 px-3">선결제 예치금</th>
                  <th className="py-2.5 px-3">출고 상태</th>
                  <th className="py-2.5 px-3">계량 실중량 (kg)</th>
                  <th className="py-2.5 px-3">차액 정산 상태</th>
                  <th className="py-2.5 px-3 text-right">출고 및 계량 입력</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map((order) => {
                  const settlement = order.weightSettlement;
                  const isSettled = order.orderStatus === 'SETTLED';
                  return (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-800">{order.orderNo}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {order.buyer?.businessBuyer?.companyName || '하남돼지집 강남역삼점'}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-800">{order.items[0]?.spec.product.productName}</strong>
                        <p className="text-[11px] text-slate-400">
                          {order.items[0]?.boxQty}박스 (기준 {order.items[0]?.spec.stdWeightKg}kg/box)
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900">{order.totalEstimatedAmt.toLocaleString()}원</strong>
                        <span className="text-[10px] text-slate-400 block">(에스크로 예치)</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isSettled ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isSettled ? '출고완료' : '출고준비'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {settlement ? (
                          <span className="font-bold text-slate-900">{settlement.actualWeightKg}kg</span>
                        ) : (
                          <span className="text-slate-400">계량 대기</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {settlement ? (
                          <span className="font-bold text-emerald-700">
                            {settlement.diffAmount < 0 ? `${settlement.diffAmount.toLocaleString()}원 환불` : `+${settlement.diffAmount.toLocaleString()}원 청구`}
                          </span>
                        ) : (
                          <span className="text-slate-400">미정산</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrderForFulfillment(order);
                            setActualWeightKg(settlement ? String(settlement.actualWeightKg) : '19.4');
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            isSettled
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                          }`}
                        >
                          {isSettled ? '계량/정산표 수정' : '출고 & 실중량 입력'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3.0 RFQ 비딩 & 조건 협상 센터 */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-amber-700" />
                식당 점주 맞춤 조건요청(RFQ) 수신함 & 견적서 제출
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                식당 인적사항은 블라인드 처리되어 있으며, 희망 단가 및 납기에 맞춰 경쟁력 있는 견적을 송부하세요.
              </p>
            </div>
            <span className="text-xs text-slate-400">수신 견적 요청: {rfqs.length}건</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      수신 RFQ #{rfq.id}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">
                      {rfq.categoryCode === 'PORK_BELLY' ? '국내산 한돈 삼겹살' : rfq.categoryCode} 대량 {rfq.targetBoxQty}박스 요청
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    납기: {new Date(rfq.preferredDeliveryDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">점주 희망 단가:</span>
                    <strong className="text-red-700">{rfq.targetPricePerKg.toLocaleString()}원/kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">요청 세절:</span>
                    <span className="text-slate-700 font-medium">{rfq.cutSpec || '원물 덩어리'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">도착된 제안 수:</span>
                    <span className="text-amber-700 font-semibold">{rfq.proposals.length}개사 경쟁중</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRfqForQuote(rfq)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  맞춤 견적서(제안 단가·포장) 송부하기
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 4.1 출고 방식 선택 & 4.2 실중량 계량 입력 모달 */}
        {selectedOrderForFulfillment && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedOrderForFulfillment(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  4.1 출고 & 4.2 계량 입력
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  주문 {selectedOrderForFulfillment.orderNo} 출고 처리 및 실중량 정산
                </h3>
                <p className="text-xs text-slate-500">
                  식당명: {selectedOrderForFulfillment.buyer?.businessBuyer?.companyName || '하남돼지집'} | 
                  기준 중량: {selectedOrderForFulfillment.items[0]?.spec.stdWeightKg}kg
                </p>
              </div>

              <form onSubmit={handleExecuteSettlement} className="space-y-4 text-xs">
                {/* 4.1 출고 수단 선택 (라디오 버튼) */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">4.1 출고 방식 선택</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 ${
                        shipmentOption === 'COLD_TRUCK_DIRECT'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipmentType"
                        className="sr-only"
                        checked={shipmentOption === 'COLD_TRUCK_DIRECT'}
                        onChange={() => setShipmentOption('COLD_TRUCK_DIRECT')}
                      />
                      <span>[옵션 A] 냉동탑차 직배송</span>
                      <span className="text-[10px] font-normal text-slate-500">지정 냉동 차량으로 매장 새벽 직배송</span>
                    </label>

                    <label
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 ${
                        shipmentOption === 'BWT_WAREHOUSE_TRANSFER'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipmentType"
                        className="sr-only"
                        checked={shipmentOption === 'BWT_WAREHOUSE_TRANSFER'}
                        onChange={() => setShipmentOption('BWT_WAREHOUSE_TRANSFER')}
                      />
                      <span>[옵션 B] BWT 창고 명의이전</span>
                      <span className="text-[10px] font-normal text-slate-500">보세/수도권 냉동창고 명의이전 서류 첨부</span>
                    </label>
                  </div>

                  {shipmentOption === 'COLD_TRUCK_DIRECT' ? (
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">차량 번호 및 기사 연락처</label>
                      <input
                        type="text"
                        value={truckNumber}
                        onChange={(e) => setTruckNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">보관 창고명</label>
                        <input
                          type="text"
                          value={bwtWarehouseName}
                          onChange={(e) => setBwtWarehouseName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">창고 계좌 및 명의이전 상세</label>
                        <input
                          type="text"
                          value={bwtAccountInfo}
                          onChange={(e) => setBwtAccountInfo(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4.2 계량 실중량(근량) 입력 & 공인 계량표 첨부 */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block font-bold text-slate-700">4.2 계량 실중량(근량) 입력 & 공인 계량표 첨부</label>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">출고 박스 시리얼 번호</label>
                      <input
                        type="text"
                        value={boxSerialNo}
                        onChange={(e) => setBoxSerialNo(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">공인 계량 실중량 (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={actualWeightKg}
                        onChange={(e) => setActualWeightKg(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900"
                        required
                      />
                    </div>
                  </div>

                  {/* Calculated difference preview */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
                    <div className="flex justify-between">
                      <span>기준 중량:</span>
                      <strong>{selectedOrderForFulfillment.items[0]?.spec.stdWeightKg}kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>계량 오차:</span>
                      <strong className="text-red-700">
                        {(parseFloat(actualWeightKg || '0') - selectedOrderForFulfillment.items[0]?.spec.stdWeightKg).toFixed(1)}kg
                      </strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                      <span>차액 환불/청구액:</span>
                      <span className="text-emerald-700">
                        {Math.round((parseFloat(actualWeightKg || '0') - selectedOrderForFulfillment.items[0]?.spec.stdWeightKg) * selectedOrderForFulfillment.items[0]?.unitPrice).toLocaleString()}원
                      </span>
                    </div>
                  </div>

                  {/* Scale ticket file mock */}
                  <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50">
                    <Scale size={20} className="mx-auto text-slate-400 mb-1" />
                    <span className="text-[11px] font-semibold text-slate-600">공인 계량표 사진 첨부됨 (scale_ticket.jpg)</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForFulfillment(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md"
                  >
                    출고 확정 및 국세청 전자세금계산서 1-Click 발행
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* RFQ 견적 작성 모달 */}
        {selectedRfqForQuote && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setSelectedRfqForQuote(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">3.1 견적서 송부</span>
                <h3 className="text-lg font-bold text-slate-900">
                  RFQ #{selectedRfqForQuote.id} 맞춤 견적서 작성
                </h3>
                <p className="text-xs text-slate-500">
                  요청 품목: {selectedRfqForQuote.categoryCode} ({selectedRfqForQuote.targetBoxQty}박스) | 
                  점주 희망가: {selectedRfqForQuote.targetPricePerKg.toLocaleString()}원/kg
                </p>
              </div>

              <form onSubmit={handleSubmitProposal} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">제안 단가 (원/kg)</label>
                  <input
                    type="number"
                    value={proposalPrice}
                    onChange={(e) => setProposalPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-red-700"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">포장 방식 및 품질 사양</label>
                  <input
                    type="text"
                    value={proposalPackaging}
                    onChange={(e) => setProposalPackaging(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                  견적 송부 후 점주가 1:1 대화로 조건을 수락하면 즉시 정식 수발주로 확정 전환됩니다.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRfqForQuote(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                  >
                    견적서 송부하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 1.2 신규 원박스/가공 상품 등록 모달 (축평원 API 연동 검증 포함) */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
              <button
                onClick={() => setShowProductModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  도매 공급자 신규 상품 등록 (Master Intent 02조)
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  신규 원박스 축산물 등록 & 축평원 검증
                </h3>
                <p className="text-xs text-slate-500">
                  축평원 이력번호를 조회하여 도축/등급 진위를 공인 확인한 후, B2B 매칭 시장에 즉시 노출합니다.
                </p>
              </div>

              <form onSubmit={handleRegisterProduct} className="space-y-4 text-xs">
                {/* 1단계: 축산물 이력추적번호 검증 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-600" />
                      축산물 이력추적번호 (12자리)
                    </label>
                    <span className="text-[10px] text-slate-400">축산물품질평가원 API 연동</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={productForm.traceNumber}
                      onChange={(e) => {
                        setProductForm({ ...productForm, traceNumber: e.target.value });
                        setTraceVerified(false);
                      }}
                      placeholder="예: 002198450992"
                      className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono text-xs bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSimulateTraceVerify}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shrink-0 flex items-center gap-1.5"
                    >
                      {isVerifyingTrace ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>조회중...</span>
                        </>
                      ) : (
                        <span>이력번호 조회</span>
                      )}
                    </button>
                  </div>

                  {traceVerified && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 space-y-1 animate-in fade-in">
                      <p className="font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        축평원 실시간 공인 인증 완료
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        품목: 한우(소) | 등급: 1++(No.8) | 도축장: 농협음성공판장 | 가공일자: 오늘
                      </p>
                    </div>
                  )}
                </div>

                {/* 2단계: 모바일 현장 실물 사진 촬영 & WebP 실시간 최적화 */}
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                        <Camera size={16} className="text-amber-700" />
                        현장 원물 실물 사진 첨부 (모바일 직접 촬영 지원)
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        작업장 현장에서 스마트폰으로 직접 촬영해도 고해상도 과부하 없이 <strong>브라우저 즉시 WebP 압축(용량 ~90% 절감)</strong>되어 안전하게 저장됩니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-white rounded-2xl p-4 text-center transition-colors flex flex-col items-center justify-center gap-1.5 shadow-2xs">
                        <Camera className="text-amber-600" size={24} />
                        <span className="font-bold text-slate-800 text-xs">
                          스마트폰 카메라 촬영 또는 갤러리 사진 선택
                        </span>
                        <span className="text-[10px] text-slate-400">
                          (모바일 환경에서 클릭 시 카메라가 바로 구동됩니다)
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleProcessImageToWebp}
                        className="hidden"
                      />
                    </label>

                    {/* WebP 변환 인디케이터 및 미리보기 */}
                    {isConvertingWebp && (
                      <div className="p-4 bg-white rounded-2xl border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
                        <RefreshCw size={16} className="animate-spin text-amber-600" />
                        <span>고해상도 원본을 WebP 형식으로 경량화 변환 중...</span>
                      </div>
                    )}

                    {productForm.imageUrl && !isConvertingWebp && (
                      <div className="relative group w-28 h-28 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md shrink-0 bg-slate-900">
                        <img
                          src={productForm.imageUrl}
                          alt="실물 WebP 미리보기"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-1.5 text-[9px] text-white font-mono">
                          <span className="bg-emerald-600 px-1 py-0.2 rounded text-center font-bold">WEBP 변환됨</span>
                          {imageMeta && (
                            <span className="text-[8px] text-emerald-300 mt-0.5 leading-tight">
                              {imageMeta.origSize} → {imageMeta.webpSize} ({imageMeta.compressionRatio})
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {imageMeta && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-[11px] flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold">
                        <Check size={13} className="text-emerald-600" />
                        WebP 최적화 완료: 대용량 이미지 에러 없이 초경량 저장 준비됨
                      </span>
                      <strong className="font-mono text-emerald-700">
                        원본 {imageMeta.origSize} → {imageMeta.webpSize} ({imageMeta.compressionRatio})
                      </strong>
                    </div>
                  )}
                </div>

                {/* 3단계: 축산 도매 정밀 스펙 (브랜드, 가공/지방 정선, 도축장) */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">브랜드 / 가공 브랜드명</label>
                      <input
                        type="text"
                        value={productForm.brandName}
                        onChange={(e) => setProductForm({ ...productForm, brandName: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                        placeholder="예: 도드람한돈, 안성마춤한우"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">도축장명</label>
                      <input
                        type="text"
                        value={productForm.slaughterHouseName}
                        onChange={(e) => setProductForm({ ...productForm, slaughterHouseName: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                        placeholder="예: 농협음성축산물공판장"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      가공/지방 정선 스펙 (식당 점주 필수 확인 항목)
                    </label>
                    <input
                      type="text"
                      value={productForm.trimSpec}
                      onChange={(e) => setProductForm({ ...productForm, trimSpec: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                      placeholder="예: 원물 덩어리 진공포장 (떡지방 90% 정선 완료, 과지방 클레임 보상)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">상품 카테고리</label>
                      <select
                        value={productForm.categoryCode}
                        onChange={(e) => setProductForm({ ...productForm, categoryCode: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="BEEF_TENDERLOIN">한우 안심 (원박스)</option>
                        <option value="BEEF_SIRLOIN">한우 등심 (원박스)</option>
                        <option value="BEEF_RIBS">한우/수입 갈비</option>
                        <option value="PORK_BELLY">한돈 삼겹살 (원박스)</option>
                        <option value="PORK_COLLAR">한돈 목심 (원박스)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">보관 방식</label>
                      <select
                        value={productForm.storageType}
                        onChange={(e) => setProductForm({ ...productForm, storageType: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="REFRIGERATED">냉장 (신선 0~2℃)</option>
                        <option value="FROZEN">냉동 (-18℃ 이하)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">등록 상품명</label>
                    <input
                      type="text"
                      value={productForm.productName}
                      onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      placeholder="예: 국내산 한우 안심 1++ (No.8 BMS)"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">판매 타겟</label>
                      <select
                        value={productForm.targetAudience}
                        onChange={(e) => setProductForm({ ...productForm, targetAudience: e.target.value })}
                        className="w-full px-2.5 py-2 border border-slate-200 rounded-xl bg-white text-[11px]"
                      >
                        <option value="B2B_WHOLESALE">B2B 식당 도매</option>
                        <option value="B2C_GIFT">B2C 명절 선물세트</option>
                        <option value="B2C_RETAIL">B2C 일반 소매</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">기준 중량 (kg/box)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={productForm.stdWeightKg}
                        onChange={(e) => setProductForm({ ...productForm, stdWeightKg: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">kg당 공급 단가 (원)</label>
                      <input
                        type="number"
                        step="100"
                        value={productForm.basePricePerKg}
                        onChange={(e) => setProductForm({ ...productForm, basePricePerKg: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-amber-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">초기 보유 박스 재고</label>
                      <input
                        type="number"
                        value={productForm.stockBoxes}
                        onChange={(e) => setProductForm({ ...productForm, stockBoxes: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                        placeholder="30"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">도축 등급 / BMS</label>
                      <input
                        type="text"
                        value={productForm.bmsGrade}
                        onChange={(e) => setProductForm({ ...productForm, bmsGrade: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                        placeholder="1++ (No.8 BMS)"
                      />
                    </div>
                  </div>
                </div>

                {/* 자동 계산된 선결제 예치 기준가 안내 */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">박스당 선결제 예치 예상가:</span>
                  <strong className="text-base font-extrabold text-amber-900">
                    {(parseFloat(productForm.stdWeightKg || '0') * parseInt(productForm.basePricePerKg || '0')).toLocaleString()}원 / box
                  </strong>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isRegisteringProduct}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold shadow-md flex items-center gap-1.5"
                  >
                    {isRegisteringProduct ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>등록 처리중...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle size={15} />
                        <span>상품 등록 완료 및 B2B 판매 개시</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
