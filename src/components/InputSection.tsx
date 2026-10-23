import React from 'react';
import { ChevronDown, ChevronUp, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { MarginInputState, TaxType } from '../types/margin';
import { PLATFORM_PRESETS } from '../constants/feePresets';
import { TranslationDictionary } from '../constants/translations';

interface InputSectionProps {
  input: MarginInputState;
  setInput: React.Dispatch<React.SetStateAction<MarginInputState>>;
  isAdvancedOpen: boolean;
  setIsAdvancedOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handlePlatformChange: (platform: MarginInputState['platform']) => void;
  resetToDefaults: () => void;
  t: TranslationDictionary;
}

export const InputSection: React.FC<InputSectionProps> = ({
  input,
  setInput,
  isAdvancedOpen,
  setIsAdvancedOpen,
  handlePlatformChange,
  resetToDefaults,
  t,
}) => {
  const currentPlatform = PLATFORM_PRESETS[input.platform] || PLATFORM_PRESETS.COUPANG_WING;
  const isUSD = currentPlatform.currency === 'USD';
  const sym = currentPlatform.currencySymbol;

  const updateField = (field: keyof MarginInputState, value: any) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceInput = (field: keyof MarginInputState, valStr: string) => {
    if (isUSD) {
      // USD 소수점 허용
      const cleaned = valStr.replace(/[^0-9.]/g, '');
      const parts = cleaned.split('.');
      const formatted = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
      const num = formatted === '' ? 0 : parseFloat(formatted);
      updateField(field, isNaN(num) ? 0 : num);
    } else {
      // KRW / JPY 정수
      const cleaned = valStr.replace(/[^0-9]/g, '');
      const num = cleaned === '' ? 0 : parseInt(cleaned, 10);
      updateField(field, num);
    }
  };

  const displayVal = (num: number) => {
    if (!num && num !== 0) return '';
    if (isUSD) return num.toString();
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* 1. 플랫폼 및 카테고리 선택 (글로벌 8대 마켓 프리셋) */}
      <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {t.sec1Title}
            </h3>
          </div>
          <button
            type="button"
            onClick={resetToDefaults}
            className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.reset}
          </button>
        </div>

        {/* 글로벌 플랫폼 탭 그리드 (8개 마켓) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {Object.values(PLATFORM_PRESETS).map((p) => {
            const isSelected = input.platform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePlatformChange(p.id)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-center ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-[1.02]'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{p.badge}</span>
                  <span className="text-[10px] opacity-75 font-mono">({p.currencySymbol})</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 카테고리 드롭다운 */}
        {input.platform !== 'CUSTOM' ? (
          <div>
            <div className="relative">
              <select
                value={input.category}
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
            {!currentPlatform.vatIncludedInFee && (
              <p className="mt-2 text-[11px] text-amber-700 font-medium flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
                {t.coupangVatNotice}
              </p>
            )}
          </div>
        ) : (
          <div>
            <div className="relative bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                {t.customFeeRate}
              </span>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  step="0.1"
                  value={input.customFeeRate}
                  onChange={(e) => updateField('customFeeRate', parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-bold text-slate-900 bg-transparent focus:outline-none"
                />
                <span className="text-sm font-bold text-slate-400">%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 판매 가격 & 배송비 (통화 기호 연동) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.sec2Title}
          </span>
          <button
            type="button"
            onClick={() =>
              updateField(
                'customerShippingFee',
                input.customerShippingFee === 0 ? (isUSD ? 3.0 : currentPlatform.currency === 'JPY' ? 300 : 3000) : 0
              )
            }
            className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
          >
            {input.customerShippingFee === 0
              ? `${t.switchPaidShip} (+${sym}${isUSD ? '3.00' : currentPlatform.currency === 'JPY' ? '300' : '3,000'})`
              : t.switchFreeShip}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 상품 판매가 */}
          <div className="bg-slate-50/70 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-slate-200/80 rounded-2xl p-4 transition-all">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight block mb-1">
              {t.salePrice} <span className="text-red-500">*</span>
            </span>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={displayVal(input.salePrice)}
                onChange={(e) => handlePriceInput('salePrice', e.target.value)}
                placeholder={isUSD ? '25.00' : '25,000'}
                className="w-full text-xl sm:text-2xl font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
              />
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md ml-2">
                {sym}
              </span>
            </div>
          </div>

          {/* 고객 부담 배송비 */}
          <div className="bg-slate-50/70 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-slate-200/80 rounded-2xl p-4 transition-all">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight block mb-1">
              {t.customerShippingFee}
            </span>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={displayVal(input.customerShippingFee)}
                onChange={(e) => handlePriceInput('customerShippingFee', e.target.value)}
                placeholder="0"
                className="w-full text-xl sm:text-2xl font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
              />
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md ml-2">
                {sym}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 매입 원가 및 물류비 (통화 기호 연동) */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          {t.sec3Title}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 상품 사입원가 */}
          <div className="bg-slate-50/70 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-slate-200/80 rounded-2xl p-3.5 transition-all">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight block mb-1">
              {t.productCost} <span className="text-red-500">*</span>
            </span>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={displayVal(input.productCost)}
                onChange={(e) => handlePriceInput('productCost', e.target.value)}
                placeholder={isUSD ? '10.00' : '11,000'}
                className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
              />
              <span className="text-xs font-bold text-slate-400 ml-1">{sym}</span>
            </div>
          </div>

          {/* 판매자 실 배송비 */}
          <div className="bg-slate-50/70 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-slate-200/80 rounded-2xl p-3.5 transition-all">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight block mb-1">
              {t.actualShippingFee}
            </span>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={displayVal(input.actualShippingFee)}
                onChange={(e) => handlePriceInput('actualShippingFee', e.target.value)}
                placeholder={isUSD ? '2.80' : '2,800'}
                className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
              />
              <span className="text-xs font-bold text-slate-400 ml-1">{sym}</span>
            </div>
          </div>

          {/* 포장 부자재비 */}
          <div className="bg-slate-50/70 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-slate-200/80 rounded-2xl p-3.5 transition-all">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight block mb-1">
              {t.packagingCost}
            </span>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={displayVal(input.packagingCost)}
                onChange={(e) => handlePriceInput('packagingCost', e.target.value)}
                placeholder={isUSD ? '0.50' : '500'}
                className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
              />
              <span className="text-xs font-bold text-slate-400 ml-1">{sym}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 숨은 비용 설정 */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full py-3.5 px-4.5 bg-slate-50/50 flex items-center justify-between text-left hover:bg-slate-100/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-700">{t.sec4Title}</span>
            <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {t.precisionCalc}
            </span>
          </div>
          {isAdvancedOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isAdvancedOpen && (
          <div className="p-4 sm:p-5 space-y-4 bg-white border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 개당 광고비 */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {t.adCost}
                </span>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={displayVal(input.adCostPerUnit)}
                    onChange={(e) => handlePriceInput('adCostPerUnit', e.target.value)}
                    placeholder={isUSD ? '1.50' : '1,500'}
                    className="w-full text-base font-bold text-slate-900 bg-transparent focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">{sym}</span>
                </div>
              </div>

              {/* 반품 충당율 */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {t.returnReserveRate}
                </span>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    value={input.returnReserveRate}
                    onChange={(e) =>
                      updateField('returnReserveRate', parseFloat(e.target.value) || 0)
                    }
                    className="w-full text-base font-bold text-slate-900 bg-transparent focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
              </div>
            </div>

            {/* 과세 유형 */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                {t.taxType}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'GENERAL', label: t.taxGeneral },
                  { id: 'SIMPLE', label: t.taxSimple },
                  { id: 'TAX_FREE', label: t.taxFree },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateField('taxType', item.id as TaxType)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      input.taxType === item.id
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
