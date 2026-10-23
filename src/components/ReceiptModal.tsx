import React from 'react';
import { X, Printer, Copy } from 'lucide-react';
import { MarginResult, MarginInputState } from '../types/margin';
import { PLATFORM_PRESETS } from '../constants/feePresets';
import { TranslationDictionary } from '../constants/translations';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  input: MarginInputState;
  result: MarginResult;
  copySummaryText: () => void;
  t: TranslationDictionary;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  input,
  result,
  copySummaryText,
  t,
}) => {
  if (!isOpen) return null;

  const platform = PLATFORM_PRESETS[input.platform];
  const currency = platform.currency;
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {t.receiptTitle}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 영수증 본문 */}
        <div className="p-6 font-mono text-xs text-slate-800 space-y-4">
          <div className="text-center pb-3 border-b border-dashed border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block mb-1" />
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              {t.appTitle}
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">{dateStr}</p>
            <p className="text-xs font-bold text-blue-600 mt-1">
              {platform.name} ({currency})
            </p>
          </div>

          {/* 매출 */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>{t.salePrice}</span>
              <span className="font-bold text-slate-900">{formatCurrency(input.salePrice, currency)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>{t.customerShippingFee}</span>
              <span>{formatCurrency(input.customerShippingFee, currency)}</span>
            </div>
            <div className="flex justify-between font-black pt-1.5 border-t border-slate-200 text-slate-900">
              <span>{t.flowRevenue}</span>
              <span>{formatCurrency(result.grossRevenue, currency)}</span>
            </div>
          </div>

          {/* 공제 내역 */}
          <div className="space-y-1.5 pt-2 border-t border-dashed border-slate-200">
            <div className="flex justify-between text-red-600 font-medium">
              <span>{t.flowFee}</span>
              <span>- {formatCurrency(result.totalPlatformFee, currency)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{t.productCost}</span>
              <span>- {formatCurrency(result.productCost, currency)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{t.labelShipping}</span>
              <span>- {formatCurrency(result.actualShippingFee + result.packagingCost, currency)}</span>
            </div>
            {result.adCost > 0 && (
              <div className="flex justify-between text-purple-600 font-medium">
                <span>{t.labelAd}</span>
                <span>- {formatCurrency(result.adCost, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>{t.labelTax}</span>
              <span>- {formatCurrency(result.estimatedVat + result.returnReserveCost, currency)}</span>
            </div>
          </div>

          {/* 최종 결과 하이라이트 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              {t.netProfitLabel}
            </span>
            <div
              className={`text-2xl font-black tracking-tight ${
                result.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(result.netProfit, currency)}
            </div>
            <div className="text-[11px] font-bold text-slate-600">
              {t.marginRateLabel}: {formatPercent(result.marginRate)} | {t.roiLabel}: {formatPercent(result.roi)}
            </div>
          </div>
        </div>

        {/* 모달 하단 버튼 */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex gap-2">
          <button
            onClick={copySummaryText}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            {t.receiptCopy}
          </button>
          <button
            onClick={() => window.print()}
            className="py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            {t.receiptPrint}
          </button>
        </div>
      </div>
    </div>
  );
};
