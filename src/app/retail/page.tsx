'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Gift,
  Package,
  ShoppingCart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Truck,
  Heart,
  Search,
  Filter,
  Flame,
  ChefHat,
  Users,
  Timer,
  BadgePercent,
  SlidersHorizontal,
  X,
  ChevronRight,
  ShieldCheck,
  Star,
  Plus,
  Minus,
  Settings,
} from 'lucide-react';

// B2C 소매 큐레이션용 확장 더미/초기 데이터
const INITIAL_RETAIL_CATALOG = [
  {
    id: 101,
    category: 'BEEF',
    name: '국내산 한우 1++ 명품 구이용 선물세트 (등심+안심)',
    brand: '안성마춤한우',
    origin: '국내산 (음성공판장 도축)',
    storage: 'REFRIGERATED',
    cookingIntent: ['GIFT', 'PARTY', 'STEAK'],
    portionSize: 'FAMILY', // 4인 이상
    specWeight: '3.0kg (등심 1.5kg + 안심 1.5kg)',
    price: 240000,
    marketPrice: 320000,
    discountRate: 25,
    pricePer100g: 8000,
    badge: '1++ No.8 BMS',
    freshnessBadge: '도축 3일 이내',
    traceNumber: '002938471928',
    deliveryTag: '새벽배송 (신선보자기 포장)',
    rating: 4.9,
    reviewCount: 312,
    imageDesc: '🥩',
  },
  {
    id: 102,
    category: 'PORK',
    name: '초신선 국내산 한돈 삼겹살 2cm 구이용 소포장',
    brand: '도드람한돈',
    origin: '국내산 (도드람안성공판장)',
    storage: 'REFRIGERATED',
    cookingIntent: ['BBQ', 'GRILL', 'EASY'],
    portionSize: 'COUPLE', // 2~3인
    specWeight: '600g (개별 진공 스킨팩)',
    price: 15900,
    marketPrice: 21900,
    discountRate: 27,
    pricePer100g: 2650,
    badge: '1+ 등급 A',
    freshnessBadge: '도축 48시간 이내',
    traceNumber: '002194829101',
    deliveryTag: '내일 아침 7시 도착',
    rating: 4.8,
    reviewCount: 840,
    imageDesc: '🥓',
  },
  {
    id: 103,
    category: 'BEEF',
    name: '홈파티 1++ 한우 안심 두툼 스테이크용 (3cm 컷)',
    brand: '농협안심한우',
    origin: '국내산 (음성공판장)',
    storage: 'REFRIGERATED',
    cookingIntent: ['STEAK', 'PARTY', 'DIET'],
    portionSize: 'SINGLE', // 1인~2인
    specWeight: '300g (1인 스테이크 2팩)',
    price: 36000,
    marketPrice: 48000,
    discountRate: 25,
    pricePer100g: 12000,
    badge: '1++ No.9 프리미엄',
    freshnessBadge: '웻에이징 7일 숙성',
    traceNumber: '002198450992',
    deliveryTag: '새벽배송',
    rating: 5.0,
    reviewCount: 198,
    imageDesc: '🥩',
  },
  {
    id: 104,
    category: 'PORK',
    name: '캠핑용 숯불 바베큐 두툼 돈마호크 & 통우대갈비 세트',
    brand: '포크밸리',
    origin: '국내산',
    storage: 'REFRIGERATED',
    cookingIntent: ['CAMPING', 'BBQ', 'PARTY'],
    portionSize: 'FAMILY',
    specWeight: '1.2kg (돈마호크 600g + 통우대갈비 600g)',
    price: 38900,
    marketPrice: 52000,
    discountRate: 25,
    pricePer100g: 3240,
    badge: '시즈닝/버터 증정',
    freshnessBadge: '도축 직송',
    traceNumber: '002773819201',
    deliveryTag: '캠핑장 직배송 가능',
    rating: 4.9,
    reviewCount: 412,
    imageDesc: '🍖',
  },
  {
    id: 105,
    category: 'BEEF',
    name: '깊은 풍미 한우 1등급 양지 국거리/미역국용 소분팩',
    brand: '안성축협',
    origin: '국내산',
    storage: 'REFRIGERATED',
    cookingIntent: ['SOUP', 'EASY', 'HEALTH'],
    portionSize: 'COUPLE',
    specWeight: '400g (깍둑썰기 손질완료)',
    price: 18500,
    marketPrice: 26000,
    discountRate: 28,
    pricePer100g: 4625,
    badge: '국물 진한 한우 양지',
    freshnessBadge: '신선 진공소포장',
    traceNumber: '002551029481',
    deliveryTag: '새벽배송',
    rating: 4.7,
    reviewCount: 156,
    imageDesc: '🍲',
  },
  {
    id: 106,
    category: 'DIET',
    name: '헬스 & 다이어트 고단백 한우 우둔살 슬라이스 (저지방)',
    brand: '목우촌',
    origin: '국내산',
    storage: 'REFRIGERATED',
    cookingIntent: ['DIET', 'HEALTH', 'EASY'],
    portionSize: 'SINGLE',
    specWeight: '200g x 3팩 (총 600g)',
    price: 19800,
    marketPrice: 28000,
    discountRate: 29,
    pricePer100g: 3300,
    badge: '지방 3% 미만 고단백',
    freshnessBadge: '100% 한우',
    traceNumber: '002991024581',
    deliveryTag: '정기배송 가능',
    rating: 4.9,
    reviewCount: 520,
    imageDesc: '🥗',
  },
  {
    id: 107,
    category: 'GIFT',
    name: '특선 1+ 한우 정성 갈비세트 2.4kg (찜갈비+구이갈비)',
    brand: '도드람양돈농협',
    origin: '국내산',
    storage: 'FROZEN',
    cookingIntent: ['GIFT', 'PARTY'],
    portionSize: 'FAMILY',
    specWeight: '2.4kg (찜용 1.2kg + 구이용 1.2kg)',
    price: 189000,
    marketPrice: 260000,
    discountRate: 27,
    pricePer100g: 7875,
    badge: '황금 보자기 포장',
    freshnessBadge: '지방 85% 손질',
    traceNumber: '002441920192',
    deliveryTag: '지정일 안심택배',
    rating: 4.9,
    reviewCount: 284,
    imageDesc: '🎁',
  },
  {
    id: 108,
    category: 'PORK',
    name: '기름기 쏙 담백한 한돈 목살 구이/수육 겸용 500g',
    brand: '도드람한돈',
    origin: '국내산',
    storage: 'REFRIGERATED',
    cookingIntent: ['GRILL', 'HEALTH', 'SOUP'],
    portionSize: 'COUPLE',
    specWeight: '500g (두께 1.5cm)',
    price: 12900,
    marketPrice: 17500,
    discountRate: 26,
    pricePer100g: 2580,
    badge: '1+ 골든포크',
    freshnessBadge: '도축 3일 이내',
    traceNumber: '002881920491',
    deliveryTag: '새벽배송',
    rating: 4.8,
    reviewCount: 390,
    imageDesc: '🥩',
  },
];

