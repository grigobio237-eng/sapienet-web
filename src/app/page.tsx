'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Store,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Layers,
  FileSpreadsheet,
  UploadCloud,
  FileCheck,
  Sparkles,
  Building2,
  Lock,
  LogIn,
  UserCheck,
  X,
  Phone,
  MessageCircle,
  ChefHat,
  Search,
  Award,
  Scale,
  Receipt,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  Flame,
  Package,
  Printer,
  BadgePercent,
  Check,
  ShoppingCart,
  SlidersHorizontal,
} from 'lucide-react';

export default function LandingGatePage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRole, setAuthRole] = useState<'RETAIL' | 'BUYER' | 'SUPPLIER'>('BUYER');

  // Mode: LOGIN or SIGNUP_WIZARD
  const [authMode, setAuthMode] = useState<'LOGIN' | 'WIZARD'>('LOGIN');

  // Wizard Steps (for Buyer & Supplier)
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [isVerifyingOcr, setIsVerifyingOcr] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  // Form states
  const [buyerForm, setBuyerForm] = useState({
    companyName: '하남돼지집 강남역삼점',
    businessNumber: '120-81-49201',
    representativeName: '홍길동',
    storeAddress: '서울시 강남구 테헤란로 123 1층',
  });

  const [supplierForm, setSupplierForm] = useState({
    companyName: '(주)도드람축산가공',
    permitNumber: '경기-2022-유통-0891',
    bank: '농협 301-4561-789012',
    legalAgree: false,
  });

  const [retailSignupForm, setRetailSignupForm] = useState({
    realName: '',
    phoneNumber: '',
    email: '',
    password: '',
    deliveryAddress: '',
    agreeTerms: true,
  });
  const [retailSignupSuccess, setRetailSignupSuccess] = useState(false);
  const [loginToast, setLoginToast] = useState<{ show: boolean; user: string; role: string; destination: string } | null>(null);

  // 축산물 이력조회 인터랙티브 데모 상태
  const [traceInput, setTraceInput] = useState('002198450123');
  const [isSearchingTrace, setIsSearchingTrace] = useState(false);
  const [traceResult, setTraceResult] = useState<any>({
    traceNumber: '002198450123',
    itemType: '돼지고기 (한돈 삼겹살 원박스)',
    grade: '1+ 등급 (A)',
    slaughterHouse: '도드람안성공판장',
    slaughterDate: '2026. 11. 07 (도축 24시간 이내)',
    origin: '국내산 (경기 안성)',
    farmer: '도드람 107호 안심농가',
    safetyCert: 'HACCP 위해요소중점관리 인증 완료',
  });

  const handleSearchTrace = (num: string) => {
    setTraceInput(num);
    setIsSearchingTrace(true);
    setTimeout(() => {
      setIsSearchingTrace(false);
      if (num === '002198450992') {
        setTraceResult({
          traceNumber: '002198450992',
          itemType: '소고기 (한우 안심/채끝 웻에이징)',
          grade: '1++ (No.8 BMS 최상급)',
          slaughterHouse: '농협음성축산물공판장',
          slaughterDate: '2026. 11. 06 (도축 48시간 이내)',
          origin: '국내산 (충북 음성)',
          farmer: '안성마춤 한우 명인농가',
          safetyCert: '무항생제 축산물 & HACCP 인증 완료',
        });
      } else {
        setTraceResult({
          traceNumber: '002198450123',
          itemType: '돼지고기 (한돈 삼겹살 원박스)',
          grade: '1+ 등급 (도드람 프리미엄)',
          slaughterHouse: '도드람안성공판장',
          slaughterDate: '2026. 11. 07 (도축 24시간 이내)',
          origin: '국내산 (경기 안성)',
          farmer: '도드람 107호 안심농가',
          safetyCert: 'HACCP 위해요소중점관리 인증 완료',
        });
      }
    }, 600);
  };

  // 현재 사이트 구축 단계용 모의 로그인 라우팅 (test1: 개인소매, test2: 식당점주, test3: 도매공급자)
  const handleSimulateLogin = (testUserId: string, roleName: string, targetPath: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sapienet_active_user', testUserId);
      localStorage.setItem('sapienet_active_role', roleName);
    }
    setLoginToast({
      show: true,
      user: testUserId,
      role: roleName,
      destination: targetPath,
    });
    setTimeout(() => {
      setShowAuthModal(false);
      router.push(targetPath);
    }, 700);
  };

  const handleSimulateOcr = () => {
    setIsVerifyingOcr(true);
    setTimeout(() => {
      setIsVerifyingOcr(false);
      setOcrSuccess(true);
    }, 1000);
  };

  const handleCompleteBuyerWizard = () => {
    setWizardStep(3); // 심사 접수 및 승인 단계
  };

  const handleCompleteSupplierWizard = () => {
    setWizardStep(3); // 심사 접수 및 승인 단계
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900">
      {/* ========================================================================= */}
      {/* 1. 상단 글로벌 네비게이션 헤더 */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-xs shadow-red-500 animate-pulse"></span>
              <div>
                <span className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                  SAPIENET
                </span>
                <span className="text-[10px] text-slate-400 font-bold block sm:inline leading-tight">
                  B2B 도매 · B2C 새벽배송 · C2B2C 셰프소분 통합 허브
                </span>
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-300">
              <Link
                href="/retail"
                className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 text-purple-300"
              >
                <span>🥩 개인 소매몰 (새벽배송)</span>
                <span className="text-[9px] bg-purple-900/80 text-purple-200 px-1.5 py-0.2 rounded-full border border-purple-700">
                  5,000P
                </span>
              </Link>
              <Link
                href="/retail"
                className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <span>🧑‍🍳 동네맛집 셰프소분관</span>
              </Link>
              <Link
                href="/buyer"
                className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 text-red-300"
              >
                <span>🏪 식당 점주 ERP</span>
                <span className="text-[9px] bg-red-950 text-red-300 px-1.5 py-0.2 rounded border border-red-800">
                  실측정산
                </span>
              </Link>
              <Link
                href="/supplier"
                className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 text-amber-300"
              >
                <span>🏭 도매 공급자 허브</span>
              </Link>
            </nav>
          </div>

          {/* 우측 빠른 진입 버튼 & 로그인 모달 트리거 */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/retail"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700/80 hover:bg-purple-600 text-white font-extrabold text-xs transition-transform active:scale-95 shadow-sm"
            >
              <ShoppingCart size={14} />
              <span>소매 쇼핑몰 가기</span>
            </Link>

            <button
              onClick={() => {
                setShowAuthModal(true);
                setAuthMode('LOGIN');
              }}
              className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-950/60 transition-all hover:scale-105 cursor-pointer"
            >
              <LogIn size={15} />
              <span>로그인 / 역할 체험</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. 메인 히어로 섹션 (하이브리드 B2B / B2C / C2B2C) */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white border-b border-slate-800 relative overflow-hidden">
        {/* 은은한 배경 그라데이션 원형 광채 */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-16 sm:pt-20 pb-16 text-center space-y-6 relative z-10">
          {/* 상단 통합 배지 */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-slate-200 border border-white/20 text-xs font-semibold shadow-inner">
            <Sparkles size={14} className="text-amber-400" />
            <span>축산물 도매 B2B · 개인 식탁 B2C · 셰프 소분 C2B2C 통합 생태계</span>
          </div>

          {/* 메인 헤드라인 */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            도축장에서 식당 주방으로,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-purple-300">
              셰프의 비법 손질에서 당신의 식탁으로.
            </span>
          </h1>

          {/* 서브 카피 */}
          <p className="max-w-3xl mx-auto text-slate-300 text-xs sm:text-base leading-relaxed">
            중간 유통 마진을 걷어내고, <strong>축평원 100% 이력번호 검증</strong>과 
            <strong> 원박스 공인 실측 근량 정산</strong>으로<br className="hidden sm:inline" />
            식당 점주에게는 <strong className="text-red-300">원가 절감과 셰프 소분팩 부가수익</strong>을,
            개인 소비자에게는 <strong className="text-purple-300">5,000P 혜택과 도축장 직송 새벽배송</strong>을 제공합니다.
          </p>

          {/* 3대 페르소나 바로가기 카드 (히어로 인터랙티브 카드) */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            {/* 1. 개인 소매 구매자 카드 */}
            <Link
              href="/retail"
              className="p-5 rounded-2xl bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/50 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                    B2C 개인 소매몰
                  </span>
                  <span className="text-[11px] font-bold text-purple-300">신규 5,000P</span>
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-purple-200 transition-colors flex items-center gap-1">
                  <span>도축장 직송 새벽배송</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  도축 48h 이내 신선육 내일 아침 7시 도착. 스테이크, 바베큐 맞춤 스마트 AI 탐색.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-purple-800/50 flex items-center justify-between text-[11px] text-purple-300 font-semibold">
                <span>소분 스킨팩 쇼핑하기</span>
                <span className="text-xs font-bold text-white">바로가기 →</span>
              </div>
            </Link>

            {/* 2. 식당 점주 카드 */}
            <Link
              href="/buyer"
              className="p-5 rounded-2xl bg-red-950/60 hover:bg-red-900/70 border border-red-500/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/50 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-600 text-white">
                    B2B 식당 점주 ERP
                  </span>
                  <span className="text-[11px] font-bold text-red-300">실측정산 D+1</span>
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-red-200 transition-colors flex items-center gap-1">
                  <span>원박스 도매 & 팩 판매</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-red-200/80 leading-relaxed">
                  원박스 1-Click 발주, 공인 계량 차액 1원단위 자동 환불, 셰프 수제소분팩 B2C 판매.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-red-800/50 flex items-center justify-between text-[11px] text-red-300 font-semibold">
                <span>점주 대시보드 열기</span>
                <span className="text-xs font-bold text-white">바로가기 →</span>
              </div>
            </Link>

            {/* 3. 도매 공급자 카드 */}
            <Link
              href="/supplier"
              className="p-5 rounded-2xl bg-amber-950/60 hover:bg-amber-900/70 border border-amber-500/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/50 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-600 text-white">
                    B2B 도매 공급자 허브
                  </span>
                  <span className="text-[11px] font-bold text-amber-300">BWT 보세창고</span>
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-amber-200 transition-colors flex items-center gap-1">
                  <span>가공장 출고 & WebP 등록</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  모바일 현장 사진 WebP 자동 압축 등록, 축평원 12자리 이력번호 연동, D+1 익일 정산.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-800/50 flex items-center justify-between text-[11px] text-amber-300 font-semibold">
                <span>공급자 허브 열기</span>
                <span className="text-xs font-bold text-white">바로가기 →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 축평원 eKaPe 100% 축산물 이력추적 원클릭 검증 체험기 (신뢰의 핵심) */}
      {/* ========================================================================= */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <ShieldCheck size={14} />
                  축산물품질평가원(eKaPe) 공인 API 실시간 연동
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-2">
                  100% 축산물 이력추적 검증 시스템
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  사피에넷의 모든 고기는 12자리 이력번호로 도축장, 등급, 사육 농가, 도축일자가 투명하게 보증됩니다.
                </p>
              </div>

              {/* 샘플 이력번호 원클릭 테스트 버튼 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">예시 이력번호:</span>
                <button
                  type="button"
                  onClick={() => handleSearchTrace('002198450123')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    traceInput === '002198450123'
                      ? 'bg-red-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300'
                  }`}
                >
                  한돈 삼겹살
                </button>
                <button
                  type="button"
                  onClick={() => handleSearchTrace('002198450992')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    traceInput === '002198450992'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300'
                  }`}
                >
                  1++ 한우 안심
                </button>
              </div>
            </div>

            {/* 이력번호 검색 바 */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={traceInput}
                  onChange={(e) => setTraceInput(e.target.value)}
                  placeholder="축산물 이력추적번호 12자리를 입력하세요"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-mono text-sm placeholder:text-slate-400 focus:bg-white focus:text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 transition-all font-bold"
                />
                <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              </div>

              <button
                type="button"
                onClick={() => handleSearchTrace(traceInput)}
                disabled={isSearchingTrace}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSearchingTrace ? (
                  <>
                    <Clock size={16} className="animate-spin" />
                    <span>축평원 검증 중...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>이력정보 실시간 검증</span>
                  </>
                )}
              </button>
            </div>

            {/* 검증 결과 카드 */}
            {traceResult && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs animate-in fade-in">
                <div>
                  <span className="text-slate-400 block text-[11px]">품목 / 규격</span>
                  <strong className="text-white text-sm mt-0.5 block">{traceResult.itemType}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">공인 판정 등급</span>
                  <strong className="text-amber-400 text-sm mt-0.5 block">{traceResult.grade}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">도축장 / 도축일</span>
                  <strong className="text-white text-sm mt-0.5 block">{traceResult.slaughterHouse}</strong>
                  <span className="text-[10px] text-emerald-400">{traceResult.slaughterDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">안전 위생 인증</span>
                  <strong className="text-emerald-300 text-sm mt-0.5 block">{traceResult.safetyCert}</strong>
                  <span className="text-[10px] text-slate-400">{traceResult.farmer}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. 사피에넷 3대 핵심 혁신 가치 (B2C 새벽배송 / C2B2C 셰프소분 / B2B 실측정산) */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-red-600 tracking-wider uppercase">
            SAPIENET TRI-PILLAR INNOVATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            사피에넷(SAPIENET)이 바꾸는 축산물 유통의 3대 혁신
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            생산자부터 식당, 그리고 개인 소비자의 식탁까지 단절되었던 유통 사슬을 데이터와 신뢰로 연결합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 혁신 1: B2C 소매몰 & 스마트 탐색 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <ShoppingCart size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  B2C 개인 소매 혁신
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  도축장 직송 초신선육 새벽배송 & AI 스마트 탐색
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                도축 48시간 이내 신선육을 산지에서 새벽에 직접 썰어 <strong>내일 아침 7시 문 앞 배송</strong>합니다.
                어려운 부위명 없이 스테이크, 캠핑, 다이어트 등 요리 목적과 인원수만 고르면 최적의 고기를 추천합니다.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700">신규 가입 5,000P 지급</span>
              <Link href="/retail" className="text-xs font-bold text-slate-900 hover:text-purple-700 flex items-center gap-1">
                <span>쇼핑몰 보기</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* 혁신 2: C2B2C 셰프 수제소분관 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center">
                <ChefHat size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                  C2B2C 하이브리드 혁신
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  동네 맛집 & 셰프의 수제 소분 팩 유통
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                하남돼지집 등 식당 점주가 원박스 고기를 매장 비법으로 <strong>2.5cm 두툼 컷팅 & 300번 칼집</strong>을 내어
                소분팩으로 등록합니다. 소비자는 <strong>퇴근길 매장 방문 픽업 시 1,000원 추가 할인</strong> 혜택을 받습니다.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-red-700">점주 재고부담 0%</span>
              <Link href="/buyer/packs" className="text-xs font-bold text-slate-900 hover:text-red-700 flex items-center gap-1">
                <span>팩 판매 등록</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* 혁신 3: B2B 100% 실측정산 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Scale size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  B2B 점주 공정거래 혁신
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  100% 공인 실측 근량(Catch Weight) 차액 정산
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                박스마다 다른 실중량(BWT) 오차를 출고 즉시 자동 계량표로 확인하고, 
                <strong>1원 단위까지 D+1 영업일에 점주 환불 계좌로 자동 입금</strong>합니다.
                국세청 세금계산서 월말 자동 합산 발행으로 세무 업무를 자동화합니다.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700">D+1 자동 입금 보장</span>
              <Link href="/buyer" className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center gap-1">
                <span>점주 ERP 보기</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. 소매몰 실시간 인기 큐레이션 쇼케이스 */}
      {/* ========================================================================= */}
      <section className="py-16 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="text-red-600 fill-red-600" size={18} />
                <h2 className="text-2xl font-black text-slate-950">
                  소매몰 실시간 베스트 & 셰프 소분 팩
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                도축장 직송 한우·한돈 및 동네 유명 식당 셰프가 직접 손질한 수제 소분팩을 만나보세요.
              </p>
            </div>

            <Link
              href="/retail"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-extrabold text-xs shadow-md transition-colors"
            >
              <span>소매몰 전체 상품 보기</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
            {/* 상품 1: 하남돼지집 비법칼집 삼겹살 */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group">
              <div>
                <div className="relative aspect-4/3 rounded-2xl bg-slate-900 flex items-center justify-center text-4xl overflow-hidden mb-3">
                  <span>🥓</span>
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-red-600 text-white">
                    식당수제
                  </span>
                  <span className="absolute bottom-2 right-2 text-[9px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded">
                    500g 진공스킨팩
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-purple-800 text-[11px]">하남돼지집 강남역삼점</span>
                  <h4 className="font-black text-slate-900 text-sm leading-snug">
                    비법 칼집 생삼겹살 500g
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    2.5cm 두툼 컷팅 & 300번 정밀 다이아몬드 칼집
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-black text-slate-950">14,900원</span>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded">
                    픽업 시 -1,000원
                  </span>
                </div>
                <Link
                  href="/retail"
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center block"
                >
                  구매하러 가기
                </Link>
              </div>
            </div>

            {/* 상품 2: 초신선 한돈 삼겹살 */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group">
              <div>
                <div className="relative aspect-4/3 rounded-2xl bg-slate-900 flex items-center justify-center text-4xl overflow-hidden mb-3">
                  <span>🥩</span>
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-purple-700 text-white">
                    도축 직송
                  </span>
                  <span className="absolute bottom-2 right-2 text-[9px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded">
                    600g (한 근)
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-purple-800 text-[11px]">도드람한돈</span>
                  <h4 className="font-black text-slate-900 text-sm leading-snug">
                    초신선 1+ 한돈 삼겹살 2cm 구이용
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    도축 48시간 이내 냉장 직송 스킨팩
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-black text-slate-950">15,900원</span>
                  <span className="text-[10px] text-emerald-700 font-bold">내일 아침 7시 도착</span>
                </div>
                <Link
                  href="/retail"
                  className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-center block"
                >
                  구매하러 가기
                </Link>
              </div>
            </div>

            {/* 상품 3: 1++ 한우 안심 */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group">
              <div>
                <div className="relative aspect-4/3 rounded-2xl bg-slate-900 flex items-center justify-center text-4xl overflow-hidden mb-3">
                  <span>🥩</span>
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-600 text-white">
                    1++ No.9
                  </span>
                  <span className="absolute bottom-2 right-2 text-[9px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded">
                    300g (2팩)
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-purple-800 text-[11px]">농협안심한우 (음성공판장)</span>
                  <h4 className="font-black text-slate-900 text-sm leading-snug">
                    홈파티 1++ 한우 안심 두툼 스테이크
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    3cm 두툼 컷팅 & 웻에이징 7일 숙성
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-black text-slate-950">36,000원</span>
                  <span className="text-[10px] text-purple-700 font-bold">5,000P 할인 적용</span>
                </div>
                <Link
                  href="/retail"
                  className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-center block"
                >
                  구매하러 가기
                </Link>
              </div>
            </div>

            {/* 상품 4: 하남돼지집 1++ 한우 큐브 채끝등심 */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group">
              <div>
                <div className="relative aspect-4/3 rounded-2xl bg-slate-900 flex items-center justify-center text-4xl overflow-hidden mb-3">
                  <span>🍖</span>
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-red-600 text-white">
                    식당수제
                  </span>
                  <span className="absolute bottom-2 right-2 text-[9px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded">
                    300g 큐브
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-purple-800 text-[11px]">하남돼지집 마스터셰프</span>
                  <h4 className="font-black text-slate-900 text-sm leading-snug">
                    1++ 한우 웻에이징 깍둑 채끝등심
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    저온숙성고 14일 숙성 후 한입 큐브 손질
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-black text-slate-950">32,000원</span>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded">
                    픽업 시 -1,000원
                  </span>
                </div>
                <Link
                  href="/retail"
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center block"
                >
                  구매하러 가기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. B2B 식당 점주 & 도매 공급자 특화 도구 안내 */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            식당 점주와 도매 공급자를 위한 전문 B2B ERP 도구
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            단순 중개를 넘어 거래 전 과정을 자동화하고 사업자의 세무·물류 비용을 획기적으로 줄여드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <FileSpreadsheet size={18} />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">맞춤 대량 조건요청 (RFQ)</h4>
            <p className="text-slate-500 leading-relaxed">
              원하는 수량, 단가, 세절방식을 제시하면 전국 1차가공장들이 Side-by-Side 맞춤 견적을 역경매로 제안합니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingDown size={18} />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">내 고기 경제실 & 영수증 OCR</h4>
            <p className="text-slate-500 leading-relaxed">
              외부 거래처 영수증까지 사진 한 장으로 업로드해 축평원 시장 시세와 실시간 비교 분석 가이드를 제공합니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Printer size={18} />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">식품위생법 라벨 원클릭 출력</h4>
            <p className="text-slate-500 leading-relaxed">
              소분 팩 등록 즉시 이력번호와 가공일자, 소비기한이 포함된 표준 규격 라벨 스티커를 1초 만에 인쇄합니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Receipt size={18} />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">국세청 전자세금계산서 자동화</h4>
            <p className="text-slate-500 leading-relaxed">
              매월 말일 번거로운 전표 정리 없이 홈택스로 합산 전자세금계산서를 자동 발행하고 이메일로 전송합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. 하단 푸터 (Footer) */}
      {/* ========================================================================= */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 px-4 sm:px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span className="font-black text-base text-white">SAPIENET</span>
              <span className="text-[10px] text-slate-500">sapienet.com</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              (주)사피에넷 · 대표이사: 홍길동 · 사업자등록번호: 120-81-49201<br />
              통신판매업신고: 제2026-서울강남-0142호 · 축산물유통판매업 허가: 경기-2022-유통-0891
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <Link href="/retail" className="hover:text-white transition-colors">개인 소매몰</Link>
            <Link href="/buyer" className="hover:text-white transition-colors">식당 점주 ERP</Link>
            <Link href="/buyer/packs" className="hover:text-white transition-colors">셰프 소분팩 관리</Link>
            <Link href="/supplier" className="hover:text-white transition-colors">도매 공급자 허브</Link>
            <Link href="/retail/settings" className="hover:text-white transition-colors">환경설정</Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-600">
          <p>© 2026 SAPIENET Inc. All Rights Reserved. (sapienet.com)</p>
          <p>축산물이력제 공인 API 연동 및 콜드체인 안심배송 보증</p>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 로그인 / 온보딩 통합 모달 (Auth & Onboarding Modal) */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          {/* Toast Notification */}
          {loginToast?.show && (
            <div className="fixed top-8 z-60 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-sm">
                ✓
              </div>
              <div className="text-left text-xs">
                <p className="font-extrabold text-emerald-400">
                  [{loginToast.user}] {loginToast.role} 로그인 성공!
                </p>
                <p className="text-slate-300 text-[11px]">
                  전용 작업 페이지({loginToast.destination})로 즉시 이동합니다...
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button
              onClick={() => {
                setShowAuthModal(false);
                setWizardStep(1);
                setOcrSuccess(false);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={22} />
            </button>

            {/* Modal Title */}
            <div className="text-center space-y-1 pt-2">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                SAPIENET GATEWAY
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                플랫폼 로그인 & 자격 인증
              </h2>
              <p className="text-xs text-slate-500">
                이용하실 페르소나 역할을 선택해 주세요.
              </p>
            </div>

            {/* 3대 페르소나 선택 탭 */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-bold text-center">
              <button
                onClick={() => {
                  setAuthRole('RETAIL');
                  setAuthMode('LOGIN');
                  setWizardStep(1);
                }}
                className={`py-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  authRole === 'RETAIL'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 size={18} />
                <span>개인 소매 구매자</span>
              </button>

              <button
                onClick={() => {
                  setAuthRole('BUYER');
                  setAuthMode('LOGIN');
                  setWizardStep(1);
                }}
                className={`py-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  authRole === 'BUYER'
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store size={18} />
                <span>식당 / 사업자 점주</span>
              </button>

              <button
                onClick={() => {
                  setAuthRole('SUPPLIER');
                  setAuthMode('LOGIN');
                  setWizardStep(1);
                }}
                className={`py-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  authRole === 'SUPPLIER'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck size={18} />
                <span>도매 공급자</span>
              </button>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* 1. 개인 소매 구매자 (로그인 vs 신규 회원가입) */}
            {/* ------------------------------------------------------------- */}
            {authRole === 'RETAIL' && (
              <div className="space-y-4 py-1">
                {/* Login vs Signup Toggle */}
                <div className="flex border-b border-slate-200 text-xs">
                  <button
                    onClick={() => {
                      setAuthMode('LOGIN');
                      setRetailSignupSuccess(false);
                    }}
                    className={`flex-1 py-2 font-bold border-b-2 transition-colors ${
                      authMode === 'LOGIN'
                        ? 'border-purple-700 text-purple-700'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    기존 회원 로그인
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('WIZARD');
                      setRetailSignupSuccess(false);
                    }}
                    className={`flex-1 py-2 font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                      authMode === 'WIZARD'
                        ? 'border-purple-700 text-purple-700'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span>신규 회원가입</span>
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                      5,000P
                    </span>
                  </button>
                </div>

                {/* Case A: 기존 회원 로그인 */}
                {authMode === 'LOGIN' && (
                  <div className="space-y-3">
                    <div className="bg-purple-50/70 border border-purple-200/70 rounded-xl p-2.5 text-center text-[11px] text-purple-900">
                      <span className="font-extrabold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded mr-1">테스트 안내</span>
                      소셜/간편 로그인 클릭 시 <strong className="font-bold underline text-purple-900">test1 (개인 이용자)</strong> 계정으로 즉시 소매관에 연결됩니다.
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleSimulateLogin('test1', '개인 소매 구매자', '/retail')}
                        className="w-full py-3.5 px-4 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
                      >
                        <MessageCircle size={18} className="fill-[#191919]" />
                        <span>카카오 1초 간편 로그인 (test1)</span>
                      </button>

                      <button
                        onClick={() => handleSimulateLogin('test1', '개인 소매 구매자', '/retail')}
                        className="w-full py-3.5 px-4 bg-[#03C75A] hover:bg-[#02b351] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
                      >
                        <span className="font-extrabold text-sm">N</span>
                        <span>네이버 아이디로 로그인 (test1)</span>
                      </button>

                      <button
                        onClick={() => handleSimulateLogin('test1', '개인 소매 구매자', '/retail')}
                        className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-2.5 border border-slate-300 shadow-xs transition-transform active:scale-98"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Google 계정으로 로그인 (test1)</span>
                      </button>

                      <button
                        onClick={() => handleSimulateLogin('test1', '개인 소매 구매자', '/retail')}
                        className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-transform active:scale-98"
                      >
                        <Phone size={16} />
                        <span>휴대폰 본인인증으로 로그인 (test1)</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-center">
                      <p className="text-[11px] text-slate-500">
                        아직 사피에넷 회원이 아니신가요?{' '}
                        <button
                          onClick={() => setAuthMode('WIZARD')}
                          className="font-bold text-purple-700 underline"
                        >
                          회원가입하고 5,000P 받기
                        </button>
                      </p>
                    </div>
                  </div>
                )}

                {/* Case B: 신규 개인 회원가입 (Sign-up) */}
                {authMode === 'WIZARD' && (
                  <div className="space-y-4">
                    {/* Welcome Bonus Callout */}
                    <div className="bg-purple-50 rounded-2xl p-3.5 border border-purple-200 text-xs text-purple-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center font-extrabold text-sm shrink-0">
                        P
                      </div>
                      <div>
                        <strong className="block font-bold">신규 회원가입 축하 5,000P 지급</strong>
                        <span className="text-[11px] text-purple-700">첫 주문 즉시 현금처럼 사용 가능한 적립금을 드립니다.</span>
                      </div>
                    </div>

                    {!retailSignupSuccess ? (
                      <div className="space-y-3 text-xs">
                        {/* 1) 소셜 3초 간편 가입 */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-slate-400 block">소셜 계정으로 3초 만에 빠른 가입</span>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => {
                                setRetailSignupSuccess(true);
                              }}
                              className="py-2.5 px-2 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-2xs"
                            >
                              <MessageCircle size={15} className="fill-[#191919]" />
                              <span>카카오 가입</span>
                            </button>

                            <button
                              onClick={() => {
                                setRetailSignupSuccess(true);
                              }}
                              className="py-2.5 px-2 bg-[#03C75A] hover:bg-[#02b351] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-2xs"
                            >
                              <span className="font-extrabold text-xs">N</span>
                              <span>네이버 가입</span>
                            </button>

                            <button
                              onClick={() => {
                                setRetailSignupSuccess(true);
                              }}
                              className="py-2.5 px-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-slate-300 shadow-2xs"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                              </svg>
                              <span>구글 가입</span>
                            </button>
                          </div>
                        </div>

                        <div className="relative py-1 text-center">
                          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                          <span className="relative bg-white px-2 text-[10px] text-slate-400">또는 이메일 직접 가입</span>
                        </div>

                        {/* 2) 일반 정보 입력 폼 */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">성명 (실명)</label>
                            <input
                              type="text"
                              value={retailSignupForm.realName}
                              onChange={(e) => setRetailSignupForm({ ...retailSignupForm, realName: e.target.value })}
                              placeholder="홍길동"
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">휴대폰 번호</label>
                            <input
                              type="text"
                              value={retailSignupForm.phoneNumber}
                              onChange={(e) => setRetailSignupForm({ ...retailSignupForm, phoneNumber: e.target.value })}
                              placeholder="010-1234-5678"
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">이메일 아이디</label>
                          <input
                            type="email"
                            value={retailSignupForm.email}
                            onChange={(e) => setRetailSignupForm({ ...retailSignupForm, email: e.target.value })}
                            placeholder="user@example.com"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">비밀번호 (8자 이상)</label>
                          <input
                            type="password"
                            value={retailSignupForm.password}
                            onChange={(e) => setRetailSignupForm({ ...retailSignupForm, password: e.target.value })}
                            placeholder="비밀번호 설정"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">기본 배송지 주소 (신선 새벽배송지)</label>
                          <input
                            type="text"
                            value={retailSignupForm.deliveryAddress}
                            onChange={(e) => setRetailSignupForm({ ...retailSignupForm, deliveryAddress: e.target.value })}
                            placeholder="서울시 서초구 반포대로 123 아파트 101동"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                          />
                        </div>

                        {/* 약관 동의 */}
                        <div className="pt-1">
                          <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-600 font-medium">
                            <input
                              type="checkbox"
                              checked={retailSignupForm.agreeTerms}
                              onChange={(e) => setRetailSignupForm({ ...retailSignupForm, agreeTerms: e.target.checked })}
                              className="rounded text-purple-700 focus:ring-purple-600"
                            />
                            <span>[필수] 만 14세 이상이며 사피에넷 이용약관 및 개인정보 처리에 동의합니다.</span>
                          </label>
                        </div>

                        <button
                          onClick={() => setRetailSignupSuccess(true)}
                          disabled={!retailSignupForm.agreeTerms}
                          className="w-full py-3.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all mt-1"
                        >
                          회원가입 완료하고 5,000P 받기 →
                        </button>
                      </div>
                    ) : (
                      /* 가입 완료 축하 화면 */
                      <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200 text-center space-y-3">
                        <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                          <CheckCircle2 size={32} />
                        </div>
                        <h4 className="font-extrabold text-base text-slate-900">
                          사피에넷(SAPIENET) 회원가입이 완료되었습니다!
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          신규 가입 축하 <strong>5,000P 적립금</strong>이 계정에 즉시 지급되었습니다. 지금 바로 명절 선물세트와 신선 소포장 축산물을 만나보세요.
                        </p>
                        <button
                          onClick={() => router.push('/retail')}
                          className="w-full py-3.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-2xl text-xs shadow-md transition-all"
                        >
                          개인 소매관 입장하기 (5,000P 사용) →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 2. 식당 점주 (기존 로그인 vs 초기 셋팅 화면 / 심사) */}
            {/* ------------------------------------------------------------- */}
            {authRole === 'BUYER' && (
              <div className="space-y-4">
                {/* Login vs Wizard Toggle */}
                <div className="flex border-b border-slate-200 text-xs">
                  <button
                    onClick={() => setAuthMode('LOGIN')}
                    className={`flex-1 py-2 font-bold border-b-2 transition-colors ${
                      authMode === 'LOGIN'
                        ? 'border-red-700 text-red-700'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    기존 점주 계정 로그인
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('WIZARD');
                      setWizardStep(1);
                    }}
                    className={`flex-1 py-2 font-bold border-b-2 transition-colors ${
                      authMode === 'WIZARD'
                        ? 'border-red-700 text-red-700'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    신규 점주 초기 셋팅 & 가입 신청
                  </button>
                </div>

                {/* Sub Mode A: 기존 점주 로그인 */}
                {authMode === 'LOGIN' && (
                  <div className="space-y-3 text-xs">
                    <div className="bg-red-50/70 border border-red-200/70 rounded-xl p-2.5 text-center text-[11px] text-red-900">
                      <span className="font-extrabold text-red-700 bg-red-100 px-1.5 py-0.5 rounded mr-1">테스트 안내</span>
                      소셜/간편 로그인 클릭 시 <strong className="font-bold underline text-red-900">test2 (식당 점주 / 하남돼지집 역삼점)</strong> 계정으로 즉시 ERP에 연결됩니다.
                    </div>

                    {/* 4대 간편 사업자 로그인 버튼 */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleSimulateLogin('test2', '식당 점주 (하남돼지집 역삼점)', '/buyer')}
                        className="w-full py-3.5 px-4 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
                      >
                        <MessageCircle size={18} className="fill-[#191919]" />
                        <span>카카오 사업자 간편 로그인 (test2)</span>
                      </button>

                      <button
                        onClick={() => handleSimulateLogin('test2', '식당 점주 (하남돼지집 역삼점)', '/buyer')}
                        className="w-full py-3.5 px-4 bg-[#03C75A] hover:bg-[#02b351] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
                      >
                        <span className="font-extrabold text-sm">N</span>
                        <span>네이버 사업자 아이디로 로그인 (test2)</span>
                      </button>

                      <button
                        onClick={() => handleSimulateLogin('test2', '식당 점주 (하남돼지집 역삼점)', '/buyer')}
                        className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-2.5 border border-slate-300 shadow-xs transition-transform active:scale-98"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Google 사업자 계정으로 로그인 (test2)</span>
                      </button>

                      <button
                        onClick={() => handleSimulateLogin('test2', '식당 점주 (하남돼지집 역삼점)', '/buyer')}
                        className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-transform active:scale-98"
                      >
                        <Phone size={16} />
                        <span>대표자 휴대폰 본인인증으로 로그인 (test2)</span>
                      </button>
                    </div>

                    {/* 전통적인 사업자번호 로그인 (접이식/보조) */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <details className="text-slate-500 cursor-pointer">
                        <summary className="text-[11px] text-center font-semibold hover:text-slate-700">
                          사업자등록번호 / 비밀번호로 직접 로그인하기 ▼
                        </summary>
                        <div className="pt-3 space-y-2.5">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">사업자등록번호</label>
                            <input
                              type="text"
                              defaultValue="120-81-49201"
                              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs"
                              placeholder="사업자등록번호 10자리"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">비밀번호</label>
                            <input
                              type="password"
                              defaultValue="••••••••"
                              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs"
                            />
                          </div>
                          <button
                            onClick={() => handleSimulateLogin('test2', '식당 점주 (하남돼지집 역삼점)', '/buyer')}
                            className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl text-xs shadow-xs"
                          >
                            사업자번호로 ERP 홈 입장 (test2)
                          </button>
                        </div>
                      </details>
                    </div>
                  </div>
                )}

                {/* Sub Mode B: 신규 점주 초기 셋팅 화면 (Onboarding Wizard) */}
                {authMode === 'WIZARD' && (
                  <div className="space-y-4">
                    {/* Step Tracker */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pb-2 border-b border-slate-100">
                      <span className={wizardStep === 1 ? 'text-red-700' : ''}>1. 매장정보 셋팅</span>
                      <span>→</span>
                      <span className={wizardStep === 2 ? 'text-red-700' : ''}>2. 사업자 서류 검증</span>
                      <span>→</span>
                      <span className={wizardStep === 3 ? 'text-red-700' : ''}>3. 심사 후 거래 확장</span>
                    </div>

                    {/* Step 1: 매장정보 입력 */}
                    {wizardStep === 1 && (
                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">식당 상호명</label>
                            <input
                              type="text"
                              value={buyerForm.companyName}
                              onChange={(e) => setBuyerForm({ ...buyerForm, companyName: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">사업자등록번호</label>
                            <input
                              type="text"
                              value={buyerForm.businessNumber}
                              onChange={(e) => setBuyerForm({ ...buyerForm, businessNumber: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">대표자명</label>
                          <input
                            type="text"
                            value={buyerForm.representativeName}
                            onChange={(e) => setBuyerForm({ ...buyerForm, representativeName: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">배송 및 매장 주소</label>
                          <input
                            type="text"
                            value={buyerForm.storeAddress}
                            onChange={(e) => setBuyerForm({ ...buyerForm, storeAddress: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                          />
                        </div>

                        <button
                          onClick={() => setWizardStep(2)}
                          className="w-full py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl text-xs shadow-xs"
                        >
                          다음: 사업자 서류 첨부 및 검증 →
                        </button>
                      </div>
                    )}

                    {/* Step 2: 서류 첨부 & OCR 검증 */}
                    {wizardStep === 2 && (
                      <div className="space-y-3 text-xs">
                        <div
                          onClick={handleSimulateOcr}
                          className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50"
                        >
                          <UploadCloud className="mx-auto text-slate-400 mb-1" size={28} />
                          <p className="font-bold text-slate-700">사업자등록증 이미지 드래그 업로드</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">클릭 시 자동 텍스트 추출 및 국세청 API 검증 시뮬레이션</p>
                        </div>

                        {isVerifyingOcr && (
                          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl flex items-center gap-2">
                            <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            국세청 API로 계속사업자 여부를 실시간 검증하고 있습니다...
                          </div>
                        )}

                        {ocrSuccess && (
                          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 space-y-1">
                            <p className="font-bold flex items-center gap-1.5">
                              <CheckCircle2 size={15} className="text-emerald-600" />
                              국세청 검증 성공 (정상 계속사업자)
                            </p>
                            <p className="text-[11px] text-emerald-700">
                              상호: {buyerForm.companyName} | 대표: {buyerForm.representativeName}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => setWizardStep(1)}
                            className="w-1/3 py-2.5 bg-slate-100 rounded-xl text-slate-600 font-semibold"
                          >
                            이전
                          </button>
                          <button
                            onClick={handleCompleteBuyerWizard}
                            disabled={!ocrSuccess}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-white transition-all ${
                              ocrSuccess ? 'bg-red-700 hover:bg-red-600' : 'bg-slate-300 cursor-not-allowed'
                            }`}
                          >
                            자격 심사 신청 완료 →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: 심사 후 거래 확장 완료 */}
                    {wizardStep === 3 && (
                      <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                          <FileCheck size={28} />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">식당 점주 자격 심사가 승인되었습니다!</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          국세청 사업자 진위 확인이 완료되어 <strong>정식 B2B 거래 권한 및 점주 ERP</strong>가 즉시 활성화되었습니다.
                        </p>
                        <button
                          onClick={() => router.push('/buyer')}
                          className="w-full py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl text-xs shadow-md"
                        >
                          식당 점주 ERP로 입장하여 발주 시작하기 →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 3. 도매 공급자 (인허가 등록 및 심사) */}
            {/* ------------------------------------------------------------- */}
            {authRole === 'SUPPLIER' && (
              <div className="space-y-4">
                <div className="flex border-b border-slate-200 text-xs">
                  <button
                    onClick={() => setAuthMode('LOGIN')}
                    className={`flex-1 py-2 font-bold border-b-2 transition-colors ${
                      authMode === 'LOGIN'
                        ? 'border-amber-600 text-amber-700'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    기존 공급자 로그인
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('WIZARD');
                      setWizardStep(1);
                    }}
                    className={`flex-1 py-2 font-bold border-b-2 transition-colors ${
                      authMode === 'WIZARD'
                        ? 'border-amber-600 text-amber-700'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    신규 도매 공급자 입점 신청
                  </button>
                </div>

                {authMode === 'LOGIN' && (
                  <div className="space-y-3 text-xs">
                    <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-2.5 text-center text-[11px] text-amber-900">
                      <span className="font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded mr-1">테스트 안내</span>
                      소셜/간편 로그인 클릭 시 <strong className="font-bold underline text-amber-900">test3 (도매 공급자 / (주)도드람축산가공)</strong> 계정으로 즉시 허브에 연결됩니다.
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleSimulateLogin('test3', '도매 공급자 ((주)도드람축산가공)', '/supplier')}
                        className="w-full py-3.5 px-4 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
                      >
                        <MessageCircle size={18} className="fill-[#191919]" />
                        <span>카카오 공급자 간편 로그인 (test3)</span>
                      </button>

                      <button
                        onClick={() => handleSimulateLogin('test3', '도매 공급자 ((주)도드람축산가공)', '/supplier')}
                        className="w-full py-3.5 px-4 bg-[#03C75A] hover:bg-[#02b351] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
                      >
                        <span className="font-extrabold text-sm">N</span>
                        <span>네이버 공급자 아이디로 로그인 (test3)</span>
                      </button>

                      <button
                        onClick={() => handleSimulateLogin('test3', '도매 공급자 ((주)도드람축산가공)', '/supplier')}
                        className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-2.5 border border-slate-300 shadow-xs transition-transform active:scale-98"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Google 공급자 계정으로 로그인 (test3)</span>
                      </button>

                      <button
                        onClick={() => handleSimulateLogin('test3', '도매 공급자 ((주)도드람축산가공)', '/supplier')}
                        className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-transform active:scale-98"
                      >
                        <Phone size={16} />
                        <span>대표자 휴대폰 본인인증으로 로그인 (test3)</span>
                      </button>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <details className="text-slate-500 cursor-pointer">
                        <summary className="text-[11px] text-center font-semibold hover:text-slate-700">
                          축산물 인허가 번호 / 비밀번호로 직접 로그인하기 ▼
                        </summary>
                        <div className="pt-3 space-y-2.5">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">인허가 번호 또는 이메일</label>
                            <input
                              type="text"
                              defaultValue="경기-2022-유통-0891"
                              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">비밀번호</label>
                            <input
                              type="password"
                              defaultValue="••••••••"
                              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs"
                            />
                          </div>
                          <button
                            onClick={() => handleSimulateLogin('test3', '도매 공급자 ((주)도드람축산가공)', '/supplier')}
                            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-xs"
                          >
                            인허가 번호로 허브 입장 (test3)
                          </button>
                        </div>
                      </details>
                    </div>
                  </div>
                )}

                {authMode === 'WIZARD' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed text-[11px]">
                      <strong>공급자 법적 책임 고지 (Master Intent 00조/08조)</strong>: 사피에넷(sapienet.com)은 무재고 운영 플랫폼입니다. 상품 소유권, 가격 결정, 재고 관리, 출고 실계량 정산 및 물류 배송의 책임은 공급자에게 귀속됩니다.
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">도축/가공장 상호</label>
                        <input
                          type="text"
                          value={supplierForm.companyName}
                          onChange={(e) => setSupplierForm({ ...supplierForm, companyName: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">축산물가공업·유통 허가번호</label>
                        <input
                          type="text"
                          value={supplierForm.permitNumber}
                          onChange={(e) => setSupplierForm({ ...supplierForm, permitNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>

                    <label className="flex items-start gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={supplierForm.legalAgree}
                        onChange={(e) => setSupplierForm({ ...supplierForm, legalAgree: e.target.checked })}
                        className="mt-0.5 rounded text-amber-600"
                      />
                      <span className="text-[11px] text-slate-600 font-medium">
                        축산물 위생관리법 기준 인허가증 제출 및 무재고 플랫폼 공급자 법적 책임에 동의합니다.
                      </span>
                    </label>

                    <button
                      onClick={() => router.push('/supplier')}
                      disabled={!supplierForm.legalAgree}
                      className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                        supplierForm.legalAgree ? 'bg-amber-600 hover:bg-amber-500 shadow-md' : 'bg-slate-300 cursor-not-allowed'
                      }`}
                    >
                      입점 심사 신청 및 공급자 허브 입장 →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
