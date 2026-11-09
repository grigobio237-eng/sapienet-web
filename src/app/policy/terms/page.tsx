import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function TermsPage() {
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
          <Shield className="text-red-500 w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-white">사피에넷 미트 서비스 이용약관</h1>
            <p className="text-xs text-slate-400 mt-1">시행일자: 2026년 11월 1일 (최신 개정)</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">제1조 (목적)</h2>
            <p>
              본 약관은 (주)사피에넷(이하 &apos;회사&apos;)이 운영하는 무재고 축산물 직거래 플랫폼 사피에넷 미트(이하 &apos;플랫폼&apos;)에서 제공하는 도소매 전자상거래 및 수발주 ERP 중개 서비스(이하 &apos;서비스&apos;)를 이용함에 있어 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">제2조 (통신판매중개자 및 무재고 플랫폼의 법적 성격)</h2>
            <p>
              1. 회사는 축산물의 통신판매중개자로서 거래 당사자 간의 원활한 거래를 지원하기 위한 시스템(표준 규격 매칭, 거래 원장, 실중량 정산 승인, 분쟁 조정)만을 제공합니다.<br />
              2. 등록된 축산물 원박스 및 소분 가공 상품의 소유권, 보관, 가공, 품질보증, 출고 및 배송의 모든 법적 책임은 해당 상품을 등록하고 출고한 공급자(도축장, 가공장, 유통사) 및 소매점주에게 있습니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">제3조 (축산물 근량 실계량 정산 원칙)</h2>
            <p>
              1. B2B 원박스 축산물은 개체별 실중량 차이가 발생하는 특성이 있으므로, 최초 주문 시 기준 중량에 따른 예치 결제금을 선결제합니다.<br />
              2. 공급자의 공인 계량표에 기반하여 출고 실중량이 확정되면, 기준 중량과의 오차에 따라 차액은 자동으로 추가 청구되거나 즉시 환불 처리됩니다.<br />
              3. 정산 완료 후 정산 원장에 기재된 최종 확정 금액으로 국세청 전자세금계산서 또는 현금영수증이 발급됩니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">제4조 (회원의 의무 및 자격 심사)</h2>
            <p>
              1. B2B 식당 점주 및 도매 공급자는 가입 시 유효한 사업자등록증 및 인허가 서류(축산물가공업/유통업 허가증, HACCP 인증서)를 제공하여야 하며, 국세청 및 공공기관 API를 통한 검증을 거쳐야 합니다.<br />
              2. 허위 정보 기재 또는 타인의 명의를 도용한 경우 이용 자격이 즉시 정지되며 법적 제재를 받을 수 있습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
