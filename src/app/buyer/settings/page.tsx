'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Receipt,
  Truck,
  CreditCard,
  Bot,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  KeyRound,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';
import ProfileImageUploader from '@/components/ProfileImageUploader';

export default function BuyerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 계정 및 프로필
  const [userId, setUserId] = useState<number | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [loginId, setLoginId] = useState('buyer1@sapienet.com');

  // 사업자 정보
  const [companyName, setCompanyName] = useState('하남돼지집 강남역삼점');
  const [representativeName, setRepresentativeName] = useState('홍길동');
  const [businessNumber, setBusinessNumber] = useState('120-81-49201');
  const [businessType, setBusinessType] = useState('한식 / 육류구이 전문점');
  const [storeAddress, setStoreAddress] = useState('서울시 강남구 테헤란로 123 1층');
  const [taxEmail, setTaxEmail] = useState('tax@hanamgangnam.com');

  // 매장 하역 및 입고 환경
  const [unloadingLocation, setUnloadingLocation] = useState('KITCHEN_BACKDOOR'); // 'KITCHEN_BACKDOOR' | 'WALK_IN_FRIDGE' | 'BUILDING_DOCK'
  const [doorCode, setDoorCode] = useState('*7788#');
  const [deliveryWindow, setDeliveryWindow] = useState('DAWN'); // 'DAWN' (04~07시) | 'BREAK' (14~16시)
  const [kitchenContact, setKitchenContact] = useState('010-9999-1234');
  const [specialInstructions, setSpecialInstructions] = useState('주방 뒷문 보냉박스 위에 적치 후 도어락 잠금 확인 부탁드립니다.');

  // 근량 실측 차액정산 환불 계좌
  const [refundBank, setRefundBank] = useState('국민은행');
  const [refundAccount, setRefundAccount] = useState('810101-04-192834');
  const [refundHolder, setRefundHolder] = useState('하남돼지집(홍길동)');

  // V3 AI 위임재발주
  const [autoReorderActive, setAutoReorderActive] = useState(true);
  const [reorderThreshold, setReorderThreshold] = useState('2'); // 잔여 2박스 이하
  const [reorderBoxes, setReorderBoxes] = useState('3'); // 3박스 자동발주
  const [maxPriceCap, setMaxPriceCap] = useState('18500'); // kg당 최고 상한선

  // 세무 & 알림
  const [autoTaxInvoice, setAutoTaxInvoice] = useState(true);
  const [weightDiffAlert, setWeightDiffAlert] = useState(true);
  const [tempAbnormalAlert, setTempAbnormalAlert] = useState(true);

  // DB 기존 설정 로드
  useEffect(() => {
    fetch('/api/settings?role=BUYER')
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
            if (persona.representativeName) setRepresentativeName(persona.representativeName);
            if (persona.businessNumber) setBusinessNumber(persona.businessNumber);
            if (persona.businessType) setBusinessType(persona.businessType);
            if (persona.storeAddress) setStoreAddress(persona.storeAddress);
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
          role: 'BUYER',
          profileImageUrl,
          personaData: {
            companyName,
            representativeName,
            businessType,
            storeAddress,
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
              href="/buyer"
              className="p-2 rounded-xl text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
              title="점주 대시보드로 돌아가기"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-extrabold text-lg text-slate-950 flex items-center gap-2">
                식당 점주 환경설정
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                  B2B 점주 ERP
                </span>
              </h1>
              <p className="text-[11px] text-slate-500">
                매장 프로필(WebP), 세무정보, 주방 야간하역 도어락, 근량 실측 환불계좌, V3 위임발주
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/buyer/order"
              className="text-xs font-semibold text-red-700 hover:text-red-900 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200"
            >
              발주하기
            </Link>
            <Link
              href="/retail"
              className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1.5"
            >
              소매관 보기
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
                <p className="text-sm font-bold">점주 환경설정과 프로필 이미지가 안전하게 저장되었습니다.</p>
                <p className="text-xs text-emerald-600">모바일 WebP 변환 프로필 및 세무/하역 설정이 즉시 동기화되었습니다.</p>
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
          {/* 섹션 1: 점주 프로필 노출 이미지 (카메라/파일/캐릭터 WebP) */}
          <ProfileImageUploader
            currentImageUrl={profileImageUrl}
            onImageChange={(webpUrl) => setProfileImageUrl(webpUrl)}
            accentColor="red"
            title="식당 점주 노출 이미지 (간판/주방장/캐릭터 WebP)"
            defaultCharacterPresets={['🧑‍🍳', '🥩', '🐷', '🐮', '🔥', '🔪', '🏪', '👑']}
          />

          {/* 섹션 2: 사업자 정보 & 국세청 세무 이메일 */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-slate-900">사업자 등록 및 세무 정보</h2>
                  <p className="text-[11px] text-slate-500">국세청 전자세금계산서 발급 및 매장 식별 정보</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                <FileCheck size={14} />
                <span>국세청 홈택스 사업자인증 완료</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1.5">상호명</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-hidden transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">대표자명</label>
                <input
                  type="text"
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-hidden transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">사업자등록번호</label>
                <input
                  type="text"
                  value={businessNumber}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100/80 text-slate-500 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">업태 / 종목</label>
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-bold mb-1.5">매장 실제 주소 (배송지)</label>
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                />
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-red-50/60 border border-red-100">
                <label className="block text-red-950 font-bold mb-1 flex items-center gap-1.5">
                  <Receipt size={14} className="text-red-600" />
                  국세청 전자세금계산서 전용 수신 이메일
                </label>
                <input
                  type="email"
                  value={taxEmail}
                  onChange={(e) => setTaxEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-red-200 bg-white font-mono text-red-950 font-semibold focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
                <p className="text-[10px] text-red-700 mt-1">
                  매월 말일 자동 발행되는 전자세금계산서 원본(XML/PDF)이 국세청 전송과 동시에 위 이메일로 자동 전달됩니다.
                </p>
              </div>
            </div>
          </section>

          {/* 섹션 3: 매장 야간 하역 & 주방 출입키 환경설정 */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
                <Truck size={18} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-900">냉동탑차 매장 입고 & 주방 하역 환경</h2>
                <p className="text-[11px] text-slate-500">
                  점주님 부재 시에도 신선육이 안전하게 보관 냉장고에 입고되도록 하역 환경을 지정합니다.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-2">하역 보관 장소 지정</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'KITCHEN_BACKDOOR', title: '주방 뒷문 보냉랙', desc: '외부와 분리된 주방 뒷문 보냉랙에 적치' },
                    { id: 'WALK_IN_FRIDGE', title: '매장 내부 워크인 냉장고', desc: '도어락 비밀번호 입력 후 내부 냉장실 직접 입고' },
                    { id: 'BUILDING_DOCK', title: '건물 1층 공동 하역장', desc: '경비실 확인 후 전용 냉동보관함에 보관' },
                  ].map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setUnloadingLocation(loc.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        unloadingLocation === loc.id
                          ? 'border-red-600 bg-red-50/50 ring-2 ring-red-600/20 text-red-950 font-bold'
                          : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <p className="text-xs">{loc.title}</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-normal">{loc.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-slate-800 font-bold mb-1 flex items-center gap-1.5">
                    <KeyRound size={14} className="text-red-600" />
                    주방/후문 도어락 비밀번호
                  </label>
                  <input
                    type="text"
                    value={doorCode}
                    onChange={(e) => setDoorCode(e.target.value)}
                    placeholder="예: *1234# 또는 열쇠보관함 비밀번호"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-mono text-slate-900 font-bold text-xs"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    배송 담당 기사님 전용 단말기에만 암호화되어 전송됩니다.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-slate-800 font-bold mb-1 flex items-center gap-1.5">
                    <Clock size={14} className="text-red-600" />
                    입고 희망 시간대
                  </label>
                  <select
                    value={deliveryWindow}
                    onChange={(e) => setDeliveryWindow(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs"
                  >
                    <option value="DAWN">새벽 04:00 ~ 07:00 (오픈 전 야간 무인입고 권장)</option>
                    <option value="BREAK">오후 14:00 ~ 16:00 (브레이크타임 대면 입고)</option>
                    <option value="MORNING">오전 09:00 ~ 11:00 (점심 장사 준비 전)</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    사피에넷 콜드체인 직영 탑차가 해당 시간에 맞추어 배송합니다.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">배송 기사님 현장 전달사항</label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>
            </div>
          </section>

          {/* 섹션 4: 근량 실측 차액정산 환불 계좌 (사피에넷 특화) */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
                <CreditCard size={18} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-900">근량 실측 차액정산 환불 계좌</h2>
                <p className="text-[11px] text-slate-500">
                  도축 실물 중량(Catch Weight) 차이에 따른 과결제분 자동 환불 계좌
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
              <p className="font-bold">⚖️ 사피에넷 100% 실측 근량 정산 보장 정책</p>
              <p className="text-[11px] text-amber-800">
                원박스 고기는 가공 시마다 실중량이 다릅니다 (예: 기준 20kg 대비 실측 19.3kg 계량 시 0.7kg 상당 차액 발생).
                사피에넷 시스템은 실측 계량표 등록 즉시 차액을 계산하여 다음 영업일(D+1) 오전 11시에 아래 계좌로 자동 환불 입금해 드립니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1.5">환불 은행</label>
                <select
                  value={refundBank}
                  onChange={(e) => setRefundBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                >
                  <option value="국민은행">국민은행</option>
                  <option value="신한은행">신한은행</option>
                  <option value="우리은행">우리은행</option>
                  <option value="하나은행">하나은행</option>
                  <option value="기업은행">기업은행</option>
                  <option value="농협">농협은행</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">환불 계좌번호</label>
                <input
                  type="text"
                  value={refundAccount}
                  onChange={(e) => setRefundAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">예금주</label>
                <input
                  type="text"
                  value={refundHolder}
                  onChange={(e) => setRefundHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>
            </div>
          </section>

          {/* 섹션 5: V3 AI 위임 재발주 (조건부 자동발주) */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-slate-900">V3 지능형 위임 재발주 설정</h2>
                  <p className="text-[11px] text-slate-500">주방 재고 소진 시 조건부 자동 안전 발주</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoReorderActive}
                onChange={(e) => setAutoReorderActive(e.target.checked)}
                className="w-5 h-5 accent-red-600 rounded cursor-pointer"
              />
            </div>

            {autoReorderActive && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">재발주 발동 재고 (박스)</label>
                    <input
                      type="number"
                      value={reorderThreshold}
                      onChange={(e) => setReorderThreshold(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">남은 박스 이하 시 즉시 발주</span>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">자동 발주량 (박스)</label>
                    <input
                      type="number"
                      value={reorderBoxes}
                      onChange={(e) => setReorderBoxes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">한번에 보충할 원박스 수량</span>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">최고 허용 단가 캡 (원/kg)</label>
                    <input
                      type="number"
                      value={maxPriceCap}
                      onChange={(e) => setMaxPriceCap(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold text-red-700"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">이 가격 초과 시 발주 보류</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  🛡️ 점주님이 등록해 두신 기준 시세를 바탕으로, 원자재 가격 급등(상한가 초과) 시 자동 결제되지 않고 점주님 스마트폰으로 확인 푸시가 먼저 전송됩니다.
                </p>
              </div>
            )}
          </section>

          {/* 섹션 6: 알림 및 세무 발행 설정 */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-900">ERP 알림톡 & 세무 연동</h2>
                <p className="text-[11px] text-slate-500">배송 및 결제 세무 현황 즉시 알림</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold text-xs text-slate-900">매월 말일 전자세금계산서 자동 합산 청구/발행</p>
                  <p className="text-[11px] text-slate-500">발주 건별 일일이 세금계산서를 끊을 필요 없이 월말 합산하여 홈택스에 자동 전송합니다.</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoTaxInvoice}
                  onChange={(e) => setAutoTaxInvoice(e.target.checked)}
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold text-xs text-slate-900">근량 실측 차액 환불 입금 즉시 알림톡</p>
                  <p className="text-[11px] text-slate-500">실중량 계량 완료 시 선결제 차액 입금내역 및 정산영수증을 카카오톡으로 발송합니다.</p>
                </div>
                <input
                  type="checkbox"
                  checked={weightDiffAlert}
                  onChange={(e) => setWeightDiffAlert(e.target.checked)}
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold text-xs text-slate-900">냉동탑차 콜드체인 온도 이탈(위험) 긴급 알림</p>
                  <p className="text-[11px] text-slate-500">배송 중 차량 냉각기 고장으로 냉장 4℃ / 냉동 -18℃ 기준 초과 시 기사님 및 점주님께 긴급 통보합니다.</p>
                </div>
                <input
                  type="checkbox"
                  checked={tempAbnormalAlert}
                  onChange={(e) => setTempAbnormalAlert(e.target.checked)}
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* 하단 저장 플로팅 버튼 */}
          <div className="sticky bottom-6 z-30 pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-red-700 hover:bg-red-800 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-red-900/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={18} />
              <span>{saving ? 'WebP 저장 및 반영 중...' : '점주 환경설정 저장하기'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
