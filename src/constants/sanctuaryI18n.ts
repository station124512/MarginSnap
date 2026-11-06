// 글로벌 추모 샌드박스 다국어 및 프리셋 에셋 정의

export type SanctuaryLang = 'ko' | 'en';

export type StickerCategory = 'lifestyle' | 'pets' | 'keepsakes';

export interface PresetStickerItem {
  id: string;
  mediaUrl: string;
  name: {
    ko: string;
    en: string;
  };
  category: StickerCategory;
  defaultScale?: number;
  defaultRotate?: number;
}

// 🌍 라이프스타일 & 생전 취향 중심 글로벌 프리셋 에셋 모음
export const PRESET_STICKERS: PresetStickerItem[] = [
  // 1. Lifestyle & Hobbies (생전 취향과 즐거움)
  {
    id: 'fav-coffee',
    mediaUrl: '☕',
    name: { ko: '달달한 믹스커피', en: 'Sweet Mix Coffee' },
    category: 'lifestyle',
    defaultScale: 1.0,
    defaultRotate: 0
  },
  {
    id: 'fav-game',
    mediaUrl: '🎮',
    name: { ko: '레트로 게임기', en: 'Retro Game Console' },
    category: 'lifestyle',
    defaultScale: 1.05,
    defaultRotate: -8
  },
  {
    id: 'fav-sunglasses',
    mediaUrl: '🕶️',
    name: { ko: '멋쟁이 선글라스', en: 'Vintage Sunglasses' },
    category: 'lifestyle',
    defaultScale: 1.0,
    defaultRotate: 5
  },
  {
    id: 'fav-beer',
    mediaUrl: '🍺',
    name: { ko: '시원한 생맥주', en: 'Ice-Cold Draft Beer' },
    category: 'lifestyle',
    defaultScale: 1.0,
    defaultRotate: 6
  },
  {
    id: 'fav-guitar',
    mediaUrl: '🎸',
    name: { ko: '어쿠스틱 통기타', en: 'Acoustic Guitar' },
    category: 'lifestyle',
    defaultScale: 1.1,
    defaultRotate: -10
  },
  {
    id: 'fav-camera',
    mediaUrl: '📷',
    name: { ko: '빈티지 필름 카메라', en: 'Vintage Camera' },
    category: 'lifestyle',
    defaultScale: 0.95,
    defaultRotate: 4
  },
  {
    id: 'fav-headphones',
    mediaUrl: '🎧',
    name: { ko: '클래식 헤드폰', en: 'Retro Headphones' },
    category: 'lifestyle',
    defaultScale: 1.0,
    defaultRotate: 8
  },
  {
    id: 'fav-food',
    mediaUrl: '🍜',
    name: { ko: '얼큰한 라면 한 그릇', en: 'Warm Comfort Noodles' },
    category: 'lifestyle',
    defaultScale: 1.0,
    defaultRotate: 0
  },
  {
    id: 'fav-sports',
    mediaUrl: '⚽',
    name: { ko: '열정의 축구공', en: 'Classic Football' },
    category: 'lifestyle',
    defaultScale: 0.9,
    defaultRotate: 12
  },
  {
    id: 'fav-fishing',
    mediaUrl: '🎣',
    name: { ko: '주말 낚싯대', en: 'Weekend Fishing Rod' },
    category: 'lifestyle',
    defaultScale: 1.05,
    defaultRotate: -15
  },

  // 2. Cherished Pets (소중한 반려동물)
  {
    id: 'pet-paw',
    mediaUrl: '🐾',
    name: { ko: '사랑스런 발자국', en: 'Gentle Paw Prints' },
    category: 'pets',
    defaultScale: 0.95,
    defaultRotate: -8
  },
  {
    id: 'pet-rainbow',
    mediaUrl: '🌈',
    name: { ko: '무지개다리', en: 'Rainbow Bridge' },
    category: 'pets',
    defaultScale: 1.15,
    defaultRotate: 0
  },
  {
    id: 'pet-wings',
    mediaUrl: '🪽',
    name: { ko: '천사의 날개', en: 'Pure Angel Wings' },
    category: 'pets',
    defaultScale: 1.05,
    defaultRotate: 0
  },
  {
    id: 'pet-tennis-ball',
    mediaUrl: '🎾',
    name: { ko: '애착 테니스공', en: 'Favorite Tennis Ball' },
    category: 'pets',
    defaultScale: 0.85,
    defaultRotate: 0
  },
  {
    id: 'pet-treat',
    mediaUrl: '🐟',
    name: { ko: '맛있는 츄르 간식', en: 'Favorite Treats' },
    category: 'pets',
    defaultScale: 0.9,
    defaultRotate: 6
  },
  {
    id: 'pet-bone',
    mediaUrl: '🦴',
    name: { ko: '든든한 뼈다귀', en: 'Delicious Bone' },
    category: 'pets',
    defaultScale: 0.9,
    defaultRotate: -15
  },

  // 3. Warm Keepsakes (추억의 보물 & 온기)
  {
    id: 'fav-vinyl',
    mediaUrl: '🎵',
    name: { ko: '클래식 바이닐 LP', en: 'Vintage Vinyl Record' },
    category: 'keepsakes',
    defaultScale: 1.0,
    defaultRotate: 15
  },
  {
    id: 'fav-whiskey',
    mediaUrl: '🥃',
    name: { ko: '온더락 위스키', en: 'On-the-Rocks Whiskey' },
    category: 'keepsakes',
    defaultScale: 0.9,
    defaultRotate: 0
  },
  {
    id: 'fav-book',
    mediaUrl: '📖',
    name: { ko: '낡은 애독서', en: 'Beloved Book' },
    category: 'keepsakes',
    defaultScale: 1.0,
    defaultRotate: -4
  },
  {
    id: 'fav-car',
    mediaUrl: '🚗',
    name: { ko: '로망의 클래식카', en: 'Vintage Classic Car' },
    category: 'keepsakes',
    defaultScale: 1.1,
    defaultRotate: 0
  },
  {
    id: 'keep-letter',
    mediaUrl: '✉️',
    name: { ko: '부치지 못한 손편지', en: 'Handwritten Letter' },
    category: 'keepsakes',
    defaultScale: 0.95,
    defaultRotate: -5
  },
  {
    id: 'keep-star',
    mediaUrl: '⭐',
    name: { ko: '영원히 빛나는 별', en: 'Eternal Shining Star' },
    category: 'keepsakes',
    defaultScale: 1.0,
    defaultRotate: 0
  },
  {
    id: 'keep-clover',
    mediaUrl: '🍀',
    name: { ko: '행운의 네잎클로버', en: 'Four-Leaf Clover' },
    category: 'keepsakes',
    defaultScale: 0.9,
    defaultRotate: 10
  }
];

