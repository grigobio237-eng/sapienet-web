import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPage() {
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
          <Lock className="text-emerald-500 w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-white">사피에넷 미트 개인정보 처리방침</h1>
            <p className="text-xs text-slate-400 mt-1">시행일자: 2026년 11월 1일</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">1. 수집하는 개인정보 항목 및 수집방법</h2>
            <p>
              회사는 B2B 도매 거래 및 B2C 소매 배송, 세금계산서 발행을 위해 다음의 개인정보를 수집합니다.<br />
              - <strong>사업자 회원</strong>: 상호명, 대표자명, 사업자등록번호, 사업장 주소, 대표 연락처, 세금계산서 담당자 이메일, 사업자등록증 이미지<br />
              - <strong>도매 공급자</strong>: 상호명, 대표자명, 축산물 인허가번호, 정산 계좌번호, 예금주명<br />
              - <strong>개인 구매자</strong>: 실명, 휴대폰번호, 본인인증 CI/DI 값, 배송지 주소, 결제 정보
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">2. 개인정보의 수집 및 이용목적</h2>
            <p>
              - 회원 자격 식별 및 국세청 API 사업자 진위 확인<br />
              - B2B 발주 중개, RFQ 비딩 매칭, 냉동탑차 직배송 및 BWT 창고 명의이전 지원<br />
              - 실중량 계량 차액 정산, 국세청 전자세금계산서 발행 및 현금영수증 발급<br />
              - 분쟁 중개 및 고객 지원 (CS)
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">3. 개인정보의 보유 및 이용기간</h2>
            <p>
              전자상거래 등에서의 소비자보호에 관한 법률, 국세기본법 등 관련 법령의 규정에 따라 일정 기간 보존합니다.<br />
              - 계약 또는 청약철회 등에 관한 기록: 5년<br />
              - 대금결제 및 재화 등의 공급에 관한 기록: 5년<br />
              - 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">4. 개인정보 보호책임자</h2>
            <p>
              - 책임자: 홍사피 (보안최고책임자)<br />
              - 연락처: privacy@sapienet.com / 1588-0000
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
