'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Factory,
  ShieldCheck,
  CreditCard,
  Truck,
  Warehouse,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  FileBadge2,
  PhoneCall,
  Scale,
  Sparkles,
} from 'lucide-react';
import ProfileImageUploader from '@/components/ProfileImageUploader';

export default function SupplierSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 계정 및 프로필
  const [userId, setUserId] = useState<number | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [loginId, setLoginId] = useState('supplier2@sapienet.com');

  // 인허가 및 사업장 정보
  const [companyName, setCompanyName] = useState('(주)도드람축산가공');
  const [permitNumber, setPermitNumber] = useState('경기-2022-유통-0891');
  const [haccpStatus, setHaccpStatus] = useState('인증완료 (2027-12-31까지 유효)');
  const [factoryAddress, setFactoryAddress] = useState('경기도 안성시 일죽면 도드람로 12 도드람안성공판장 내 제2가공장');
  const [managerName, setManagerName] = useState('김공급 팀장');
  const [managerPhone, setManagerPhone] = useState('010-8888-9999');

  // 대금 정산 계좌
  const [settlementBank, setSettlementBank] = useState('농협');
  const [settlementAccount, setSettlementAccount] = useState('301-4561-789012');
  const [settlementHolder, setSettlementHolder] = useState('(주)도드람축산가공');

  // 출고 및 물류 기본값
  const [defaultWarehouse, setDefaultWarehouse] = useState('BWT_YEONGDEUNGPO'); // 'BWT_YEONGDEUNGPO' | 'MAJANG' | 'FACTORY_DIRECT'
  const [coldChainCarrier, setColdChainCarrier] = useState('SAPIENET_DIRECT'); // 사피에넷 직영 냉동탑차
  const [cutLeadTime, setCutLeadTime] = useState('D1'); // 'SAME_DAY' | 'D1' | 'D2'
  const [moqBoxes, setMoqBoxes] = useState('1'); // 최소 주문 1박스
  const [safetyStockWarning, setSafetyStockWarning] = useState('10'); // 10박스 이하 경고

  // RFQ 및 알림
  const [rfqMinWeight, setRfqMinWeight] = useState('300'); // 300kg 이상 우선 알림
  const [smsStockAlert, setSmsStockAlert] = useState(true);
  const [rfqRealtimeAlert, setRfqRealtimeAlert] = useState(true);
  const [traceDisclaimerAgree, setTraceDisclaimerAgree] = useState(true);

  // DB 기존 설정 로드
  useEffect(() => {
    fetch('/api/settings?role=SUPPLIER')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const { user, persona } = json.data;
          setUserId(user.id);
          setLoginId(user.loginId);
          if (user.profileImageUrl) {
            setProfileImageUrl(user.profileImageUrl);
          }
          if (persona) {
            if (persona.companyName) setCompanyName(persona.companyName);
            if (persona.permitNumber) setPermitNumber(persona.permitNumber);
            if (persona.settlementBank) setSettlementBank(persona.settlementBank);
            if (persona.settlementAccount) setSettlementAccount(persona.settlementAccount);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          role: 'SUPPLIER',
          profileImageUrl,
          personaData: {
            companyName,
            permitNumber,
            settlementBank,
            settlementAccount,
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        setErrorMessage(json.error || '저장 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. 상단 네비게이션 헤더 */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/supplier"
              className="p-2 rounded-xl text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
              title="공급자 허브로 돌아가기"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-extrabold text-lg text-slate-950 flex items-center gap-2">
                도매 공급자 환경설정
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  SUPPLIER
                </span>
              </h1>
              <p className="text-[11px] text-slate-500">
                공급자 노출 이미지(WebP), 축산인허가·HACCP, BWT 보세창고 및 출고 기본값, 판매정산 계좌
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/supplier"
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
            >
              공급자 허브
            </Link>
          </div>
        </div>
      </header>

      {/* 2. 본문 컨테이너 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
              <div>
                <p className="text-sm font-bold">도매 공급자 환경설정이 성공적으로 저장되었습니다.</p>
                <p className="text-xs text-emerald-600">공급사 프로필 WebP 이미지 및 물류/정산 기본값이 즉시 반영되었습니다.</p>
              </div>
            </div>
            <button
              onClick={() => setSavedSuccess(false)}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              닫기
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="text-red-600 shrink-0" size={20} />
            <p className="text-sm font-semibold">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* 섹션 1: 공급자 노출 이미지 (도축공판장/가공라인/로고/캐릭터 WebP) */}
          <ProfileImageUploader
            currentImageUrl={profileImageUrl}
            onImageChange={(webpUrl) => setProfileImageUrl(webpUrl)}
            accentColor="amber"
            title="공급자 노출 프로필 (가공장/브랜드/캐릭터 WebP)"
            defaultCharacterPresets={['🏭', '🚚', '🥩', '🐮', '🐷', '⚖️', '📦', '👑']}
          />

          {/* 섹션 2: 축산물 가공·유통 인허가 & HACCP 인증 */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Factory size={18} />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-slate-900">도축/가공 인허가 및 사업장</h2>
                  <p className="text-[11px] text-slate-500">축산물위생관리법에 따른 법적 허가 및 HACCP 검증 정보</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                <FileBadge2 size={14} />
                <span>HACCP 축산안전인증 공인</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1.5">공급사 상호명</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-600 focus:outline-hidden transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">축산물 가공/유통 허가번호</label>
                <input
                  type="text"
                  value={permitNumber}
                  onChange={(e) => setPermitNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-amber-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-bold mb-1.5">HACCP 안전인증 현황</label>
                <input
                  type="text"
                  value={haccpStatus}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100/80 text-emerald-800 font-semibold cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-bold mb-1.5">가공장 / 물류창고 본사 주소</label>
                <input
                  type="text"
                  value={factoryAddress}
                  onChange={(e) => setFactoryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">출고 담당자 성함</label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">담당자 직통 휴대폰</label>
                <input
                  type="tel"
                  value={managerPhone}
                  onChange={(e) => setManagerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-medium"
                />
              </div>
            </div>
          </section>

          {/* 섹션 3: 판매 대금 정산 계좌 */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <CreditCard size={18} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-900">도매 판매대금 정산 계좌</h2>
                <p className="text-[11px] text-slate-500">실측 중량 확정 및 입고 검수 완료 후 D+1일 입금 계좌</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1.5">정산 은행</label>
                <select
                  value={settlementBank}
                  onChange={(e) => setSettlementBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                >
                  <option value="농협">농협은행</option>
                  <option value="기업은행">기업은행</option>
                  <option value="국민은행">국민은행</option>
                  <option value="신한은행">신한은행</option>
                  <option value="우리은행">우리은행</option>
                  <option value="하나은행">하나은행</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">정산 계좌번호</label>
                <input
                  type="text"
                  value={settlementAccount}
                  onChange={(e) => setSettlementAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">예금주 (사업자명 일치)</label>
                <input
                  type="text"
                  value={settlementHolder}
                  onChange={(e) => setSettlementHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              💡 사피에넷 에스크로 안전결제 시스템을 통해 식당 점주의 선결제 예치금이 확보된 주문만 출고되며, 식당 입고 완료 즉시 공급자에게 자동 정산됩니다.
            </p>
          </section>

          {/* 섹션 4: BWT 보세창고 & 냉동탑차 출고 기본값 */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Warehouse size={18} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-900">BWT 보세창고 및 출고 기본값</h2>
                <p className="text-[11px] text-slate-500">원박스 보관 창고 거점 및 냉동탑차 배송 정책 설정</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">기본 보관/출고 거점 창고</label>
                <select
                  value={defaultWarehouse}
                  onChange={(e) => setDefaultWarehouse(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                >
                  <option value="BWT_YEONGDEUNGPO">BWT 영등포 축산물 냉장/냉동 물류센터 (수도권 당일 연계)</option>
                  <option value="MAJANG">마장동 축산물 시장 중앙 보냉창고</option>
                  <option value="FACTORY_DIRECT">안성 제2가공장 도축장 직송 출고</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">세절가공 리드타임</label>
                  <select
                    value={cutLeadTime}
                    onChange={(e) => setCutLeadTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                  >
                    <option value="SAME_DAY">당일 가공출고 (14시 이전 발주)</option>
                    <option value="D1">익일(D+1) 가공출고 (권장)</option>
                    <option value="D2">D+2일 가공출고</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">최소 주문 단위 (MOQ)</label>
                  <input
                    type="number"
                    value={moqBoxes}
                    onChange={(e) => setMoqBoxes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">최소 박스 단위 (원박스 1박스)</span>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">안전재고 경고 임계값</label>
                  <input
                    type="number"
                    value={safetyStockWarning}
                    onChange={(e) => setSafetyStockWarning(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold text-amber-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">남은 박스 이하 시 SMS 경고</span>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 5: RFQ 조건요청 알림 및 축산물 이력제 법적 책임 */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-900">RFQ 대량 견적 알림 & 법적 책임</h2>
                <p className="text-[11px] text-slate-500">대량 발주 알림 조건 및 축산물이력제 의무 준수</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold text-xs text-slate-900">대형 식당 RFQ 조건요청 실시간 푸시</p>
                  <p className="text-[11px] text-slate-500">
                    희망 중량 {rfqMinWeight}kg 이상의 대량 견적 요청 등록 시 공급자에게 즉시 입찰 알림을 발송합니다.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={rfqRealtimeAlert}
                  onChange={(e) => setRfqRealtimeAlert(e.target.checked)}
                  className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold text-xs text-slate-900">축산물 이력번호 및 실측 계량표 법적 책임 준수 동의</p>
                  <p className="text-[11px] text-slate-500">
                    축산물위생관리법 제31조에 의거, 허위 이력번호 또는 계량표 조작 시 법적 처벌 및 공급 자격이 영구 정지됩니다.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={traceDisclaimerAgree}
                  onChange={(e) => setTraceDisclaimerAgree(e.target.checked)}
                  className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* 하단 저장 플로팅 버튼 */}
          <div className="sticky bottom-6 z-30 pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-amber-900/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={18} />
              <span>{saving ? 'WebP 저장 및 반영 중...' : '공급자 환경설정 저장하기'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
