'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BuyerNav from '@/components/BuyerNav';
import {
  Package,
  PlusCircle,
  Camera,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  Scale,
  ShoppingBag,
  ArrowRight,
  Store,
  Layers,
  FileCheck,
  Tag,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface RetailPack {
  id: number;
  packName: string;
  categoryCode: string;
  sourceTraceNumber: string;
  sourceSlaughterHouse: string | null;
  chefNote: string | null;
  portionWeightG: number;
  salePrice: number;
  stockQty: number;
  meatGrade: string | null;
  imageUrl: string | null;
  pickupAvailable: boolean;
  pickupDiscount: number;
  deliveryAvailable: boolean;
  storeAddress: string | null;
  status: string;
  createdAt: string;
}

interface SourceOrder {
  id: number;
  orderNo: string;
  items: Array<{
    id: number;
    spec: {
      specName: string;
      basePricePerKg: number;
      product: {
        productName: string;
        categoryCode: string;
        traceability?: {
          traceNumber: string;
          bmsGrade: string | null;
          slaughterHouseName: string | null;
        } | null;
      };
    };
  }>;
}

export default function BuyerRetailPacksPage() {
  const [activeTab, setActiveTab] = useState<'LIST' | 'CREATE'>('LIST');
  const [loading, setLoading] = useState(true);
  const [packs, setPacks] = useState<RetailPack[]>([]);
  const [sourceOrders, setSourceOrders] = useState<SourceOrder[]>([]);

  // 신규 팩 등록 폼 상태
  const [selectedSource, setSelectedSource] = useState<{
    orderId?: number;
    productName: string;
    categoryCode: string;
    traceNumber: string;
    grade: string;
    slaughterHouse: string;
    costPerKg: number;
  } | null>(null);

  const [packName, setPackName] = useState('');
  const [chefNote, setChefNote] = useState('');
  const [portionWeightG, setPortionWeightG] = useState(500);
  const [salePrice, setSalePrice] = useState(15900);
  const [stockQty, setStockQty] = useState(20);
  const [pickupAvailable, setPickupAvailable] = useState(true);
  const [pickupDiscount, setPickupDiscount] = useState(1000);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [storeAddress, setStoreAddress] = useState('서울시 강남구 테헤란로 123 1층 (하남돼지집 강남역삼점)');
  const [packImageUrl, setPackImageUrl] = useState('');
  const [isConvertingImage, setIsConvertingImage] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 데이터 로드
  const loadData = async () => {
    try {
      setLoading(true);
      // 1. 등록된 팩 목록 조회
      const resPacks = await fetch('/api/retail-packs?buyerId=1');
      const jsonPacks = await resPacks.json();
      if (jsonPacks.success) {
        setPacks(jsonPacks.data || []);
      }

      // 2. 가공 가능한 원물 발주 내역 조회
      const resOrders = await fetch('/api/retail-packs?sourceOrders=true');
      const jsonOrders = await resOrders.json();
      if (jsonOrders.success) {
        setSourceOrders(jsonOrders.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 원물 선택 시 폼 자동 세팅
  const handleSelectSource = (item: any, orderId: number) => {
    const spec = item.spec || item.productSpec;
    const prod = spec.product;
    const trace = prod.traceability;

    setSelectedSource({
      orderId,
      productName: prod.productName,
      categoryCode: prod.categoryCode?.startsWith('BEEF') ? 'BEEF' : 'PORK',
      traceNumber: trace?.traceNumber || '002198450123',
      grade: trace?.bmsGrade || '1+ 등급',
      slaughterHouse: trace?.slaughterHouseName || '도드람안성공판장',
      costPerKg: spec.basePricePerKg || 18000,
    });

    const isBeef = prod.categoryCode?.startsWith('BEEF');
    setPackName(`[하남돼지집] ${isBeef ? '1++ 한우 웻에이징 큐브 스테이크' : '비법 칼집 생삼겹살'} 500g`);
    setChefNote(isBeef ? '매장 저온숙성고에서 14일 숙성 후 한입 큐브 컷팅' : '하남돼지집 특제 2.5cm 두툼 컷팅 & 300번 정밀 다이아몬드 칼집');
    setPortionWeightG(500);
    setSalePrice(isBeef ? 34000 : 15900);
    setActiveTab('CREATE');
  };

  // 모바일 현장 사진 촬영 및 WebP 변환
  const handleProcessImageToWebp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsConvertingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new (window as any).Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const webpData = canvas.toDataURL('image/webp', 0.85);
          setPackImageUrl(webpData);
          setIsConvertingImage(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // 팩 상품 등록 요청
  const handleCreatePack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSource && !packName) {
      alert('상품명을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/retail-packs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessBuyerId: 1,
          sourceOrderId: selectedSource?.orderId,
          sourceTraceNumber: selectedSource?.traceNumber || '002198450123',
          sourceSlaughterHouse: selectedSource?.slaughterHouse || '도드람안성공판장',
          categoryCode: selectedSource?.categoryCode || 'PORK',
          packName,
          chefNote,
          portionWeightG,
          salePrice,
          stockQty,
          meatGrade: selectedSource?.grade || '1+ 등급',
          imageUrl: packImageUrl || null,
          pickupAvailable,
          pickupDiscount,
          deliveryAvailable,
          storeAddress,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setToastMessage('소분 팩상품이 성공적으로 등록되어 B2C 소매몰에 즉시 노출되었습니다!');
        setTimeout(() => setToastMessage(null), 4000);
        setActiveTab('LIST');
        loadData();
      } else {
        alert(json.error || '등록 중 오류가 발생했습니다.');
      }
    } catch (e: any) {
      alert(e.message || '네트워크 오류');
    } finally {
      setSubmitting(false);
    }
  };

  // 마진 계산
  const costPerPack = selectedSource ? Math.round((selectedSource.costPerKg * portionWeightG) / 1000) : 0;
  const grossProfit = salePrice - costPerPack;
  const marginPct = salePrice > 0 ? Math.round((grossProfit / salePrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col pb-20">
      <BuyerNav />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* 헤더 배너 */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/30 text-red-200 text-xs font-bold">
              <ChefHat size={14} />
              <span>C2B2C 하이브리드 점주 소분 유통 모델</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              식당 원물 ➔ 셰프 수제 소분 팩 판매 시스템
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              사피에넷에서 발주한 도매 원박스 고기를 매장 비법으로 세절·진공 소포장하여{' '}
              <strong className="text-white underline decoration-red-400">B2C 개인 소매몰</strong>에 실시간 판매하세요.{' '}
              축산물이력번호 자동 승계와 법적 표시 라벨 인쇄까지 원클릭으로 지원합니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('CREATE');
                if (!selectedSource && sourceOrders.length > 0) {
                  const firstItem = sourceOrders[0]?.items?.[0];
                  if (firstItem) handleSelectSource(firstItem, sourceOrders[0].id);
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-red-900/30 transition-transform active:scale-95 cursor-pointer"
            >
              <PlusCircle size={18} />
              <span>새 소분 팩상품 등록</span>
            </button>
            <Link
              href="/retail"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
            >
              <span>소매몰 노출 보기</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
              <p className="text-sm font-bold">{toastMessage}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-xs text-emerald-700 font-bold">
              확인
            </button>
          </div>
        )}

        {/* 탭 네비게이션 */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('LIST')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'LIST'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            현재 판매 중인 팩상품 ({packs.length}개)
          </button>
          <button
            onClick={() => setActiveTab('CREATE')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'CREATE'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            원물 재고 기반 팩상품 등록
          </button>
        </div>

        {/* 탭 1: 현재 판매 중인 팩상품 목록 */}
        {activeTab === 'LIST' && (
          <div className="space-y-6">
            {packs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Package className="mx-auto text-slate-300 mb-3" size={48} />
                <h3 className="font-extrabold text-slate-700 text-base">등록된 소분 팩상품이 없습니다</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  발주한 도매 고기를 500g, 1kg 진공팩으로 등록해 소매 고객에게 판매해 보세요.
                </p>
                <button
                  onClick={() => setActiveTab('CREATE')}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700"
                >
                  <PlusCircle size={15} />
                  <span>첫 팩상품 등록하기</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {packs.map((pack) => (
                  <div
                    key={pack.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* 이미지 & 배지 */}
                      <div className="relative w-full h-44 rounded-2xl bg-slate-100 overflow-hidden mb-3.5 flex items-center justify-center">
                        {pack.imageUrl ? (
                          <img src={pack.imageUrl} alt={pack.packName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <span className="text-4xl">{pack.categoryCode === 'BEEF' ? '🥩' : '🥓'}</span>
                            <span className="block text-[10px] text-slate-400 mt-1">현장 실물 사진 미등록</span>
                          </div>
                        )}
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                          {pack.categoryCode === 'BEEF' ? '소고기' : '돼지고기'} · {pack.meatGrade}
                        </span>
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold">
                          소매몰 LIVE
                        </span>
                      </div>

                      {/* 상품명 & 설명 */}
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-sm text-slate-950 leading-snug line-clamp-2">
                          {pack.packName}
                        </h3>
                        {pack.chefNote && (
                          <p className="text-xs text-slate-500 line-clamp-2">
                            ✂ {pack.chefNote}
                          </p>
                        )}
                      </div>

                      {/* 스펙 & 이력번호 */}
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">포장 중량:</span>
                          <span className="font-bold text-slate-800">{pack.portionWeightG}g</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">축산물 이력번호:</span>
                          <span className="font-mono font-bold text-slate-800 text-[11px]">
                            {pack.sourceTraceNumber}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">잔여 팩 재고:</span>
                          <span className="font-bold text-red-700">{pack.stockQty}팩</span>
                        </div>
                      </div>

                      {/* 픽업 혜택 안내 */}
                      {pack.pickupAvailable && (
                        <div className="mt-2.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold flex items-center justify-between">
                          <span>🚶 매장 방문 픽업 지원</span>
                          <span className="text-amber-800 font-extrabold">-{pack.pickupDiscount.toLocaleString()}원 할인</span>
                        </div>
                      )}
                    </div>

                    {/* 하단 가격 및 액션 */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">팩당 소매 판매가</span>
                        <strong className="text-base font-black text-slate-950">
                          {pack.salePrice.toLocaleString()}원
                        </strong>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSource({
                            productName: pack.packName,
                            categoryCode: pack.categoryCode,
                            traceNumber: pack.sourceTraceNumber,
                            grade: pack.meatGrade || '1+ 등급',
                            slaughterHouse: pack.sourceSlaughterHouse || '공인도축장',
                            costPerKg: 18000,
                          });
                          setPackName(pack.packName);
                          setChefNote(pack.chefNote || '');
                          setPortionWeightG(pack.portionWeightG);
                          setSalePrice(pack.salePrice);
                          setShowLabelModal(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700"
                      >
                        <Printer size={13} />
                        <span>라벨 출력</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 탭 2: 원물 발주내역 기반 팩상품 신규 등록 */}
        {activeTab === 'CREATE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 좌측: 내가 발주한 원물 재고 선택 (이력번호 자동 승계) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Layers size={16} className="text-red-700" />
                    <span>가공할 원물 선택 (발주 내역)</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">사피에넷 발주 연동</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  내가 사피에넷에서 구매한 원박스/가공육을 선택하면,{' '}
                  <strong className="text-red-700">도축장 정보와 축산물 이력번호가 100% 자동 승계</strong>됩니다.
                </p>

                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {sourceOrders.map((ord) =>
                    (ord.items || []).map((item) => {
                      const spec = item.spec;
                      const prod = spec.product;
                      const trace = prod.traceability;
                      const isSelected = selectedSource?.traceNumber === trace?.traceNumber;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectSource(item, ord.id)}
                          className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-red-600 bg-red-50/70 ring-2 ring-red-600/20 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              주문 #{ord.orderNo}
                            </span>
                            <span className="text-[11px] font-extrabold text-red-700">
                              단가 {spec.basePricePerKg.toLocaleString()}원/kg
                            </span>
                          </div>
                          <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                            {prod.productName}
                          </h4>
                          <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <span>이력: {trace?.traceNumber || '002198450123'}</span>
                            <span>·</span>
                            <span>{trace?.bmsGrade || '1+ 등급'}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 수익성 실시간 분석 카드 */}
              {selectedSource && (
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                      <Sparkles size={14} />
                      수익성 시뮬레이션
                    </span>
                    <span className="text-[10px] text-slate-400">원물 대비 마진율</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">원물 원가/팩</span>
                      <strong className="text-sm font-extrabold text-slate-200">
                        {costPerPack.toLocaleString()}원
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">소매 판매가</span>
                      <strong className="text-sm font-black text-white">
                        {salePrice.toLocaleString()}원
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">예상 마진율</span>
                      <strong className="text-sm font-black text-emerald-400">
                        +{marginPct}%
                      </strong>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 bg-white/5 p-2.5 rounded-xl leading-relaxed">
                    💡 홀에서 판매하고 남은 원박스 고기를 {portionWeightG}g 스킨팩으로 소분 판매 시 팩당 약{' '}
                    <strong className="text-white">{grossProfit.toLocaleString()}원</strong>의 추가 순이익이 발생합니다.
                  </p>
                </div>
              )}
            </div>

            {/* 우측: 팩상품 스펙 & 모바일 사진 촬영 & 등록 폼 */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-950">소분 팩상품 상세 스펙 작성</h3>
                  <p className="text-xs text-slate-500">소비자에게 노출될 상품 정보 및 매장 픽업 옵션</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLabelModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Printer size={14} />
                  <span>법적 라벨 미리보기</span>
                </button>
              </div>

              <form onSubmit={handleCreatePack} className="space-y-5 text-xs">
                {/* 1. 상품명 */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">소매 노출 상품명</label>
                  <input
                    type="text"
                    value={packName}
                    onChange={(e) => setPackName(e.target.value)}
                    placeholder="예: [하남돼지집] 비법 칼집 생삼겹살 500g 진공스킨팩"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                    required
                  />
                </div>

                {/* 2. 셰프 가공 노하우 설명 */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    셰프/점주 가공 노하우 설명 (스토리텔링)
                  </label>
                  <textarea
                    rows={2}
                    value={chefNote}
                    onChange={(e) => setChefNote(e.target.value)}
                    placeholder="예: 2.5cm 두툼 컷팅에 300번 정밀 다이아몬드 칼집을 넣어 겉은 바삭하고 속은 촉촉합니다."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  />
                </div>

                {/* 3. 포장 중량 & 판매 가격 & 팩 수량 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">포장 중량 (g)</label>
                    <select
                      value={portionWeightG}
                      onChange={(e) => setPortionWeightG(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                    >
                      <option value={300}>300g (1인 혼밥/스테이크)</option>
                      <option value={500}>500g (2인 구이용 표준)</option>
                      <option value={600}>600g (한 근 기준)</option>
                      <option value={1000}>1,000g (1kg 패밀리)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">팩당 판매가 (원)</label>
                    <input
                      type="number"
                      step={100}
                      value={salePrice}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-red-700 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">판매 수량 (팩)</label>
                    <input
                      type="number"
                      value={stockQty}
                      onChange={(e) => setStockQty(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold font-mono"
                      required
                    />
                  </div>
                </div>

                {/* 4. 모바일 현장 사진 촬영 / WebP 변환 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Camera size={15} className="text-red-600" />
                      실물 팩 사진 촬영 (모바일 현장 즉시 WebP 변환)
                    </label>
                    {isConvertingImage && (
                      <span className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                        <RefreshCw size={11} className="animate-spin" />
                        WebP 최적화 변환 중...
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-white overflow-hidden flex items-center justify-center shrink-0 relative">
                      {packImageUrl ? (
                        <img src={packImageUrl} alt="WebP 미리보기" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-slate-400">
                          <Package size={24} className="mx-auto" />
                          <span className="text-[9px] mt-1 block">사진 없음</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        {/* 모바일 카메라 촬영 버튼 */}
                        <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer transition-colors shadow-xs">
                          <Camera size={14} />
                          <span>모바일 카메라 촬영</span>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleProcessImageToWebp}
                            className="hidden"
                          />
                        </label>

                        {/* PC/갤러리 파일 업로드 */}
                        <label className="px-3 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold cursor-pointer transition-colors">
                          <span>갤러리</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProcessImageToWebp}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        * 고해상도 사진도 브라우저에서 800px WebP로 자동 리사이징되어 OOM 오류 없이 초경량 저장됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. 매장 픽업 옵션 및 할인 */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">퇴근길 매장 방문 픽업 지원</p>
                      <p className="text-[11px] text-slate-500">
                        소비자가 매장에 직접 들러 가져갈 경우 배송비 대신 즉시 할인 제공
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pickupAvailable}
                      onChange={(e) => setPickupAvailable(e.target.checked)}
                      className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                    />
                  </div>

                  {pickupAvailable && (
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-amber-200/60">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">픽업 할인 금액 (원)</label>
                        <input
                          type="number"
                          value={pickupDiscount}
                          onChange={(e) => setPickupDiscount(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-bold font-mono text-amber-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">픽업 매장 주소</label>
                        <input
                          type="text"
                          value={storeAddress}
                          onChange={(e) => setStoreAddress(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-medium text-slate-800"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 등록 버튼 */}
                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-xl shadow-red-900/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <PlusCircle size={18} />
                    <span>{submitting ? '소매몰 등록 중...' : 'B2C 소매몰에 즉시 노출 등록'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 식품위생법 표시사항(라벨 스티커) 인쇄 모달 */}
        {showLabelModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Printer className="text-red-700" size={18} />
                  <h3 className="font-extrabold text-sm text-slate-900">식품위생법 규격 라벨 스티커</h3>
                </div>
                <button
                  onClick={() => setShowLabelModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-xs"
                >
                  닫기
                </button>
              </div>

              {/* 실제 라벨 출력물 시뮬레이션 */}
              <div className="p-4 rounded-xl border-2 border-slate-800 bg-white text-slate-900 font-mono space-y-2 text-xs shadow-inner">
                <div className="text-center pb-2 border-b-2 border-slate-800">
                  <h4 className="font-black text-sm tracking-tight">{packName || '[하남돼지집] 비법 칼집 삼겹살'}</h4>
                  <span className="text-[10px] text-slate-600">축산물 식육즉석가공소포장육</span>
                </div>

                <div className="space-y-1 text-[11px] pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">이력추적번호:</span>
                    <span className="font-black tracking-wider text-slate-950">
                      {selectedSource?.traceNumber || '002198450123'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">원산지/도축장:</span>
                    <span className="font-semibold">{selectedSource?.slaughterHouse || '도드람안성공판장'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">중량 / 수량:</span>
                    <span className="font-bold text-slate-950">{portionWeightG}g / 1팩</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">보관방법:</span>
                    <span>-2℃ ~ 10℃ 냉장보관</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">가공일자:</span>
                    <span>2026. 11. 08 (도축 48h 이내)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">소비기한:</span>
                    <span className="text-red-700 font-bold">2026. 11. 15 (가공일로부터 7일)</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500 font-bold">가공 및 판매원:</span>
                    <span className="font-bold">하남돼지집 강남역삼점</span>
                  </div>
                </div>

                <div className="pt-2 text-center border-t border-slate-800">
                  <div className="w-48 h-8 mx-auto bg-slate-900 text-white flex items-center justify-center text-[10px] tracking-widest font-mono">
                    ||||||||||||||||||||||||||||
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5 block">
                    SAP-{selectedSource?.traceNumber?.slice(-6) || '450123'}-{portionWeightG}G
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    alert('라벨 프린터로 인쇄 명령이 전송되었습니다.');
                    setShowLabelModal(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer size={15} />
                  <span>라벨 스티커 인쇄 (라벨프린터 연동)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
