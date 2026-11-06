import React from 'react';
import { ChevronDown, ChevronUp, RotateCcw, SlidersHorizontal, ArrowRightLeft } from 'lucide-react';
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
  const isForeign = currentPlatform.currency !== 'KRW';
  const isUSD = currentPlatform.currency === 'USD';
  const rate = isUSD ? (input.exchangeRateUsd || 1400) : (input.exchangeRateJpy || 9.3);
  const isDecimal = isUSD && !input.inputInKrw;
  const sym = input.inputInKrw ? '₩' : currentPlatform.currencySymbol;

  const updateField = (field: keyof MarginInputState, value: any) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  // 1000 단위 이상 입력 시 쉼표(,) 때문에 잘리던 버그 완벽 수정
  const handlePriceInput = (field: keyof MarginInputState, valStr: string) => {
    // 줄바꿈만 분리하고 쉼표(,)는 절대 자르지 않음!
    const firstLine = valStr.trim().split(/[\r\n]+/)[0] || '';
    const noCommas = firstLine.replace(/,/g, '');

    const isFieldDecimal = isUSD && !input.inputInKrw;
    const MAX_LIMIT = isFieldDecimal ? 1_000_000 : 100_000_000;

    if (isFieldDecimal) {
      const cleaned = noCommas.replace(/[^0-9.]/g, '');
      const parts = cleaned.split('.');
      const formatted = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
      let num = formatted === '' ? 0 : parseFloat(formatted);
      if (isNaN(num)) num = 0;
      if (num > MAX_LIMIT) num = MAX_LIMIT;
      updateField(field, num);
    } else {
      const cleaned = noCommas.replace(/[^0-9]/g, '');
      let num = cleaned === '' ? 0 : parseInt(cleaned, 10);
      if (isNaN(num)) num = 0;
      if (num > MAX_LIMIT) num = MAX_LIMIT;
      updateField(field, num);
    }
  };

  const displayVal = (num: number) => {
    if (!num && num !== 0) return '';
    if (num === 0) return '';
    if (isUSD && !input.inputInKrw) return num.toString();
    return num.toLocaleString('ko-KR');
  };

  // 해외 플랫폼일 때 원화/외화 실시간 상호 환산 프리뷰
  const renderDualPreview = (val: number) => {
    if (!isForeign || !val) return null;
    if (input.inputInKrw) {
      const foreignVal = isUSD ? (val / rate).toFixed(2) : Math.round(val / rate).toLocaleString();
      return (
        <span className="text-[11px] font-semibold text-blue-600 block mt-1">
          ≈ {currentPlatform.currencySymbol}{foreignVal} (현지 통화 환산)
        </span>
      );
    } else {
      const krwVal = Math.round(val * rate).toLocaleString();
      return (
        <span className="text-[11px] font-semibold text-blue-600 block mt-1">
          ≈ {krwVal}원 (환율 {rate.toLocaleString()}원 적용)
        </span>
      );
    }
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

        {/* 해외 플랫폼 환율 & 원화(₩) 계산 모드 컨트롤 배너 */}
        {isForeign && (
          <div className="mb-3.5 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">💱</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-800">
                    해외 마켓 실시간 환율 & 원화 계산
                  </span>
                  <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                    {currentPlatform.badge}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {isUSD ? `기준 환율: 1$ = ${rate.toLocaleString()}원` : `기준 환율: 100¥ = ${(rate * 100).toLocaleString()}원`} (직접 수정 가능)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* 환율 수정 인풋 */}
              <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1 text-xs shadow-2xs">
                <span className="text-[11px] text-slate-400 font-bold">{isUSD ? '1$ =' : '1¥ ='}</span>
                <input
                  type="number"
                  step={isUSD ? 1 : 0.1}
                  value={isUSD ? (input.exchangeRateUsd || 1400) : (input.exchangeRateJpy || 9.3)}
                  onChange={(e) =>
                    updateField(
                      isUSD ? 'exchangeRateUsd' : 'exchangeRateJpy',
                      parseFloat(e.target.value) || (isUSD ? 1400 : 9.3)
                    )
                  }
                  className="w-14 font-black text-slate-800 text-xs focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 font-bold">원</span>
              </div>

              {/* 원화(₩)로 계산하기 토글 버튼 */}
              <button
                type="button"
                onClick={() => {
                  const nextInKrw = !input.inputInKrw;
                  if (nextInKrw) {
                    // 외화 -> 원화 환산
                    setInput((prev) => ({
                      ...prev,
                      inputInKrw: true,
                      salePrice: Math.round(prev.salePrice * rate),
                      customerShippingFee: Math.round(prev.customerShippingFee * rate),
                      productCost: Math.round(prev.productCost * rate),
                      actualShippingFee: Math.round(prev.actualShippingFee * rate),
                      packagingCost: Math.round(prev.packagingCost * rate),
                      adCostPerUnit: Math.round(prev.adCostPerUnit * rate),
                    }));
                  } else {
                    // 원화 -> 외화 환산
                    setInput((prev) => ({
                      ...prev,
                      inputInKrw: false,
                      salePrice: isUSD ? Number((prev.salePrice / rate).toFixed(2)) : Math.round(prev.salePrice / rate),
                      customerShippingFee: isUSD ? Number((prev.customerShippingFee / rate).toFixed(2)) : Math.round(prev.customerShippingFee / rate),
                      productCost: isUSD ? Number((prev.productCost / rate).toFixed(2)) : Math.round(prev.productCost / rate),
                      actualShippingFee: isUSD ? Number((prev.actualShippingFee / rate).toFixed(2)) : Math.round(prev.actualShippingFee / rate),
                      packagingCost: isUSD ? Number((prev.packagingCost / rate).toFixed(2)) : Math.round(prev.packagingCost / rate),
                      adCostPerUnit: isUSD ? Number((prev.adCostPerUnit / rate).toFixed(2)) : Math.round(prev.adCostPerUnit / rate),
                    }));
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-xs active:scale-95 ${
                  input.inputInKrw
                    ? 'bg-blue-600 text-white shadow-blue-500/25'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>{input.inputInKrw ? '🇰🇷 한국 원화(₩)로 계산' : '🌐 현지 외화($)로 계산'}</span>
              </button>
            </div>
          </div>
        )}

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
                input.customerShippingFee === 0
                  ? input.inputInKrw
                    ? 3000
                    : isUSD
                    ? 3.0
                    : currentPlatform.currency === 'JPY'
                    ? 300
                    : 3000
                  : 0
              )
            }
            className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
          >
            {input.customerShippingFee === 0
              ? `${t.switchPaidShip} (+${sym}${input.inputInKrw ? '3,000' : isUSD ? '3.00' : currentPlatform.currency === 'JPY' ? '300' : '3,000'})`
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
                placeholder={input.inputInKrw ? '35,000' : isUSD ? '25.00' : '25,000'}
                className="w-full text-xl sm:text-2xl font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
              />
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md ml-2">
                {sym}
              </span>
            </div>
            {renderDualPreview(input.salePrice)}
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
            {renderDualPreview(input.customerShippingFee)}
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
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                {t.productCost} <span className="text-red-500">*</span>
              </span>
              {/* 해외 플랫폼이면서 외화 입력 모드일 때 원화 입력 도우미 버튼 */}
              {isForeign && !input.inputInKrw && (
                <button
                  type="button"
                  onClick={() => {
                    const krwStr = prompt('국내 사입 원가(원 단위)를 입력하세요:', '14000');
                    if (krwStr) {
                      const krwNum = parseInt(krwStr.replace(/[^0-9]/g, ''), 10);
                      if (!isNaN(krwNum) && krwNum > 0) {
                        const foreignVal = isUSD
                          ? Number((krwNum / rate).toFixed(2))
                          : Math.round(krwNum / rate);
                        updateField('productCost', foreignVal);
                      }
                    }
                  }}
                  className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  + ₩원가입력
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={displayVal(input.productCost)}
                onChange={(e) => handlePriceInput('productCost', e.target.value)}
                placeholder={input.inputInKrw ? '14,000' : isUSD ? '10.00' : '11,000'}
                className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
              />
              <span className="text-xs font-bold text-slate-400 ml-1">{sym}</span>
            </div>
            {renderDualPreview(input.productCost)}
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
                placeholder={input.inputInKrw ? '3,500' : isUSD ? '2.80' : '2,800'}
                className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
              />
              <span className="text-xs font-bold text-slate-400 ml-1">{sym}</span>
            </div>
            {renderDualPreview(input.actualShippingFee)}
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
                placeholder={input.inputInKrw ? '700' : isUSD ? '0.50' : '500'}
                className="w-full text-lg font-black text-slate-900 bg-transparent focus:outline-none tracking-tight"
              />
              <span className="text-xs font-bold text-slate-400 ml-1">{sym}</span>
            </div>
            {renderDualPreview(input.packagingCost)}
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
                    placeholder={input.inputInKrw ? '2,100' : isUSD ? '1.50' : '1,500'}
                    className="w-full text-base font-bold text-slate-900 bg-transparent focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">{sym}</span>
                </div>
                {renderDualPreview(input.adCostPerUnit)}
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
