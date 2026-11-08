'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Truck, ShieldCheck, ShoppingBag, Compass, Wrench, X } from 'lucide-react';

export default function RoleSwitcher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { name: '0.0 랜딩 관문', href: '/', icon: Compass },
    { name: '식당 점주 ERP', href: '/buyer', icon: Store },
    { name: '도매 공급자 Hub', href: '/supplier', icon: Truck },
    { name: '사이트 관리자', href: '/admin', icon: ShieldCheck },
    { name: '개인 소매(B2C)', href: '/retail', icon: ShoppingBag },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 text-xs">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900/90 hover:bg-slate-900 text-slate-200 px-3 py-2 rounded-full shadow-lg border border-slate-700 flex items-center gap-1.5 backdrop-blur-xs transition-all hover:scale-105"
          title="빠른 화면 테스트 스위처 열기"
        >
          <Wrench size={13} className="text-amber-400" />
          <span className="font-semibold text-[11px]">화면 전환기</span>
        </button>
      ) : (
        <div className="bg-slate-900 text-slate-200 p-3 rounded-2xl shadow-2xl border border-slate-700 space-y-2 min-w-[200px] animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Wrench size={12} className="text-amber-400" /> 개발 테스트 빠른 이동
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-300 p-0.5 rounded"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = pathname === role.href;
              return (
                <Link
                  key={role.href}
                  href={role.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-red-700 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{role.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
