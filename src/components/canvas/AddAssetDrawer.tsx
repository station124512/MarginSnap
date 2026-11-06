import React, { useState, useRef, useMemo } from 'react';
import {
  X,
  Upload,
  Link2,
  Sparkles,
  Image,
  Check,
  PenLine,
  Palette,
  PackagePlus,
  Flame,
  Coffee,
  Heart,
  Search
} from 'lucide-react';
import { CanvasItemData, CanvasCardTheme, CARD_THEME_STYLES } from './CanvasItem';
import {
  SanctuaryLang,
  StickerCategory,
  PresetStickerItem,
  PRESET_STICKERS,
  SANCTUARY_TRANSLATIONS,
  GLOBAL_PRESET_MESSAGES
} from '@/constants/sanctuaryI18n';

export interface AddAssetDrawerProps {
  /** 드로어 열림 상태 */
  isOpen: boolean;
  /** 드로어 닫기 콜백 */
  onClose: () => void;
  /** 새 에셋 등록 시 콜백 */
  onAddItem: (newItem: CanvasItemData) => void;
  /** 현재 배치된 아이템 목록 (새 아이템 zIndex 계산 및 배치 상태 파악용) */
  currentItems?: CanvasItemData[];
  /** 글로벌 언어 ('ko' | 'en') */
  lang?: SanctuaryLang;
}

// 카드 테마 옵션 정의
const CARD_THEME_OPTIONS: { id: CanvasCardTheme; label: { ko: string; en: string }; colorDot: string }[] = [
  { id: 'cream', label: { ko: '크림 화이트', en: 'Warm Cream' }, colorDot: 'bg-[#FFFDF9] border border-amber-300' },
  { id: 'sage', label: { ko: '세이지 숲', en: 'Serene Sage' }, colorDot: 'bg-[#E3EBE4] border border-emerald-400' },
  { id: 'rose', label: { ko: '노을 로즈', en: 'Sunset Rose' }, colorDot: 'bg-[#FCE7E9] border border-rose-300' },
  { id: 'parchment', label: { ko: '빈티지 양장', en: 'Vintage Parchment' }, colorDot: 'bg-[#EBDDC3] border border-[#BCA37F]' }
];

