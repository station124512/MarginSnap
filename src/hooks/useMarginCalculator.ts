import { useState, useMemo, useEffect } from 'react';
import {
  MarginInputState,
  ReverseInputState,
  MarginResult,
  CalculationHistoryItem,
  Language,
} from '../types/margin';
import { calculateMargin, calculateReversePrice } from '../utils/calculator';
import { PLATFORM_PRESETS } from '../constants/feePresets';
import { TRANSLATIONS } from '../constants/translations';
import { formatCurrency, formatPercent } from '../utils/formatters';

const DEFAULT_SAMPLE_VALUES = {
  KRW: {
    salePrice: 25000,
    customerShippingFee: 3000,
    productCost: 11000,
    actualShippingFee: 2800,
    packagingCost: 500,
    adCostPerUnit: 1500,
    targetNetProfit: 5000,
  },
  USD: {
    salePrice: 25.0,
    customerShippingFee: 3.0,
    productCost: 10.0,
    actualShippingFee: 2.8,
    packagingCost: 0.5,
    adCostPerUnit: 1.5,
    targetNetProfit: 5.0,
  },
  JPY: {
    salePrice: 2500,
    customerShippingFee: 300,
    productCost: 1100,
    actualShippingFee: 280,
    packagingCost: 50,
    adCostPerUnit: 150,
    targetNetProfit: 500,
  },
};

const DEFAULT_INPUT: MarginInputState = {
  calculatorMode: 'STANDARD',
  platform: 'COUPANG_WING',
  category: 'living',
  customFeeRate: 10.8,
  salePrice: 25000,
  customerShippingFee: 3000,
  productCost: 11000,
  actualShippingFee: 2800,
  packagingCost: 500,
  adCostPerUnit: 1500,
  returnReserveRate: 2.0,
  taxType: 'GENERAL',
};

const DEFAULT_REVERSE: ReverseInputState = {
  targetType: 'MARGIN_RATE',
  targetValue: 20,
  productCost: 11000,
  actualShippingFee: 2800,
  packagingCost: 500,
  adCostPerUnit: 1500,
  returnReserveRate: 2.0,
  platform: 'COUPANG_WING',
  category: 'living',
  customFeeRate: 10.8,
  customerShippingFee: 3000,
  taxType: 'GENERAL',
};

const HISTORY_KEY = 'seller_margin_calc_history_v2';
const LANG_KEY = 'seller_margin_lang_v1';

