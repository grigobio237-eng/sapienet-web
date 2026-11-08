'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BuyerNav from '@/components/BuyerNav';
import {
  Repeat,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Package,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Truck,
  Receipt,
} from 'lucide-react';

export default function BuyerDashboardPage() {
  const [reorderSuccess, setReorderSuccess] = useState(false);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/market-watch')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setMarketPrices(json.data);
      })
      .catch(console.error);
  }, []);

  const handleQuickReorder = () => {
    setReorderSuccess(true);
    setTimeout(() => setReorderSuccess(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <BuyerNav />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                사업자 ERP 정상 연결
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              하남돼지집 강남역삼점 점주 대시보드
            </h1>
            <p className="text-xs text-slate-500">
              오늘도 축평원 연동 <strong>최적 매칭가</strong>로 불필요한 저가 경매 피로 없이 안전하게 수발주하세요.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">지정 출고 방식:</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
              냉동탑차 직배송 (새벽 05:00 전 입고)
            </span>
          </div>
        </div>

        {/* 블록 1: 1-Click 간편 재발주 바 (Restaurant Quick Reorder Bar) */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-red-900/40">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-300">
                <Repeat size={14} className="text-red-400" />
                1-Click 간편 복사 재발주
              </div>
              <h2 className="text-base sm:text-lg font-bold">
                지난 11.05(수) 발주 품목을 동일한 최적 매칭 조건으로 담으시겠습니까?
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 pt-1">
                <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  📦 국내산 한돈 삼겹살 원박스 2박스 (약 40kg) · <strong className="text-white">18,500원/kg</strong>
                </span>
                <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  📦 호주산 와규 갈비살 1박스 (약 20kg) · <strong className="text-white">29,000원/kg</strong>
                </span>
                <span className="text-red-300 font-semibold">예치 결제액: 1,320,000원</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <button
                onClick={handleQuickReorder}
                className="w-full lg:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <Repeat size={16} />
                <span>동일 조건 한 번에 담기</span>
              </button>
            </div>
          </div>

          {reorderSuccess && (
            <div className="mt-3 p-3 bg-emerald-900/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>지난 발주 품목이 장바구니에 성공적으로 담겼습니다! 출고 시 실계량 차액 정산 안내가 적용됩니다.</span>
            </div>
          )}
        </div>

        {/* 블록 2: 실시간 도매 시세 비교 표 (Market Watch) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">Market Watch</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  실시간 도매 시세 비교표 (축평원 데이터 연동)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                최저가 출혈 경쟁 대신, 축산물품질평가원 전국 도매시장 평균가와 사피에넷 <strong>최적 매칭가</strong>를 투명하게 비교합니다.
              </p>
            </div>
            <span className="text-[11px] text-slate-400">기준: 오늘 오전 09시 집계 (원/kg)</span>
          </div>

          {/* Price Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-y border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">주요 축종 및 부위</th>
                  <th className="py-2.5 px-3">축평원 전국 도매시장 평균가</th>
                  <th className="py-2.5 px-3">사피에넷 최적 매칭가</th>
                  <th className="py-2.5 px-3">시장 대비 혜택</th>
                  <th className="py-2.5 px-3">내 매장 최근 매입가</th>
                  <th className="py-2.5 px-3 text-right">바로 발주</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    국내산 한돈 삼겹살 (1+ 등급)
                  </td>
                  <td className="py-3 px-3 text-slate-600">19,400원</td>
                  <td className="py-3 px-3 font-bold text-red-700">18,500원</td>
                  <td className="py-3 px-3 text-emerald-600 font-bold flex items-center gap-1">
                    <TrendingDown size={14} /> -4.6% (kg당 900원 우위)
                  </td>
                  <td className="py-3 px-3 text-slate-500">18,500원 (사피에넷)</td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href="/buyer/order"
                      className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-800"
                    >
                      발주하기
                    </Link>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    국내산 한우 1++ 등심 (BMS 8)
                  </td>
                  <td className="py-3 px-3 text-slate-600">72,500원</td>
                  <td className="py-3 px-3 font-bold text-red-700">68,000원</td>
                  <td className="py-3 px-3 text-emerald-600 font-bold flex items-center gap-1">
                    <TrendingDown size={14} /> -6.2% (kg당 4,500원 우위)
                  </td>
                  <td className="py-3 px-3 text-slate-500">74,000원 (외부거래처)</td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href="/buyer/order"
                      className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-800"
                    >
                      발주하기
                    </Link>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    호주산 와규 갈비살 (MB5+)
                  </td>
                  <td className="py-3 px-3 text-slate-600">31,000원</td>
                  <td className="py-3 px-3 font-bold text-red-700">29,000원</td>
                  <td className="py-3 px-3 text-emerald-600 font-bold flex items-center gap-1">
                    <TrendingDown size={14} /> -6.5% (kg당 2,000원 우위)
                  </td>
                  <td className="py-3 px-3 text-slate-500">29,000원 (사피에넷)</td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href="/buyer/order"
                      className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-800"
                    >
                      발주하기
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 블록 3: 2-Way 집중 진입 카드 (Quick Order vs Custom RFQ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link
            href="/buyer/order"
            className="group bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-red-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Package size={24} />
              </div>
              <span className="text-[11px] font-bold text-red-700 uppercase">단기 / 정기 소량 발주</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                📦 규격 상품 빠른 발주 (원박스 / 세절)
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                스마트 3-Step 가이드 필터(용도·온도·단가)로 1~5박스 규격 축산물을 신속 검색하고 발주합니다. 축산물 이력추적번호와 공판장 등급 판정서를 100% 공개합니다.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold text-red-700">
              규격 상품 리스트 보기 <ArrowRight size={14} />
            </div>
          </Link>

          <Link
            href="/buyer/rfq"
            className="group bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-amber-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileSpreadsheet size={24} />
              </div>
              <span className="text-[11px] font-bold text-amber-700 uppercase">대량 구매 / 맞춤 가공</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                📑 대량 맞춤 조건 발주 (RFQ 작성)
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                10박스 이상 대량 구매 또는 매장 맞춤 세절·진공포장 조건이 필요하신가요? 희망 단가와 납기를 요청하면 1차 공급자들이 Side-by-Side 경쟁 견적을 제시합니다.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold text-amber-700">
              맞춤 조건요청(RFQ) 작성하기 <ArrowRight size={14} />
            </div>
          </Link>
        </div>

        {/* 블록 4: 진행 중인 발주/견적 현황 바 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock size={16} className="text-slate-500" />
            진행 중인 발주 및 견적 상태
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Order status card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  정산 완료 (출고 배송완료)
                </span>
                <p className="font-bold text-slate-800 mt-1">ORD-20261107-001 (한돈 삼겹살 1박스)</p>
                <p className="text-slate-500 text-[11px]">
                  기준 20kg 선결제 (370,000원) → <strong>실계량 19.4kg (-0.6kg)</strong>
                </p>
                <p className="text-emerald-700 font-semibold mt-1">
                  차액 환불 완료: +11,100원 (국세청 전자세금계산서 발행 완료)
                </p>
              </div>
              <Link
                href="/buyer/history"
                className="text-xs font-bold text-red-700 hover:underline shrink-0"
              >
                상세내역 →
              </Link>
            </div>

            {/* RFQ status card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  공급자 제안 도착 (2건)
                </span>
                <p className="font-bold text-slate-800 mt-1">대량 삼겹살 50박스 납품 요청</p>
                <p className="text-slate-500 text-[11px]">
                  희망 단가 17,800원 대비 도드람축산(17,900원) 등 2개사 견적 도착
                </p>
                <p className="text-amber-700 font-semibold mt-1">1:1 협의 및 계약 승인 대기중</p>
              </div>
              <Link
                href="/buyer/rfq"
                className="text-xs font-bold text-amber-700 hover:underline shrink-0"
              >
                견적 비교하기 →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
