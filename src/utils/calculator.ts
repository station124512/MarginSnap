import {
  MarginInputState,
  MarginResult,
  HealthStatus,
  ReverseInputState,
  ReverseCalculationResult,
  Language,
} from '../types/margin';
import { PLATFORM_PRESETS } from '../constants/feePresets';
import { TRANSLATIONS } from '../constants/translations';
import { formatCurrency } from './formatters';

export function calculateMargin(
  input: MarginInputState,
  lang: Language = 'KO'
): MarginResult {
  const platformConfig = PLATFORM_PRESETS[input.platform] || PLATFORM_PRESETS.COUPANG_WING;
  const isUSD = platformConfig.currency === 'USD';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.KO;

  const roundVal = (v: number) => (isUSD ? Number(v.toFixed(2)) : Math.round(v));

  // 1. 유효 수수료율 결정
  let saleFeeRate = input.customFeeRate;
  if (input.platform !== 'CUSTOM') {
    const matchedCategory = platformConfig.categories.find((c) => c.id === input.category);
    saleFeeRate = matchedCategory ? matchedCategory.feeRate : platformConfig.defaultFeeRate;
  }

  // 2. 매출 계산
  const grossRevenue = roundVal((input.salePrice || 0) + (input.customerShippingFee || 0));

  // 3. 플랫폼 수수료 계산
  // 쿠팡은 부가세 10% 별도 가산 (1.1배)
  const feeVatMultiplier = platformConfig.vatIncludedInFee ? 1.0 : 1.1;
  const platformSaleFee = roundVal(
    (input.salePrice || 0) * (saleFeeRate / 100) * feeVatMultiplier
  );
  const platformShippingFee = roundVal(
    (input.customerShippingFee || 0) * (platformConfig.shippingFeeRate / 100)
  );
  const totalPlatformFee = roundVal(platformSaleFee + platformShippingFee);

  // 4. 예상 정산액
  const settlementAmount = roundVal(grossRevenue - totalPlatformFee);

  // 5. 비용 및 충당금
  const productCost = input.productCost || 0;
  const actualShippingFee = input.actualShippingFee || 0;
  const packagingCost = input.packagingCost || 0;
  const adCost = input.adCostPerUnit || 0;
  const returnReserveCost = roundVal(
    (input.salePrice || 0) * ((input.returnReserveRate || 0) / 100)
  );

  // 6. 부가가치세(VAT) 예상 납부액 계산
  let estimatedVat = 0;
  if (input.taxType === 'GENERAL') {
    const outputVat = roundVal(grossRevenue / 11);
    const inputVat = roundVal(
      (productCost + actualShippingFee + packagingCost + totalPlatformFee) / 11
    );
    estimatedVat = Math.max(0, roundVal(outputVat - inputVat));
  } else if (input.taxType === 'SIMPLE') {
    estimatedVat = roundVal(grossRevenue * 0.025);
  } else {
    estimatedVat = 0; // 면세 / 해외
  }

  // 7. 총 지출 및 최종 순이익
  const totalExpense = roundVal(
    productCost +
      actualShippingFee +
      packagingCost +
      adCost +
      returnReserveCost +
      totalPlatformFee +
      estimatedVat
  );

  const netProfit = roundVal(grossRevenue - totalExpense);

  // 8. 마진율 및 ROI
  const marginRate = grossRevenue > 0 ? Number(((netProfit / grossRevenue) * 100).toFixed(2)) : 0;
  const totalInvestedCost = productCost + actualShippingFee + packagingCost + adCost;
  const roi = totalInvestedCost > 0 ? Number(((netProfit / totalInvestedCost) * 100).toFixed(1)) : 0;

  // 9. 손익분기 광고 ROAS (BEP ROAS)
  const profitBeforeAd = netProfit + adCost;
  let bepRoas = 0;
  if (profitBeforeAd > 0 && input.salePrice > 0) {
    bepRoas = Math.round((input.salePrice / profitBeforeAd) * 100);
  }

  // 10. 건강도 진단 (Health Status)
  let healthStatus: HealthStatus = 'HEALTHY';
  let healthTitle = t.healthyTitle;
  let healthMessage = t.healthyMessage;

  if (netProfit < 0) {
    healthStatus = 'DANGER';
    healthTitle = t.dangerTitle;
    healthMessage = `${t.dangerMessage} (${formatCurrency(Math.abs(netProfit), platformConfig.currency)})`;
  } else if (marginRate < 10) {
    healthStatus = 'WARNING';
    healthTitle = t.warningTitle;
    healthMessage = t.warningMessage;
  } else if (marginRate >= 25) {
    healthStatus = 'EXCELLENT';
    healthTitle = t.excellentTitle;
    healthMessage = t.excellentMessage;
  }

  // 11. 비용 비중 백분율 (도넛 차트용)
  const safeRevenue = grossRevenue > 0 ? grossRevenue : 1;
  const productPct = Math.max(0, Number(((productCost / safeRevenue) * 100).toFixed(1)));
  const feePct = Math.max(0, Number(((totalPlatformFee / safeRevenue) * 100).toFixed(1)));
  const shipPackPct = Math.max(
    0,
    Number((((actualShippingFee + packagingCost) / safeRevenue) * 100).toFixed(1))
  );
  const adPct = Math.max(0, Number(((adCost / safeRevenue) * 100).toFixed(1)));
  const taxReservePct = Math.max(
    0,
    Number((((estimatedVat + returnReserveCost) / safeRevenue) * 100).toFixed(1))
  );
  const netProfitPct = Math.max(0, Number(((netProfit / safeRevenue) * 100).toFixed(1)));

  return {
    grossRevenue,
    platformSaleFee,
    platformShippingFee,
    totalPlatformFee,
    settlementAmount,
    productCost,
    actualShippingFee,
    packagingCost,
    adCost,
    returnReserveCost,
    estimatedVat,
    totalExpense,
    netProfit,
    marginRate,
    roi,
    bepRoas,
    healthStatus,
    healthTitle,
    healthMessage,
    costBreakdownPercentages: {
      product: productPct,
      platformFee: feePct,
      shippingAndPackaging: shipPackPct,
      advertising: adPct,
      taxAndReserve: taxReservePct,
      netProfit: netProfitPct,
    },
  };
}

