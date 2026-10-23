import { Language } from '../types/margin';

export interface TranslationDictionary {
  appTitle: string;
  tagline: string;
  subTagline: string;
  badgeVerified: string;
  tabStandard: string;
  tabReverse: string;
  sec1Title: string;
  reset: string;
  coupangVatNotice: string;
  customFeeRate: string;
  sec2Title: string;
  switchFreeShip: string;
  switchPaidShip: string;
  salePrice: string;
  customerShippingFee: string;
  sec3Title: string;
  productCost: string;
  actualShippingFee: string;
  packagingCost: string;
  sec4Title: string;
  precisionCalc: string;
  adCost: string;
  returnReserveRate: string;
  taxType: string;
  taxGeneral: string;
  taxSimple: string;
  taxFree: string;
  dangerBadge: string;
  dangerTitle: string;
  dangerMessage: string;
  warningTitle: string;
  warningMessage: string;
  healthyTitle: string;
  healthyMessage: string;
  excellentTitle: string;
  excellentMessage: string;
  netProfitLabel: string;
  netProfitSub: string;
  marginRateLabel: string;
  roiLabel: string;
  bepRoasLabel: string;
  noProfit: string;
  costBreakdownTitle: string;
  costBreakdownSub: string;
  labelProduct: string;
  labelFee: string;
  labelShipping: string;
  labelAd: string;
  labelTax: string;
  labelProfit: string;
  labelLoss: string;
  flowTitle: string;
  flowRevenue: string;
  flowFee: string;
  flowSettlement: string;
  btnCopy: string;
  btnQuickCopy: string;
  btnReceipt: string;
  btnSave: string;
  reverseTitle: string;
  reverseSub: string;
  reverseTargetType: string;
  reverseMarginRate: string;
  reverseNetProfit: string;
  reverseTargetLabel: string;
  reverseRecommendTitle: string;
  reverseRecommendSub: string;
  reverseApplyBtn: string;
  reverseNotice: string;
  historyTitle: string;
  historyClear: string;
  historyLoad: string;
  receiptTitle: string;
  receiptCopy: string;
  receiptPrint: string;
  guideTitle: string;
  guide1Title: string;
  guide1Desc: string;
  guide2Title: string;
  guide2Desc: string;
  guide3Title: string;
  guide3Desc: string;
  footerNotice: string;
  copiedToast: string;
  savedToast: string;
  loadedToast: string;
  clearedToast: string;
  appliedReverseToast: string;
  shareCopyHeader: string;
  shareCopyPlatform: string;
  shareCopyFeeWord: string;
  shareCopyPriceCost: string;
  shareCopyCost: string;
  shareCopyPayout: string;
  shareCopyNetMargin: string;
  shareCopyMarginRate: string;
  shareCopyCta: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  KO: {
    appTitle: '마진스냅 (MarginSnap)',
    tagline: '글로벌 스마트 마진 계산기',
    subTagline: '플랫폼 수수료 털고 내 통장에 남는 돈',
    badgeVerified: '역마진 0% 안심 검증',
    tabStandard: '실시간 마진 계산기',
    tabReverse: '목표 마진 판매가 역산기',
    sec1Title: '판매 채널 & 카테고리 수수료',
    reset: '초기화',
    coupangVatNotice: '쿠팡 윙은 카테고리 수수료에 부가세 10%가 별도(×1.1) 부과됩니다. 실질 계산 반영됨!',
    customFeeRate: '직접 입력 수수료율',
    sec2Title: '판매 가격 및 배송비 책정',
    switchFreeShip: '무료배송 전환 (0)',
    switchPaidShip: '유료배송 전환',
    salePrice: '상품 판매가',
    customerShippingFee: '고객 결제 배송비',
    sec3Title: '매입 원가 및 실제 지출 물류비',
    productCost: '상품 사입원가',
    actualShippingFee: '실제 지출 택배비',
    packagingCost: '포장 부자재비',
    sec4Title: '숨은 비용 옵션 (광고비, 반품충당금, 부가세)',
    precisionCalc: '정밀 계산',
    adCost: '건당 투입 광고비 (전환비용)',
    returnReserveRate: '반품/파손 손실 충당율 (기본 2%)',
    taxType: '사업자 과세 유형',
    taxGeneral: '일반과세 (10%)',
    taxSimple: '간이과세 (2.5%)',
    taxFree: '면세/해외 (0%)',
    dangerBadge: '적자 경고',
    dangerTitle: '🚨 역마진 발생 (팔수록 적자)',
    dangerMessage: '상품을 1개 판매할 때마다 손실이 발생합니다! 판매가를 올리거나 광고비를 줄이세요.',
    warningTitle: '⚠️ 초저마진 주의 구간 (위험)',
    warningMessage: '마진율이 10% 미만입니다. 반품 1~2건 발생 시 즉시 적자로 전환될 위험이 큽니다.',
    healthyTitle: '안정적인 마진 구조',
    healthyMessage: '이커머스 평균 수준의 건전한 마진입니다. 지속 판매가 가능합니다.',
    excellentTitle: '🌟 우수한 고마진 상품',
    excellentMessage: '순마진율이 25% 이상으로, 검색광고 등 마케팅을 적극 집행해도 수익이 남는 구조입니다.',
    netProfitLabel: '통장에 꽂히는 건당 실순이익',
    netProfitSub: '(부가세 납부액 및 반품충당금까지 공제 완료된 실질 수령액)',
    marginRateLabel: '순 마진율',
    roiLabel: '투자 대비 수익률 (ROI)',
    bepRoasLabel: '손익분기 광고 ROAS',
    noProfit: '수익 없음',
    costBreakdownTitle: '매출액 대비 비용 비중',
    costBreakdownSub: '총 100%',
    labelProduct: '상품원가',
    labelFee: '플랫폼수수료',
    labelShipping: '배송·포장',
    labelAd: '광고비',
    labelTax: '세금·충당금',
    labelProfit: '순이익',
    labelLoss: '적자손실',
    flowTitle: '1건 판매 시 정산 & 비용 흐름',
    flowRevenue: '고객 결제 총액 (판매가+배송비)',
    flowFee: '플랫폼 공제 수수료',
    flowSettlement: '실 통장 정산 예정액',
    btnCopy: '상세 복사',
    btnQuickCopy: '결과 요약 복사하기',
    btnReceipt: '영수증 카드',
    btnSave: '내역 저장',
    reverseTitle: '목표 마진 판매가 역산기',
    reverseSub: '원하는 순마진율(%) 또는 순이익을 정하면 플랫폼 수수료와 세금을 모두 감안한 권장 판매가를 산출합니다.',
    reverseTargetType: '목표 수익 기준 선택',
    reverseMarginRate: '순마진율 (%) 기준',
    reverseNetProfit: '건당 순수익 기준',
    reverseTargetLabel: '목표 순 마진율',
    reverseRecommendTitle: '목표 마진 달성 권장 판매가',
    reverseRecommendSub: '(플랫폼 수수료 및 부가세 공제 고려 완료)',
    reverseApplyBtn: '이 가격으로 마진 계산기 적용하기',
    reverseNotice: '* 이 권장가로 등록하시면 반품이나 부가세 정산 후에도 목표하셨던 수익이 안전하게 남습니다.',
    historyTitle: '최근 계산 및 비교 내역',
    historyClear: '전체 비우기',
    historyLoad: '불러오기',
    receiptTitle: '마진스냅 정산 상세 영수증',
    receiptCopy: '텍스트 복사',
    receiptPrint: '인쇄',
    guideTitle: '초보 셀러 마진 정산 3대 필수 체크포인트',
    guide1Title: '1. 수수료 부가세 별도 여부',
    guide1Desc: '쿠팡 윙 등 플랫폼에 따라 고시 수수료에 부가세 10%가 별도(1.1배) 가산됩니다.',
    guide2Title: '2. 배송비 수수료 공제',
    guide2Desc: '고객 결제 배송비에도 수수료(쿠팡 3.3% 등)가 부과되는 정책을 확인해야 합니다.',
    guide3Title: '3. 손익분기 광고 ROAS (BEP)',
    guide3Desc: '순마진율에 맞는 최소 광고 수익률을 지켜야 광고비로 인한 적자를 방지할 수 있습니다.',
    footerNotice: '© 2026 마진스냅 (MarginSnap) · 모든 입력값과 계산 내역은 사용자 기기(LocalStorage)에만 안전하게 보관됩니다.',
    copiedToast: '클립보드에 복사되었습니다! 🎉',
    savedToast: '💾 현재 계산 결과가 히스토리에 저장되었습니다.',
    loadedToast: '📂 계산 내역을 불러왔습니다.',
    clearedToast: '히스토리가 비워졌습니다.',
    appliedReverseToast: '🎯 역산된 권장 판매가가 실시간 계산기에 적용되었습니다!',
    shareCopyHeader: '[마진스냅 (MarginSnap) 계산 결과]',
    shareCopyPlatform: '플랫폼',
    shareCopyFeeWord: '수수료',
    shareCopyPriceCost: '판매가',
    shareCopyCost: '매입원가',
    shareCopyPayout: '내 통장 실수령액',
    shareCopyNetMargin: '최종 순마진',
    shareCopyMarginRate: '순마진율',
    shareCopyCta: '👉 마진스냅에서 내 마진 3초 컷 계산하기',
  },
  EN: {
    appTitle: 'MarginSnap',
    tagline: 'Global Smart Margin Calculator',
    subTagline: 'Real Profit in Your Pocket After Platform Fees',
    badgeVerified: '0% Negative Margin Guarantee',
    tabStandard: 'Live Margin Calculator',
    tabReverse: 'Target Margin Reverse Price',
    sec1Title: 'Sales Channel & Category Fees',
    reset: 'Reset',
    coupangVatNotice: 'Note: Coupang Wing charges +10% VAT separately (1.1x) on category fees.',
    customFeeRate: 'Custom Fee Rate',
    sec2Title: 'Price & Shipping Settings',
    switchFreeShip: 'Switch to Free Shipping',
    switchPaidShip: 'Switch to Paid Shipping',
    salePrice: 'Selling Price',
    customerShippingFee: 'Customer Shipping Fee',
    sec3Title: 'Product Cost & Logistics',
    productCost: 'Product Purchase Cost',
    actualShippingFee: 'Actual Shipping Cost',
    packagingCost: 'Packaging Cost',
    sec4Title: 'Hidden Cost Options (Ads, Returns, Tax)',
    precisionCalc: 'Detailed Options',
    adCost: 'Ad Cost per Unit (CPA)',
    returnReserveRate: 'Return/Loss Reserve Rate (Default 2%)',
    taxType: 'Tax Classification',
    taxGeneral: 'Standard VAT (10%)',
    taxSimple: 'Reduced VAT (2.5%)',
    taxFree: 'Tax Exempt / Global (0%)',
    dangerBadge: 'LOSS ALERT',
    dangerTitle: '🚨 Negative Margin Alert (Losing Money)',
    dangerMessage: 'You are losing money on every single sale! Increase selling price or reduce ad spend.',
    warningTitle: '⚠️ Ultra-low Margin Warning (Risky)',
    warningMessage: 'Margin is below 10%. A single return or damaged item could turn your profit into a loss.',
    healthyTitle: 'Healthy Margin Structure',
    healthyMessage: 'A stable e-commerce profit margin. Sustainable for ongoing sales.',
    excellentTitle: '🌟 High-Profit Item (Great Margin)',
    excellentMessage: 'Net margin is over 25%. You have enough room for aggressive marketing & ads.',
    netProfitLabel: 'Net Profit per Unit (Take-home)',
    netProfitSub: '(Actual profit after platform fees, taxes, and return reserves)',
    marginRateLabel: 'Net Margin Rate',
    roiLabel: 'Return on Investment (ROI)',
    bepRoasLabel: 'Break-even Ad ROAS',
    noProfit: 'No Profit',
    costBreakdownTitle: 'Revenue vs Cost Breakdown',
    costBreakdownSub: 'Total 100%',
    labelProduct: 'Product Cost',
    labelFee: 'Platform Fee',
    labelShipping: 'Shipping/Pack',
    labelAd: 'Advertising',
    labelTax: 'Tax/Reserve',
    labelProfit: 'Net Profit',
    labelLoss: 'Net Loss',
    flowTitle: 'Per-Order Payout & Cost Breakdown',
    flowRevenue: 'Gross Revenue (Price + Shipping)',
    flowFee: 'Platform Deduction Fee',
    flowSettlement: 'Estimated Payout Amount',
    btnCopy: 'Copy Details',
    btnQuickCopy: 'Copy Quick Summary',
    btnReceipt: 'Receipt Card',
    btnSave: 'Save History',
    reverseTitle: 'Target Margin Reverse Calculator',
    reverseSub: 'Set your desired net margin (%) or profit amount, and we will calculate the exact price to charge.',
    reverseTargetType: 'Target Metric Type',
    reverseMarginRate: 'Target Margin (%)',
    reverseNetProfit: 'Target Profit Amount',
    reverseTargetLabel: 'Target Margin Rate',
    reverseRecommendTitle: 'Recommended Selling Price',
    reverseRecommendSub: '(Platform fees, taxes, and reserves already calculated)',
    reverseApplyBtn: 'Apply this price to Margin Calculator',
    reverseNotice: '* Charging this price ensures your target profit remains safe even after deductions.',
    historyTitle: 'Recent Calculations & Comparisons',
    historyClear: 'Clear All',
    historyLoad: 'Load',
    receiptTitle: 'MarginSnap Payout Receipt',
    receiptCopy: 'Copy Text',
    receiptPrint: 'Print',
    guideTitle: '3 Essential Checkpoints for New Sellers',
    guide1Title: '1. VAT on Platform Fees',
    guide1Desc: 'Some platforms add 10% VAT on top of published commissions (e.g. Coupang 1.1x).',
    guide2Title: '2. Shipping Commission Deductions',
    guide2Desc: 'Check if platforms also take a commission fee out of the shipping charges paid by buyers.',
    guide3Title: '3. Break-even ROAS (BEP)',
    guide3Desc: 'Stay above your BEP ROAS to ensure you are not funding platform ads out of your own pocket.',
    footerNotice: '© 2026 MarginSnap · All input and calculation data are stored locally in your browser.',
    copiedToast: 'Copied to clipboard! 🎉',
    savedToast: '💾 Calculation saved to history.',
    loadedToast: '📂 Calculation loaded from history.',
    clearedToast: 'History cleared.',
    appliedReverseToast: '🎯 Recommended price applied to calculator!',
    shareCopyHeader: '[MarginSnap Calculation Result]',
    shareCopyPlatform: 'Platform',
    shareCopyFeeWord: 'Fee',
    shareCopyPriceCost: 'Price',
    shareCopyCost: 'Product Cost',
    shareCopyPayout: 'Net Payout to Bank',
    shareCopyNetMargin: 'Final Net Profit',
    shareCopyMarginRate: 'Net Margin',
    shareCopyCta: '👉 Calculate your margins in 3 seconds on MarginSnap',
  },
  JA: {
    appTitle: 'MarginSnap',
    tagline: 'グローバル対応スマート利益計算ツール',
    subTagline: '手数料を引いた本当の純利益',
    badgeVerified: '逆ザヤ0%安心検証',
    tabStandard: 'リアルタイム利益計算機',
    tabReverse: '目標利益率から販売価格逆算',
    sec1Title: '販売プラットフォーム＆手数料プリセット',
    reset: '初期化',
    coupangVatNotice: '※Coupang Wingは手数料に消費税10%が別途(×1.1)加算されます。計算に実質反映済み。',
    customFeeRate: 'カスタム手数料率',
    sec2Title: '販売価格および送料設定',
    switchFreeShip: '送料無料に変更 (0)',
    switchPaidShip: '有料送料に変更',
    salePrice: '商品販売価格',
    customerShippingFee: '購入者負担送料',
    sec3Title: '仕入原価および配送梱包費',
    productCost: '商品仕入原価',
    actualShippingFee: '実質配送運賃',
    packagingCost: '梱包資材費',
    sec4Title: '隠れコスト設定（広告費・返品引当金・税金）',
    precisionCalc: '詳細設定',
    adCost: '1個あたりの広告費 (CPA)',
    returnReserveRate: '返品・破損損失引当率 (基本2%)',
    taxType: '事業者課税区分',
    taxGeneral: '一般課税 (10%)',
    taxSimple: '簡易課税 (2.5%)',
    taxFree: '免税 / 海外 (0%)',
    dangerBadge: '赤字警告',
    dangerTitle: '🚨 逆ザヤ発生（売るほど赤字）',
    dangerMessage: '1個売るごとに損失が発生しています！販売価格を上げるか広告費を見直してください。',
    warningTitle: '⚠️ 超低利益率注意（危険領域）',
    warningMessage: '利益率が10%未満です。返品が1件発生するだけで赤字転落するリスクがあります。',
    healthyTitle: '安定した利益構造',
    healthyMessage: 'EC平均水準の健全なマージンです。持続的な販売が可能です。',
    excellentTitle: '🌟 優秀な高利益商品',
    excellentMessage: '純利益率25%以上。積極的な広告運用を行っても利益が残る優良構造です。',
    netProfitLabel: '手元に残る1個あたりの純利益',
    netProfitSub: '(手数料・税金・返品引当金を控除した実際の受取額)',
    marginRateLabel: '純利益率',
    roiLabel: '投資対効果 (ROI)',
    bepRoasLabel: '損益分岐 広告ROAS',
    noProfit: '利益なし',
    costBreakdownTitle: '売上に対するコスト比率',
    costBreakdownSub: '全体 100%',
    labelProduct: '仕入原価',
    labelFee: '販売手数料',
    labelShipping: '配送・梱包',
    labelAd: '広告費',
    labelTax: '税・引当金',
    labelProfit: '純利益',
    labelLoss: '純損失',
    flowTitle: '1注文あたりの精算＆コスト明細',
    flowRevenue: '購入者決済総額 (価格+送料)',
    flowFee: 'モール控除手数料',
    flowSettlement: '口座振込予定額',
    btnCopy: '詳細コピー',
    btnQuickCopy: '結果サマリーをコピー',
    btnReceipt: '領収書カード',
    btnSave: '履歴保存',
    reverseTitle: '目標利益率から販売価格を逆算',
    reverseSub: '残したい純利益率(%)または利益額を設定すると、手数料や税金を考慮した推奨価格を即座に逆算します。',
    reverseTargetType: '目標基準の選択',
    reverseMarginRate: '純利益率 (%) 基準',
    reverseNetProfit: '純利益額 基準',
    reverseTargetLabel: '目標 純利益率',
    reverseRecommendTitle: '目標達成のための推奨販売価格',
    reverseRecommendSub: '(モール手数料・税金・引当金を全額考慮済み)',
    reverseApplyBtn: 'この価格を利益計算機に適用',
    reverseNotice: '※この推奨価格で出品すると、諸費用精算後も目標利益を確実に確保できます。',
    historyTitle: '最近の計算および比較履歴',
    historyClear: '全削除',
    historyLoad: '呼出',
    receiptTitle: 'MarginSnap 精算明細レシート',
    receiptCopy: 'テキストコピー',
    receiptPrint: '印刷',
    guideTitle: '初心者セラーのための3大チェックポイント',
    guide1Title: '1. 手数料の消費税別計算',
    guide1Desc: 'モールによって手数料に消費税が別途加算される場合があります。',
    guide2Title: '2. 送料に対する手数料控除',
    guide2Desc: '購入者が支払った送料からも手数料が控除されるモール規約を確認しましょう。',
    guide3Title: '3. 損益分岐広告ROAS',
    guide3Desc: '利益率に見合った最低限の広告回収率を下回らないことが赤字防止の鉄則です。',
    footerNotice: '© 2026 MarginSnap · 入力データはブラウザ（ローカル）にのみ安全に保存されます。',
    copiedToast: 'クリップボードにコピーしました！🎉',
    savedToast: '💾 計算結果が履歴に保存されました。',
    loadedToast: '📂 履歴データを読み込みました。',
    clearedToast: '履歴を削除しました。',
    appliedReverseToast: '🎯 逆算推奨価格を計算機に適用しました！',
    shareCopyHeader: '[MarginSnap 利益計算サマリー]',
    shareCopyPlatform: 'プラットフォーム',
    shareCopyFeeWord: '手数料',
    shareCopyPriceCost: '販売価格',
    shareCopyCost: '仕入原価',
    shareCopyPayout: '通帳受取額',
    shareCopyNetMargin: '最終純利益',
    shareCopyMarginRate: '純利益率',
    shareCopyCta: '👉 MarginSnapで純利益を3秒スピード診断',
  },
  ZH: {
    appTitle: 'MarginSnap (利润快算)',
    tagline: '全球跨境智能利润计算器',
    subTagline: '扣除平台费用后的真实到手利润',
    badgeVerified: '0% 倒贴亏损防线',
    tabStandard: '实时利润计算器',
    tabReverse: '目标利润售价逆算器',
    sec1Title: '销售渠道及佣金类目',
    reset: '重置',
    coupangVatNotice: '注意：韩国Coupang佣金需额外加收10%增值税(×1.1)。系统已自动精准核算。',
    customFeeRate: '自定义佣金率',
    sec2Title: '销售价格与运费设置',
    switchFreeShip: '切换为包邮 (0)',
    switchPaidShip: '切换为买家付运费',
    salePrice: '商品售价',
    customerShippingFee: '买家实付运费',
    sec3Title: '采购成本与实际物流费用',
    productCost: '商品采购成本',
    actualShippingFee: '实际国内/国际头程运费',
    packagingCost: '包装耗材费用',
    sec4Title: '隐形成本选项（广告费、退货备用金、税费）',
    precisionCalc: '精细核算',
    adCost: '单件广告花费 (CPA/转化成本)',
    returnReserveRate: '退货及损坏备用金比例 (默认2%)',
    taxType: '税务类型',
    taxGeneral: '一般纳税 (10%)',
    taxSimple: '小规模/简易 (2.5%)',
    taxFree: '免税 / 跨境海外 (0%)',
    dangerBadge: '亏损警报',
    dangerTitle: '🚨 发生倒贴亏损（卖得越多亏得越多）',
    dangerMessage: '每卖出一单都在倒贴亏损！请立即上调售价或削减广告预算。',
    warningTitle: '⚠️ 超低利润警告（高危区间）',
    warningMessage: '利润率低于10%。一旦产生退货或滞销，将立即转为净亏损。',
    healthyTitle: '健康的利润结构',
    healthyMessage: '达到电商行业平均健康利润水平，支持可持续稳健经营。',
    excellentTitle: '🌟 高利润爆款结构',
    excellentMessage: '净利润率超过25%，拥有充足的投流广告预算与降价抗风险能力。',
    netProfitLabel: '单件到手真实纯利润',
    netProfitSub: '(已全额扣除平台佣金、广告、损耗金及各项税费)',
    marginRateLabel: '纯利润率',
    roiLabel: '投资回报率 (ROI)',
    bepRoasLabel: '保本广告 ROAS',
    noProfit: '无利润',
    costBreakdownTitle: '销售额成本构成比例',
    costBreakdownSub: '总计 100%',
    labelProduct: '采购成本',
    labelFee: '平台佣金',
    labelShipping: '物流包装',
    labelAd: '广告推广',
    labelTax: '税费备用金',
    labelProfit: '净利润',
    labelLoss: '净亏损',
    flowTitle: '单笔订单收支明细流向',
    flowRevenue: '买家实付总金额 (售价+运费)',
    flowFee: '平台扣除总费用',
    flowSettlement: '预计银行到账金额',
    btnCopy: '详细复制',
    btnQuickCopy: '复制测算摘要',
    btnReceipt: '结算小票',
    btnSave: '保存记录',
    reverseTitle: '目标利润售价逆算器',
    reverseSub: '输入您期望的净利润率(%)或固定利润金额，智能逆算出抵抗各项扣费的最优标价。',
    reverseTargetType: '选择目标利润标准',
    reverseMarginRate: '按净利润率 (%) 逆算',
    reverseNetProfit: '按单件净利润金额逆算',
    reverseTargetLabel: '目标净利润率',
    reverseRecommendTitle: '达成目标利润推荐标价',
    reverseRecommendSub: '(已全额预扣平台抽佣与税费折损)',
    reverseApplyBtn: '将此价格一键应用至计算器',
    reverseNotice: '* 按此推荐标价上架销售，扣除所有隐形开销后仍能稳获您设定的纯利润。',
    historyTitle: '最近测算对比历史',
    historyClear: '清空历史',
    historyLoad: '载入',
    receiptTitle: 'MarginSnap 结算小票',
    receiptCopy: '复制文本',
    receiptPrint: '打印',
    guideTitle: '跨境新手卖家三大盈利避坑要点',
    guide1Title: '1. 佣金是否额外含税',
    guide1Desc: '部分电商平台在官方佣金外还会单独加收增值税服务费（如韩国Coupang加收10%）。',
    guide2Title: '2. 买家运费抽佣',
    guide2Desc: '切勿忽略平台是否会对买家支付的运费金额同样收取佣金抽成。',
    guide3Title: '3. 保本广告投产比 (BEP ROAS)',
    guide3Desc: '务必守住自身的保本ROAS红线，防止广告投流给平台做嫁衣。',
    footerNotice: '© 2026 MarginSnap · 所有测算数据均加密保存在用户浏览器本地，绝不上云。',
    copiedToast: '已成功复制到剪贴板！🎉',
    savedToast: '💾 当前测算结果已成功保存至历史记录。',
    loadedToast: '📂 已载入历史测算数据。',
    clearedToast: '历史记录已清空。',
    appliedReverseToast: '🎯 逆算推荐售价已同步应用至实时计算器！',
    shareCopyHeader: '[MarginSnap (利润快算) 测算结果]',
    shareCopyPlatform: '销售平台',
    shareCopyFeeWord: '佣金',
    shareCopyPriceCost: '销售价格',
    shareCopyCost: '采购成本',
    shareCopyPayout: '实际到手金额',
    shareCopyNetMargin: '最终纯利润',
    shareCopyMarginRate: '纯利润率',
    shareCopyCta: '👉 立即使用 MarginSnap 3秒极速核算真实到手利润',
  },
};
