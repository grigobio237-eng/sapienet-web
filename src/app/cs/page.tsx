'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Bell,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Search,
  PhoneCall,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import Footer from '@/components/Footer';

export default function CustomerCenterPage() {
  const [activeTab, setActiveTab] = useState<'NOTICE' | 'FAQ' | 'INQUIRY'>('NOTICE');
  const [notices, setNotices] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqCategory, setFaqCategory] = useState<string>('ALL');

  // 1:1 문의 폼 상태
  const [inquiryQuestion, setInquiryQuestion] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  useEffect(() => {
    fetch('/api/notices')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setNotices(json.data);
      });

    fetch('/api/faqs')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setFaqs(json.data);
      });
  }, []);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryQuestion.trim()) return;

    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: inquiryQuestion, userId: 1 }),
    });
    const json = await res.json();
    if (json.success) {
      setInquirySuccess(true);
      setInquiryQuestion('');
      setTimeout(() => setInquirySuccess(false), 4000);
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    if (faqCategory === 'ALL') return true;
    return faq.category === faqCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-red-500 font-semibold mb-1">
              <span>SAPIENET MEAT CS CENTER</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <HelpCircle className="text-red-500" /> 고객 지원 & 신뢰 케어 센터
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              무재고 B2B 직거래 발주, 냉동탑차 실시간 배송, 실중량 근량 차액 정산 상담
            </p>
          </div>
          <Link
            href="/"
            className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800"
          >
            홈으로 이동
          </Link>
        </div>
      </header>

      {/* Hero Banner / Hotline Info */}
      <section className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border-b border-slate-800 py-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-red-600/10 text-red-400 rounded-xl">
              <PhoneCall size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400">도매 발주 & 분쟁 직통 핫라인</p>
              <h3 className="text-xl font-bold text-white mt-0.5">1588-0000</h3>
              <p className="text-[11px] text-slate-500 mt-1">평일 09:00 ~ 18:00 (주말/공휴일 휴무)</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl">
              <Truck size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400">냉동탑차 심야/새벽 배송 관제</p>
              <h3 className="text-base font-bold text-white mt-0.5">24시 자동 온도/위치 추적</h3>
              <p className="text-[11px] text-slate-500 mt-1">-18℃ 이하 냉동 및 0~2℃ 냉장 실시간 관제</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400">실계량 차액 안심 보장</p>
              <h3 className="text-base font-bold text-white mt-0.5">100% 당일 자동 환불</h3>
              <p className="text-[11px] text-slate-500 mt-1">공인 계량표 기준 차액 즉시 정산 및 NTS 연동</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabs */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        {/* Navigation Pills */}
        <div className="flex border-b border-slate-800 mb-8 gap-3">
          <button
            onClick={() => setActiveTab('NOTICE')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'NOTICE'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell size={16} /> 공지사항 ({notices.length})
          </button>
          <button
            onClick={() => setActiveTab('FAQ')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'FAQ'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle size={16} /> 자주 묻는 질문 (FAQ)
          </button>
          <button
            onClick={() => setActiveTab('INQUIRY')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'INQUIRY'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare size={16} /> 1:1 고객 문의
          </button>
        </div>

        {/* Tab 1: Notice List */}
        {activeTab === 'NOTICE' && (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors space-y-2"
              >
                <div className="flex items-center gap-2">
                  {notice.isPinned && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                      중요
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300">
                    {notice.category === 'SHIPPING' && '배송안내'}
                    {notice.category === 'PRICE_TREND' && '시세동향'}
                    {notice.category === 'SYSTEM' && '시스템안내'}
                    {notice.category === 'ALL' && '일반공지'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white">{notice.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{notice.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: FAQ Accordion */}
        {activeTab === 'FAQ' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'ALL', label: '전체' },
                { key: 'PAY_SETTLE', label: '결제 및 정산' },
                { key: 'JOIN_VERIFY', label: '사업자 인증' },
                { key: 'DELIVERY', label: '배송 및 물류' },
                { key: 'CLAIM_REFUND', label: '반품/교환/클레임' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setFaqCategory(cat.key)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-colors ${
                    faqCategory === cat.key
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-red-600/10 text-red-400 flex items-center justify-center text-xs font-bold shrink-0">
                          Q
                        </span>
                        <span className="text-sm font-semibold text-white">{faq.question}</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp size={18} className="text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown size={18} className="text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: 1:1 Inquiry Form */}
        {activeTab === 'INQUIRY' && (
          <div className="max-w-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">1:1 고객 문의 접수</h2>
              <p className="text-xs text-slate-400 mt-1">
                원박스 대량 발주 견적 조율, 출고 탑차 기사 연락, 계량 차액 및 세금계산서 문의를 남겨주시면 담당 매니저가 신속히 답변드립니다.
              </p>
            </div>

            {inquirySuccess && (
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-xl flex items-center gap-3 text-emerald-300 text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                문의가 정상 접수되었습니다. 담당자가 확인 후 등록된 휴대폰으로 알림톡을 발송해 드립니다.
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  문의 내용
                </label>
                <textarea
                  rows={5}
                  value={inquiryQuestion}
                  onChange={(e) => setInquiryQuestion(e.target.value)}
                  placeholder="주문번호, 축종/부위명 또는 불편사항을 구체적으로 기재해 주시면 더 빠른 처리가 가능합니다."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-950/50"
              >
                <Send size={15} /> 1:1 문의 남기기
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
