'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  MapPin,
  KeyRound,
  ShieldCheck,
  Coins,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  ShoppingBag,
  Package,
} from 'lucide-react';
import ProfileImageUploader from '@/components/ProfileImageUploader';

export default function RetailSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 계정 및 프로필 상태
  const [userId, setUserId] = useState<number | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [realName, setRealName] = useState('이소매');
  const [phoneNumber, setPhoneNumber] = useState('010-5555-1234');
  const [loginId, setLoginId] = useState('retail@sapienet.com');
  const [pointBalance, setPointBalance] = useState(5000);

  // 새벽배송지 & 출입정보
  const [postalCode, setPostalCode] = useState('05510');
  const [roadAddress, setRoadAddress] = useState('서울특별시 송파구 올림픽로 300');
  const [detailAddress, setDetailAddress] = useState('102동 1403호');
  const [entranceType, setEntranceType] = useState('PW'); // 'PW' | 'FREE' | 'CALL'
  const [entrancePassword, setEntrancePassword] = useState('#2468*');
  const [deliveryRequest, setDeliveryRequest] = useState('문 앞에 조용히 놓아주세요. (새벽 초인종 금지)');
  const [ecoBagReturn, setEcoBagReturn] = useState(true);

  // 혜택 & 알림 설정
  const [autoUsePoints, setAutoUsePoints] = useState(true);
  const [dawnAlert, setDawnAlert] = useState(true);
  const [freshMeatDealAlert, setFreshMeatDealAlert] = useState(true);
  const [holidayGiftAlert, setHolidayGiftAlert] = useState(false);

  // 초기 DB 설정 불러오기
  useEffect(() => {
    fetch('/api/settings?role=RETAIL')
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
            if (persona.realName) setRealName(persona.realName);
            if (persona.phoneNumber) setPhoneNumber(persona.phoneNumber);
            if (persona.pointBalance !== undefined) setPointBalance(persona.pointBalance);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 환경설정 저장 (WebP 프로필 이미지 포함)
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
          role: 'RETAIL',
          profileImageUrl,
          personaData: {
            realName,
            phoneNumber,
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/retail"
              className="p-2 rounded-xl text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
              title="소매 쇼핑몰로 돌아가기"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-extrabold text-lg text-slate-950 flex items-center gap-2">
                개인 회원 환경설정
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  RETAIL
                </span>
              </h1>
              <p className="text-[11px] text-slate-500">
                프로필 이미지(WebP), 새벽배송지, 공동현관 출입키, 맞춤 혜택 설정
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/retail/cart"
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200"
            >
              장바구니
            </Link>
            <Link
              href="/buyer"
              className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1.5"
            >
              점주 ERP
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
                <p className="text-sm font-bold">환경설정과 프로필 이미지가 성공적으로 저장되었습니다.</p>
                <p className="text-xs text-emerald-600">모바일 WebP 변환본이 데이터베이스에 안전하게 반영되었습니다.</p>
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
          {/* 섹션 1: 노출 이미지 (카메라 직접촬영 / 갤러리 업로드 / 캐릭터 프리셋 WebP) */}
          <ProfileImageUploader
            currentImageUrl={profileImageUrl}
            onImageChange={(webpUrl) => setProfileImageUrl(webpUrl)}
            accentColor="purple"
            title="소매 구매자 노출 프로필 (사진 / 캐릭터 WebP)"
            defaultCharacterPresets={['🧑‍🍳', '🥩', '🐮', '🐷', '👑', '⭐', '🔥', '✨']}
          />

          {/* 섹션 2: 회원 기본 정보 */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-slate-900">본인 인증 및 기본 계정</h2>
                  <p className="text-[11px] text-slate-500">PASS 실명인증 및 알림 수신 기본 정보</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                <ShieldCheck size={14} />
                <span>NICE 본인인증 완료</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1.5">실명 (성함)</label>
                <input
                  type="text"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-hidden transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">휴대폰 번호</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-hidden transition-all font-medium font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-bold mb-1.5">로그인 계정 (이메일 ID)</label>
                <input
                  type="email"
                  value={loginId}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100/80 text-slate-500 font-mono cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  계정 ID는 본인인증 연동 식별자로 사용되므로 변경 시 고객센터 문의가 필요합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 섹션 3: 새벽배송지 & 공동현관 출입 보안키 */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Truck size={18} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-900">새벽배송지 & 공동현관 출입키</h2>
                <p className="text-[11px] text-slate-500">
                  익일 오전 7시 전 신선도착을 위한 배송지 및 암호화 출입 정보
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="sm:col-span-1">
                  <label className="block text-slate-600 font-bold mb-1.5">우편번호</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-center font-bold"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-slate-600 font-bold mb-1.5">도로명 주소</label>
                  <input
                    type="text"
                    value={roadAddress}
                    onChange={(e) => setRoadAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">동·호수 / 상세 주소</label>
                <input
                  type="text"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              {/* 공동현관 출입방법 */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
                <label className="block text-purple-950 font-bold">
                  공동현관 출입 방식 (새벽배송 전용)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'PW', label: '공동현관 비밀번호', desc: '새벽 배송원 안전 접근' },
                    { id: 'FREE', label: '자유 출입 가능', desc: '1층 현관 항시 개방' },
                    { id: 'CALL', label: '경비실 호출', desc: '야간 경비실 부재 시 지연 가능' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEntranceType(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        entranceType === item.id
                          ? 'border-purple-600 bg-white shadow-xs text-purple-900 ring-2 ring-purple-600/20'
                          : 'border-purple-200/60 bg-white/60 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <p className="font-bold text-xs">{item.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>

                {entranceType === 'PW' && (
                  <div className="pt-2">
                    <label className="block text-purple-900 font-semibold mb-1 text-[11px] flex items-center gap-1">
                      <KeyRound size={13} className="text-purple-600" />
                      공동현관 비밀번호 (특수문자 포함 정확히 기재)
                    </label>
                    <input
                      type="text"
                      value={entrancePassword}
                      onChange={(e) => setEntrancePassword(e.target.value)}
                      placeholder="예: #1234* 또는 종버튼1234종"
                      className="w-full px-3.5 py-2 rounded-xl border border-purple-200 bg-white font-mono text-purple-900 font-bold text-xs focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                    />
                    <p className="text-[10px] text-purple-600 mt-1">
                      🔒 고객님의 출입 비밀번호는 AES-256 암호화되어 새벽 배송 기사 전용 PDA 앱에만 한시 제공됩니다.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5">기사님 요청 사항</label>
                <input
                  type="text"
                  value={deliveryRequest}
                  onChange={(e) => setDeliveryRequest(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              {/* 프레시백 반납 옵션 */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Package className="text-purple-600" size={18} />
                  <div>
                    <p className="font-bold text-xs text-slate-900">사피에넷 친환경 프레시백 수거 이용</p>
                    <p className="text-[11px] text-slate-500">
                      다음 배송 시 현관 앞에 둔 이전 보냉백을 기사님이 수거해 세척 재사용합니다. (환경보호 적립금 100P 적립)
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={ecoBagReturn}
                  onChange={(e) => setEcoBagReturn(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* 섹션 4: 보유 적립금 & 결제 혜택 */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Coins size={18} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-900">적립금 & 멤버십 혜택</h2>
                <p className="text-[11px] text-slate-500">결제 시 자동 할인 및 신규 가입 혜택</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-900 text-white shadow-md">
              <div>
                <p className="text-xs text-purple-200 font-semibold">현재 사용 가능한 사피에넷 포인트</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black">{pointBalance.toLocaleString()}</span>
                  <span className="text-sm font-bold text-purple-200">P</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
                가입축하 5,000P 지급완료
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <p className="font-bold text-xs text-slate-900">결제 시 적립금 자동 우선 사용</p>
                <p className="text-[11px] text-slate-500">
                  1,000P 이상 보유 시 장바구니/주문서에서 별도 입력 없이 전액 자동 차감합니다.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoUsePoints}
                onChange={(e) => setAutoUsePoints(e.target.checked)}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>
          </section>

          {/* 섹션 5: 스마트 알림 수신 설정 */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-900">알림톡 및 소식 수신 설정</h2>
                <p className="text-[11px] text-slate-500">신선육 배송 상태 및 초특가 게릴라 알림</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold text-xs text-slate-900">새벽 7시 도착 완료 카카오 알림톡</p>
                  <p className="text-[11px] text-slate-500">기사님이 문 앞 배송 후 현장 사진과 함께 즉시 발송</p>
                </div>
                <input
                  type="checkbox"
                  checked={dawnAlert}
                  onChange={(e) => setDawnAlert(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold text-xs text-slate-900">도축 당일 초신선 한돈/한우 반짝특가 알림</p>
                  <p className="text-[11px] text-slate-500">도축장에서 소분 직송되는 한정수량 게릴라 세일 안내</p>
                </div>
                <input
                  type="checkbox"
                  checked={freshMeatDealAlert}
                  onChange={(e) => setFreshMeatDealAlert(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold text-xs text-slate-900">명절(추석/설) 프리미엄 선물세트 사전예약 알림</p>
                  <p className="text-[11px] text-slate-500">얼리버드 30% 할인 및 맞춤 보자기 포장 혜택 안내</p>
                </div>
                <input
                  type="checkbox"
                  checked={holidayGiftAlert}
                  onChange={(e) => setHolidayGiftAlert(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* 하단 저장 플로팅 버튼 */}
          <div className="sticky bottom-6 z-30 pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-purple-900/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={18} />
              <span>{saving ? 'WebP 저장 및 반영 중...' : '환경설정 저장하기'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
