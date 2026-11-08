'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BuyerNav from '@/components/BuyerNav';
import {
  Filter,
  Check,
  Package,
  Layers,
  Sparkles,
  Info,
  ShoppingCart,
  ArrowRight,
  ShieldAlert,
  FileSpreadsheet,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function BuyerOrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 3-Step Filter states
  const [stepUsage, setStepUsage] = useState<string>('ALL'); // ALL, GRILL, DISPLAY, STEW, BULK
  const [stepStorage, setStepStorage] = useState<string>('ALL'); // ALL, REFRIGERATED, FROZEN
  const [stepPriceRange, setStepPriceRange] = useState<string>('ALL'); // ALL, UNDER_20K, 20K_TO_50K, OVER_50K

  // Detail Modal & Cart state
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [cart, setCart] = useState<{ spec: any; product: any; qty: number }[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/products?audience=B2B_WHOLESALE')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProducts(json.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filteredProducts = products.filter((p) => {
    if (stepStorage !== 'ALL' && p.storageType !== stepStorage) return false;
    if (stepPriceRange !== 'ALL') {
      const price = p.specs[0]?.basePricePerKg || 0;
      if (stepPriceRange === 'UNDER_20K' && price >= 20000) return false;
      if (stepPriceRange === '20K_TO_50K' && (price < 20000 || price > 50000)) return false;
      if (stepPriceRange === 'OVER_50K' && price <= 50000) return false;
    }
    return true;
  });

  const addToCart = (product: any, spec: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.spec.id === spec.id);
      if (existing) {
        return prev.map((item) =>
          item.spec.id === spec.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { spec, product, qty: 1 }];
    });
  };

  const totalCartQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalCartEstAmount = cart.reduce(
    (sum, item) => sum + item.spec.estimatedPackPrice * item.qty,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);
    try {
      const firstItem = cart[0];
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specId: firstItem.spec.id,
          boxQty: firstItem.qty,
          shipmentType: 'COLD_TRUCK_DIRECT',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setOrderComplete(json.data);
        setCart([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <BuyerNav cartCount={totalCartQty} />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              간편 고기 발주 (Wholesale Ordering Center)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              탐색 피로 없는 스마트 3-Step 가이드 필터로 원하는 원박스·세절 규격을 신속하게 선택하세요.
            </p>
          </div>
          <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            총 운영 규격: <strong>{products.length}종</strong>
          </span>
        </div>

        {/* 2.1 스마트 3-Step 가이드 필터 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
            <Filter size={15} className="text-red-700" />
            <span>스마트 3-Step 가이드 필터</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Step 1: 용도 */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400">STEP 1. 매장 용도</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '전체', val: 'ALL' },
                  { label: '구이용', val: 'GRILL' },
                  { label: '국거리·불고기', val: 'STEW' },
                  { label: '업소원물', val: 'BULK' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setStepUsage(item.val)}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all ${
                      stepUsage === item.val
                        ? 'bg-red-700 border-red-700 text-white font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: 상태 */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400">STEP 2. 보관 상태</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '전체', val: 'ALL' },
                  { label: '냉장 (0~2℃)', val: 'REFRIGERATED' },
                  { label: '냉동 (-18℃)', val: 'FROZEN' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setStepStorage(item.val)}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all ${
                      stepStorage === item.val
                        ? 'bg-red-700 border-red-700 text-white font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: 단가 범위 */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400">STEP 3. kg당 희망 단가</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '전체', val: 'ALL' },
                  { label: '2만원 이하', val: 'UNDER_20K' },
                  { label: '2만~5만원', val: '20K_TO_50K' },
                  { label: '5만원 이상', val: 'OVER_50K' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setStepPriceRange(item.val)}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all ${
                      stepPriceRange === item.val
                        ? 'bg-red-700 border-red-700 text-white font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 우수 매칭 TOP 추천 상품 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-red-600" />
            <h2 className="text-sm font-bold text-slate-900">도축 3일 이내 & 우수 공급사 규격 TOP 3</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {products.slice(0, 3).map((p, idx) => {
              const spec = p.specs[0];
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-red-500 transition-all space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                      TOP {idx + 1} 추천
                    </span>
                    <span className="text-slate-400 font-medium">
                      {p.storageType === 'REFRIGERATED' ? '냉장 (0~2℃)' : '진공 냉동'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{p.productName}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      공급사: {p.supplier.companyName} | 원산지: {p.origin}
                    </p>
                  </div>

                  {p.traceability && (
                    <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span>이력번호:</span>
                        <strong className="text-slate-800 font-mono">{p.traceability.traceNumber}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>판정등급:</span>
                        <strong className="text-red-700 font-bold">{p.traceability.bmsGrade}</strong>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">최적 매칭가 (kg당)</span>
                      <strong className="text-base text-red-700 font-extrabold">
                        {spec?.basePricePerKg.toLocaleString()}원
                      </strong>
                    </div>
                    <button
                      onClick={() => addToCart(p, spec)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      + 담기
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2.1 B2B 규격 상품 테이블 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">전체 B2B 원박스 / 세절 규격 상품 목록</h3>
            <span className="text-xs text-slate-400">조건 일치: {filteredProducts.length}건</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">품목명 / 공급사</th>
                  <th className="py-3 px-3">보관 / 원산지</th>
                  <th className="py-3 px-3">판매 규격 (기준중량)</th>
                  <th className="py-3 px-3">BMS / 이력번호</th>
                  <th className="py-3 px-3">최적 매칭가 (kg당)</th>
                  <th className="py-3 px-3">예상 박스당가</th>
                  <th className="py-3 px-4 text-right">상세 및 발주</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((p) => {
                  return p.specs.map((spec: any) => (
                    <tr key={spec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 text-sm">{p.productName}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{p.supplier.companyName}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.storageType === 'REFRIGERATED'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-cyan-50 text-cyan-700'
                          }`}
                        >
                          {p.storageType === 'REFRIGERATED' ? '냉장' : '냉동'}
                        </span>
                        <span className="ml-1 text-slate-600">{p.origin}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-800">{spec.specName}</span>
                        <span className="text-[11px] text-slate-400 block">
                          기준: {spec.stdWeightKg}kg (허용오차 ±{spec.weightTolerancePct}%)
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        {p.traceability ? (
                          <>
                            <span className="font-bold text-red-700 block">{p.traceability.bmsGrade}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {p.traceability.traceNumber}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-red-700 text-sm">
                          {spec.basePricePerKg.toLocaleString()}원
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-extrabold text-slate-900">
                          {spec.estimatedPackPrice.toLocaleString()}원
                        </span>
                        <span className="text-[10px] text-slate-400 block">선결제 예치 기준</span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedProduct({ product: p, spec })}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          상세 스펙
                        </button>
                        <button
                          onClick={() => addToCart(p, spec)}
                          className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-bold shadow-xs"
                        >
                          발주바구니 담기
                        </button>
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2.3 발주 바구니 & ★ 원클릭 대량 RFQ 전환 바 */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-8 sm:right-8 max-w-4xl mx-auto z-40 bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingCart size={16} className="text-red-400" />
                  <span className="font-bold text-sm">
                    발주 바구니 ({totalCartQty}박스 / {cart.length}개 품목)
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  총 예치 결제금액: <strong className="text-red-400 text-base">{totalCartEstAmount.toLocaleString()}원</strong>
                  <span className="text-[11px] text-slate-400 ml-2">
                    (출고 시 공인 계량 실중량에 따라 차액 자동 환불/정산)
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCheckout}
                  disabled={isOrdering}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5"
                >
                  {isOrdering ? '발주 처리중...' : '에스크로 예치 발주 실행'}
                </button>
              </div>
            </div>

            {/* 원클릭 RFQ 전환 안내 바 (Master Intent 03조) */}
            {totalCartQty >= 10 && (
              <div className="bg-amber-950/80 border border-amber-500/50 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet size={16} className="text-amber-400 shrink-0" />
                  <span>
                    <strong>발주 수량이 {totalCartQty}박스 이상이신가요?</strong> 공급자들에게 대량 맞춤 단가 제안받기(RFQ 전환)를 이용하시면 추가 단가 조율이 가능합니다.
                  </span>
                </div>
                <button
                  onClick={() => router.push('/buyer/rfq')}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs whitespace-nowrap shadow-xs"
                >
                  대량 RFQ로 전환하기 →
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2.2 상품 상세 & 전문 신뢰 데이터 모달 */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  축산물 전문 신뢰 데이터
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedProduct.product.productName}</h3>
                <p className="text-xs text-slate-500">
                  규격: {selectedProduct.spec.specName} (기준 중량 {selectedProduct.spec.stdWeightKg}kg)
                </p>
              </div>

              {/* 스펙 태그 바 */}
              {selectedProduct.product.traceability && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500">축산물 이력추적번호:</span>
                    <strong className="font-mono text-red-700 text-sm">
                      {selectedProduct.product.traceability.traceNumber}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">육질/육량 등급:</span>
                    <strong className="text-slate-900">
                      {selectedProduct.product.traceability.bmsGrade}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">도축일자:</span>
                    <strong className="text-slate-900">2026.11.03 (도드람안성공판장)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">축평원 판정서 연동:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> 공식 판정서 확인 완료
                    </span>
                  </div>
                </div>
              )}

              {/* 근량 계량 정산 안내 (Master Intent 08조) */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Info size={15} /> 근량 계량 차액 정산 안내
                </p>
                <p className="text-[11px] leading-relaxed">
                  본 상품은 원박스(약 {selectedProduct.spec.stdWeightKg}kg) 단위로 판매되며, 출고 시 도축/가공 공급자의 실제 계량 중량에 따라 최종 결제 금액이 자동 정산(차액 환불 또는 추가 결제)됩니다. 공인 계량표 사진이 출고 시 투명하게 첨부됩니다.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  닫기
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedProduct.product, selectedProduct.spec);
                    setSelectedProduct(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-700 hover:bg-red-600 shadow-xs"
                >
                  발주 바구니 담기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Complete Modal */}
        {orderComplete && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">에스크로 예치 발주가 접수되었습니다!</h3>
              <p className="text-xs text-slate-500">
                주문번호: <strong>{orderComplete.orderNo}</strong><br />
                예치 결제액: {orderComplete.totalEstimatedAmt?.toLocaleString()}원
              </p>
              <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                도매 공급자가 원박스 출고 시 실중량을 계량하여 계량표를 등록하면 차액이 자동 환불/정산됩니다.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => setOrderComplete(null)}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  확인
                </button>
                <button
                  onClick={() => router.push('/buyer/history')}
                  className="px-5 py-2.5 bg-red-700 text-white rounded-xl text-xs font-bold"
                >
                  배송 및 정산 내역 확인 →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