export function calculateReversePrice(
  input: ReverseInputState,
  lang: Language = 'KO'
): ReverseCalculationResult {
  const platformConfig = PLATFORM_PRESETS[input.platform] || PLATFORM_PRESETS.COUPANG_WING;
  const isUSD = platformConfig.currency === 'USD';

  let baseFeeRate = input.customFeeRate;
  if (input.platform !== 'CUSTOM') {
    const matchedCategory = platformConfig.categories.find((c) => c.id === input.category);
    baseFeeRate = matchedCategory ? matchedCategory.feeRate : platformConfig.defaultFeeRate;
  }

  const effectiveFeeRate = (baseFeeRate / 100) * (platformConfig.vatIncludedInFee ? 1.0 : 1.1);
  const shipFeeRate = platformConfig.shippingFeeRate / 100;
  const returnRate = (input.returnReserveRate || 0) / 100;
  const vatRate = input.taxType === 'GENERAL' ? 0.045 : input.taxType === 'SIMPLE' ? 0.025 : 0;

  const fixedExpenses =
    (input.productCost || 0) +
    (input.actualShippingFee || 0) +
    (input.packagingCost || 0) +
    (input.adCostPerUnit || 0);

  const customerShip = input.customerShippingFee || 0;
  let rawPrice = 0;

  if (input.targetType === 'MARGIN_RATE') {
    const targetMargin = (input.targetValue || 20) / 100;
    const denominator = 1 - (effectiveFeeRate + returnRate + vatRate + targetMargin);

    if (denominator <= 0.05) {
      rawPrice = fixedExpenses * 2;
    } else {
      const numerator = fixedExpenses - customerShip * (1 - shipFeeRate - targetMargin);
      rawPrice = Math.max(0, numerator / denominator);
    }
  } else {
    const targetProfit = input.targetValue || (isUSD ? 5 : 5000);
    const denominator = 1 - (effectiveFeeRate + returnRate + vatRate);

    if (denominator <= 0.05) {
      rawPrice = fixedExpenses + targetProfit;
    } else {
      const numerator = fixedExpenses + targetProfit - customerShip * (1 - shipFeeRate);
      rawPrice = Math.max(0, numerator / denominator);
    }
  }

  // 통화별 깔끔한 라운딩: USD는 0.1달러 절상 또는 .99 책정, KRW는 100원, JPY는 10엔 절상
  let recommendedPrice = 0;
  if (isUSD) {
    recommendedPrice = Number((Math.ceil(rawPrice * 10) / 10).toFixed(2));
  } else if (platformConfig.currency === 'JPY') {
    recommendedPrice = Math.ceil(rawPrice / 10) * 10;
  } else {
    recommendedPrice = Math.ceil(rawPrice / 100) * 100;
  }

  const simulatedInput: MarginInputState = {
    calculatorMode: 'STANDARD',
    platform: input.platform,
    category: input.category,
    customFeeRate: input.customFeeRate,
    salePrice: recommendedPrice,
    customerShippingFee: customerShip,
    productCost: input.productCost,
    actualShippingFee: input.actualShippingFee,
    packagingCost: input.packagingCost,
    adCostPerUnit: input.adCostPerUnit,
    returnReserveRate: input.returnReserveRate,
    taxType: input.taxType,
  };

  const simulatedResult = calculateMargin(simulatedInput, lang);

  return {
    recommendedSalePrice: recommendedPrice,
    targetMarginRate: simulatedResult.marginRate,
    targetNetProfit: simulatedResult.netProfit,
    simulatedResult,
  };
}
