import React from 'react';
import { History, Trash2, FolderOpen } from 'lucide-react';
import { CalculationHistoryItem } from '../types/margin';
import { TranslationDictionary } from '../constants/translations';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface HistorySectionProps {
  history: CalculationHistoryItem[];
  loadHistoryItem: (item: CalculationHistoryItem) => void;
  deleteHistoryItem: (id: string) => void;
  clearAllHistory: () => void;
  t: TranslationDictionary;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  loadHistoryItem,
  deleteHistoryItem,
  clearAllHistory,
  t,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            {t.historyTitle} ({history.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={clearAllHistory}
          className="text-xs text-slate-400 hover:text-red-500 font-semibold transition-colors cursor-pointer"
        >
          {t.historyClear}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-slate-50/70 hover:bg-slate-100/70 rounded-2xl border border-slate-100 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-800 truncate">{item.platform}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    item.healthStatus === 'DANGER'
                      ? 'bg-red-100 text-red-700'
                      : item.healthStatus === 'WARNING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.healthStatus === 'DANGER' ? t.dangerBadge : formatPercent(item.marginRate)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400 font-medium">{t.salePrice}</span>
                <span className="text-xs font-bold text-slate-700">
                  {formatCurrency(item.salePrice, item.currency)}
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-xs text-slate-400 font-medium">{t.netProfitLabel}</span>
                <span
                  className={`text-sm font-black ${
                    item.netProfit < 0 ? 'text-red-600' : 'text-emerald-600'
                  }`}
                >
                  {formatCurrency(item.netProfit, item.currency)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/60">
              <button
                type="button"
                onClick={() => loadHistoryItem(item)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                {t.historyLoad}
              </button>
              <button
                type="button"
                onClick={() => deleteHistoryItem(item.id)}
                className="text-slate-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