export const AddAssetDrawer: React.FC<AddAssetDrawerProps> = ({
  isOpen,
  onClose,
  onAddItem,
  currentItems = [],
  lang = 'ko'
}) => {
  const t = SANCTUARY_TRANSLATIONS[lang];

  // 탭: 스티커 보관함 / 추모 카드 / 갤러리 업로드 / 이미지 링크
  const [activeTab, setActiveTab] = useState<'stickers' | 'card' | 'gallery' | 'url'>('stickers');

  // 스티커 보관함 카테고리 필터
  const [selectedCategory, setSelectedCategory] = useState<StickerCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 사진 / URL 관련 상태
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [assetName, setAssetName] = useState<string>('');
  const [isTransparentSticker, setIsTransparentSticker] = useState<boolean>(true);

  // 추모 카드/메모 관련 상태
  const [cardText, setCardText] = useState<string>(
    lang === 'en' ? 'Forever in our hearts.' : '늘 기억하고 사랑합니다.'
  );
  const [cardSender, setCardSender] = useState<string>(
    lang === 'en' ? 'Loving Family' : '가족 일동'
  );
  const [cardTheme, setCardTheme] = useState<CanvasCardTheme>('cream');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 필터링된 프리셋 스티커 목록
  const filteredStickers = useMemo(() => {
    return PRESET_STICKERS.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.name.ko.toLowerCase().includes(q) ||
        item.name.en.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  // 1. 프리셋 스티커 원클릭 배치 핸들러
  const handleSelectPresetSticker = (preset: PresetStickerItem) => {
    const highestZ = currentItems.reduce((max, it) => Math.max(max, it.zIndex), 10);
    // 중앙 주변으로 자연스럽게 분산 배치
    const randomOffset = Math.floor(Math.random() * 40) - 20;

    const newItem: CanvasItemData = {
      id: `sticker-${preset.id}-${Date.now()}`,
      mediaUrl: preset.mediaUrl,
      name: preset.name[lang],
      x: 140 + randomOffset,
      y: 190 + randomOffset,
      scale: preset.defaultScale ?? 1,
      rotate: preset.defaultRotate ?? 0,
      zIndex: highestZ + 1,
      isLocked: false,
      type: 'media'
    };

    onAddItem(newItem);
    handleClose();
  };

  // 로컬 파일 선택 시
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      if (!assetName) {
        setAssetName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  // URL 입력 시
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputUrl(val);
    setPreviewUrl(val);
  };

  // 폼 초기화
  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setInputUrl('');
    setAssetName('');
    setIsTransparentSticker(true);
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 에셋 등록 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const highestZ = currentItems.reduce((max, it) => Math.max(max, it.zIndex), 10);

    if (activeTab === 'card') {
      const trimmedText = cardText.trim();
      if (!trimmedText) return;

      const subtleRotate = Math.floor(Math.random() * 7) - 3;
      const defaultName = lang === 'en' ? 'Memorial Card' : '추모 카드';

      const newCardItem: CanvasItemData = {
        id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        mediaUrl: 'card-media',
        name: cardSender.trim() ? `${cardSender.trim()}` : defaultName,
        x: 135,
        y: 190,
        scale: 1,
        rotate: subtleRotate,
        zIndex: highestZ + 1,
        isLocked: false,
        type: 'card',
        text: trimmedText,
        sender: cardSender.trim() || undefined,
        cardTheme
      };

      onAddItem(newCardItem);
      handleClose();
      return;
    }

    // 갤러리 또는 URL 에셋
    let mediaUrl = '';
    if (activeTab === 'gallery' && selectedFile) {
      mediaUrl = URL.createObjectURL(selectedFile);
    } else if (activeTab === 'url' && inputUrl.trim()) {
      mediaUrl = inputUrl.trim();
    } else if (previewUrl) {
      mediaUrl = previewUrl;
    }

    if (!mediaUrl) return;

    const newItem: CanvasItemData = {
      id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      mediaUrl,
      name: assetName.trim() || (lang === 'en' ? 'Sanctuary Asset' : '추모 에셋'),
      x: 140,
      y: 200,
      scale: 1,
      rotate: 0,
      zIndex: highestZ + 1,
      isLocked: false,
      type: 'media'
    };

    onAddItem(newItem);
    handleClose();
  };

  const canSubmit =
    activeTab === 'card'
      ? Boolean(cardText.trim())
      : activeTab === 'gallery'
      ? Boolean(selectedFile)
      : activeTab === 'url'
      ? Boolean(inputUrl.trim())
      : false;

  const currentThemeStyle = CARD_THEME_STYLES[cardTheme];
  const presetMessages = GLOBAL_PRESET_MESSAGES[lang];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end select-none">
      {/* 1. 배경 딤드(Backdrop) 오버레이 */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-[#153328]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* 2. 구글 머티리얼 3 하단 시트 (Bottom Sheet) */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-asset-title"
        className="relative z-10 w-full max-w-lg mx-auto bg-[#FAF8F5] rounded-t-[32px] shadow-[0_-16px_48px_-8px_rgba(21,51,40,0.25)] border-t border-stone-200/80 flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-250"
      >
        {/* 상단 드래그 핸들 필 */}
        <div className="w-full pt-3 pb-1 flex justify-center cursor-grab">
          <div className="w-12 h-1.5 rounded-full bg-stone-300" />
        </div>

        {/* 시트 헤더 */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-stone-200/60">
          <div>
            <h2 id="add-asset-title" className="text-[17px] font-bold text-[#153328] leading-tight">
              {lang === 'en' ? 'Add Sanctuary Assets' : '에셋 및 추모 소품 추가'}
            </h2>
            <p className="text-[12px] text-stone-500 mt-0.5">
              {lang === 'en'
                ? 'Decorate this sacred space with tokens of love and memory'
                : '소중한 추억이 깃든 소품, 카드, 사진으로 공간을 자유롭게 채워보세요'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-stone-200/70 text-stone-600 hover:bg-stone-300 flex items-center justify-center transition-colors active:scale-90"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* 4단 탭 전환 (M3 세그먼트 알약 스위치) */}
        <div className="px-5 pt-3">
          <div className="grid grid-cols-4 p-1 bg-stone-200/70 rounded-full gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('stickers')}
              className={`py-1.5 rounded-full text-[11px] sm:text-[12px] font-semibold flex items-center justify-center gap-1 transition-all ${
                activeTab === 'stickers'
                  ? 'bg-[#2C4A3E] text-white shadow-xs'
                  : 'text-stone-600 hover:text-[#153328]'
              }`}
            >
              <PackagePlus size={13} />
              <span className="truncate">{t.tabStickers}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('card')}
              className={`py-1.5 rounded-full text-[11px] sm:text-[12px] font-semibold flex items-center justify-center gap-1 transition-all ${
                activeTab === 'card'
                  ? 'bg-[#2C4A3E] text-white shadow-xs'
                  : 'text-stone-600 hover:text-[#153328]'
              }`}
            >
              <PenLine size={13} />
              <span className="truncate">{t.tabCard}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`py-1.5 rounded-full text-[11px] sm:text-[12px] font-semibold flex items-center justify-center gap-1 transition-all ${
                activeTab === 'gallery'
                  ? 'bg-[#2C4A3E] text-white shadow-xs'
                  : 'text-stone-600 hover:text-[#153328]'
              }`}
            >
              <Upload size={13} />
              <span className="truncate">{t.tabGallery}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`py-1.5 rounded-full text-[11px] sm:text-[12px] font-semibold flex items-center justify-center gap-1 transition-all ${
                activeTab === 'url'
                  ? 'bg-[#2C4A3E] text-white shadow-xs'
                  : 'text-stone-600 hover:text-[#153328]'
              }`}
            >
              <Link2 size={13} />
              <span className="truncate">{t.tabUrl}</span>
            </button>
          </div>
        </div>

        {/* 탭 1: 🗃️ 글로벌 스티커 보관함 (Sticker Vault) */}
        {activeTab === 'stickers' && (
          <div className="flex-1 flex flex-col min-h-0 px-5 pt-3 pb-6">
            {/* 카테고리 필터 칩 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {(
                [
                  { id: 'all', label: t.catAll },
                  { id: 'lifestyle', label: t.catLifestyle },
                  { id: 'pets', label: t.catPets },
                  { id: 'keepsakes', label: t.catKeepsakes }
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all active:scale-95 ${
                    selectedCategory === cat.id
                      ? 'bg-[#2C4A3E] text-white shadow-xs font-semibold'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 스티커 목록 그리드 (스크롤) */}
            <div className="flex-1 overflow-y-auto max-h-[46vh] pr-1 pt-1">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {filteredStickers.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectPresetSticker(item)}
                    className="p-3 rounded-2xl bg-white border border-stone-200/80 hover:border-[#2C4A3E] hover:shadow-md transition-all flex flex-col items-center justify-between text-center gap-1.5 group active:scale-95 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-2xs">
                      {item.mediaUrl}
                    </div>
                    <span className="text-[11px] font-semibold text-stone-800 line-clamp-1 leading-tight group-hover:text-[#2C4A3E]">
                      {item.name[lang]}
                    </span>
                    <span className="text-[9px] text-[#F59E0B] font-medium bg-[#F59E0B]/10 px-1.5 py-0.2 rounded-full">
                      {lang === 'en' ? 'Tap to place' : '원클릭 배치'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 하단 힌트 배너 */}
            <div className="mt-3 px-3 py-2 bg-stone-100/90 rounded-xl border border-stone-200 flex items-center gap-2">
              <span className="text-[14px]">💡</span>
              <p className="text-[11px] text-stone-600 leading-tight">
                {lang === 'en'
                  ? 'Tap any token above to immediately place and arrange it on your sanctuary canvas.'
                  : '원하는 소품을 탭하면 캔버스에 즉시 배치되며, 자유롭게 회전하고 크기를 조절할 수 있습니다.'}
              </p>
            </div>
          </div>
        )}

        {/* 탭 2, 3, 4: 일반 폼 형태 */}
        {activeTab !== 'stickers' && (
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 overflow-y-auto max-h-[60vh]">
            {/* TAB 2: 추모 카드 / 감성 메모 작성 */}
            {activeTab === 'card' && (
              <div className="space-y-3.5">
                {/* 추천 문구 빠른 선택 칩 */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1.5 flex items-center gap-1">
                    <Sparkles size={12} className="text-[#F59E0B]" />
                    <span>{t.cardPresetTitle}</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {presetMessages.map((msg) => (
                      <button
                        key={msg}
                        type="button"
                        onClick={() => setCardText(msg)}
                        className="px-2.5 py-1 rounded-full text-[11px] bg-white border border-stone-300 text-stone-700 hover:border-[#2C4A3E] hover:text-[#2C4A3E] hover:bg-[#E3EBE4]/50 transition-all active:scale-95 text-left"
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 메시지 본문 입력 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[12px] font-semibold text-stone-700">
                      {t.cardMessageLabel}
                    </label>
                    <span className="text-[10px] text-stone-400">
                      {cardText.length} / 120
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={120}
                    value={cardText}
                    onChange={(e) => setCardText(e.target.value)}
                    placeholder={t.cardMessagePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-300 bg-white text-[13px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/30 focus:border-[#2C4A3E] resize-none"
                  />
                </div>

                {/* 작성자 / 남기는 사람 */}
                <div>
                  <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                    {t.cardSenderLabel}
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder={t.cardSenderPlaceholder}
                    value={cardSender}
                    onChange={(e) => setCardSender(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/30 focus:border-[#2C4A3E]"
                  />
                </div>

                {/* 카드 종이 테마 선택 */}
                <div>
                  <label className="block text-[12px] font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                    <Palette size={13} className="text-stone-500" />
                    <span>{t.cardThemeLabel}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {CARD_THEME_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCardTheme(opt.id)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          cardTheme === opt.id
                            ? 'border-[#2C4A3E] bg-[#2C4A3E]/5 ring-2 ring-[#2C4A3E]/20'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full ${opt.colorDot} shadow-2xs`} />
                        <span className="text-[10px] font-medium text-stone-700">
                          {opt.label[lang]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 실시간 카드 완성 미리보기 */}
                <div>
                  <span className="block text-[11px] font-semibold text-stone-500 mb-1.5">
                    {t.cardPreviewLabel}
                  </span>
                  <div className="w-full p-4 rounded-2xl bg-[#153328]/10 border border-[#153328]/15 flex items-center justify-center">
                    <div
                      className={`w-full max-w-[220px] p-3 rounded-2xl ${currentThemeStyle.bg} ${currentThemeStyle.border} border shadow-md flex flex-col gap-1.5`}
                    >
                      <div className="flex items-center justify-between gap-1 border-b border-black/5 pb-1">
                        <div className="flex items-center gap-1">
                          <PenLine size={11} color={currentThemeStyle.iconColor} strokeWidth={2.2} />
                          <span className={`text-[10px] font-bold ${currentThemeStyle.title}`}>
                            {lang === 'en' ? 'Memorial Card' : '추모 카드'}
                          </span>
                        </div>
                        {cardSender.trim() && (
                          <span
                            className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${currentThemeStyle.badge} truncate max-w-[90px]`}
                          >
                            {cardSender.trim()}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] leading-relaxed italic ${currentThemeStyle.text} font-serif whitespace-pre-wrap break-keep`}
                      >
                        “{cardText.trim() || (lang === 'en' ? 'Forever with us' : '소중한 마음을 전해주세요')}”
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: 갤러리 업로드 */}
            {activeTab === 'gallery' && (
              <div className="space-y-3.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-36 rounded-2xl border-2 border-dashed border-[#2C4A3E]/30 hover:border-[#2C4A3E] bg-white/70 flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-white transition-all group"
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain rounded-lg drop-shadow"
                      />
                      <span className="absolute bottom-1 bg-[#153328]/80 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs">
                        {t.uploadChangeHint}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-11 h-11 rounded-full bg-[#E3EBE4] text-[#2C4A3E] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Image size={22} />
                      </div>
                      <span className="text-[13px] font-semibold text-[#153328]">
                        {t.uploadTitle}
                      </span>
                      <span className="text-[11px] text-stone-500 mt-0.5">
                        {t.uploadSubtitle}
                      </span>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/30 focus:border-[#2C4A3E]"
                  />
                </div>

                {/* 투명 스티커 옵션 */}
                <div
                  onClick={() => setIsTransparentSticker((prev) => !prev)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#E3EBE4]/60 border border-[#2C4A3E]/20 cursor-pointer hover:bg-[#E3EBE4] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#F59E0B]/20 text-[#d97706] flex items-center justify-center">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#153328]">
                        {t.stickerizeTitle}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {t.stickerizeSub}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      isTransparentSticker ? 'bg-[#2C4A3E] text-white' : 'border border-stone-400 bg-white'
                    }`}
                  >
                    {isTransparentSticker && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: 이미지 링크 입력 */}
            {activeTab === 'url' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                    {t.urlLabel}
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/photo.gif"
                    value={inputUrl}
                    onChange={handleUrlChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/30 focus:border-[#2C4A3E]"
                  />
                </div>

                {previewUrl && (
                  <div className="w-full h-28 rounded-xl bg-white border border-stone-200 flex items-center justify-center p-2 overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      onError={() => setPreviewUrl('')}
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/30 focus:border-[#2C4A3E]"
                  />
                </div>
              </div>
            )}

            {/* 하단 완료 버튼 */}
            <div className="pt-2 pb-4">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full py-3.5 rounded-full text-[14px] font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 ${
                  canSubmit
                    ? 'bg-[#2C4A3E] text-white hover:bg-[#153328] cursor-pointer'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                }`}
              >
                <span>{activeTab === 'card' ? t.cardSubmitBtn : t.assetSubmitBtn}</span>
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

export default AddAssetDrawer;
