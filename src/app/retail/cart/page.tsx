'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building,
  Gift,
  HelpCircle,
  Store,
} from 'lucide-react';

export default function RetailCartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'CARD' | 'EASY' | 'TRANSFER'>('CARD');
  const [deliveryType, setDeliveryType] = useState<'DAWN' | 'PICKUP'>('DAWN');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('문 앞에 놓아주시고 배송 완료 후 문자 부탁드립니다.');
  const [customAddress, setCustomAddress] = useState('서울시 서초구 반포대로 123 래미안아파트 101동 1204호');

  // 1. localStorage에서 장바구니 불러오기 (비어있으면 기본 추천 품목 1종 세팅)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sapienet_retail_cart');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCartItems(parsed);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      // 기본 담긴 예시 상품 (한돈 삼겹살 + 한우 안심)
      const defaultItems = [
        {
          id: 102,
          name: '초신선 국내산 한돈 삼겹살 2cm 구이용 소포장',
          brand: '도드람한돈',
          origin: '국내산 (도드람안성공판장)',
          storage: 'REFRIGERATED',
          specWeight: '600g (개별 진공 스킨팩)',
          price: 15900,
          marketPrice: 21900,
          qty: 2,
          badge: '1+ 등급 A',
          traceNumber: '002194829101',
          deliveryTag: '내일 아침 7시 도착 (새벽배송)',
          imageDesc: '🥓',
        },
        {
          id: 103,
          name: '홈파티 1++ 한우 안심 두툼 스테이크용 (3cm 컷)',
          brand: '농협안심한우',
          origin: '국내산 (음성공판장)',
          storage: 'REFRIGERATED',
          specWeight: '300g (1인 스테이크 2팩)',
          price: 36000,
          marketPrice: 48000,
          qty: 1,
          badge: '1++ No.9 프리미엄',
          traceNumber: '002198450992',
          deliveryTag: '새벽배송',
          imageDesc: '🥩',
        },
      ];
      setCartItems(defaultItems);
      localStorage.setItem('sapienet_retail_cart', JSON.stringify(defaultItems));
    }
  }, []);

  const updateCart = (newItems: any[]) => {
    setCartItems(newItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sapienet_retail_cart', JSON.stringify(newItems));
    }
  };

  const handleQtyChange = (id: number, delta: number) => {
    const next = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    });
    updateCart(next);
  };

  const handleRemoveItem = (id: number) => {
    const next = cartItems.filter((i) => i.id !== id);
    updateCart(next);
  };

  const totalProductAmt = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cartItems]);

  const hasPickupEligible = cartItems.some((i) => i.pickupAvailable || i.isChefPack);
  const pickupDiscountAmt = deliveryType === 'PICKUP' ? (hasPickupEligible ? 1000 : 0) : 0;
  const discountBonus = 5000; // 가입축하 5,000P
  const deliveryFee = deliveryType === 'PICKUP' ? 0 : (totalProductAmt >= 30000 ? 0 : 3500);
  const finalPaymentAmt = Math.max(
    0,
    totalProductAmt + deliveryFee - (totalProductAmt > 0 ? discountBonus : 0) - pickupDiscountAmt
  );

  const handleExecuteOrder = () => {
    setOrderSuccess(true);
    updateCart([]);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen text-slate-900">
      {/* 1. 상단 전용 헤더 */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/retail"
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">쇼핑 계속하기</span>
            </Link>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-600"></span>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-950">
                장바구니 & 주문서 작성
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full">
              <span className="font-extrabold text-purple-900 bg-purple-200 text-[10px] px-1.5 py-0.5 rounded-full">
                test1
              </span>
              <span className="font-bold text-purple-950 hidden sm:inline">이소매 회원님</span>
              <span className="text-[11px] font-extrabold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                5,000P 보유
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. 장바구니 본문 (페이지 레이아웃: 좌측 리스트 + 우측 결제 요약) */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {orderSuccess ? (
          /* 주문 완료 화면 */
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-5 my-12 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                새벽배송 주문 완료
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                신선 주문이 성공적으로 접수되었습니다!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                도축장(도드람/음성)에서 바로 진공 스킨포장 후 새벽 출고됩니다.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">배송지 주소:</span>
                <span className="font-bold text-slate-800 text-right">{customAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">배송 예정일:</span>
                <strong className="text-purple-700">내일 아침 7시 전 도착 (풀콜드체인)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">적립금 할인:</span>
                <span className="font-bold text-purple-700">-5,000P 적용 완료</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                href="/retail"
                className="flex-1 py-3 bg-purple-700 hover:bg-purple-600 text-white font-extrabold rounded-2xl text-xs shadow-md transition-all text-center"
              >
                쇼핑몰 홈으로 돌아가기
              </Link>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* 빈 장바구니 화면 */
          <div className="max-w-md mx-auto bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs space-y-4 my-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingCart size={32} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">장바구니에 담긴 고기가 없습니다</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              도축장 다이렉트 신선육과 1++ 한우 선물세트를 둘러보시고 장바구니에 담아보세요.
            </p>
            <Link
              href="/retail"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white font-extrabold rounded-2xl text-xs shadow-md transition-all"
            >
              <span>신선 고기 둘러보기</span>
              <ArrowLeft className="rotate-180" size={14} />
            </Link>
          </div>
        ) : (
          /* 장바구니 & 주문 결제 2열 레이아웃 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* 좌측: 장바구니 상품 목록 + 배송지 설정 (2열 차지) */}
            <div className="lg:col-span-2 space-y-6">
              {/* 장바구니 품목 박스 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-xs">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <ShoppingCart size={18} className="text-purple-700" />
                    담긴 고기 품목 ({cartItems.length}개)
                  </h3>
                  <button
                    onClick={() => updateCart([])}
                    className="text-slate-400 hover:text-red-600 font-semibold flex items-center gap-1"
                  >
                    <Trash2 size={13} />
                    <span>전체 삭제</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                      {/* 좌측 상품 정보 */}
                      <div className="flex items-start gap-3.5 flex-1">
                        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-200 flex items-center justify-center text-2xl shrink-0 overflow-hidden relative">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{item.imageDesc || '🥩'}</span>
                          )}
                          <span className="absolute bottom-0 inset-x-0 bg-purple-700/80 text-[8px] text-white font-bold text-center">
                            {item.storage === 'REFRIGERATED' ? '냉장' : '냉동'}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.2 rounded">
                              {item.brand}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                              {item.badge}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            규격: {item.specWeight} | 이력번호: <span className="font-mono">{item.traceNumber}</span>
                          </p>
                        </div>
                      </div>

                      {/* 우측 수량 조절 및 가격 */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {/* 수량 카운터 */}
                        <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-2.5 py-1.5">
                          <button
                            onClick={() => handleQtyChange(item.id, -1)}
                            className="text-slate-500 hover:text-slate-900"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="font-extrabold text-xs w-5 text-center">{item.qty}</span>
                          <button
                            onClick={() => handleQtyChange(item.id, 1)}
                            className="text-slate-500 hover:text-slate-900"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* 가격 */}
                        <div className="text-right min-w-[90px]">
                          <strong className="text-base font-extrabold text-slate-950 block">
                            {(item.price * item.qty).toLocaleString()}원
                          </strong>
                          <span className="text-[10px] text-slate-400 line-through">
                            {((item.marketPrice || item.price * 1.3) * item.qty).toLocaleString()}원
                          </span>
                        </div>

                        {/* 개별 삭제 버튼 */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-300 hover:text-red-600 p-1 rounded-lg"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-purple-900 bg-purple-50/70 p-3 rounded-2xl">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Truck size={15} className="text-purple-700" />
                    3만원 이상 구매 시 전 지역 풀콜드체인 새벽배송 무료!
                  </span>
                  <span className="text-[11px] font-semibold text-purple-700">내일 아침 7시 전 도착</span>
                </div>
              </div>

              {/* 배송지 및 수령 정보 (새벽배송 vs 매장방문 픽업 토글) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Truck size={17} className="text-purple-700" />
                    수령 방식 선택
                  </h3>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                    {deliveryType === 'DAWN' ? '신선 새벽배송' : '매장 직접 픽업 (-1,000원)'}
                  </span>
                </div>

                {/* 새벽배송 vs 매장 픽업 탭 */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 font-bold">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('DAWN')}
                    className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      deliveryType === 'DAWN'
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Truck size={14} />
                    <span>풀콜드체인 새벽배송</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('PICKUP')}
                    className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      deliveryType === 'PICKUP'
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Store size={14} />
                    <span>퇴근길 매장 픽업 (-1,000원)</span>
                  </button>
                </div>

                {deliveryType === 'DAWN' ? (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">새벽배송 수령지 주소</label>
                      <input
                        type="text"
                        value={customAddress}
                        onChange={(e) => setCustomAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">배송 기사님 요청사항 (공동현관 비밀번호 등)</label>
                      <input
                        type="text"
                        value={deliveryNote}
                        onChange={(e) => setDeliveryNote(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-amber-950">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-amber-900">
                        <Store size={15} />
                        픽업 매장 안내
                      </span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                        준비완료 후 24시간 보관
                      </span>
                    </div>
                    <p className="font-extrabold text-sm text-slate-900">
                      하남돼지집 강남역삼점
                    </p>
                    <p className="text-[11px] text-slate-600">
                      서울시 강남구 테헤란로 123 1층 (카운터에서 주문자명 확인 후 수령)
                    </p>
                    <p className="text-[10px] text-amber-800 font-semibold pt-1">
                      🎉 매장 직접 방문 픽업으로 탄소발자국을 줄이고 1,000원 즉시 할인이 적용되었습니다!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 우측: 결제 금액 정산 및 결제 수단 (1열 고정) */}
            <div className="space-y-6 sticky top-24">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-lg space-y-5 text-xs">
                <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
                  최종 결제 금액
                </h3>

                {/* 금액 내역 */}
                <div className="space-y-2.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>총 상품 금액</span>
                    <span className="font-bold text-slate-900">{totalProductAmt.toLocaleString()}원</span>
                  </div>

                  <div className="flex justify-between">
                    <span>{deliveryType === 'DAWN' ? '새벽 신선배송비' : '수령 배송비'}</span>
                    <span className="font-bold text-emerald-700">
                      {deliveryFee === 0 ? '무료' : `+${deliveryFee.toLocaleString()}원`}
                    </span>
                  </div>

                  {pickupDiscountAmt > 0 && (
                    <div className="flex justify-between items-center text-amber-900 bg-amber-50 p-2.5 rounded-xl font-bold">
                      <span className="flex items-center gap-1">
                        <Store size={13} className="text-amber-700" />
                        퇴근길 매장 직접 픽업 할인
                      </span>
                      <span>-{pickupDiscountAmt.toLocaleString()}원</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-purple-800 bg-purple-50 p-2.5 rounded-xl font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles size={13} className="text-purple-600" />
                      신규 가입 5,000P 할인
                    </span>
                    <span>-5,000원</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="font-extrabold text-slate-900 text-sm">최종 결제 금액</span>
                    <strong className="text-2xl font-extrabold text-purple-900">
                      {finalPaymentAmt.toLocaleString()}원
                    </strong>
                  </div>
                </div>

                {/* 결제 수단 선택 */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block font-bold text-slate-800">결제 수단 선택</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'CARD', label: '신용/체크카드', icon: CreditCard },
                      { id: 'EASY', label: '카카오/네이버페이', icon: Sparkles },
                      { id: 'TRANSFER', label: '실시간 계좌이체', icon: Building },
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedPaymentMethod(m.id as any)}
                          className={`py-3 px-1.5 rounded-2xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                            selectedPaymentMethod === m.id
                              ? 'border-purple-600 bg-purple-50/80 text-purple-900 shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-[10px] leading-tight">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 약관 및 안심 결제 안내 */}
                <div className="p-3 bg-slate-50 rounded-2xl text-[10px] text-slate-500 space-y-1">
                  <p className="flex items-center gap-1 font-semibold text-slate-700">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    사피에넷 100% 신선 안심 보장제
                  </p>
                  <p>
                    도축장 직배송 상품의 신선도에 문제가 있을 경우, 사진 한 장으로 100% 즉시 교환/환불을 보장합니다.
                  </p>
                </div>

                {/* 주문 결제 버튼 */}
                <button
                  onClick={handleExecuteOrder}
                  className="w-full py-4 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white font-extrabold text-sm shadow-xl shadow-purple-900/20 transition-transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  <span>{finalPaymentAmt.toLocaleString()}원 신선 새벽배송 결제</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
