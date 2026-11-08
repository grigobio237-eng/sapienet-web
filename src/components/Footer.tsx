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
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              SAPIENET
              <span className="text-xs font-normal text-slate-400 px-2 py-0.5 bg-slate-800 rounded">sapienet.com</span>
            </div>
            <p className="text-slate-400">
              (주)사피에넷 | 사업자등록번호: 211-88-92019 | 대표: 홍사피 | 서울시 강남구 테헤란로 123 사피에타워 8층
            </p>
            <p className="text-slate-500 mt-1">고객센터 & 분쟁중개센터: 1588-0000 | 평일 09:00 ~ 18:00 (도매 및 BWT 문의 포함)</p>
          </div>

          <div className="text-slate-500 text-right md:text-left">
            <p>© 2026 SAPIENET Inc. All rights reserved.</p>
            <p className="text-[11px] text-slate-600 mt-1">축산물품질평가원(EKAPE) 실시간 도매 시세 API 공식 연동 플랫폼</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
