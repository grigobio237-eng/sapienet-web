'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store,
  Layers,
  FileSpreadsheet,
  ReceiptText,
  ShoppingCart,
  TrendingDown,
  UserCheck,
  Settings,
  ChefHat,
} from 'lucide-react';

export default function BuyerNav({ cartCount = 0 }: { cartCount?: number }) {
  const pathname = usePathname();

  const navItems = [
    { name: '홈 (대시보드)', href: '/buyer', icon: Store },
    { name: '간편 고기 발주 (원박스/세절)', href: '/buyer/order', icon: Layers },
    { name: '대량/맞춤 조건요청 (RFQ)', href: '/buyer/rfq', icon: FileSpreadsheet },
    { name: '발주·세금계산서·경제실', href: '/buyer/history', icon: ReceiptText },
    { name: '셰프 수제 팩 판매', href: '/buyer/packs', icon: ChefHat },
    { name: '고객지원(CS)·공지', href: '/cs', icon: Store },
    { name: '환경설정/배송지', href: '/buyer/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo & Platform Info */}
        <div className="flex items-center gap-6">
          <Link href="/buyer" className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-700"></span>
            <span className="font-extrabold text-lg tracking-tight text-slate-950">
              SAPIENET
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800">B2B 점주 ERP</span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-red-50 text-red-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/retail"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 px-2.5 py-1.5 rounded-lg border border-purple-200"
          >
            소매 구매 전환
          </Link>

          <Link
            href="/buyer/order"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            <ShoppingCart size={15} />
            <span className="hidden sm:inline">발주 바구니</span>
            {cartCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
            <Link
              href="/buyer/settings"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title="식당 점주 환경설정 (WebP 프로필/하역/정산)"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-xs font-bold border border-red-300">
                test2
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold bg-red-600 text-white px-1.5 py-0.2 rounded">test2</span>
                  <p className="text-xs font-bold text-slate-800 leading-none">하남돼지집 역삼점</p>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">홍길동 사장님 (B2B 사업자)</p>
              </div>
            </Link>
            <Link
              href="/buyer/settings"
              title="환경설정"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 border border-slate-200"
            >
              <Settings size={15} />
            </Link>
            <Link
              href="/"
              title="계정 전환 및 로그아웃"
              className="ml-0.5 text-[11px] text-slate-400 hover:text-red-600 px-2 py-1 rounded bg-slate-50 hover:bg-red-50 border border-slate-200"
            >
              로그아웃
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50/80 py-1.5 px-2 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded font-medium text-[11px] ${
                isActive ? 'text-red-700 font-bold' : 'text-slate-600'
              }`}
            >
              <Icon size={16} />
              <span>{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
