export type PlatformId =
  | 'COUPANG_WING'
  | 'COUPANG_GROWTH'
  | 'SMARTSTORE'
  | 'AMAZON_US'
  | 'ALIEXPRESS'
  | 'SHOPEE'
  | 'QOO10_JP'
  | 'CUSTOM';

export type Currency = 'KRW' | 'USD' | 'JPY';
export type Language = 'KO' | 'EN' | 'JA' | 'ZH';

export type TaxType = 'GENERAL' | 'SIMPLE' | 'TAX_FREE';
export type HealthStatus = 'DANGER' | 'WARNING' | 'HEALTHY' | 'EXCELLENT';

export interface CategoryPreset {
  id: string;
  name: string;
  feeRate: number; // %
  description?: string;
}

export interface PlatformPreset {
  id: PlatformId;
  name: string;
  badge: string;
  currency: Currency;
  currencySymbol: string;
  defaultFeeRate: number;
  vatIncludedInFee: boolean; // 쿠팡: false(부가세 1.1배), 네이버/해외: true
  shippingFeeRate: number;   // 배송비 수수료율 (%)
  categories: CategoryPreset[];
}

export interface MarginInputState {
  calculatorMode: 'STANDARD' | 'REVERSE';
  platform: PlatformId;
  category: string;
  customFeeRate: number;

  // 가격 및 매출
  salePrice: number;
  customerShippingFee: number;

  // 비용 및 원가
  productCost: number;
  actualShippingFee: number;
  packagingCost: number;

  // 추가 변동비
  adCostPerUnit: number;
  returnReserveRate: number; // %
  taxType: TaxType;
}

export interface ReverseInputState {
  targetType: 'MARGIN_RATE' | 'NET_PROFIT';
  targetValue: number;
  productCost: number;
  actualShippingFee: number;
  packagingCost: number;
  adCostPerUnit: number;
  returnReserveRate: number;
  platform: PlatformId;
  category: string;
  customFeeRate: number;
  customerShippingFee: number;
  taxType: TaxType;
}

export interface MarginResult {
  grossRevenue: number;
  platformSaleFee: number;
  platformShippingFee: number;
  totalPlatformFee: number;
  settlementAmount: number;

  productCost: number;
  actualShippingFee: number;
  packagingCost: number;
  adCost: number;
  returnReserveCost: number;
  estimatedVat: number;
  totalExpense: number;

  netProfit: number;
  marginRate: number;
  roi: number;
  bepRoas: number;

  healthStatus: HealthStatus;
  healthTitle: string;
  healthMessage: string;

  costBreakdownPercentages: {
    product: number;
    platformFee: number;
    shippingAndPackaging: number;
    advertising: number;
    taxAndReserve: number;
    netProfit: number;
  };
}

export interface ReverseCalculationResult {
  recommendedSalePrice: number;
  targetMarginRate: number;
  targetNetProfit: number;
  simulatedResult: MarginResult;
}

export interface CalculationHistoryItem {
  id: string;
  timestamp: number;
  title: string;
  platform: string;
  currency: Currency;
  salePrice: number;
  netProfit: number;
  marginRate: number;
  healthStatus: HealthStatus;
  input: MarginInputState;
}
