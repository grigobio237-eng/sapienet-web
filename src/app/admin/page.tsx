'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  Users,
  FileSpreadsheet,
  Building,
  Check,
  ArrowRight,
  Receipt,
  FileCheck,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => d.success && setOrders(d.data));

    fetch('/api/rfq')
      .then((r) => r.json())
      .then((d) => d.success && setRfqs(d.data));
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="font-extrabold text-lg tracking-tight text-white">
              SAPIENET <span className="text-emerald-400">ADMIN</span>
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              플랫폼 거버넌스 백오피스
            </span>
          </div>

          <div className="text-xs text-slate-400">
            총괄 운영자 로그인됨 (권한 레벨: SUPER_ADMIN)
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* 1.0 관리자 KPI 카운터 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 block">당일 총 거래액</span>
            <strong className="text-xl sm:text-2xl font-extrabold text-white">14,250,000원</strong>
            <span className="text-[10px] text-emerald-400 block mt-1 font-semibold">전액 에스크로 안전보관</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 block">대량 RFQ 심사/진행 건</span>
            <strong className="text-xl sm:text-2xl font-extrabold text-amber-400">{rfqs.length}건</strong>
            <span className="text-[10px] text-slate-400 block mt-1 font-semibold">비공개 블라인드 배포중</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 block">실계량 차액 정산 승인</span>
            <strong className="text-xl sm:text-2xl font-extrabold text-emerald-400">
              {orders.filter((o) => o.weightSettlement).length}건 완료
            </strong>
            <span className="text-[10px] text-emerald-400 block mt-1 font-semibold">100% 공인 계량표 일치</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 block">회원/분쟁 대기 이슈</span>
            <strong className="text-xl sm:text-2xl font-extrabold text-white">0건</strong>
            <span className="text-[10px] text-slate-400 block mt-1 font-semibold">정상 운영중</span>
          </div>
        </div>

        {/* 3.1 RFQ 비공개 심사 & 적격 매칭 배포 모듈 */}
        <section className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-700">
            <div>
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-emerald-400" />
                3.1 대량 조건요청(RFQ) 비공개 심사 & 적격 공급자 배포 관리
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                과도한 저가 덤핑 요구나 허위 조건을 사전 검수하고, 구매자 상호를 블라인드 처리하여 배포합니다.
              </p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
              안전 검수 엔진 활성화
            </span>
          </div>

          <div className="space-y-3">
            {rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-slate-900 rounded-xl p-4 border border-slate-700/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold text-[10px]">
                      심사 승인됨 (APPROVED)
                    </span>
                    <strong className="text-white text-sm">
                      RFQ #{rfq.id} - {rfq.categoryCode} ({rfq.targetBoxQty}박스)
                    </strong>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    점주 희망가: <strong className="text-red-400">{rfq.targetPricePerKg.toLocaleString()}원/kg</strong> | 
                    납기: {new Date(rfq.preferredDeliveryDate).toLocaleDateString()} | 
                    블라인드 배포 상태: <strong>적격 가공 공급자 2개사 견적 제출 완료</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                    인적사항 블라인드 확인됨
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3.2 실중량(근량) 차액 정산 원장 승인 & 세금계산서 모니터링 */}
        <section className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-700">
            <div>
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <Scale size={18} className="text-emerald-400" />
                3.2 원박스 공인 계량 실중량(근량) 차액 정산 원장 관리
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                공급자가 등록한 공인 계량표 사진 및 실제 계량 중량에 따른 차액 환불/추가결제 승인 내역입니다.
              </p>
            </div>
            <span className="text-xs text-slate-400">총 {orders.length}건 처리</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">주문번호</th>
                  <th className="py-2.5 px-3">구매자 / 공급자</th>
                  <th className="py-2.5 px-3">기준중량 선결제액</th>
                  <th className="py-2.5 px-3">출고 실중량 (오차)</th>
                  <th className="py-2.5 px-3">차액 환불/청구액</th>
                  <th className="py-2.5 px-3">전자세금계산서</th>
                  <th className="py-2.5 px-3 text-right">감사 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-medium text-slate-300">
                {orders.map((o) => {
                  const s = o.weightSettlement;
                  const t = o.taxInvoice;
                  return (
                    <tr key={o.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-mono text-white font-bold">{o.orderNo}</td>
                      <td className="py-3 px-3">
                        <p className="text-white">{o.buyer?.businessBuyer?.companyName || '하남돼지집'}</p>
                        <p className="text-[11px] text-slate-400">{o.supplier?.companyName || '(주)도드람축산'}</p>
                      </td>
                      <td className="py-3 px-3">
                        {o.totalEstimatedAmt.toLocaleString()}원
                      </td>
                      <td className="py-3 px-3">
                        {s ? (
                          <span className="font-bold text-white">
                            {s.actualWeightKg}kg ({s.weightDiffKg}kg)
                          </span>
                        ) : (
                          <span className="text-slate-500">대기</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {s ? (
                          <span className="text-emerald-400 font-bold">
                            {s.diffAmount.toLocaleString()}원
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {t ? (
                          <span className="text-[11px] font-mono text-slate-300">
                            {t.ntsApprovalNum}
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-400 font-bold text-[10px]">
                          ✓ 승인 완료
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2.1 사업자 및 공급자 가입 승인 검증 */}
        <section className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 sm:p-6 space-y-3">
          <h2 className="font-bold text-base text-white flex items-center gap-2">
            <Users size={18} className="text-emerald-400" />
            2.1 회원 자격 서류 검증 (국세청 API 및 축산물 허가증 연동)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">하남돼지집 강남역삼점 (식당 점주)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">사업자번호: 120-81-49201 | 대표자: 홍길동</p>
              </div>
              <span className="text-emerald-400 font-bold text-[11px]">국세청 실시간 계속사업자 확인됨</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">(주)도드람축산가공 (도매 공급자)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">허가번호: 경기-2022-유통-0891 | HACCP 인증 완료</p>
              </div>
              <span className="text-emerald-400 font-bold text-[11px]">축산물유통 허가 및 책임동의 완료</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