// 🌐 글로벌 UI 다국어 사전
export const SANCTUARY_TRANSLATIONS = {
  ko: {
    appTitle: '추모 샌드박스',
    appSubtitle: '고인의 온기와 취향을 담은 자유 공간',
    assetCount: '개 소품 배치됨',
    modePreview: '감상 모드',
    modeEdit: '편집 모드',
    hintPreview: '도구를 숨기고 조용히 감상합니다',
    hintEdit: '편집 도구를 다시 엽니다',

    // 하단 플로팅 바 (Empathy Floating Glass Pill Bar)
    btnAddAsset: '추억 얹기',
    btnChangeBg: '배경',
    btnPureView: '온전히 보기',
    btnEdit: '편집하기',
    btnSave: '저장',
    btnShare: '공유',

    // 바텀시트 탭
    tabStickers: '스티커 보관함',
    tabCard: '추모 카드/메모',
    tabGallery: '사진/GIF',
    tabUrl: '웹 링크',

    // 카테고리 필터
    catAll: '전체',
    catLifestyle: '☕ 취향 & 취미',
    catPets: '🐾 반려동물',
    catKeepsakes: '💌 추억의 보물',

    // 추모 카드 탭
    cardPresetTitle: '추천 추모 문구',
    cardMessageLabel: '전하고 싶은 마음 (메모)',
    cardMessagePlaceholder: '고인에게 전하고 싶은 따뜻한 한마디를 적어주세요...',
    cardSenderLabel: '남기는 사람',
    cardSenderPlaceholder: '예: 민준, 친구 일동',
    cardThemeLabel: '종이 질감 테마',
    cardPreviewLabel: '카드 미리보기',
    cardSubmitBtn: '💌 캔버스에 카드 남기기',

    // 갤러리/URL 탭
    uploadTitle: '사진/GIF 선택',
    uploadSubtitle: 'JPG, PNG, GIF, WebP 투명 누끼 지원',
    uploadChangeHint: '다른 사진 선택',
    urlLabel: '웹 이미지 URL',
    nameLabel: '이름 (선택)',
    namePlaceholder: '예: 즐겨 마시던 믹스커피, 레트로 게임기',
    stickerizeTitle: '투명 스티커 스타일로 등록',
    stickerizeSub: '배경과 자연스럽게 어우러지도록 그림자 효과를 적용합니다.',
    assetSubmitBtn: '캔버스에 배치하기',

    // 토스트
    toastCardAdded: '💌 추모 카드가 캔버스에 남겨졌습니다.',
    toastAssetAdded: "'{name}'이(가) 배치되었습니다.",
    toastBgChanged: '배경 이미지가 변경되었습니다.',
    toastShareSuccess: '공간 링크가 복사되었습니다.',
    toastDeleted: '에셋이 삭제되었습니다.'
  },
  en: {
    appTitle: 'Sanctuary Studio',
    appSubtitle: 'A freeform tribute space of warmth and memory',
    assetCount: 'items placed',
    modePreview: 'Visit Mode',
    modeEdit: 'Edit Mode',
    hintPreview: 'Hide controls and experience in peaceful serenity',
    hintEdit: 'Re-open editing and placement tools',

    // Bottom Floating Bar (Empathy Floating Glass Pill Bar)
    btnAddAsset: 'Place Memory',
    btnChangeBg: 'Backdrop',
    btnPureView: 'Serene View',
    btnEdit: 'Edit',
    btnSave: 'Save',
    btnShare: 'Share',

    // Bottom Sheet Tabs
    tabStickers: 'Sticker Vault',
    tabCard: 'Memorial Card',
    tabGallery: 'Upload Photo',
    tabUrl: 'Web URL',

    // Category Filters
    catAll: 'All',
    catLifestyle: '☕ Lifestyle & Hobbies',
    catPets: '🐾 Cherished Pets',
    catKeepsakes: '💌 Keepsakes',

    // Memorial Card Tab
    cardPresetTitle: 'Suggested Messages',
    cardMessageLabel: 'Heartfelt Message',
    cardMessagePlaceholder: 'Leave a word of love, smile and peace...',
    cardSenderLabel: 'From',
    cardSenderPlaceholder: 'e.g. Minjun, Loving Family',
    cardThemeLabel: 'Paper Theme',
    cardPreviewLabel: 'Live Preview',
    cardSubmitBtn: '💌 Place Card on Canvas',

    // Gallery / URL Tabs
    uploadTitle: 'Select Photo or GIF',
    uploadSubtitle: 'Supports JPG, PNG, GIF, transparent stickers',
    uploadChangeHint: 'Choose another photo',
    urlLabel: 'Web Image URL',
    nameLabel: 'Asset Name (Optional)',
    namePlaceholder: 'e.g. Sweet Mix Coffee, Retro Console',
    stickerizeTitle: 'Register as Transparent Sticker',
    stickerizeSub: 'Applies gentle shadows to blend naturally.',
    assetSubmitBtn: 'Place on Canvas',

    // Toasts
    toastCardAdded: '💌 Memorial card placed on canvas.',
    toastAssetAdded: "'{name}' placed on canvas.",
    toastBgChanged: 'Backdrop updated.',
    toastShareSuccess: 'Sanctuary link copied to clipboard.',
    toastDeleted: 'Asset removed.'
  }
};

// 추천 글로벌 추모 문구 프리셋
export const GLOBAL_PRESET_MESSAGES: Record<SanctuaryLang, string[]> = {
  ko: [
    '늘 기억하고 사랑합니다 🕊️',
    '하늘에서 편히 쉬세요 🌿',
    '함께했던 모든 순간이 감사했습니다 🌸',
    '영원히 마음속에 간직할게요 ✨'
  ],
  en: [
    'Forever in our hearts 🕊️',
    'Rest in gentle peace 🌿',
    'Thank you for every beautiful memory 🌸',
    'Your light shines on forever ✨'
  ]
};

