import Link from 'next/link';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> 홈으로 돌아가기
        </Link>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
          <RefreshCw className="text-amber-500 w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-white">사피에넷 미트 반품/교환 및 계량오차 보상규정</h1>
            <p className="text-xs text-slate-400 mt-1">시행일자: 2026년 11월 1일</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800">
          <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 flex items-start gap-3 text-amber-200">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <p className="text-xs leading-relaxed">
              축산물은 신선식품 및 생물 특성상 단순 변심에 의한 반품이 제한될 수 있습니다. 단, 배송 중 변질, 진공 풀림, 명백한 스펙 불일치 또는 계량 중량 오차 발생 시 규정에 따라 즉시 100% 환불 또는 차액 정산이 보장됩니다.
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">1. 실중량 계량오차(근량 차액) 자동 정산</h2>
            <p>
              원박스 고기는 출고 시 공인 계량표 중량으로 최종 금액이 재산정됩니다.<br />
              - <strong>중량 미달 시</strong>: 기준 중량보다 적게 출고된 경우, 출고 확정 즉시 선결제 금액에서 차액이 예치금/카드 취소로 자동 환불됩니다.<br />
              - <strong>중량 초과 시</strong>: 기준 중량을 초과한 경우(허용오차 ±5% 이내), 차액이 자동 청구 정산됩니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">2. 반품 및 교환(클레임) 인정 기준</h2>
            <p>
              다음의 경우 수령 즉시(수령 후 24시간 이내) 사진을 촬영하여 고객센터 또는 주문 상세에서 클레임을 접수하시면 무상 교환 또는 전액 환불됩니다.<br />
              - 배송 과정에서 냉장/냉동 적정 온도가 유지되지 않아 고기가 변질/부패한 경우<br />
              - 진공 포장이 파손되어 오염 및 갈변이 심각하게 진행된 경우<br />
              - 주문한 이력번호, 등급(BMS), 부위 규격과 상이한 상품이 오배송된 경우
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">3. 클레임 접수 방법</h2>
            <p>
              - 식당 점주 및 소매 구매자는 [발주·내역 관리] &gt; [해당 주문 클레임 접수] 버튼을 통해 박스 라벨(이력번호), 고기 상태, 체감 온도계 사진을 첨부하여 신청합니다.<br />
              - 관리자 분쟁중개센터에서 영업일 기준 4시간 이내 검수 후 공급자와 협의하여 즉시 환불 판결을 내립니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
