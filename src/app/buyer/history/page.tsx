'use client';

import { useState, useEffect } from 'react';
import BuyerNav from '@/components/BuyerNav';
import {
  Receipt,
  FileText,
  Truck,
  CheckCircle2,
  TrendingDown,
  UploadCloud,
  FileCheck,
  AlertCircle,
  Sparkles,
  Bot,
  Settings,
} from 'lucide-react';

export default function BuyerHistoryEconomyPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  // V3 Delegation Rule state
  const [delegationActive, setDelegationActive] = useState(true);
  const [targetMaxPrice, setTargetMaxPrice] = useState('18000');

  useEffect(() => {
    fetch('/api/orders?buyerId=1')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setOrders(json.data);
      })
      .catch(console.error);

    fetch('/api/receipts?buyerId=1')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setReceipts(json.data);
      })
      .catch(console.error);
  }, []);

  const handleSimulateOcrUpload = async () => {
    setOcrLoading(true);
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: 1,
          vendorName: '독산동 한일축산(외부영수증)',
          itemName: '국내산 한돈 삼겹살 원물',
          unitPricePerKg: 20800,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setOcrSuccess(true);
        // Refresh receipts
        fetch('/api/receipts?buyerId=1')
          .then((r) => r.json())
          .then((d) => setReceipts(d.data));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <BuyerNav />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              발주 · 정산 내역 & 내 고기 경제실
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              공인 계량 실중량 차액 환불 내역과 외부 영수증 OCR 통합 매입 분석을 한눈에 확인하세요.
            </p>
          </div>
          <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
            누적 근량 정산 환불액: +11,100원
          </span>
        </div>

        {/* 4.2 계량 실중량 차액 정산 내역 & 실시간 배송 추적 */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="font-bold text-sm sm:text-base text-slate-900">
                실시간 출고 배송 & 실중량(근량) 차액 정산 원장
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">국세청 전자세금계산서 즉시 조회 가능</span>
          </div>

          <div className="space-y-4">
            {orders.map((order) => {
              const settlement = order.weightSettlement;
              const shipment = order.shipment;
              const tax = order.taxInvoice;
              return (
                <div
                  key={order.id}
                  className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4"
                >
                  {/* Order header row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {order.orderNo}
                      </span>
                      <span className="text-xs text-slate-600 font-semibold">
                        {order.items[0]?.spec.product.productName} ({order.items[0]?.boxQty}박스)
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {order.orderStatus === 'SETTLED' ? '실중량 정산 완료' : '출고 준비중'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      발주일시: {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Weight Settlement details box (Master Intent 08조) */}
                  {settlement && (
                    <div className="bg-white rounded-xl p-4 border border-emerald-200 text-xs space-y-2">
                      <div className="flex items-center justify-between text-emerald-900 font-bold border-b border-slate-100 pb-2">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={15} className="text-emerald-600" />
                          원박스 공인 계량표 기준 차액 정산 명세
                        </span>
                        <span className="text-emerald-700 font-mono">
                          시리얼: {settlement.boxSerialNo}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 pt-1">
                        <div>
                          <span className="text-slate-400 text-[11px] block">기준 중량 선결제</span>
                          <strong>{order.items[0]?.spec.stdWeightKg}kg ({order.totalEstimatedAmt.toLocaleString()}원)</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">출고 계량 실중량</span>
                          <strong className="text-slate-900">{settlement.actualWeightKg}kg</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">중량 오차</span>
                          <span className="text-red-700 font-bold">{settlement.weightDiffKg}kg</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">차액 환불 정산</span>
                          <strong className="text-emerald-700 text-sm">
                            {settlement.diffAmount < 0 ? `${settlement.diffAmount.toLocaleString()}원 환불 완료` : `+${settlement.diffAmount.toLocaleString()}원 추가청구`}
                          </strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex flex-wrap justify-between items-center text-[11px] text-slate-500">
                        <span>
                          최종 결제 확정액: <strong>{order.totalFinalAmt?.toLocaleString()}원</strong>
                        </span>
                        {tax && (
                          <span className="text-slate-700">
                            전자세금계산서: <strong>{tax.ntsApprovalNum}</strong> (국세청 승인)
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Shipment info */}
                  {shipment && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-200/80">
                      <Truck size={15} className="text-slate-500" />
                      <span>
                        출고 배송: <strong>{shipment.shipmentType === 'COLD_TRUCK_DIRECT' ? '냉동탑차 직배송' : 'BWT 창고 명의이전'}</strong>
                        {shipment.vehicleNumber && ` (${shipment.vehicleNumber})`}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 4.3 외부 영수증 OCR 등록 & 내 고기 경제실 (통합 구매 분석) */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">내 고기 경제실</span>
                <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                  통합 구매 분석 및 시세 비교 대시보드
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                사피에넷 실거래 데이터와 외부 거래처 OCR 영수증을 통합 분석하여 원가 절감 제안을 제공합니다.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                [플랫폼 검증] 실거래
              </span>
              <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                [외부 등록] OCR 입력
              </span>
            </div>
          </div>

          {/* AI 절감 참고 가이드 (Master Intent 02조/09조 성과추정치 명시) */}
          <div className="bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 rounded-2xl p-4 sm:p-5 border border-red-200/80 text-xs text-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold">
              <Bot size={16} />
              <span>AI 데이터 원가 절감 제안 가이드 (참고용 추정치)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              점주님의 최근 한돈 삼겹살 외부 매입 평균 단가는 <strong>20,650원/kg</strong>으로, 축평원 시장 평균(19,400원) 대비 약 <strong>6.4% 높게 매입</strong>되고 있습니다. 사피에넷 플랫폼 B사 맞춤 RFQ(18,500원) 이용 시 매월 50박스 기준 <strong>약 215만 원의 원가 절감이 추정</strong>됩니다.
            </p>
            <p className="text-[10px] text-slate-400">
              * 본 절감액은 확정 성과가 아니며, 축평원 일일 공시 데이터 및 사피에넷 최근 거래 기록에 기반한 참고 제안 가이드입니다.
            </p>
          </div>

          {/* OCR Upload & Purchase ledger */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* OCR Upload box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <UploadCloud size={16} className="text-slate-600" />
                  외부 거래처 종이 영수증 OCR 등록
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  타 도매상이나 마장동 오프라인에서 매입하신 세금계산서/영수증 사진을 등록하시면 자동으로 품목과 단가를 추출해 경제실에 반영합니다.
                </p>
              </div>

              <div
                onClick={handleSimulateOcrUpload}
                className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-white"
              >
                <UploadCloud className="mx-auto text-slate-400 mb-1" size={24} />
                <span className="text-xs font-bold text-slate-700">영수증 사진 드래그 업로드</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">클릭 시 샘플 영수증 OCR 시뮬레이션</span>
              </div>

              {ocrLoading && (
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg text-xs flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  영수증 품목명 및 매입 단가를 추출하고 있습니다...
                </div>
              )}

              {ocrSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  영수증 등록 완료! [외부 등록] 내역에 반영되었습니다.
                </div>
              )}
            </div>

            {/* Combined Purchase Ledger Table */}
            <div className="lg:col-span-2 space-y-2">
              <h3 className="font-bold text-xs text-slate-800">
                통합 매입 내역 ([플랫폼 검증] vs [외부 등록] 시각적 구분)
              </h3>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">출처 구분</th>
                      <th className="py-2.5 px-3">거래처 상호</th>
                      <th className="py-2.5 px-3">품목명</th>
                      <th className="py-2.5 px-3">매입 단가 (원/kg)</th>
                      <th className="py-2.5 px-3">시장 평균가 대비</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {/* Platform verified rows */}
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                          플랫폼 검증
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        (주)도드람축산가공 (사피에넷)
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">국내산 한돈 삼겹살 (1+)</td>
                      <td className="py-2.5 px-3 font-bold text-red-700">18,500원</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-bold">-900원 (최적 매칭)</td>
                    </tr>

                    {/* External OCR rows */}
                    {receipts.map((rc) => (
                      <tr key={rc.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            외부 등록 (OCR)
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{rc.vendorName}</td>
                        <td className="py-2.5 px-3 text-slate-700">{rc.itemName}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {rc.unitPricePerKg.toLocaleString()}원
                        </td>
                        <td className="py-2.5 px-3 text-red-600 font-semibold">
                          +{rc.unitPricePerKg - 19400 > 0 ? `${(rc.unitPricePerKg - 19400).toLocaleString()}원 높음` : '양호'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 4.4 V3 자동 위임구매 / 조건부 재발주 설정 (Delegate Management) */}
        <section className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  V3 신기능
                </span>
                <h3 className="text-base font-bold text-white">
                  스마트 자동 위임구매 / 조건부 재발주 설정 (Delegate Engine)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                점주님이 설정한 단가·수량 조건이 도매 시장에서 충족될 때, 신뢰 가공장으로부터 안전하게 자동 발주됩니다.
              </p>
            </div>

            <button
              onClick={() => setDelegationActive(!delegationActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                delegationActive ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {delegationActive ? '위임구매 활성화됨 (ON)' : '일시정지 (OFF)'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
              <span className="text-slate-400 text-[11px] block">지정 품목</span>
              <strong className="text-slate-200">국내산 한돈 삼겹살 원박스 (A등급)</strong>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
              <span className="text-slate-400 text-[11px] block">자동 발주 목표 상한가</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={targetMaxPrice}
                  onChange={(e) => setTargetMaxPrice(e.target.value)}
                  className="w-24 px-2 py-1 bg-slate-900 border border-slate-600 rounded text-xs text-white"
                />
                <span className="text-slate-300">원/kg 이하 진입 시</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
              <span className="text-slate-400 text-[11px] block">안전장치 (카카오 알림톡 1-Click 승인)</span>
              <strong className="text-amber-300">발주 30분 전 사전 최종 승인 필수 활성화</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
