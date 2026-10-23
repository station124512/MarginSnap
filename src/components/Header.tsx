import React from 'react';
import { Calculator, Target, Globe } from 'lucide-react';
import { MarginInputState, Language } from '../types/margin';
import { TranslationDictionary } from '../constants/translations';

interface HeaderProps {
  mode: MarginInputState['calculatorMode'];
  setMode: (mode: MarginInputState['calculatorMode']) => void;
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  language,
  changeLanguage,
  t,
}) => {
  const languages: { code: Language; label: string }[] = [
    { code: 'KO', label: 'KO' },
    { code: 'EN', label: 'EN' },
    { code: 'JA', label: '日本語' },
    { code: 'ZH', label: '中文' },
  ];

  return (
    <header className="mb-8">
      {/* 상단 최상위: 태그 및 언어 선택 토글 바 (우측 정렬) */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            {t.tagline}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
            {t.badgeVerified}
          </span>
        </div>

        {/* 언어 변경 알약형(Pill) 토글 스위처 [ KO | EN | 日本語 | 中文 ] */}
        <div className="inline-flex items-center p-1 bg-slate-200/70 rounded-full border border-slate-200/80 shadow-inner">
          <Globe className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1 hidden sm:block" />
          {languages.map((l) => {
            const isSelected = language === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => changeLanguage(l.code)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-blue-600 shadow-sm scale-[1.03]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        {/* 서비스 로고 및 타이틀 & 슬로건 (마진스냅 MarginSnap) */}
        <div className="flex items-center gap-3 group">
          {/* 심볼 아이콘: 포커스 프레임 [ ] + 상승 화살표 ↗ + 퍼센트 기호 % 결합형 모던 벡터 마크 */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-emerald-500 p-2 flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <svg
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-white"
              aria-label="MarginSnap Logo Icon"
            >
              {/* 포커스 프레임 브래킷 [ ] */}
              <path
                d="M6 12V8C6 6.89543 6.89543 6 8 6H12"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.85"
              />
              <path
                d="M24 6H28C29.1046 6 30 6.89543 30 8V12"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.85"
              />
              <path
                d="M6 24V28C6 29.1046 6.89543 30 8 30H12"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.85"
              />
              <path
                d="M24 30H28C29.1046 30 30 29.1046 30 28V24"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.85"
              />

              {/* 수익 상승 화살표 ↗ */}
              <path
                d="M12 24L23.5 12.5"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M16.5 12.5H23.5V19.5"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 마진율 % 도트 노드 */}
              <circle cx="13.5" cy="14" r="2" fill="currentColor" />
              <circle cx="22.5" cy="22" r="2" fill="currentColor" />
            </svg>
          </div>

          {/* 오른쪽 텍스트: 타이틀과 슬로건 완벽 수평 정렬 */}
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-none">
              {language === 'KO' ? (
                <>
                  마진스냅{' '}
                  <span className="text-blue-600 font-extrabold text-lg sm:text-xl">
                    (MarginSnap)
                  </span>
                </>
              ) : language === 'ZH' ? (
                <>
                  MarginSnap{' '}
                  <span className="text-blue-600 font-extrabold text-lg sm:text-xl">
                    (利润快算)
                  </span>
                </>
              ) : (
                <>
                  Margin<span className="text-blue-600 font-black">Snap</span>
                </>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 truncate sm:whitespace-normal">
              {t.subTagline}
            </p>
          </div>
        </div>

        {/* 토스 스타일 알약형(Pill) 탭 스위처 */}
        <div className="inline-flex p-1.5 bg-slate-200/70 rounded-full border border-slate-200/60 self-start md:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setMode('STANDARD')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 cursor-pointer ${
              mode === 'STANDARD'
                ? 'bg-white text-blue-600 shadow-sm scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4" />
            {t.tabStandard}
          </button>
          <button
            type="button"
            onClick={() => setMode('REVERSE')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 cursor-pointer ${
              mode === 'REVERSE'
                ? 'bg-white text-blue-600 shadow-sm scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-500" />
            {t.tabReverse}
          </button>
        </div>
      </div>
    </header>
  );
};
