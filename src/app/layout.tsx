import type { Metadata } from 'next';
import './globals.css';
import RoleSwitcher from '@/components/RoleSwitcher';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://sapienet.com'),
  title: '사피에넷 (SAPIENET) - B2B 도매 & B2C 새벽배송 통합 축산물 플랫폼',
  description: '도축장에서 식당 주방으로, 셰프의 비법 손질에서 당신의 식탁으로. 사피에넷(sapienet.com) 축산물 직거래 & 셰프소분 플랫폼',
  openGraph: {
    title: '사피에넷 (SAPIENET) - 통합 축산물 직거래 플랫폼',
    description: '도축장 직송 초신선육 새벽배송, 식당 점주 100% 실측정산 및 셰프 수제소분팩',
    url: 'https://sapienet.com',
    siteName: 'SAPIENET',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-red-200">
        <RoleSwitcher />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
