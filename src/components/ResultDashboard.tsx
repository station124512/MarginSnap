import React from 'react';
import { Copy, Receipt, BookmarkPlus, Flame } from 'lucide-react';
import { MarginResult, MarginInputState } from '../types/margin';
import { PLATFORM_PRESETS } from '../constants/feePresets';
import { TranslationDictionary } from '../constants/translations';
import { formatCurrency, formatSignedCurrency, formatPercent } from '../utils/formatters';
import { CostDonutChart } from './CostDonutChart';

interface ResultDashboardProps {
  input: MarginInputState;
  result: MarginResult;
  copySummaryText: () => void;
  saveCurrentToHistory: () => void;
  setIsReceiptOpen: (open: boolean) => void;
  t: TranslationDictionary;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  input,
  result,
  copySummaryText,
  saveCurrentToHistory,
  setIsReceiptOpen,
  t,
}) => {
  const currentPlatform = PLATFORM_PRESETS[input.platform] || PLATFORM_PRESETS.COUPANG_WING;
  const currency = currentPlatform.currency;

  const isDanger = result.healthStatus === 'DANGER';
  const isWarning = result.healthStatus === 'WARNING';

  return (
    <div className="space-y-4">
      {/* 1. 토스 스타일 리스크/안전 진단 박스 */}
      {isDanger ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-red-50 border-2 border-red-200 text-red-950 animate-shake shadow-md shadow-red-100">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white font-black text-sm flex-shrink-0 mt-0.5">
              🚨
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
                  {t.dangerBadge}
                </span>
                <h3 className="font-black text-sm sm:text-base text-red-900 leading-tight">
                  {result.healthTitle}
                </h3>
              </div>
              <p className="text-xs mt-1.5 leading-relaxed text-red-800 font-medium">
                {result.healthMessage}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`p-4 rounded-2xl border transition-all duration-200 ${
            isWarning
              ? 'bg-amber-50/80 border-amber-200 text-amber-950'
              : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isWarning ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
                }`}
              />
              <span className="font-bold text-xs sm:text-sm tracking-tight">
                {result.healthTitle}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isWarning
                  ? 'bg-amber-100/80 text-amber-800 border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}
            >
              {t.marginRateLabel} {formatPercent(result.marginRate)}
            </span>
          </div>
        </div>
      )}

      {/* 2. 초대형 타이포그래피 핵심 정산 카드 (통화 연동) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">
              {t.netProfitLabel}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black tracking-tight ${
                isDanger
                  ? 'bg-red-100 text-red-700'
                  : isWarning
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
              }`}
            >
              {t.marginRateLabel} {formatPercent(result.marginRate)}
            </span>
          </div>

          {/* 초대형 금액 숫자 */}
          <div
            className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-1 ${
              isDanger ? 'text-red-600' : 'text-slate-900'
            }`}
          >
            {formatSignedCurrency(result.netProfit, currency)}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">{t.netProfitSub}</p>
        </div>

        {/* ROI & 손익분기 ROAS 지표 박스 */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100/80">
            <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-tight">
              {t.roiLabel}
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 mt-0.5 block">
              {formatPercent(result.roi)}
            </span>
          </div>
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100/80">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-tight">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              {t.bepRoasLabel}
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 mt-0.5 block">
              {result.bepRoas > 0 ? `${result.bepRoas}%` : t.noProfit}
            </span>
          </div>
        </div>
      </div>

      {/* 3. 비용 비중 차트 */}
      <CostDonutChart
        percentages={result.costBreakdownPercentages}
        isLoss={result.netProfit < 0}
        t={t}
      />

      {/* 4. 정산 및 상세 비용 명세표 (통화 연동) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          {t.flowTitle}
        </h4>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <span>{t.flowRevenue}</span>
            <span>{formatCurrency(result.grossRevenue, currency)}</span>
          </div>

          <div className="flex justify-between py-0.5 text-red-600 font-medium">
            <span>{t.flowFee}</span>
            <span>- {formatCurrency(result.totalPlatformFee, currency)}</span>
          </div>

          {/* 실 정산액 하이라이트 */}
          <div className="flex justify-between py-2 px-3 bg-blue-50/70 border border-blue-100/80 rounded-xl font-bold text-blue-900">
            <span>{t.flowSettlement}</span>
            <span className="text-sm font-black">
              {formatCurrency(result.settlementAmount, currency)}
            </span>
          </div>

          <div className="flex justify-between py-0.5 text-slate-500 pt-1">
            <span>{t.productCost}</span>
            <span className="font-semibold text-slate-700">
              - {formatCurrency(result.productCost, currency)}
            </span>
          </div>

          <div className="flex justify-between py-0.5 text-slate-500">
            <span>{t.actualShippingFee} + {t.packagingCost}</span>
            <span className="font-semibold text-slate-700">
              - {formatCurrency(result.actualShippingFee + result.packagingCost, currency)}
            </span>
          </div>

          {result.adCost > 0 && (
            <div className="flex justify-between py-0.5 text-purple-600 font-medium">
              <span>{t.labelAd}</span>
              <span>- {formatCurrency(result.adCost, currency)}</span>
            </div>
          )}

          <div className="flex justify-between py-0.5 text-slate-400">
            <span>{t.labelTax}</span>
            <span>
              - {formatCurrency(result.estimatedVat + result.returnReserveCost, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* 5. 액션 버튼 */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={copySummaryText}
          className="flex items-center justify-center gap-1.5 py-3 px-3 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-bold rounded-2xl shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Copy className="w-4 h-4 text-slate-500" />
          {t.btnCopy}
        </button>

        <button
          type="button"
          onClick={() => setIsReceiptOpen(true)}
          className="flex items-center justify-center gap-1.5 py-3 px-3 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-bold rounded-2xl shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Receipt className="w-4 h-4 text-blue-600" />
          {t.btnReceipt}
        </button>

        <button
          type="button"
          onClick={saveCurrentToHistory}
          className="flex items-center justify-center gap-1.5 py-3 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-sm shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
        >
          <BookmarkPlus className="w-4 h-4" />
          {t.btnSave}
        </button>
      </div>
    </div>
  );
};
