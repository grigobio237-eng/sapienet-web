import { ShieldCheck, Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-10 px-4 sm:px-8 mt-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Legal Disclaimer Box as required by Master Intent */}
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 flex items-start gap-3">
          <Info className="text-red-400 shrink-0 mt-0.5" size={18} />
          <div className="space-y-1 text-slate-300">
            <p className="font-semibold text-white">사피에넷 무재고 직거래 및 법적 책임 고지 (Master Intent 00조/08조)</p>
            <p className="text-slate-400 leading-relaxed">
              사피에넷(SAPIENET · sapienet.com)은 축산물 재고를 직접 보유하지 않는 무재고 B2B 직거래 및 C2B2C 셰프 소분 중개 플랫폼입니다. 등록된 육류 상품의 소유, 가격 결정, 품질 보증, 보관 및 출고·물류 배송의 법적 책임은 등록된 도축장·가공장 및 판매자에게 귀속됩니다. 플랫폼은 거래 기록 원장 관리, 표준 규격 적용 및 분쟁 중개 지원을 담당합니다.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              SAPIENET
              <span className="text-xs font-normal text-slate-400 px-2 py-0.5 bg-slate-800 rounded">sapienet.com</span>
            </div>

            {/* 법적 필수 링크 모음 */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
              <a href="/policy/terms" className="hover:text-white underline underline-offset-2">이용약관</a>
              <span className="text-slate-600">|</span>
              <a href="/policy/privacy" className="hover:text-white underline underline-offset-2 text-amber-400">개인정보처리방침</a>
              <span className="text-slate-600">|</span>
              <a href="/policy/refund" className="hover:text-white underline underline-offset-2">반품/계량정산규정</a>
              <span className="text-slate-600">|</span>
              <a href="/cs" className="hover:text-white underline underline-offset-2 text-blue-400">고객센터(CS)</a>
              <span className="text-slate-600">|</span>
              <a href="/cs/notice" className="hover:text-white underline underline-offset-2">공지사항</a>
              <span className="text-slate-600">|</span>
              <a href="/cs/faq" className="hover:text-white underline underline-offset-2">FAQ</a>
            </div>

            <p className="text-slate-400">
              (주)사피에넷 | 사업자등록번호: 211-88-92019 | 통신판매업신고: 2026-서울강남-01928호 | 대표: 홍사피 | 개인정보보호책임자: 홍사피
            </p>
            <p className="text-slate-400">
              사업장 소재지: 서울특별시 강남구 테헤란로 123 사피에타워 8층 | 이메일: support@sapienet.com
            </p>
            <p className="text-slate-500">
              고객센터 & 분쟁중개센터: <strong>1588-0000</strong> (평일 09:00 ~ 18:00 / 도매·BWT·클레임 직통)
            </p>
          </div>

          <div className="text-slate-400 text-xs md:text-right space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 md:justify-end text-emerald-400 font-semibold">
              <ShieldCheck size={16} /> 토스페이먼츠 에스크로 구매안전서비스
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              고객님의 안전거래를 위해 현금 결제 시 토스페이먼츠 에스크로 구매안전 서비스를 적용하고 있습니다.
            </p>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-800">
              © 2026 SAPIENET Inc. All rights reserved. | 축산물품질평가원(EKAPE) 실시간 시세 연동
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
