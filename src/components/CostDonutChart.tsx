import React from 'react';
import { formatPercent } from '../utils/formatters';
import { TranslationDictionary } from '../constants/translations';

interface Props {
  percentages: {
    product: number;
    platformFee: number;
    shippingAndPackaging: number;
    advertising: number;
    taxAndReserve: number;
    netProfit: number;
  };
  isLoss: boolean;
  t: TranslationDictionary;
}

export const CostDonutChart: React.FC<Props> = ({ percentages, isLoss, t }) => {
  const items = [
    { label: t.labelProduct, val: percentages.product, color: '#3B82F6' }, // blue-500
    { label: t.labelFee, val: percentages.platformFee, color: '#EF4444' }, // red-500
    { label: t.labelShipping, val: percentages.shippingAndPackaging, color: '#F59E0B' }, // amber-500
    { label: t.labelAd, val: percentages.advertising, color: '#8B5CF6' }, // purple-500
    { label: t.labelTax, val: percentages.taxAndReserve, color: '#94A3B8' }, // slate-400
    {
      label: isLoss ? t.labelLoss : t.labelProfit,
      val: Math.max(0, percentages.netProfit),
      color: isLoss ? '#DC2626' : '#10B981',
    },
  ].filter((i) => i.val > 0);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {t.costBreakdownTitle}
        </span>
        <span className="text-[11px] font-semibold text-slate-400">{t.costBreakdownSub}</span>
      </div>

      <div className="flex items-center gap-6">
        {/* SVG 도넛 */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth="13"
            />
            {items.map((item, idx) => {
              const dashLength = (item.val / 100) * circumference;
              const dashOffset = -accumulatedOffset;
              accumulatedOffset += dashLength;
              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="13"
                  strokeDasharray={`${dashLength} ${circumference}`}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-400 font-bold">
              {isLoss ? t.labelLoss : t.labelProfit}
            </span>
            <span
              className={`text-xs font-black ${
                isLoss ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {formatPercent(percentages.netProfit)}
            </span>
          </div>
        </div>

        {/* 범례 리스트 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs flex-1">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-500 truncate text-[11px] font-medium">
                  {item.label}
                </span>
              </div>
              <span className="font-bold text-slate-800 text-[11px] ml-1">{item.val}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
