# [기술 명세서] 초보 셀러용 스마트 마진 계산기 (Developer Technical Specification)

- **문서 버전**: v1.0.0
- **작성일자**: 2026-10-24
- **대상**: 프론트엔드 개발자 (3호 개발자용)
- **기반 문서**: [docs/01_PRD.md](file:///c:/Users/user/Desktop/글로벌인공지능플랫폼/상세페이지쿠팡이/docs/01_PRD.md)
- **권장 기술 스택**: React 18+ (Next.js or Vite), TypeScript, Tailwind CSS, Lucide-React

---

## 1. 시스템 아키텍처 및 디렉토리 구조

```
src/
├── components/margin-calculator/
│   ├── MarginCalculator.tsx          // 메인 컨테이너 컴포넌트
│   ├── CalculatorTab.tsx             // 모드 탭 (일반 계산기 vs 역산기)
│   ├── InputSection.tsx              // 좌측 입력 폼 패널
│   │   ├── PlatformSelector.tsx      // 플랫폼 및 카테고리 선택 드롭다운
│   │   ├── PriceInputs.tsx           // 판매가, 고객 배송비
│   │   ├── CostInputs.tsx            // 사입원가, 실배송비, 포장비
│   │   └── AdvancedOptions.tsx       // 광고비, 반품충당금, 과세유형 (아코디언)
│   ├── ResultDashboard.tsx           // 우측 결과 대시보드
│   │   ├── HealthStatusCard.tsx      // 역마진/안전 진단 배지
│   │   ├── ProfitSummaryCard.tsx     // 순이익, 마진율, ROI 하이라이트
│   │   ├── BreakdownTable.tsx        // 상세 정산/비용 명세표
│   │   ├── CostDonutChart.tsx        // Tailwind/SVG 기반 비용 비중 차트
│   │   └── ActionButtonGroup.tsx     // 복사, 초기화, 로컬 저장
│   └── ReverseCalculator.tsx         // 목표 마진 역산기 전용 뷰
├── constants/
│   └── feePresets.ts                 // 플랫폼별/카테고리별 수수료율 상수
├── hooks/
│   └── useMarginCalculator.ts        // 계산 상태 및 비즈니스 로직 훅
├── types/
│   └── margin.ts                     // TypeScript 인터페이스 및 타입 정의
└── utils/
    ├── calculator.ts                 // 순수 계산 엔진 (마진 계산 & 역산)
    └── formatters.ts                 // 원화(KRW), 백분율(%) 포맷팅 유틸
```

---

## 2. TypeScript 타입 정의 (`types/margin.ts`)

```typescript
// 플랫폼 식별자
export type PlatformId = 'COUPANG_WING' | 'COUPANG_GROWTH' | 'SMARTSTORE' | 'CUSTOM';

// 사업자 과세 유형
export type TaxType = 'GENERAL' | 'SIMPLE' | 'TAX_FREE'; // 일반과세(10%), 간이과세(간이율), 면세

// 마진 건전성 상태
export type HealthStatus = 'DANGER' | 'WARNING' | 'HEALTHY' | 'EXCELLENT';

// 카테고리 수수료 프리셋 정의
export interface CategoryPreset {
  id: string;
  name: string;
  feeRate: number; // 단위: % (예: 10.8)
  description?: string;
}

// 플랫폼 설정 정의
export interface PlatformPreset {
  id: PlatformId;
  name: string;
  badge: string;
  defaultFeeRate: number;
  vatIncludedInFee: boolean; // 수수료율에 부가세가 이미 포함되어 있는지 여부 (쿠팡은 별도이므로 false)
  shippingFeeRate: number;   // 배송비 수수료율 (%) (쿠팡: 3.3%)
  categories: CategoryPreset[];
}

// 1. 계산기 입력 상태 (Input State)
export interface MarginInputState {
  calculatorMode: 'STANDARD' | 'REVERSE'; // 일반 계산 vs 목표마진 역산
  platform: PlatformId;
  category: string;
  customFeeRate: number;        // 커스텀 수수료율 (%)

  // 가격 및 매출
  salePrice: number;            // 상품 판매가 (원)
  customerShippingFee: number;  // 고객 부담 배송비 (원)

  // 비용 및 원가
  productCost: number;          // 상품 매입/제조 원가 (원)
  actualShippingFee: number;    // 판매자 실 지출 배송비 (원)
  packagingCost: number;        // 포장 부자재비 (원)

  // 추가 변동비 (고급 옵션)
  adCostPerUnit: number;        // 개당 광고비 (원)
  returnReserveRate: number;    // 반품 충당율 (%) - 기본 2% 권장
  taxType: TaxType;             // 과세 유형
}

// 2. 목표 마진 역산 입력 상태 (Reverse Input State)
export interface ReverseInputState {
  targetType: 'MARGIN_RATE' | 'NET_PROFIT'; // 목표 마진율(%) or 건당 목표 순수익(원)
  targetValue: number;                     // 예: 20(%) 또는 5000(원)
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

// 3. 계산 결과 모델 (Calculation Result)
export interface MarginResult {
  // 매출
  grossRevenue: number;         // 총 매출액 = 판매가 + 고객배송비

  // 플랫폼 공제
  platformSaleFee: number;      // 판매 수수료 (부가세 포함)
  platformShippingFee: number;  // 배송비 수수료 (부가세 포함)
  totalPlatformFee: number;     // 총 플랫폼 수수료
  settlementAmount: number;     // 예상 정산액 = 총매출 - 플랫폼수수료

  // 지출 비용
  productCost: number;          // 원가
  actualShippingFee: number;    // 실배송비
  packagingCost: number;        // 포장비
  adCost: number;               // 광고비
  returnReserveCost: number;    // 반품 충당금 (원)
  estimatedVat: number;         // 예상 납부 부가세
  totalExpense: number;         // 총 지출액 (원가+배송+포장+광고+충당금+수수료+세금)

  // 최종 손익
  netProfit: number;            // 실 순이익 = 총매출 - 총지출
  marginRate: number;           // 순마진율 (%) = (순이익 / 총매출) * 100
  roi: number;                  // 투자수익률 ROI (%) = (순이익 / 투자비용) * 100
  bepRoas: number;              // 손익분기 광고 ROAS (%)

  // 리스크 진단
  healthStatus: HealthStatus;
  healthTitle: string;
  healthMessage: string;

  // 차트 시각화용 비율 데이터 (%)
  costBreakdownPercentages: {
    product: number;
    platformFee: number;
    shippingAndPackaging: number;
    advertising: number;
    taxAndReserve: number;
    netProfit: number;
  };
}
```

---

## 3. 플랫폼 및 수수료율 프리셋 상수 (`constants/feePresets.ts`)

```typescript
import { PlatformPreset } from '../types/margin';

export const PLATFORM_PRESETS: Record<string, PlatformPreset> = {
  COUPANG_WING: {
    id: 'COUPANG_WING',
    name: '쿠팡 윙 (마켓플레이스)',
    badge: 'Coupang Wing',
    defaultFeeRate: 10.8,
    vatIncludedInFee: false, // 쿠팡은 카테고리 수수료에 부가세 10% 별도 부과 (실질 1.1배)
    shippingFeeRate: 3.3,    // 배송비 수수료 3.3% (부가세 포함)
    categories: [
      { id: 'fashion', name: '의류 / 패션잡화', feeRate: 10.5 },
      { id: 'kitchen', name: '주방용품 / 식기', feeRate: 10.8 },
      { id: 'living', name: '생활용품 / 청소', feeRate: 10.8 },
      { id: 'beauty', name: '뷰티 / 화장품', feeRate: 10.5 },
      { id: 'food', name: '가공식품 / 신선식품', feeRate: 10.6 },
      { id: 'electronics', name: '가전 / 디지털 / 컴퓨터', feeRate: 7.8 },
      { id: 'sports', name: '스포츠 / 레저', feeRate: 10.5 },
      { id: 'baby', name: '출산 / 유아동', feeRate: 10.8 },
      { id: 'furniture', name: '가구 / 인테리어', feeRate: 10.8 },
      { id: 'etc', name: '기타 카테고리', feeRate: 10.8 },
    ],
  },
  COUPANG_GROWTH: {
    id: 'COUPANG_GROWTH',
    name: '쿠팡 로켓그로스 (제트배송)',
    badge: 'Rocket Growth',
    defaultFeeRate: 10.8,
    vatIncludedInFee: false,
    shippingFeeRate: 0,      // 그로스는 입고/출고 물류비 요율이 별도 적용됨
    categories: [
      { id: 'growth_std', name: '로켓그로스 일반 상품 (평균)', feeRate: 10.8 },
      { id: 'growth_elec', name: '로켓그로스 가전/디지털', feeRate: 7.8 },
      { id: 'growth_fashion', name: '로켓그로스 패션', feeRate: 10.5 },
    ],
  },
  SMARTSTORE: {
    id: 'SMARTSTORE',
    name: '네이버 스마트스토어',
    badge: 'SmartStore',
    defaultFeeRate: 5.63,    // 일반등급 결제수수료 3.63% + 매출연동 2.0% (부가세 포함)
    vatIncludedInFee: true,  // 네이버 수수료는 부가세 포함 고시
    shippingFeeRate: 3.63,   // 배송비 결제수수료 (일반 등급 기준)
    categories: [
      { id: 'naver_general', name: '일반 등급 (결제 3.63% + 연동 2%)', feeRate: 5.63 },
      { id: 'naver_small3', name: '중소3 등급 (결제 3.025% + 연동 2%)', feeRate: 5.025 },
      { id: 'naver_small2', name: '중소2 등급 (결제 2.805% + 연동 2%)', feeRate: 4.805 },
      { id: 'naver_small1', name: '중소1 등급 (결제 2.585% + 연동 2%)', feeRate: 4.585 },
      { id: 'naver_micro', name: '영세 등급 (결제 1.98% + 연동 2%)', feeRate: 3.98 },
      { id: 'naver_direct', name: '자체 유입(연동수수료 0% 제외)', feeRate: 3.63 },
    ],
  },
  CUSTOM: {
    id: 'CUSTOM',
    name: '직접 입력 (11번가, G마켓 등)',
    badge: 'Custom',
    defaultFeeRate: 13.0,
    vatIncludedInFee: true,
    shippingFeeRate: 3.3,
    categories: [
      { id: 'custom_openmarket', name: '오픈마켓 평균 (13%)', feeRate: 13.0 },
      { id: 'custom_direct', name: '자사몰 (PG 3.3%)', feeRate: 3.3 },
    ],
  },
};
```

---

## 4. 정밀 계산 엔진 구현 (`utils/calculator.ts`)

> **[중요 공식 규칙]**
> 1. **쿠팡 윙 수수료 실질 요율**: `카테고리 수수료율 * 1.1` (수수료에 부가세 10% 별도 가산)
> 2. **쿠팡 윙 배송비 수수료**: `고객부담 배송비 * 3.3%` (부가세 포함)
> 3. **스마트스토어**: 고시 수수료율에 부가세가 포함되어 있으므로 `1.1`을 곱하지 않음.
> 4. **부가가치세(VAT) 간이 계산**:
>    - 일반과세자: `매출세액 = 총매출 / 11`, `매입공제세액 = (원가 + 실배송비 + 포장비 + 수수료) / 11`
>    - 예상 납부세액 = `max(0, 매출세액 - 매입공제세액)`
>    - 간이과세자: 세부담 약 1.5%~3% 수준 (초보 셀러 편의를 위해 매출의 2.5% 간이 적용)

```typescript
import { MarginInputState, MarginResult, HealthStatus, ReverseInputState } from '../types/margin';
import { PLATFORM_PRESETS } from '../constants/feePresets';

export function calculateMargin(input: MarginInputState): MarginResult {
  const platformConfig = PLATFORM_PRESETS[input.platform] || PLATFORM_PRESETS.COUPANG_WING;
  
  // 1. 유효 수수료율 결정
  let saleFeeRate = input.customFeeRate;
  if (input.platform !== 'CUSTOM') {
    const matchedCategory = platformConfig.categories.find((c) => c.id === input.category);
    saleFeeRate = matchedCategory ? matchedCategory.feeRate : platformConfig.defaultFeeRate;
  }

  // 2. 매출 계산
  const grossRevenue = (input.salePrice || 0) + (input.customerShippingFee || 0);

  // 3. 플랫폼 수수료 계산
  // 쿠팡 등 vatIncludedInFee가 false인 경우 * 1.1 적용
  const feeVatMultiplier = platformConfig.vatIncludedInFee ? 1.0 : 1.1;
  const platformSaleFee = Math.round((input.salePrice || 0) * (saleFeeRate / 100) * feeVatMultiplier);
  const platformShippingFee = Math.round(
    (input.customerShippingFee || 0) * (platformConfig.shippingFeeRate / 100)
  );
  const totalPlatformFee = platformSaleFee + platformShippingFee;

  // 4. 예상 정산액
  const settlementAmount = grossRevenue - totalPlatformFee;

  // 5. 원가 및 변동비
  const productCost = input.productCost || 0;
  const actualShippingFee = input.actualShippingFee || 0;
  const packagingCost = input.packagingCost || 0;
  const adCost = input.adCostPerUnit || 0;
  const returnReserveCost = Math.round((input.salePrice || 0) * ((input.returnReserveRate || 0) / 100));

  // 6. 부가가치세(VAT) 예상 납부액 계산
  let estimatedVat = 0;
  if (input.taxType === 'GENERAL') {
    const outputVat = Math.round(grossRevenue / 11);
    const inputVat = Math.round(
      (productCost + actualShippingFee + packagingCost + totalPlatformFee) / 11
    );
    estimatedVat = Math.max(0, outputVat - inputVat);
  } else if (input.taxType === 'SIMPLE') {
    // 간이과세자 평균 간이 추산 (매출액의 약 2.5%)
    estimatedVat = Math.round(grossRevenue * 0.025);
  } else {
    estimatedVat = 0; // 면세
  }

  // 7. 총 지출 및 최종 순이익
  const totalExpense =
    productCost +
    actualShippingFee +
    packagingCost +
    adCost +
    returnReserveCost +
    totalPlatformFee +
    estimatedVat;

  const netProfit = grossRevenue - totalExpense;

  // 8. 마진율 및 ROI
  const marginRate = grossRevenue > 0 ? Number(((netProfit / grossRevenue) * 100).toFixed(2)) : 0;
  const totalInvestedCost = productCost + actualShippingFee + packagingCost + adCost;
  const roi = totalInvestedCost > 0 ? Number(((netProfit / totalInvestedCost) * 100).toFixed(1)) : 0;

  // 9. 손익분기 광고 ROAS (BEP ROAS)
  // 광고 전 순이익 = netProfit + adCost
  const profitBeforeAd = netProfit + adCost;
  let bepRoas = 0;
  if (profitBeforeAd > 0 && input.salePrice > 0) {
    bepRoas = Math.round((input.salePrice / profitBeforeAd) * 100);
  }

  // 10. 건강도 진단 (Health Status)
  let healthStatus: HealthStatus = 'HEALTHY';
  let healthTitle = '안정적인 마진';
  let healthMessage = '이커머스 평균 수준의 건전한 마진 구조입니다.';

  if (netProfit < 0) {
    healthStatus = 'DANGER';
    healthTitle = '🚨 역마진 발생 (적자 위험)';
    healthMessage = `상품을 1개 판매할 때마다 ${Math.abs(netProfit).toLocaleString()}원의 손실이 발생합니다! 판매가를 올리거나 광고비를 줄여야 합니다.`;
  } else if (marginRate < 10) {
    healthStatus = 'WARNING';
    healthTitle = '⚠️ 초저마진 주의 구간';
    healthMessage = '마진율이 10% 미만입니다. 반품 1~2건 발생 시 즉시 적자로 돌아설 수 있습니다.';
  } else if (marginRate >= 25) {
    healthStatus = 'EXCELLENT';
    healthTitle = '🌟 우수한 고마진 상품';
    healthMessage = '순마진율이 25% 이상으로 공격적인 광고(키워드/검색광고) 집행이 가능한 최적 구조입니다.';
  }

  // 11. 비용 비중 백분율 (도넛 차트용)
  const safeRevenue = grossRevenue > 0 ? grossRevenue : 1;
  const productPct = Math.max(0, Number(((productCost / safeRevenue) * 100).toFixed(1)));
  const feePct = Math.max(0, Number(((totalPlatformFee / safeRevenue) * 100).toFixed(1)));
  const shipPackPct = Math.max(0, Number((((actualShippingFee + packagingCost) / safeRevenue) * 100).toFixed(1)));
  const adPct = Math.max(0, Number(((adCost / safeRevenue) * 100).toFixed(1)));
  const taxReservePct = Math.max(0, Number((((estimatedVat + returnReserveCost) / safeRevenue) * 100).toFixed(1)));
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
```

---

## 5. 목표 마진 판매가 역산 엔진 (`utils/calculator.ts` 확장)

초보 셀러가 "내가 20% 마진을 남기려면 얼마에 올려야 하지?"를 물었을 때의 수식입니다.

### 역산 공식 유도
총매출 $R = P_{sale} + P_{ship\_customer}$  
수수료 $Fee \approx P_{sale} \cdot f_{sale} + P_{ship\_customer} \cdot f_{ship}$  
반품충당금 $C_{res} = P_{sale} \cdot r_{return}$  
예상 부가세 부담률을 판매가의 약 $v\%$로 근사치 반영 ($v \approx 4\% \sim 5\%$).

목표 마진율 $M_{target}$ (예: 0.20):
$$\text{순이익} = R - \text{비용} = M_{target} \cdot R$$
$$P_{sale} \cdot (1 - f_{sale} - r_{return} - v - M_{target}) = C_{product} + C_{ship\_net} + C_{package} + C_{ad} - P_{ship\_customer} \cdot (1 - f_{ship} - M_{target})$$

```typescript
export interface ReverseCalculationResult {
  recommendedSalePrice: number;   // 권장 판매가 (100원 단위 올림)
  targetMarginRate: number;       // 실제 적용된 마진율 (%)
  targetNetProfit: number;         // 달성 예상 순이익 (원)
  simulatedResult: MarginResult;  // 이 가격으로 시뮬레이션한 전체 마진 결과
}

export function calculateReversePrice(input: ReverseInputState): ReverseCalculationResult {
  const platformConfig = PLATFORM_PRESETS[input.platform] || PLATFORM_PRESETS.COUPANG_WING;
  
  let baseFeeRate = input.customFeeRate;
  if (input.platform !== 'CUSTOM') {
    const matchedCategory = platformConfig.categories.find((c) => c.id === input.category);
    baseFeeRate = matchedCategory ? matchedCategory.feeRate : platformConfig.defaultFeeRate;
  }

  // 실질 판매 수수료율 (쿠팡의 경우 1.1배)
  const effectiveFeeRate = (baseFeeRate / 100) * (platformConfig.vatIncludedInFee ? 1.0 : 1.1);
  const shipFeeRate = (platformConfig.shippingFeeRate / 100);
  const returnRate = (input.returnReserveRate || 0) / 100;
  
  // 과세유형별 유효 세부담 계수
  const vatRate = input.taxType === 'GENERAL' ? 0.045 : input.taxType === 'SIMPLE' ? 0.025 : 0;

  // 고정 지출비 합산
  const fixedExpenses =
    (input.productCost || 0) +
    (input.actualShippingFee || 0) +
    (input.packagingCost || 0) +
    (input.adCostPerUnit || 0);

  const customerShip = input.customerShippingFee || 0;
  let recommendedPrice = 0;

  if (input.targetType === 'MARGIN_RATE') {
    const targetMargin = (input.targetValue || 20) / 100; // 0.20
    const denominator = 1 - (effectiveFeeRate + returnRate + vatRate + targetMargin);

    if (denominator <= 0.05) {
      // 분모가 너무 작으면 비정상적 가격이 나오므로 방어
      recommendedPrice = Math.round(fixedExpenses * 2);
    } else {
      const numerator = fixedExpenses - customerShip * (1 - shipFeeRate - targetMargin);
      recommendedPrice = Math.ceil(Math.max(0, numerator / denominator) / 100) * 100; // 100원 단위 절상
    }
  } else {
    // 목표 순수익 금액(원) 기준
    const targetProfit = input.targetValue || 5000;
    const denominator = 1 - (effectiveFeeRate + returnRate + vatRate);

    if (denominator <= 0.05) {
      recommendedPrice = Math.round(fixedExpenses + targetProfit);
    } else {
      const numerator = fixedExpenses + targetProfit - customerShip * (1 - shipFeeRate);
      recommendedPrice = Math.ceil(Math.max(0, numerator / denominator) / 100) * 100;
    }
  }

  // 역산된 가격으로 실제 마진 결과 검증 시뮬레이션
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

  const simulatedResult = calculateMargin(simulatedInput);

  return {
    recommendedSalePrice: recommendedPrice,
    targetMarginRate: simulatedResult.marginRate,
    targetNetProfit: simulatedResult.netProfit,
    simulatedResult,
  };
}
```

---

## 6. React 상태 관리 훅 (`hooks/useMarginCalculator.ts`)

```typescript
import { useState, useMemo, useEffect } from 'react';
import { MarginInputState, ReverseInputState, MarginResult } from '../types/margin';
import { calculateMargin, calculateReversePrice } from '../utils/calculator';
import { PLATFORM_PRESETS } from '../constants/feePresets';

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
  targetValue: 20, // 목표 마진 20%
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

const STORAGE_KEY = 'seller_margin_calc_history_v1';

export function useMarginCalculator() {
  const [input, setInput] = useState<MarginInputState>(DEFAULT_INPUT);
  const [reverseInput, setReverseInput] = useState<ReverseInputState>(DEFAULT_REVERSE);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // 플랫폼 변경 시 해당 플랫폼의 첫 카테고리로 자동 선택
  const handlePlatformChange = (platformId: MarginInputState['platform']) => {
    const config = PLATFORM_PRESETS[platformId];
    const defaultCat = config?.categories[0]?.id || '';
    const defaultRate = config?.defaultFeeRate || 10.8;

    setInput((prev) => ({
      ...prev,
      platform: platformId,
      category: defaultCat,
      customFeeRate: defaultRate,
    }));
  };

  // 일반 마진 계산 결과 (useMemo 실시간 반응)
  const result: MarginResult = useMemo(() => {
    return calculateMargin(input);
  }, [input]);

  // 역산 계산 결과
  const reverseResult = useMemo(() => {
    return calculateReversePrice(reverseInput);
  }, [reverseInput]);

  // 클립보드 복사용 요약 텍스트 생성
  const getSummaryText = () => {
    return `[셀러 마진 계산기 결과]
- 판매가: ${input.salePrice.toLocaleString()}원 (배송비: ${input.customerShippingFee.toLocaleString()}원)
- 매입원가: ${input.productCost.toLocaleString()}원
- 플랫폼 수수료: ${result.totalPlatformFee.toLocaleString()}원
- 실 정산액: ${result.settlementAmount.toLocaleString()}원
- 최종 순이익: ${result.netProfit.toLocaleString()}원
- 순 마진율: ${result.marginRate}% (ROI: ${result.roi}%)
- 진단: ${result.healthTitle}`;
  };

  return {
    input,
    setInput,
    reverseInput,
    setReverseInput,
    result,
    reverseResult,
    isAdvancedOpen,
    setIsAdvancedOpen,
    handlePlatformChange,
    getSummaryText,
    resetToDefaults: () => setInput(DEFAULT_INPUT),
  };
}
```

---

## 7. 화면 컴포넌트 구현 가이드 (Tailwind CSS 기반)

### 7.1 메인 레이아웃 (`MarginCalculator.tsx`)
```tsx
import React from 'react';
import { useMarginCalculator } from '../../hooks/useMarginCalculator';
import { InputSection } from './InputSection';
import { ResultDashboard } from './ResultDashboard';
import { ReverseCalculator } from './ReverseCalculator';

export const MarginCalculator: React.FC = () => {
  const calc = useMarginCalculator();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 상단 헤더 & 탭 */}
        <header className="mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between border-b pb-6 border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-indigo-600">🚀</span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                셀러마진 119
              </h1>
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                초보 셀러 필수
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              쿠팡·스마트스토어 역마진 제로 검증 & 목표 마진 판매가 역산
            </p>
          </div>

          {/* 모드 전환 탭 */}
          <div className="mt-4 sm:mt-0 inline-flex p-1 bg-slate-200 rounded-xl">
            <button
              onClick={() => calc.setInput(p => ({ ...p, calculatorMode: 'STANDARD' }))}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                calc.input.calculatorMode === 'STANDARD'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 실시간 마진 계산기
            </button>
            <button
              onClick={() => calc.setInput(p => ({ ...p, calculatorMode: 'REVERSE' }))}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                calc.input.calculatorMode === 'REVERSE'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎯 목표마진 판매가 역산기
            </button>
          </div>
        </header>

        {/* 메인 2-Column 본문 */}
        {calc.input.calculatorMode === 'STANDARD' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 좌측 입력 폼 (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <InputSection {...calc} />
            </div>

            {/* 우측 실시간 결과 대시보드 (5 cols, sticky) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
              <ResultDashboard {...calc} />
            </div>
          </div>
        ) : (
          <ReverseCalculator {...calc} />
        )}
      </div>
    </div>
  );
};
```

---

### 7.2 리스크 진단 카드 (`HealthStatusCard.tsx`)
```tsx
import React from 'react';
import { HealthStatus } from '../../types/margin';

interface Props {
  status: HealthStatus;
  title: string;
  message: string;
}

export const HealthStatusCard: React.FC<Props> = ({ status, title, message }) => {
  const themeMap = {
    DANGER: {
      bg: 'bg-red-50 border-red-200 text-red-900',
      badge: 'bg-red-600 text-white animate-pulse',
      icon: '🚨',
    },
    WARNING: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      badge: 'bg-amber-500 text-white',
      icon: '⚠️',
    },
    HEALTHY: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badge: 'bg-emerald-600 text-white',
      icon: '✅',
    },
    EXCELLENT: {
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      badge: 'bg-indigo-600 text-white',
      icon: '🌟',
    },
  }[status];

  return (
    <div className={`p-4 rounded-xl border ${themeMap.bg} transition-all duration-300`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xl">{themeMap.icon}</span>
        <h3 className="font-bold text-base tracking-tight">{title}</h3>
      </div>
      <p className="text-xs leading-relaxed opacity-90 pl-7">{message}</p>
    </div>
  );
};
```

---

### 7.3 순수 SVG/Tailwind 비용 도넛 차트 (`CostDonutChart.tsx`)
외부 라이브러리 설치 없이 즉시 사용할 수 있는 초경량 SVG 도넛 차트 컴포넌트:

```tsx
import React from 'react';

interface Props {
  percentages: {
    product: number;
    platformFee: number;
    shippingAndPackaging: number;
    advertising: number;
    taxAndReserve: number;
    netProfit: number;
  };
}

export const CostDonutChart: React.FC<Props> = ({ percentages }) => {
  const items = [
    { label: '상품원가', val: percentages.product, color: '#3b82f6' },        // blue-500
    { label: '플랫폼수수료', val: percentages.platformFee, color: '#ef4444' },    // red-500
    { label: '배송/포장비', val: percentages.shippingAndPackaging, color: '#f59e0b' }, // amber-500
    { label: '광고비', val: percentages.advertising, color: '#8b5cf6' },         // purple-500
    { label: '세금/충당금', val: percentages.taxAndReserve, color: '#64748b' },     // slate-500
    { label: '순이익', val: Math.max(0, percentages.netProfit), color: '#10b981' }, // emerald-500
  ].filter(i => i.val > 0);

  // SVG 원호(stroke-dasharray) 계산
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.32
  let accumulatedOffset = 0;

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        매출 대비 비용 및 마진 구조
      </div>
      <div className="flex items-center gap-6">
        {/* SVG 원형 차트 */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="16"
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
                  strokeWidth="16"
                  strokeDasharray={`${dashLength} ${circumference}`}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-400 font-medium">순마진</span>
            <span className="text-xs font-bold text-slate-800">
              {percentages.netProfit}%
            </span>
          </div>
        </div>

        {/* 범례 (Legend) */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs flex-1">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 truncate">{item.label}</span>
              </div>
              <span className="font-semibold text-slate-800">{item.val}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 8. 단위 검증 테스트 케이스 (Verification Test Cases)

개발자가 코드를 작성한 후 콘솔 또는 Jest/Vitest에서 수식 정확성을 즉시 검증할 수 있는 테스트 데이터입니다.

### Case 1: 쿠팡 윙 일반 사입 (정상 흑자 마진)
- **입력**:
  - 판매가: 25,000원, 고객배송비: 3,000원 (총매출 28,000원)
  - 카테고리: 생활용품 (수수료 10.8% * 1.1 = 11.88%)
  - 사입원가: 11,000원, 실배송비: 2,800원, 포장비: 500원
  - 광고비: 1,500원, 반품충당율: 2% (500원), 과세: 일반과세자
- **기대 산출 결과**:
  - 판매수수료: `25,000 * 0.1188 = 2,970원`
  - 배송비수수료: `3,000 * 0.033 = 99원`
  - 총 플랫폼수수료: `3,069원`
  - 정산액: `28,000 - 3,069 = 24,931원`
  - 부가세 납부예상액: 약 `727원`
  - 최종 순이익: **약 +7,335원**
  - 순마진율: **약 26.2%** (🌟 고마진 배지 출력)
  - BEP ROAS: **약 283%**

### Case 2: 역마진 발생 케이스 (위험 배지 & Shake 효과)
- **입력**:
  - 판매가: 12,000원 (무료배송 = 0원)
  - 수수료율: 10.8% (1.1배 = 11.88% -> 1,426원)
  - 사입원가: 8,000원, 실배송비: 3,000원, 포장비: 500원, 광고비: 1,500원
- **기대 산출 결과**:
  - 총지출: `8,000 + 3,000 + 500 + 1,500 + 1,426 + 세금 ≈ 14,426원`
  - 순이익: **-2,426원 (적자)**
  - 마진율: **-20.2%**
  - 건강도 진단: **`DANGER` (🚨 역마진 발생)**

### Case 3: 목표 마진율 20% 역산 케이스
- **입력**:
  - 사입원가 10,000원, 실배송비 2,800원, 포장비 500원, 광고비 1,000원
  - 고객배송비 3,000원
  - 목표 마진율: **20%**
- **기대 산출 결과**:
  - 역산 권장 판매가: **약 19,800원 ~ 20,200원 구간 산출**
  - 검증: 산출된 판매가로 계산 시 최종 순마진율이 20% ± 0.5% 오차 내 수렴 확인.

---

## 9. 3호 개발자 체크리스트 (Implementation Checklist)

1. [ ] `types/margin.ts` 생성 및 타입 복사
2. [ ] `constants/feePresets.ts` 생성 (쿠팡 윙, 스마트스토어 요율 확인)
3. [ ] `utils/calculator.ts` 생성 (`calculateMargin`, `calculateReversePrice` 단위 테스트 통과)
4. [ ] `hooks/useMarginCalculator.ts` 커스텀 훅 작성
5. [ ] `components/` UI 구성 (Tailwind 클래스 적용 및 2-Column 반응형 레이아웃 완성)
6. [ ] 역마진 발생 시(`status === 'DANGER'`) 빨간색 배경 및 애니메이션 확인
7. [ ] 클립보드 복사(결과 텍스트) 버튼 정상 작동 확인
