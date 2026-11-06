import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Coffee,
  Palette,
  ShieldCheck,
  Globe2,
  ExternalLink,
  Flower2,
  Compass,
  Users
} from 'lucide-react';
import { ARTHUR_PORTRAIT_URL } from '@/utils/sanctuaryStore';

export default function HomeLandingPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<'ko' | 'en'>('ko');

  const content = {
    ko: {
      badge: '글로벌 감성 웰니스 & 추모 아카이브',
      headlinePart1: '기억은 사라지지 않고,',
      headlinePart2: '따뜻한 온기로 남습니다.',
      subhead:
        '형식적이고 무거운 장례 문화에서 벗어나, 고인이 생전에 사랑했던 일상의 조각(취향, 음악, 사진, 커피 한 잔)으로 채우는 당신만의 2.5D 감성 추모 공간.',
      ctaPrimary: '추억 공간 만들기',
      ctaSecondary: '故 김아서 님 추모관 둘러보기',
      featuresTitle: '우리가 추모를 기억하는 따스한 방식',
      featuresSub: '형식적인 절차 대신, 사랑했던 사람의 취향과 이야기를 오롯이 담아냅니다.',
      feature1Title: '일상이 깃든 기억 (Passions)',
      feature1Desc: '국화꽃 대신 생전에 즐기시던 달달한 믹스커피, 레트로 게임기, 좋아하던 음악으로 기억합니다.',
      feature2Title: '자유로운 2.5D 캔버스 (Canvas)',
      feature2Desc: '정해진 틀 없이 원하는 위치와 각도로 사진과 소품, 손글씨 카드를 자유롭게 얹고 꾸밀 수 있습니다.',
      feature3Title: '부담 없는 따뜻한 위로 (Connection)',
      feature3Desc: '링크 하나로 소중한 사람들과 공유하고, 가벼운 헌화와 따뜻한 한마디로 온기를 나눕니다.',
      sampleTitle: '지금 기억되고 있는 따뜻한 공간들',
      sampleArthurTitle: '故 김아서 님 (1952 — 2024)',
      sampleArthurDesc: '산책길의 따뜻한 믹스커피와 옛 턴테이블 바이닐 가요를 사랑하셨던 아버지.',
      sampleBoriTitle: '사랑하는 반려견 보리 (2012 — 2023)',
      sampleBoriDesc: '언제나 꼬리를 흔들며 온 가족을 따뜻한 온기로 안아주던 소중한 막내.',
      footerQuote: '“사랑하는 사람은 떠나는 것이 아니라, 기억 속에서 가장 따뜻한 모습으로 머뭅니다.”',
      visitBtn: '공간 방문하기'
    },
    en: {
      badge: 'Global Wellness & Living Memorials',
      headlinePart1: 'Memories never fade,',
      headlinePart2: 'they remain as gentle warmth.',
      subhead:
        'Move beyond traditional somber formalities. Craft a freeform 2.5D digital sanctuary celebrating the everyday passions, tunes, photos, and living warmth of your loved one.',
      ctaPrimary: 'Create Memorial Space',
      ctaSecondary: 'Visit Arthur Kim’s Sanctuary',
      featuresTitle: 'A kinder, gentler way to remember',
      featuresSub: 'Celebrating life through cherished habits, little tokens, and enduring love.',
      feature1Title: 'Everyday Passions',
      feature1Desc: 'Remember with sweet mix coffee, vintage guitars, favorite songs, and heartfelt memories.',
      feature2Title: 'Freeform 2.5D Canvas',
      feature2Desc: 'No rigid templates. Freely place, rotate, and scale photos, handwritten cards, and tokens.',
      feature3Title: 'Gentle Shared Warmth',
      feature3Desc: 'Easily share with one link so family and friends can leave floral tokens and loving notes.',
      sampleTitle: 'Living sanctuaries cherished today',
      sampleArthurTitle: 'Arthur Kim (1952 — 2024)',
      sampleArthurDesc: 'A gentle father who loved morning strolls, sweet coffee, and classic vinyl melodies.',
      sampleBoriTitle: 'Beloved Companion Bori (2012 — 2023)',
      sampleBoriDesc: 'Our joyful pup whose gentle wagging tail brought endless sunshine to our home.',
      footerQuote: '“Those we love never truly leave; they live on in the gentle warmth of our shared memories.”',
      visitBtn: 'Visit Space'
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-amber-100 selection:text-stone-900 font-sans flex flex-col justify-between">
      {/* 1. 상단 글로벌 네비게이션 헤더 */}
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/85 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform">
              ✨
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-stone-900 block leading-tight">
                Sanctuary
              </span>
              <span className="text-[10px] text-stone-500 tracking-wider uppercase">
                Warm Minimalism Memorials
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* 마진스냅 계산기 바로가기 */}
            <button
              type="button"
              onClick={() => navigate('/margin')}
              className="px-2.5 sm:px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-semibold hover:bg-blue-100/70 transition-colors cursor-pointer flex items-center gap-1"
              title="글로벌 이커머스 마진 계산기 마진스냅"
            >
              <span>📊</span>
              <span className="hidden sm:inline">마진스냅</span>
            </button>

            {/* 언어 스위처 */}
            <button
              type="button"
              onClick={() => setLang((p) => (p === 'ko' ? 'en' : 'ko'))}
              className="px-2.5 py-1 rounded-full bg-white text-stone-700 border border-stone-200/60 text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
            >
              {lang === 'ko' ? 'EN' : '한국어'}
            </button>

            {/* 메인 CTA */}
            <button
              type="button"
              onClick={() => navigate('/studio')}
              className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>{t.ctaPrimary}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Empathy Warm Minimalism) */}
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center flex flex-col items-center">
          {/* 상단 뱃지 */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/70 shadow-2xs text-xs font-medium text-stone-600 mb-8 animate-in fade-in duration-500">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{t.badge}</span>
          </div>

          {/* 감성적인 메인 헤드카피 */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-stone-900 leading-[1.25] mb-6 font-serif max-w-3xl">
            <span className="block text-stone-700">{t.headlinePart1}</span>
            <span className="font-normal text-stone-950 italic underline decoration-amber-300 decoration-wavy decoration-2 underline-offset-8">
              {t.headlinePart2}
            </span>
          </h1>

          {/* 따뜻한 서브카피 */}
          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed mb-10 font-sans">
            {t.subhead}
          </p>

          {/* 액션 버튼 그룹 */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            {/* [추억 공간 만들기] 메인 CTA */}
            <button
              type="button"
              onClick={() => navigate('/studio')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-sm sm:text-base font-medium shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles size={16} className="text-amber-300" />
              <span>{t.ctaPrimary}</span>
              <ArrowRight size={16} />
            </button>

            {/* 서브 CTA: 샘플 추모관 둘러보기 */}
            <button
              type="button"
              onClick={() => navigate('/sanctuary/arthur')}
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/80 text-sm font-medium shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t.ctaSecondary}</span>
            </button>
          </div>

          {/* 3. 공간 캔버스 실시간 인터랙티브 목업 프리뷰 */}
          <div className="mt-14 w-full max-w-md mx-auto relative group">
            <div className="relative rounded-3xl bg-white p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-stone-200/70 overflow-hidden">
              <div className="relative h-96 rounded-2xl overflow-hidden bg-[#FAF8F5] flex flex-col justify-between p-4 border border-stone-100">
                {/* 상단 무드 인디케이터 */}
                <div className="flex items-center justify-between z-10">
                  <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/60 text-xs font-semibold text-stone-800 shadow-2xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>故 김아서 님의 정원</span>
                  </div>
                  <span className="text-[11px] text-stone-400 bg-white/80 px-2 py-0.5 rounded-full">
                    실시간 2.5D
                  </span>
                </div>

                {/* 중앙 오브젝트 시뮬레이션 */}
                <div className="relative flex-1 flex flex-col items-center justify-center my-auto">
                  <div className="relative flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full p-1 bg-white shadow-md ring-2 ring-stone-200 overflow-hidden flex items-center justify-center">
                      <img
                        src={ARTHUR_PORTRAIT_URL}
                        alt="故 김아서 님"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="mt-1.5 bg-white text-stone-700 border border-stone-200 rounded-full px-2.5 py-0.5 text-[10px] font-medium shadow-2xs">
                      1952 — 2024
                    </span>
                  </div>

                  {/* 얹혀진 라이프스타일 소품 토큰들 */}
                  <div className="absolute left-6 top-8 w-12 h-12 rounded-2xl bg-white shadow-sm border border-stone-100 flex items-center justify-center text-2xl -rotate-6">
                    ☕
                  </div>
                  <div className="absolute right-6 top-6 w-12 h-12 rounded-2xl bg-white shadow-sm border border-stone-100 flex items-center justify-center text-2xl rotate-8">
                    🎮
                  </div>
                  <div className="absolute left-10 bottom-4 w-12 h-12 rounded-2xl bg-white shadow-sm border border-stone-100 flex items-center justify-center text-2xl rotate-12">
                    🕶️
                  </div>
                  <div className="absolute right-10 bottom-6 w-12 h-12 rounded-2xl bg-white shadow-sm border border-stone-100 flex items-center justify-center text-2xl -rotate-8">
                    🐾
                  </div>
                </div>

                {/* 하단 플로팅 캡슐 알약 바 (미리보기) */}
                <div className="mx-auto rounded-full bg-white/90 backdrop-blur-md px-5 py-2 shadow-sm border border-stone-200/70 flex items-center gap-4 text-xs font-medium text-stone-700 z-10">
                  <span>✨ 추억 얹기</span>
                  <span className="text-stone-300">·</span>
                  <span>🖼️ 배경</span>
                  <span className="text-stone-300">·</span>
                  <span>👁️ 온전히 보기</span>
                </div>
              </div>
            </div>

            {/* 바로 열어보기 오버레이 링크 버튼 */}
            <div
              onClick={() => navigate('/studio')}
              className="mt-3 text-center cursor-pointer"
            >
              <span className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1 font-medium underline underline-offset-4">
                <span>지금 이 공간 직접 꾸며보기</span>
                <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </section>

        {/* 4. 세 가지 핵심 차별화 가치 (3 Core Pillars) */}
        <section className="bg-white py-16 sm:py-20 border-y border-stone-200/60">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-3 font-serif">
                {t.featuresTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                {t.featuresSub}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="bg-[#FAF8F5] rounded-3xl p-7 border border-stone-200/60 flex flex-col items-start text-left">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl mb-5">
                  ☕
                </div>
                <h3 className="text-base font-semibold text-stone-900 mb-2">
                  {t.feature1Title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t.feature1Desc}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#FAF8F5] rounded-3xl p-7 border border-stone-200/60 flex flex-col items-start text-left">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl mb-5">
                  🎨
                </div>
                <h3 className="text-base font-semibold text-stone-900 mb-2">
                  {t.feature2Title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t.feature2Desc}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#FAF8F5] rounded-3xl p-7 border border-stone-200/60 flex flex-col items-start text-left">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl mb-5">
                  🕊️
                </div>
                <h3 className="text-base font-semibold text-stone-900 mb-2">
                  {t.feature3Title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t.feature3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 실제 운영 샘플 추모관 둘러보기 (Sample Sanctuary Showcase) */}
        <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-light text-stone-900 mb-2 font-serif">
              {t.sampleTitle}
            </h2>
            <p className="text-xs text-stone-500">
              실제 방문객들이 링크를 통해 찾아와 조용히 온기를 전하고 있습니다
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Card 1: 故 김아서 님 */}
            <div
              onClick={() => navigate('/sanctuary/arthur')}
              className="bg-white rounded-3xl p-6 border border-stone-200/70 shadow-sm hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between cursor-pointer group active:scale-[0.98]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-stone-100 overflow-hidden flex items-center justify-center border border-stone-200">
                    <img
                      src={ARTHUR_PORTRAIT_URL}
                      alt="Arthur Kim"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                    인기 추모관
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors mb-1">
                  {t.sampleArthurTitle}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {t.sampleArthurDesc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 font-medium">
                <span>{t.visitBtn}</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: 사랑하는 반려견 보리 */}
            <div
              onClick={() => navigate('/sanctuary/bori')}
              className="bg-white rounded-3xl p-6 border border-stone-200/70 shadow-sm hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between cursor-pointer group active:scale-[0.98]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-xl border border-amber-200/60">
                    🐕
                  </div>
                  <span className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
                    반려동물
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors mb-1">
                  {t.sampleBoriTitle}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {t.sampleBoriDesc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 font-medium">
                <span>{t.visitBtn}</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. 하단 푸터 (Empathy Style Warm Footer) */}
      <footer className="border-t border-stone-200/60 bg-[#FAF8F5] py-10 px-6 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
          <p className="text-xs text-stone-500 font-serif italic max-w-md">
            {t.footerQuote}
          </p>
          <div className="text-[11px] text-stone-400 mt-2">
            © 2026 Sanctuary. All memories preserved with gentle warmth and dignity.
          </div>
        </div>
      </footer>
    </div>
  );
}
