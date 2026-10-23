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
      {/* 상단 최상위: 언어 선택 토글 바 (우측 정렬) */}
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
        {/* 서비스 타이틀 & 슬로건 */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            {t.appTitle.split(' ')[0]}{' '}
            <span className="text-blue-600">{t.appTitle.split(' ')[1] || '119'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {t.subTagline}
          </p>
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
