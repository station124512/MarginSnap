import React from 'react';
import { useMarginCalculator } from './hooks/useMarginCalculator';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultDashboard } from './components/ResultDashboard';
import { ReverseCalculator } from './components/ReverseCalculator';
import { HistorySection } from './components/HistoryDrawer';
import { ReceiptModal } from './components/ReceiptModal';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const calc = useMarginCalculator();
  const { t, language, changeLanguage } = calc;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      {/* 토스 스타일 부드러운 토스트 알림 */}
      {calc.toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white text-xs sm:text-sm font-bold py-3.5 px-5 rounded-full shadow-xl border border-slate-800 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {calc.toastMessage}
        </div>
      )}

      {/* 영수증 모달 */}
      <ReceiptModal
        isOpen={calc.isReceiptOpen}
        onClose={() => calc.setIsReceiptOpen(false)}
        input={calc.input}
        result={calc.result}
        copySummaryText={calc.copySummaryText}
        t={t}
      />

      <div className="max-w-6xl mx-auto">
        {/* 상단 헤더 & 알약형 탭 & 다국어 토글 */}
        <Header
          mode={calc.input.calculatorMode}
          setMode={(mode) => calc.setInput((p) => ({ ...p, calculatorMode: mode }))}
          language={language}
          changeLanguage={changeLanguage}
          t={t}
        />

        {/* 메인 뷰: 일반 계산기 vs 역산기 */}
        {calc.input.calculatorMode === 'STANDARD' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 좌측 입력 폼 (7 cols) - 토스 스타일 부드러운 카드 */}
            <div className="lg:col-span-7 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-6 sm:p-8">
              <InputSection
                input={calc.input}
                setInput={calc.setInput}
                isAdvancedOpen={calc.isAdvancedOpen}
                setIsAdvancedOpen={calc.setIsAdvancedOpen}
                handlePlatformChange={calc.handlePlatformChange}
                resetToDefaults={calc.resetToDefaults}
                t={t}
              />
            </div>

            {/* 우측 실시간 결과 대시보드 (5 cols, sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-8">
              <ResultDashboard
                input={calc.input}
                result={calc.result}
                copySummaryText={calc.copySummaryText}
                saveCurrentToHistory={calc.saveCurrentToHistory}
                setIsReceiptOpen={calc.setIsReceiptOpen}
                t={t}
              />
            </div>
          </div>
        ) : (
          <ReverseCalculator
            reverseInput={calc.reverseInput}
            setReverseInput={calc.setReverseInput}
            reverseResult={calc.reverseResult}
            handleReversePlatformChange={calc.handleReversePlatformChange}
            applyReversePriceToStandard={calc.applyReversePriceToStandard}
            t={t}
          />
        )}

        {/* 히스토리 섹션 */}
        <HistorySection
          history={calc.history}
          loadHistoryItem={calc.loadHistoryItem}
          deleteHistoryItem={calc.deleteHistoryItem}
          clearAllHistory={calc.clearAllHistory}
          t={t}
        />

        {/* 하단 초보 셀러 가이드 팁 (토스 핀테크 카드) */}
        <footer className="mt-14 pt-8 border-t border-slate-200/60 text-xs text-slate-500 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3 text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-600">
                <Lightbulb className="w-3.5 h-3.5" />
              </span>
              {t.guideTitle}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-600 pt-1">
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <strong className="block text-slate-900 font-bold mb-1">
                  {t.guide1Title}
                </strong>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  {t.guide1Desc}
                </p>
              </div>
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <strong className="block text-slate-900 font-bold mb-1">
                  {t.guide2Title}
                </strong>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  {t.guide2Desc}
                </p>
              </div>
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <strong className="block text-slate-900 font-bold mb-1">
                  {t.guide3Title}
                </strong>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  {t.guide3Desc}
                </p>
              </div>
            </div>
          </div>
          <div className="text-center text-slate-400 font-medium text-[11px]">
            {t.footerNotice}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