export function useMarginCalculator() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved && ['KO', 'EN', 'JA', 'ZH'].includes(saved)) {
        return saved as Language;
      }
    } catch {}
    return 'KO';
  });

  const [input, setInput] = useState<MarginInputState>(() => {
    try {
      const saved = localStorage.getItem('seller_margin_current_input_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          typeof parsed.salePrice === 'number' &&
          parsed.salePrice > 0 &&
          parsed.salePrice <= 100_000_000 &&
          typeof parsed.productCost === 'number' &&
          parsed.productCost <= 100_000_000
        ) {
          return parsed;
        } else {
          localStorage.removeItem('seller_margin_current_input_v2');
        }
      }
    } catch {}
    return DEFAULT_INPUT;
  });

  const [reverseInput, setReverseInput] = useState<ReverseInputState>(DEFAULT_REVERSE);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const t = useMemo(() => TRANSLATIONS[language] || TRANSLATIONS.KO, [language]);
  const currentPlatform = PLATFORM_PRESETS[input.platform] || PLATFORM_PRESETS.COUPANG_WING;

  // 언어 변경 시 로컬 저장
  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(LANG_KEY, newLang);
    } catch {}
  };

  // 현재 입력 상태 로컬 저장
  useEffect(() => {
    try {
      localStorage.setItem('seller_margin_current_input_v2', JSON.stringify(input));
    } catch (e) {}
  }, [input]);

  // 히스토리 로컬 저장
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {}
  }, [history]);

  const showToast = (msg: string, duration = 2000) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  // 플랫폼 변경 시 통화 변환 및 카테고리 매핑
  const handlePlatformChange = (platformId: MarginInputState['platform']) => {
    const nextConfig = PLATFORM_PRESETS[platformId];
    const prevConfig = PLATFORM_PRESETS[input.platform];
    const defaultCat = nextConfig?.categories[0]?.id || '';
    const defaultRate = nextConfig?.defaultFeeRate || 10.0;

    const needCurrencyConvert = prevConfig.currency !== nextConfig.currency;
    const sample = DEFAULT_SAMPLE_VALUES[nextConfig.currency];

    setInput((prev) => ({
      ...prev,
      platform: platformId,
      category: defaultCat,
      customFeeRate: defaultRate,
      salePrice: needCurrencyConvert ? sample.salePrice : prev.salePrice,
      customerShippingFee: needCurrencyConvert
        ? sample.customerShippingFee
        : prev.customerShippingFee,
      productCost: needCurrencyConvert ? sample.productCost : prev.productCost,
      actualShippingFee: needCurrencyConvert
        ? sample.actualShippingFee
        : prev.actualShippingFee,
      packagingCost: needCurrencyConvert ? sample.packagingCost : prev.packagingCost,
      adCostPerUnit: needCurrencyConvert ? sample.adCostPerUnit : prev.adCostPerUnit,
    }));
  };

  const handleReversePlatformChange = (platformId: ReverseInputState['platform']) => {
    const nextConfig = PLATFORM_PRESETS[platformId];
    const prevConfig = PLATFORM_PRESETS[reverseInput.platform];
    const defaultCat = nextConfig?.categories[0]?.id || '';
    const defaultRate = nextConfig?.defaultFeeRate || 10.0;
    const needCurrencyConvert = prevConfig.currency !== nextConfig.currency;
    const sample = DEFAULT_SAMPLE_VALUES[nextConfig.currency];

    setReverseInput((prev) => ({
      ...prev,
      platform: platformId,
      category: defaultCat,
      customFeeRate: defaultRate,
      productCost: needCurrencyConvert ? sample.productCost : prev.productCost,
      actualShippingFee: needCurrencyConvert
        ? sample.actualShippingFee
        : prev.actualShippingFee,
      packagingCost: needCurrencyConvert ? sample.packagingCost : prev.packagingCost,
      adCostPerUnit: needCurrencyConvert ? sample.adCostPerUnit : prev.adCostPerUnit,
      customerShippingFee: needCurrencyConvert
        ? sample.customerShippingFee
        : prev.customerShippingFee,
      targetValue:
        prev.targetType === 'NET_PROFIT' && needCurrencyConvert
          ? sample.targetNetProfit
          : prev.targetValue,
    }));
  };

  const result: MarginResult = useMemo(() => {
    return calculateMargin(input, language);
  }, [input, language]);

  const reverseResult = useMemo(() => {
    return calculateReversePrice(reverseInput, language);
  }, [reverseInput, language]);

  // 히스토리에 현재 계산 저장
  const saveCurrentToHistory = (itemTitle?: string) => {
    const platformConfig = PLATFORM_PRESETS[input.platform];
    const newHistoryItem: CalculationHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      title:
        itemTitle ||
        `${platformConfig.badge} (${formatCurrency(input.salePrice, platformConfig.currency)})`,
      platform: platformConfig.name,
      currency: platformConfig.currency,
      salePrice: input.salePrice,
      netProfit: result.netProfit,
      marginRate: result.marginRate,
      healthStatus: result.healthStatus,
      input: { ...input },
    };

    setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
    showToast(t.savedToast, 2000);
  };

  const loadHistoryItem = (item: CalculationHistoryItem) => {
    setInput(item.input);
    showToast(t.loadedToast, 2000);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const clearAllHistory = () => {
    setHistory([]);
    showToast(t.clearedToast, 2000);
  };

  // 1. 단톡방/메모장용 깔끔한 한 줄/포맷형 [결과 요약 복사]
  const copyQuickSummaryText = () => {
    const platformConfig = PLATFORM_PRESETS[input.platform];
    const cur = platformConfig.currency;

    let feeRate = input.customFeeRate;
    if (input.platform !== 'CUSTOM') {
      const matchedCategory = platformConfig.categories.find((c) => c.id === input.category);
      feeRate = matchedCategory ? matchedCategory.feeRate : platformConfig.defaultFeeRate;
    }

    const platformDisplayName = platformConfig.name.split(' ')[0];

    const text = `-------------------------------
${t.shareCopyHeader}
• ${t.shareCopyPlatform}: ${platformDisplayName} (${t.shareCopyFeeWord} ${feeRate}%)
• ${t.shareCopyPriceCost}: ${formatCurrency(input.salePrice, cur)} | ${t.shareCopyCost}: ${formatCurrency(input.productCost, cur)}
• ${t.shareCopyPayout}: ${formatCurrency(result.settlementAmount, cur)}
• ${t.shareCopyNetMargin}: ${formatCurrency(result.netProfit, cur)} (${t.shareCopyMarginRate} ${result.marginRate}%)
${t.shareCopyCta}
-------------------------------`;

    navigator.clipboard.writeText(text).then(() => {
      showToast(t.copiedToast, 2000);
    });
  };

  // 2. 상세 복사용 텍스트
  const copySummaryText = () => {
    const platformConfig = PLATFORM_PRESETS[input.platform];
    const cur = platformConfig.currency;
    const summary = `[${t.appTitle} - ${t.receiptTitle}]
- Platform: ${platformConfig.name} (${platformConfig.currency})
- ${t.salePrice}: ${formatCurrency(input.salePrice, cur)} (${t.customerShippingFee}: ${formatCurrency(input.customerShippingFee, cur)})
- ${t.productCost}: ${formatCurrency(input.productCost, cur)}
- ${t.flowFee}: ${formatCurrency(result.totalPlatformFee, cur)}
- ${t.flowSettlement}: ${formatCurrency(result.settlementAmount, cur)}
- ${t.netProfitLabel}: ${formatCurrency(result.netProfit, cur)}
- ${t.marginRateLabel}: ${result.marginRate}% (ROI: ${result.roi}%)
- Status: ${result.healthTitle}`;

    navigator.clipboard.writeText(summary).then(() => {
      showToast(t.copiedToast, 2000);
    });
  };

  const applyReversePriceToStandard = () => {
    setInput((prev) => ({
      ...prev,
      salePrice: reverseResult.recommendedSalePrice,
      customerShippingFee: reverseInput.customerShippingFee,
      productCost: reverseInput.productCost,
      actualShippingFee: reverseInput.actualShippingFee,
      packagingCost: reverseInput.packagingCost,
      adCostPerUnit: reverseInput.adCostPerUnit,
      returnReserveRate: reverseInput.returnReserveRate,
      platform: reverseInput.platform,
      category: reverseInput.category,
      customFeeRate: reverseInput.customFeeRate,
      calculatorMode: 'STANDARD',
    }));
    showToast(t.appliedReverseToast, 2000);
  };

  return {
    language,
    changeLanguage,
    t,
    input,
    setInput,
    reverseInput,
    setReverseInput,
    result,
    reverseResult,
    isAdvancedOpen,
    setIsAdvancedOpen,
    history,
    toastMessage,
    isReceiptOpen,
    setIsReceiptOpen,
    currentPlatform,
    handlePlatformChange,
    handleReversePlatformChange,
    saveCurrentToHistory,
    loadHistoryItem,
    deleteHistoryItem,
    clearAllHistory,
    copyQuickSummaryText,
    copySummaryText,
    applyReversePriceToStandard,
    resetToDefaults: () => {
      const sample = DEFAULT_SAMPLE_VALUES[currentPlatform.currency];
      setInput((prev) => ({
        ...prev,
        salePrice: sample.salePrice,
        customerShippingFee: sample.customerShippingFee,
        productCost: sample.productCost,
        actualShippingFee: sample.actualShippingFee,
        packagingCost: sample.packagingCost,
        adCostPerUnit: sample.adCostPerUnit,
      }));
      showToast(t.reset, 2000);
    },
  };
}
