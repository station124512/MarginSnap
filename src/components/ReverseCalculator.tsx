import React from 'react';
import { Target, Check, Store, ChevronDown, Sparkles } from 'lucide-react';
import { ReverseInputState, ReverseCalculationResult } from '../types/margin';
import { PLATFORM_PRESETS } from '../constants/feePresets';
import { TranslationDictionary } from '../constants/translations';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface ReverseCalculatorProps {
  reverseInput: ReverseInputState;
  setReverseInput: React.Dispatch<React.SetStateAction<ReverseInputState>>;
  reverseResult: ReverseCalculationResult;
  handleReversePlatformChange: (platform: ReverseInputState['platform']) => void;
  applyReversePriceToStandard: () => void;
  t: TranslationDictionary;
}

export const ReverseCalculator: React.FC<ReverseCalculatorProps> = ({
  reverseInput,
  setReverseInput,
  reverseResult,
  handleReversePlatformChange,
  applyReversePriceToStandard,
  t,
}) => {
  const currentPlatform =
    PLATFORM_PRESETS[reverseInput.platform] || PLATFORM_PRESETS.COUPANG_WING;
  const isUSD = currentPlatform.currency === 'USD';
  const sym = currentPlatform.currencySymbol;

  const updateField = (field: keyof ReverseInputState, value: any) => {
    setReverseInput((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceInput = (field: keyof ReverseInputState, valStr: string) => {
    const MAX_LIMIT = isUSD ? 1_000_000 : 100_000_000;
    const firstSegment = valStr.trim().split(/[\r\n|,/]/)[0] || '';

    if (isUSD) {
      const cleaned = firstSegment.replace(/[^0-9.]/g, '');
      const parts = cleaned.split('.');
      const formatted = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
      let num = formatted === '' ? 0 : parseFloat(formatted);
      if (isNaN(num)) num = 0;
      if (num > MAX_LIMIT) num = MAX_LIMIT;
      updateField(field, num);
    } else {
      const cleaned = firstSegment.replace(/[^0-9]/g, '');
      let num = cleaned === '' ? 0 : parseInt(cleaned, 10);
      if (isNaN(num)) num = 0;
      if (num > MAX_LIMIT) num = MAX_LIMIT;
      updateField(field, num);
    }
  };

  const displayVal = (num: number) => {
    if (!num && num !== 0) return '';
    if (isUSD) return num.toString();
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 좌측: 역산 조건 입력 카드 */}
      <div className="lg:col-span-7 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {t.reverseTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {t.reverseSub}
          </p>
        </div>

        {/* 1. 목표 기준 선택 (토스 알약형 Pill 스타일) */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-tight block">
            {t.reverseTargetType}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateField('targetType', 'MARGIN_RATE')}
              className={`py-2.5 px-4 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer text-center ${
                reverseInput.targetType === 'MARGIN_RATE'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100/50'
              }`}
            >
              {t.reverseMarginRate}
            </button>
            <button
              type="button"
              onClick={() => updateField('targetType', 'NET_PROFIT')}
              className={`py-2.5 px-4 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer text-center ${
                reverseInput.targetType === 'NET_PROFIT'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100/50'
              }`}
            >
              {t.reverseNetProfit}
            </button>
          </div>

          {reverseInput.targetType === 'MARGIN_RATE' ? (
            <div className="pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>{t.reverseTargetLabel}</span>
                <span className="text-blue-600 font-black">{reverseInput.targetValue}%</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[15, 20, 25, 30].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => updateField('targetValue', rate)}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      reverseInput.targetValue === rate
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100/60'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight block mb-1">
                  {t.reverseNetProfit}
                </span>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={displayVal(reverseInput.targetValue)}
                    onChange={(e) => handlePriceInput('targetValue', e.target.value)}
                    placeholder={isUSD ? '5.00' : '5,000'}
                    className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
                  />
                  <span className="text-xs font-bold text-slate-400">{sym}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. 글로벌 플랫폼 선택 */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {t.sec1Title}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.values(PLATFORM_PRESETS).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleReversePlatformChange(p.id)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-center ${
                  reverseInput.platform === p.id
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{p.badge}</span>
                  <span className="text-[10px] opacity-75 font-mono">({p.currencySymbol})</span>
                </div>
              </button>
            ))}
          </div>

          {reverseInput.platform !== 'CUSTOM' ? (
            <div className="relative">
              <select
                value={reverseInput.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none pr-10 cursor-pointer shadow-sm transition-all"
              >
                {currentPlatform.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          ) : (
            <div className="relative bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                {t.customFeeRate}
              </span>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  step="0.1"
                  value={reverseInput.customFeeRate}
                  onChange={(e) =>
                    updateField('customFeeRate', parseFloat(e.target.value) || 0)
                  }
                  className="w-full text-base font-bold text-slate-900 bg-transparent focus:outline-none"
                />
                <span className="text-sm font-bold text-slate-400">%</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. 기본 원가 입력 (통화 연동) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-50/70 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-slate-200/80 rounded-2xl p-3.5 transition-all">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight block mb-1">
              {t.productCost} <span className="text-red-500">*</span>
            </span>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={displayVal(reverseInput.productCost)}
                onChange={(e) => handlePriceInput('productCost', e.target.value)}
                placeholder={isUSD ? '10.00' : '11,000'}
                className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
              />
              <span className="text-xs font-bold text-slate-400">{sym}</span>
            </div>
          </div>

          <div className="bg-slate-50/70 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-slate-200/80 rounded-2xl p-3.5 transition-all">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight block mb-1">
              {t.actualShippingFee}
            </span>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={displayVal(reverseInput.actualShippingFee)}
                onChange={(e) => handlePriceInput('actualShippingFee', e.target.value)}
                placeholder={isUSD ? '2.80' : '2,800'}
                className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
              />
              <span className="text-xs font-bold text-slate-400">{sym}</span>
            </div>
          </div>

          <div className="bg-slate-50/70 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-slate-200/80 rounded-2xl p-3.5 transition-all">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight block mb-1">
              {t.customerShippingFee}
            </span>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={displayVal(reverseInput.customerShippingFee)}
                onChange={(e) => handlePriceInput('customerShippingFee', e.target.value)}
                placeholder={isUSD ? '3.00' : '3,000'}
                className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
              />
              <span className="text-xs font-bold text-slate-400">{sym}</span>
            </div>
          </div>

          <div className="bg-slate-50/70 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-slate-200/80 rounded-2xl p-3.5 transition-all">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight block mb-1">
              {t.labelAd} + {t.packagingCost}
            </span>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={displayVal(reverseInput.packagingCost + reverseInput.adCostPerUnit)}
                onChange={(e) => {
                  const cleaned = isUSD
                    ? e.target.value.replace(/[^0-9.]/g, '')
                    : e.target.value.replace(/[^0-9]/g, '');
                  const num = cleaned === '' ? 0 : parseFloat(cleaned);
                  updateField('adCostPerUnit', isNaN(num) ? 0 : num);
                  updateField('packagingCost', 0);
                }}
                className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
              />
              <span className="text-xs font-bold text-slate-400">{sym}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 우측: 토스 스타일 역산 추천 카드 (통화 연동) */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            {t.reverseRecommendTitle}
          </span>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-600 tracking-tight mt-3">
            {formatCurrency(reverseResult.recommendedSalePrice, currentPlatform.currency)}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {t.reverseRecommendSub}
          </p>
        </div>

        {/* 시뮬레이션 명세표 */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>{t.netProfitLabel}</span>
            <span className="font-black text-slate-900 text-sm">
              {formatCurrency(reverseResult.targetNetProfit, currentPlatform.currency)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>{t.marginRateLabel}</span>
            <span className="font-bold text-emerald-600">
              {formatPercent(reverseResult.targetMarginRate)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>{t.flowFee}</span>
            <span className="text-red-600 font-medium">
              - {formatCurrency(reverseResult.simulatedResult.totalPlatformFee, currentPlatform.currency)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200/60">
            <span>{t.flowSettlement}</span>
            <span className="font-black text-slate-900">
              {formatCurrency(reverseResult.simulatedResult.settlementAmount, currentPlatform.currency)}
            </span>
          </div>
        </div>

        {/* 적용 버튼 */}
        <button
          type="button"
          onClick={applyReversePriceToStandard}
          className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 transition-all cursor-pointer active:scale-98"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          {t.reverseApplyBtn}
        </button>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed font-medium">
          {t.reverseNotice}
        </p>
      </div>
    </div>
  );
};