export default function RetailShopPage() {
  // DB에서 불러온 상품과 초기 카탈로그 결합
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  // 1. 스마트 검색 & 필터 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<string>('ALL'); // 요리 목적 (스테이크, 캠핑, 선물, 다이어트 등)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL'); // 소, 돼지, 선물 등
  const [selectedPortion, setSelectedPortion] = useState<string>('ALL'); // 1인, 2~3인, 대가족
  const [priceRange, setPriceRange] = useState<number>(300000); // 최대 가격 슬라이더

  // 장바구니 & 모달 상태
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [orderCompleteModal, setOrderCompleteModal] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<any | null>(null);

  // 타임세일 카운트다운 타이머 (오늘 23:59:59 마감 시뮬레이션)
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 19 });

  useEffect(() => {
    // API로부터 도매 상품과 점주 수제 소분팩(Retail Packs)을 함께 페치
    const loadCatalog = async () => {
      try {
        const [resProd, resPacks] = await Promise.all([
          fetch('/api/products?audience=ALL').then((r) => r.json()),
          fetch('/api/retail-packs').then((r) => r.json()),
        ]);

        let productsFromDb: any[] = [];
        if (resProd.success && resProd.data) {
          productsFromDb = resProd.data.map((p: any) => {
            const spec = p.specs?.[0];
            return {
              id: p.id,
              category: p.categoryCode?.startsWith('BEEF') ? 'BEEF' : 'PORK',
              name: p.productName,
              brand: p.brandName || p.supplier?.companyName || '도드람한돈',
              origin: `${p.origin} (${p.traceability?.slaughterHouseName || '공인도축장'})`,
              storage: p.storageType,
              cookingIntent: ['GRILL', 'PARTY', 'BBQ'],
              portionSize: spec?.stdWeightKg > 5 ? 'FAMILY' : 'COUPLE',
              specWeight: spec?.specName || `${spec?.stdWeightKg || 1}kg`,
              price: spec?.estimatedPackPrice || 25000,
              marketPrice: Math.round((spec?.estimatedPackPrice || 25000) * 1.3),
              discountRate: 23,
              pricePer100g: Math.round(((spec?.basePricePerKg || 25000) / 10)),
              badge: p.traceability?.bmsGrade || '1+ 등급 공인',
              freshnessBadge: '도축장 직송',
              traceNumber: p.traceability?.traceNumber || '002198450123',
              deliveryTag: '산지 새벽배송',
              rating: 4.9,
              reviewCount: 45,
              imageUrl: p.imageUrl,
              imageDesc: p.categoryCode?.startsWith('BEEF') ? '🥩' : '🥓',
            };
          });
        }

        let packsFromDb: any[] = [];
        if (resPacks.success && resPacks.data) {
          packsFromDb = resPacks.data.map((pack: any) => {
            return {
              id: `pack-${pack.id}`,
              category: pack.categoryCode,
              isChefPack: true,
              name: pack.packName,
              brand: pack.businessBuyer?.companyName || '하남돼지집 강남역삼점',
              origin: `국내산 (${pack.sourceSlaughterHouse || '공인도축장'})`,
              storage: 'REFRIGERATED',
              cookingIntent: ['GRILL', 'STEAK', 'PARTY', 'EASY', 'CHEF'],
              portionSize: pack.portionWeightG <= 350 ? 'SINGLE' : (pack.portionWeightG <= 800 ? 'COUPLE' : 'FAMILY'),
              specWeight: `${pack.portionWeightG}g (진공스킨팩)`,
              price: pack.salePrice,
              marketPrice: Math.round(pack.salePrice * 1.25),
              discountRate: 20,
              pricePer100g: Math.round((pack.salePrice / pack.portionWeightG) * 100),
              badge: '🧑‍🍳 동네 맛집 수제 소분',
              freshnessBadge: '매장 비법 손질/스킨팩',
              traceNumber: pack.sourceTraceNumber,
              deliveryTag: pack.pickupAvailable
                ? `새벽배송 / 매장 픽업 (-${(pack.pickupDiscount || 1000).toLocaleString()}원)`
                : '산지 새벽배송',
              rating: 5.0,
              reviewCount: 42,
              imageUrl: pack.imageUrl || null,
              imageDesc: pack.categoryCode === 'BEEF' ? '🥩' : '🥓',
              pickupAvailable: pack.pickupAvailable,
              pickupDiscount: pack.pickupDiscount || 1000,
              storeAddress: pack.storeAddress,
              chefNote: pack.chefNote,
            };
          });
        }

        setDbProducts([...productsFromDb, ...packsFromDb]);
      } catch (err) {
        console.error(err);
      }
    };

    loadCatalog();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 통합 카탈로그
  const allProducts = useMemo(() => {
    return [...INITIAL_RETAIL_CATALOG, ...dbProducts];
  }, [dbProducts]);

  // 스마트 복합 필터링 로직
  const filteredProducts = useMemo(() => {
    return allProducts.filter((item) => {
      // 1. 검색어 매칭
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchBrand = item.brand.toLowerCase().includes(q);
        const matchOrigin = item.origin.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchOrigin) return false;
      }

      // 2. 카테고리 매칭
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'CHEF_PACK') {
          if (!item.isChefPack) return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      // 3. 요리 목적(스마트 인텐트) 매칭
      if (selectedIntent !== 'ALL') {
        if (!item.cookingIntent.includes(selectedIntent)) return false;
      }

      // 4. 인원수/식사 규모 매칭
      if (selectedPortion !== 'ALL' && item.portionSize !== selectedPortion) {
        return false;
      }

      // 5. 가격대 슬라이더
      if (item.price > priceRange) {
        return false;
      }

      return true;
    });
  }, [allProducts, searchQuery, selectedCategory, selectedIntent, selectedPortion, priceRange]);

  // 1. localStorage 장바구니 동기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sapienet_retail_cart');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setCartItems(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      } else {
        updated = [...prev, { ...product, qty: 1 }];
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('sapienet_retail_cart', JSON.stringify(updated));
      }
      return updated;
    });
    // 모달 대신 독립 장바구니 페이지로 이동
    window.location.href = '/retail/cart';
  };

  const totalCartAmt = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cartItems]);

  const discountBonus = 5000; // 가입축하 5,000P
  const finalPaymentAmt = Math.max(0, totalCartAmt - (totalCartAmt > 0 ? discountBonus : 0));

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen text-slate-900">
      {/* 1.0 프리미엄 리테일 상단 네비게이션 헤더 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-3.5 h-3.5 rounded-full bg-purple-600 shadow-xs shadow-purple-400"></span>
            <div>
              <Link href="/retail" className="font-extrabold text-xl tracking-tight text-slate-950 flex items-center gap-1.5">
                SAPIENET <span className="text-purple-700">RETAIL</span>
              </Link>
              <span className="text-[10px] text-purple-700 font-bold block sm:inline-block leading-tight">
                도축장 직송 도매소분 & 명절선물관
              </span>
            </div>
          </div>

          {/* 중앙 검색창 (스마트 자연어 검색) */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="어떤 고기를 찾으시나요? (예: 캠핑, 스테이크, 삼겹살, 다이어트)"
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100/90 border border-slate-200 text-xs focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-hidden transition-all shadow-inner"
              />
              <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* User Persona & 장바구니 */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
            {/* test1 로그인 계정 배지 (환경설정 링크) */}
            <Link
              href="/retail/settings"
              className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 px-3 py-1.5 rounded-full shadow-2xs transition-colors"
              title="개인 회원 환경설정 (WebP 프로필/새벽배송지)"
            >
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
              <span className="font-extrabold text-purple-900 bg-purple-200 text-[10px] px-1.5 py-0.5 rounded-full">
                test1
              </span>
              <span className="font-bold text-purple-950 hidden sm:inline">이소매 회원님</span>
              <span className="text-[11px] font-extrabold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200 shadow-2xs">
                5,000P
              </span>
            </Link>

            {/* 환경설정 아이콘 버튼 */}
            <Link
              href="/retail/settings"
              className="p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors"
              title="환경설정"
            >
              <Settings size={16} />
            </Link>

            {/* 장바구니 페이지 이동 링크 (카트 아이콘) */}
            <Link
              href="/retail/cart"
              className="relative p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-transform active:scale-95 shadow-md flex items-center justify-center group"
              title="장바구니 페이지로 이동"
            >
              <ShoppingCart size={18} className="group-hover:scale-105 transition-transform" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-600 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white animate-bounce">
                  {cartItems.reduce((sum, i) => sum + i.qty, 0)}
                </span>
              )}
            </Link>

            <Link
              href="/buyer"
              className="hidden lg:inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
            >
              ← 점주 ERP
            </Link>

            <Link
              href="/"
              className="text-slate-400 hover:text-slate-700 font-medium px-2 py-1.5 rounded-lg text-[11px]"
            >
              로그아웃
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-8">
        {/* 2.0 커머스형 히어로 기획전 캐러셀 배너 */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 max-w-xl text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/60 border border-purple-600/60 text-purple-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles size={14} className="text-purple-300" />
              도축장 다이렉트 B2B 도매 소분가 | 마트 대비 최대 30% 절감
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">
              식당에 납품되는 동일한 신선육을,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-rose-200 to-amber-200">
                가정에서 원터치 새벽배송으로.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              중간 유통 단계를 배제하고 도축장(음성/도드람/안성)에서 새벽에 직접 썰어 진공 스킨팩으로 배송합니다. 
              <strong> 신규 가입 축하 5,000P</strong>를 첫 주문에 즉시 사용하세요.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-purple-200">
                <Truck size={14} /> 풀콜드체인 새벽배송
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-purple-200">
                <ShieldCheck size={14} /> 축평원 100% 이력번호 검증
              </span>
            </div>
          </div>

          {/* 우측 타임세일 한정 특가 박스 */}
          <div className="w-full md:w-80 bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 text-center space-y-3 shrink-0 shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-white/15">
              <span className="flex items-center gap-1 text-amber-300">
                <Flame size={15} className="fill-amber-400" /> 오늘 당일 도축 한정특가
              </span>
              <span className="font-mono text-purple-200 bg-purple-900/60 px-2 py-0.5 rounded">
                잔여 18세트
              </span>
            </div>

            <div className="py-2 space-y-1">
              <p className="text-xs text-slate-300">초신선 1+ 한돈 삼겹살 600g</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-amber-400 font-extrabold text-2xl">15,900원</span>
                <span className="text-slate-400 line-through text-xs">21,900원</span>
              </div>
            </div>

            {/* 타이머 바 */}
            <div className="bg-slate-900/80 rounded-xl p-2.5 flex items-center justify-center gap-2 text-xs font-mono font-bold text-amber-300">
              <Timer size={14} />
              <span>
                마감까지 {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={() => addToCart(allProducts[1])}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs shadow-md transition-all active:scale-98"
            >
              특가 바로 담기 (5,000P 적용가능)
            </button>
          </div>
        </div>

        {/* 3.0 소비자 니즈 맞춤형 "스마트 검색 & 원터치 인텐트 바" */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <ChefHat size={20} className="text-purple-700" />
                소비자 맞춤형 고기 스마트 탐색기
              </h2>
              <p className="text-xs text-slate-500">
                어려운 고기 부위명을 몰라도, 오늘 만드실 요리 목적과 인원수만 선택하면 최적의 고기를 자동으로 찾아드립니다.
              </p>
            </div>
            {(selectedIntent !== 'ALL' || selectedCategory !== 'ALL' || selectedPortion !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedIntent('ALL');
                  setSelectedCategory('ALL');
                  setSelectedPortion('ALL');
                  setSearchQuery('');
                  setPriceRange(300000);
                }}
                className="text-xs text-slate-400 hover:text-purple-700 font-semibold flex items-center gap-1"
              >
                <X size={14} /> 필터 전체 초기화
              </button>
            )}
          </div>

          {/* 1) 요리 목적 (Cooking Intent) 원터치 칩 버튼 */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Sparkles size={13} className="text-purple-600" />
              ① 오늘 어떤 요리를 계획 중이신가요? (요리 목적)
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'ALL', label: '전체 요리 보기' },
                { id: 'CHEF', label: '🧑‍🍳 동네 정육/맛집 셰프 수제 소분팩' },
                { id: 'STEAK', label: '🥩 홈파티 스테이크 (3cm 두께)' },
                { id: 'GRILL', label: '🥓 팬/불판 삼겹살·목살 구이' },
                { id: 'CAMPING', label: '🏕️ 캠핑 숯불 바베큐 / 돈마호크' },
                { id: 'SOUP', label: '🍲 국거리 / 미역국 / 찌개용' },
                { id: 'DIET', label: '🥗 헬스 & 다이어트 고단백 저지방' },
                { id: 'GIFT', label: '🎁 품격있는 1++ 한우 명절 선물' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setSelectedIntent(chip.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                    selectedIntent === chip.id
                      ? 'bg-purple-700 text-white shadow-sm scale-102'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2) 인원수(식사 규모) & 축종 카테고리 & 가격 슬라이더 복합 필터 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
            {/* 식사 인원수 */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Users size={14} className="text-purple-600" />
                ② 식사 규모 (인원수)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'ALL', label: '전체' },
                  { id: 'SINGLE', label: '1인 한끼 (200~300g)' },
                  { id: 'COUPLE', label: '2~3인 가족 (500~800g)' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPortion(p.id)}
                    className={`py-2 px-1 rounded-xl font-bold text-[11px] border transition-all text-center ${
                      selectedPortion === p.id
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 축종 구분 */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Package size={14} className="text-purple-600" />
                ③ 축종 카테고리
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {[
                  { id: 'ALL', label: '전체' },
                  { id: 'CHEF_PACK', label: '🧑‍🍳 셰프소분' },
                  { id: 'BEEF', label: '한우' },
                  { id: 'PORK', label: '한돈' },
                  { id: 'GIFT', label: '선물세트' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`py-2 rounded-xl font-bold text-[11px] border transition-all text-center ${
                      selectedCategory === c.id
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 예산 슬라이더 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <SlidersHorizontal size={14} className="text-purple-600" />
                  ④ 최대 예산 설정
                </label>
                <span className="font-bold text-purple-800">
                  {priceRange >= 300000 ? '전체 가격' : `${priceRange.toLocaleString()}원 이하`}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="300000"
                step="10000"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-purple-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1만원</span>
                <span>5만원</span>
                <span>15만원</span>
                <span>30만원+</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4.0 스마트 큐레이션 결과 상품 그리드 */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>추천 고기 상품 리스트</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold">
                  {filteredProducts.length}개 발견
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                모든 상품은 축평원 이력추적 검증 완료 및 진공 스킨 신선포장되어 출고됩니다.
              </p>
            </div>

            <span className="text-xs text-slate-400 hidden sm:inline">
              회원가입 5,000P 즉시 사용 가능
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <p className="text-4xl">🥩</p>
              <h3 className="font-bold text-base text-slate-800">조건에 맞는 상품이 없습니다</h3>
              <p className="text-xs text-slate-500">
                선택하신 요리 목적이나 예산 필터를 초기화하여 더 많은 고기를 둘러보세요.
              </p>
              <button
                onClick={() => {
                  setSelectedIntent('ALL');
                  setSelectedCategory('ALL');
                  setSelectedPortion('ALL');
                  setSearchQuery('');
                  setPriceRange(300000);
                }}
                className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold"
              >
                필터 초기화
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                >
                  {/* 상단 썸네일 & 뱃지 */}
                  <div className="relative aspect-4/3 bg-slate-900 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-purple-950 flex flex-col items-center justify-center text-4xl text-white">
                        <span>{product.imageDesc}</span>
                        <span className="text-[10px] text-purple-300 font-bold mt-1 tracking-wider">
                          DODRAM / EUMSEONG DIRECT
                        </span>
                      </div>
                    )}

                    {/* 등급 / 신선도 오버레이 뱃지 */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-700 text-white shadow-sm">
                        {product.badge}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-black/60 backdrop-blur-xs text-purple-200">
                        {product.freshnessBadge}
                      </span>
                    </div>

                    <span className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-md">
                      100g당 {product.pricePer100g?.toLocaleString()}원
                    </span>
                  </div>

                  {/* 본문 정보 */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-bold text-purple-800 flex items-center gap-1">
                          {product.isChefPack && (
                            <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                              식당수제
                            </span>
                          )}
                          {product.brand}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {product.storage === 'REFRIGERATED' ? '냉장 (0~2℃)' : '냉동'}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                        {product.name}
                      </h3>

                      {product.chefNote && (
                        <p className="text-[10px] text-purple-900 bg-purple-50 p-1.5 rounded-lg border border-purple-100 line-clamp-1 font-medium">
                          🧑‍🍳 {product.chefNote}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span>규격: {product.specWeight}</span>
                        {product.pickupAvailable && (
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            픽업 시 -{product.pickupDiscount?.toLocaleString()}원
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 축산물 이력추적 태그 */}
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 flex items-center gap-1 font-semibold">
                        <ShieldCheck size={12} className="text-emerald-600" />
                        이력번호:
                      </span>
                      <span className="font-mono font-bold text-slate-700">
                        {product.traceNumber}
                      </span>
                    </div>

                    {/* 가격 및 장바구니 담기 버튼 */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-red-600 font-extrabold text-sm">
                            {product.discountRate}%
                          </span>
                          <strong className="text-base font-extrabold text-slate-950">
                            {product.price.toLocaleString()}원
                          </strong>
                        </div>
                        <span className="text-[10px] text-slate-400 line-through">
                          {product.marketPrice?.toLocaleString()}원
                        </span>
                      </div>

                      <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <Truck size={11} /> {product.deliveryTag}
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-extrabold text-xs shadow-xs transition-all active:scale-98 flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart size={14} />
                        <span>장바구니 담고 주문하기</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5.0 사피에넷 리테일 신뢰 보증 배너 (안심 정책) */}
        <section className="bg-purple-50 rounded-3xl p-6 sm:p-8 border border-purple-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-purple-950">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-200 text-purple-800 flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm mb-1">100% 공인 축산물 이력제</h4>
              <p className="text-purple-800 text-[11px] leading-relaxed">
                출처가 불명확한 수입육 섞기나 등급 속임수 없이 축평원 DB와 실시간 연동된 도축장 원물만을 투명하게 공급합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-200 text-purple-800 flex items-center justify-center shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm mb-1">풀콜드체인 신선 새벽배송</h4>
              <p className="text-purple-800 text-[11px] leading-relaxed">
                도축·가공 직후 특수 진공 스킨팩 포장 후 영하 0~2℃ 냉장 상태를 유지하며 다음 날 아침 7시 문 앞까지 신선하게 배송합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-200 text-purple-800 flex items-center justify-center shrink-0">
              <BadgePercent size={22} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm mb-1">B2B 도매 직송 소분 단가</h4>
              <p className="text-purple-800 text-[11px] leading-relaxed">
                식당에 원박스로 납품하는 도매 공급자의 물량을 가정용으로 소분하여, 백화점/대형마트 대비 최대 30% 합리적인 가격을 보장합니다.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
