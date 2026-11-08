'use client';

import { useState, useEffect } from 'react';
import BuyerNav from '@/components/BuyerNav';
import {
  FileSpreadsheet,
  PlusCircle,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Building,
  AlertCircle,
  X,
} from 'lucide-react';

export default function BuyerRfqPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProposalForConfirm, setSelectedProposalForConfirm] = useState<any | null>(null);

  // Form inputs
  const [categoryCode, setCategoryCode] = useState('PORK_BELLY');
  const [targetBoxQty, setTargetBoxQty] = useState('50');
  const [targetPricePerKg, setTargetPricePerKg] = useState('17800');
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState('2026-11-20');
  const [cutSpec, setCutSpec] = useState('원물 덩어리 진공포장 20kg/box');

  const fetchRfqs = () => {
    fetch('/api/rfq?buyerId=1')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setRfqs(json.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchRfqs();
  }, []);

  const handleCreateRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_RFQ',
          buyerId: 1,
          categoryCode,
          targetBoxQty,
          targetPricePerKg,
          preferredDeliveryDate,
          cutSpec,
          deliveryAddress: '서울시 강남구 테헤란로 123 1층 하남돼지집',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowCreateModal(false);
        fetchRfqs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptProposal = async (proposalId: number) => {
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ACCEPT_PROPOSAL',
          proposalId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedProposalForConfirm(null);
        fetchRfqs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <BuyerNav />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              대량 / 맞춤 조건요청 (Custom RFQ Center)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              원하는 축종, 단가, 세절 조건을 등록하고 전국 1차 가공장들의 Side-by-Side 맞춤 견적을 비교하세요.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle size={16} />
            신규 대량 RFQ 등록하기
          </button>
        </div>

        {/* RFQ List */}
        <div className="space-y-6">
          {rfqs.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-400 text-xs">
              등록된 대량 조건요청(RFQ)이 없습니다.
            </div>
          ) : (
            rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4"
              >
                {/* RFQ Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      RFQ #{rfq.id}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {rfq.categoryCode === 'PORK_BELLY' ? '국내산 한돈 삼겹살' : rfq.categoryCode} (대량 {rfq.targetBoxQty}박스)
                    </h3>
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck size={12} /> 관리자 비공개 심사 승인됨
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    점주 희망 단가: <strong className="text-red-700 text-sm">{rfq.targetPricePerKg.toLocaleString()}원/kg</strong>
                    <span className="text-slate-300 mx-2">|</span>
                    납품 희망일: {new Date(rfq.preferredDeliveryDate).toLocaleDateString()}
                  </div>
                </div>

                {/* RFQ Requirements summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 text-[11px] block">요청 수량</span>
                    <strong>{rfq.targetBoxQty}박스 (약 {rfq.targetBoxQty * 20}kg)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">세절 규격</span>
                    <strong>{rfq.cutSpec || '원물 덩어리'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">배송 주소</span>
                    <span className="truncate block">{rfq.deliveryAddress || '매장 주소'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">도착 견적서</span>
                    <strong className="text-amber-700">{rfq.proposals.length}개사 제안 도착</strong>
                  </div>
                </div>

                {/* Side-by-Side Supplier Proposals */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileSpreadsheet size={14} className="text-amber-600" />
                    도매 공급자 Side-by-Side 제안 다각 비교
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {rfq.proposals.map((prop: any, idx: number) => {
                      const isAccepted = prop.status === 'ACCEPTED';
                      return (
                        <div
                          key={prop.id}
                          className={`rounded-xl p-4 border transition-all space-y-3 relative ${
                            isAccepted
                              ? 'bg-emerald-50/50 border-emerald-500 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-amber-400'
                          }`}
                        >
                          {isAccepted && (
                            <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                              ✓ 최종 발주 확정
                            </span>
                          )}

                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <div>
                              <p className="font-bold text-xs text-slate-800">
                                공급자 {String.fromCharCode(65 + idx)}사
                                <span className="text-[10px] text-slate-400 font-normal ml-1">
                                  ({prop.supplier?.companyName || '인증 가공장'})
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-500">제안 단가:</span>
                              <strong className="text-red-700 text-sm">
                                {prop.proposalPricePerKg.toLocaleString()}원/kg
                              </strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">포장 사양:</span>
                              <span className="text-slate-800 font-medium">{prop.packagingType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">납품 가능일:</span>
                              <span className="text-slate-800 font-medium">
                                {new Date(prop.deliveryAvailableDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {!isAccepted && (
                            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                              <button
                                onClick={() => setSelectedProposalForConfirm({ rfq, proposal: prop, label: `공급자 ${String.fromCharCode(65 + idx)}사` })}
                                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                              >
                                이 견적으로 최종 발주 확정
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 신규 RFQ 작성 모달 */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">3.1 신규 작성</span>
                <h3 className="text-lg font-bold text-slate-900">대량 / 맞춤 조건요청(RFQ) 작성 폼</h3>
                <p className="text-xs text-slate-500">
                  작성된 요청은 관리자 비공개 심사(저가 덤핑·허위조건 검수) 후 적격 공급자 그룹에 안전하게 배포됩니다.
                </p>
              </div>

              <form onSubmit={handleCreateRfq} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">희망 축종 및 부위</label>
                  <select
                    value={categoryCode}
                    onChange={(e) => setCategoryCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  >
                    <option value="PORK_BELLY">국내산 한돈 삼겹살 원박스</option>
                    <option value="BEEF_SIRLOIN">국내산 한우 1++ 등심</option>
                    <option value="BEEF_RIBS">호주산 와규 갈비살</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">희망 수량 (박스/kg)</label>
                    <input
                      type="number"
                      value={targetBoxQty}
                      onChange={(e) => setTargetBoxQty(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      placeholder="예: 50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">희망 단가 (원/kg)</label>
                    <input
                      type="number"
                      value={targetPricePerKg}
                      onChange={(e) => setTargetPricePerKg(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      placeholder="예: 17800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">납품 희망일자</label>
                  <input
                    type="date"
                    value={preferredDeliveryDate}
                    onChange={(e) => setPreferredDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">세절 및 포장 상세 요청</label>
                  <input
                    type="text"
                    value={cutSpec}
                    onChange={(e) => setCutSpec(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    placeholder="예: 원물 덩어리 진공포장 20kg/box"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-800 flex items-start gap-1.5">
                  <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                  <span>공급자들에게는 귀하의 상호와 인적사항이 블라인드 처리되어 공정하게 견적이 수집됩니다.</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                  >
                    비공개 심사 접수하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2단계 확정 확인 & 전자 계약 승인 모듈 (Master Intent 03조 안전장치) */}
        {selectedProposalForConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle size={28} />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  2단계 안전 승인 확인
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedProposalForConfirm.label}의 견적으로 최종 발주를 확정하시겠습니까?
                </h3>
                <p className="text-xs text-slate-500">
                  본 확정은 단순 '관심/의향' 조회가 아니며, 공급자에게 정식 출고 지시 및 전자 계약이 체결됩니다.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-xs text-left space-y-1.5 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">확정 제안 단가:</span>
                  <strong className="text-red-700">
                    {selectedProposalForConfirm.proposal.proposalPricePerKg.toLocaleString()}원/kg
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">포장 및 배송:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedProposalForConfirm.proposal.packagingType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">정산 방식:</span>
                  <span className="text-emerald-700 font-bold">출고 실계량 차액 자동 정산</span>
                </div>
              </div>

              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setSelectedProposalForConfirm(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-600"
                >
                  취소
                </button>
                <button
                  onClick={() => handleAcceptProposal(selectedProposalForConfirm.proposal.id)}
                  className="px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  전자 계약 승인 및 최종 발주 확정
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
