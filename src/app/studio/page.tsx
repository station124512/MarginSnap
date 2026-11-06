import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CanvasItemProps,
  CanvasItemData,
  SanctuaryCanvas
} from '@/components/canvas';
import {
  Edit3,
  Sparkles,
  Check,
  ImagePlus,
  Wand2,
  Mic,
  PenLine,
  Wallpaper,
  RotateCcw,
  Save,
  Volume2,
  VolumeX,
  Sun,
  Sunset,
  Moon,
  Plus,
  X,
  Lightbulb,
  Eye,
  ArrowLeft,
  Share2,
  ExternalLink
} from 'lucide-react';
import {
  SanctuaryLang,
  PRESET_STICKERS,
  PresetStickerItem,
  SANCTUARY_TRANSLATIONS,
  StickerCategory
} from '@/constants/sanctuaryI18n';
import { sanctuaryAudio } from '@/utils/sanctuaryAudio';
import { getSanctuary, saveSanctuary, SanctuaryData } from '@/utils/sanctuaryStore';

export default function SanctuaryStudioPage() {
  const navigate = useNavigate();

  // 1. 글로벌 언어 ('ko' | 'en')
  const [lang, setLang] = useState<SanctuaryLang>('ko');
  const t = SANCTUARY_TRANSLATIONS[lang];

  // 2. 저장소에서 초기 데이터 불러오기
  const [sanctuary, setSanctuary] = useState<SanctuaryData>(() => getSanctuary('arthur'));
  const [items, setItems] = useState<CanvasItemProps['item'][]>(sanctuary.items);
  const [selectedId, setSelectedId] = useState<string | null>('sticker-coffee');
  const [background, setBackground] = useState<string>(sanctuary.background);
  const [mood, setMood] = useState<'morning' | 'sunset' | 'night'>(sanctuary.mood);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<StickerCategory | 'all'>('all');

  const bgInputRef = useRef<HTMLInputElement>(null);

  // 변경 시 자동 저장 동기화
  const persistChanges = (newItems: CanvasItemProps['item'][], newBg: string, newMood: 'morning' | 'sunset' | 'night') => {
    saveSanctuary({
      ...sanctuary,
      items: newItems,
      background: newBg,
      mood: newMood
    });
  };

  // 토스트 헬퍼
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  }, []);

  // 앰비언트 BGM 토글
  const handleToggleBgm = useCallback(() => {
    const isPlaying = sanctuaryAudio.toggleVinylBgm((playing) => {
      setIsAudioPlaying(playing);
    });
    if (isPlaying) {
      showToast(lang === 'en' ? '🎵 Ambient sanctuary melody playing' : '🎵 평화로운 추모 선율이 공간에 흐릅니다.');
    } else {
      showToast(lang === 'en' ? '🔇 Ambient music muted' : '🔇 배경 음악이 음소거되었습니다.');
    }
  }, [showToast, lang]);

  // 언어 전환
  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === 'ko' ? 'en' : 'ko'));
  }, []);

  // 새 에셋 등록
  const handleAddItem = useCallback(
    (newItem: CanvasItemData) => {
      setItems((prev) => {
        const highestZ = prev.reduce((max, it) => Math.max(max, it.zIndex), 0);
        const generatedItem: CanvasItemProps['item'] = {
          ...newItem,
          id: newItem.id || `asset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          x: typeof newItem.x === 'number' ? newItem.x : 140,
          y: typeof newItem.y === 'number' ? newItem.y : 180,
          scale: newItem.scale ?? 1,
          rotate: newItem.rotate ?? 0,
          zIndex: Math.max(highestZ + 1, newItem.zIndex || 1),
          isLocked: newItem.isLocked ?? false
        };
        const updated = [...prev, generatedItem];
        persistChanges(updated, background, mood);
        return updated;
      });

      setSelectedId(newItem.id);
      setIsDrawerOpen(false);

      if (newItem.type === 'card') {
        showToast(t.toastCardAdded);
      } else {
        const msg = t.toastAssetAdded.replace('{name}', newItem.name || (lang === 'en' ? 'Asset' : '새 에셋'));
        showToast(msg);
      }
    },
    [showToast, t, lang, background, mood]
  );

  // 하단 스티커 보관함에서 프리셋 스티커 토글 또는 추가
  const handleSelectPresetSticker = (preset: PresetStickerItem) => {
    const existing = items.find(
      (it) => it.name === preset.name.ko || it.name === preset.name.en || it.mediaUrl === preset.mediaUrl
    );
    if (existing) {
      setSelectedId(existing.id);
      setIsDrawerOpen(false);
      showToast(lang === 'en' ? `'${preset.name.en}' selected` : `'${preset.name.ko}' 선택됨`);
      return;
    }

    const highestZ = items.reduce((max, it) => Math.max(max, it.zIndex), 10);
    const randomOffset = Math.floor(Math.random() * 40) - 20;

    const newItem: CanvasItemData = {
      id: `sticker-${preset.id}-${Date.now()}`,
      mediaUrl: preset.mediaUrl,
      name: preset.name[lang],
      x: 135 + randomOffset,
      y: 180 + randomOffset,
      scale: preset.defaultScale ?? 1,
      rotate: preset.defaultRotate ?? 0,
      zIndex: highestZ + 1,
      isLocked: false,
      type: 'media'
    };

    handleAddItem(newItem);
  };

  // 씬 저장 (Save)
  const handleSave = () => {
    persistChanges(items, background, mood);
    showToast(lang === 'en' ? '✨ Sanctuary scene saved successfully!' : '✨ 추모 공간이 안전하게 저장되었습니다!');
  };

  // 배경 이미지 변경 파일 선택
  const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setBackground(objectUrl);
      persistChanges(items, objectUrl, mood);
      showToast(t.toastBgChanged);
    }
    e.target.value = '';
  };

  // 필터링된 프리셋 스티커 목록
  const filteredStickers = PRESET_STICKERS.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#FAF8F5] select-none flex justify-center items-center">
      {/* 배경 파일 업로드 input (숨김) */}
      <input
        ref={bgInputRef}
        type="file"
        accept="image/*"
        onChange={handleBgFileChange}
        className="hidden"
      />

      {/* 모바일 뷰포트 시뮬레이터 쉘 (100dvh 전체화면 캔버스, Empathy Warm Minimalism) */}
      <main className="w-full max-w-md h-full relative overflow-hidden bg-[#FAF8F5] flex flex-col shadow-2xl rounded-none md:rounded-3xl border-0 md:border md:border-stone-200/60">
        {/* 플로팅 토스트 알림 */}
        {toastMessage && (
          <aside
            aria-live="polite"
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-white/95 text-stone-800 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium border border-stone-200/80 shadow-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <Check size={14} className="text-amber-600" />
            <span>{toastMessage}</span>
          </aside>
        )}

        {/* 2. 상단 헤더 바 (Empathy Warm Minimalism: 깔끔하고 단정한 플로팅 오버레이) */}
        <header className="absolute top-0 left-0 right-0 z-30 pt-4 px-4 flex items-center justify-between pointer-events-auto">
          {/* 좌측: 홈 버튼 + 고인 뱃지 */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="p-1.5 rounded-full bg-white/85 text-stone-600 hover:text-stone-900 hover:bg-white backdrop-blur-md border border-stone-200/60 shadow-xs transition-all active:scale-95 cursor-pointer"
              title="홈 랜딩 페이지로 이동"
            >
              <ArrowLeft size={14} />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 text-stone-800 backdrop-blur-md border border-stone-200/60 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-semibold">{sanctuary.name}</span>
              <span className="text-[10px] text-stone-400">· {items.length}개</span>
            </div>
          </div>

          {/* 우측 도구: 무드 스위처 + BGM + 방문객 뷰 전환 */}
          <div className="flex items-center gap-1.5">
            {/* 3대 시간대 무드 스위처 (아침/노을/별밤) */}
            <div className="flex items-center p-0.5 bg-white/85 backdrop-blur-md rounded-full border border-stone-200/60 shadow-xs">
              <button
                type="button"
                onClick={() => {
                  setMood('morning');
                  persistChanges(items, background, 'morning');
                  showToast(lang === 'en' ? '☀️ Dawn light' : '☀️ 아침 햇살');
                }}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  mood === 'morning' ? 'bg-amber-100 text-amber-900 shadow-2xs font-semibold' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="아침 햇살"
              >
                <Sun size={13} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setMood('sunset');
                  persistChanges(items, background, 'sunset');
                  showToast(lang === 'en' ? '🌅 Golden sunset' : '🌅 황금 노을');
                }}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  mood === 'sunset' ? 'bg-amber-100 text-amber-900 shadow-2xs font-semibold' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="황금빛 노을"
              >
                <Sunset size={13} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setMood('night');
                  persistChanges(items, background, 'night');
                  showToast(lang === 'en' ? '🌌 Starry night' : '🌌 별빛 밤');
                }}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  mood === 'night' ? 'bg-amber-100 text-amber-900 shadow-2xs font-semibold' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="고요한 밤하늘 별빛"
              >
                <Moon size={13} />
              </button>
            </div>

            {/* BGM 토글 */}
            <button
              type="button"
              onClick={handleToggleBgm}
              className={`p-2 rounded-full backdrop-blur-md border transition-all active:scale-95 cursor-pointer ${
                isAudioPlaying
                  ? 'bg-amber-100 text-amber-900 border-amber-200 shadow-2xs'
                  : 'bg-white/85 text-stone-500 border-stone-200/60 hover:text-stone-800 shadow-xs'
              }`}
              title="배경 음악"
            >
              {isAudioPlaying ? <Volume2 size={13} className="animate-pulse" /> : <VolumeX size={13} />}
            </button>

            {/* 방문객용 추모관 바로가기 CTA */}
            <button
              type="button"
              onClick={() => {
                handleSave();
                navigate(`/sanctuary/${sanctuary.id}`);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium shadow-xs transition-all active:scale-95 cursor-pointer"
              title="게스트 방문객용 완성 화면으로 이동"
            >
              <ExternalLink size={12} />
              <span className="hidden sm:inline">방문객 화면</span>
            </button>
          </div>
        </header>

        {/* 1. 캔버스 100dvh 전체화면 확장 (맑고 따뜻한 린넨 톤) */}
        <section className="relative w-full h-full flex-1 overflow-hidden select-none bg-[#FAF8F5]">
          <SanctuaryCanvas
            items={items}
            selectedId={isPreviewMode ? null : selectedId}
            background={background}
            mood={mood}
            onItemsChange={(newItems) => {
              setItems(newItems);
              persistChanges(newItems, background, mood);
            }}
            onSelectId={(id) => {
              if (isPreviewMode) return;
              setSelectedId(id);
              if (!id) return;

              const target = items.find((it) => it.id === id);
              if (target) {
                if (target.mediaUrl === '☕' || target.name?.includes('커피')) {
                  sanctuaryAudio.playSoftClick();
                  showToast(lang === 'en' ? '☕ Warm sweet mix coffee' : '☕ 달달한 믹스커피 한 잔의 온기');
                } else if (target.mediaUrl === '🎮' || target.name?.includes('게임')) {
                  sanctuaryAudio.playSoftClick();
                  showToast(lang === 'en' ? '🎮 Remembering favorite retro games' : '🎮 생전에 좋아하시던 레트로 게임기');
                } else if (target.mediaUrl === '🕶️' || target.name?.includes('선글라스')) {
                  sanctuaryAudio.playSoftClick();
                  showToast(lang === 'en' ? '🕶️ Stylish vintage sunglasses' : '🕶️ 멋쟁이 빈티지 선글라스');
                } else if (target.mediaUrl === '🐾' || target.name?.includes('발자국')) {
                  sanctuaryAudio.playSoftClick();
                  showToast(lang === 'en' ? '🐾 Beloved furry companion' : '🐾 사랑스런 반려견의 발자국');
                } else if (target.type === 'card') {
                  sanctuaryAudio.playSoftClick();
                  showToast(lang === 'en' ? `✉️ Memorial card from ${target.sender || 'visitor'}` : `✉️ ${target.sender || '민준'}의 추모 편지입니다.`);
                } else if (target.id.includes('portrait')) {
                  sanctuaryAudio.playSoftClick();
                  showToast(lang === 'en' ? 'Remembering Arthur Kim (1952 — 2024)' : '故 김아서 님의 따뜻한 미소를 기립니다.');
                }
              }
            }}
            onAttachSound={() => {
              showToast(lang === 'en' ? 'Playing memorial melody...' : '추모 음성/멜로디가 재생됩니다 🎵');
            }}
            className="w-full h-full"
          />
        </section>

        {/* 2. 하단 인터페이스 (Floating Glass Pill Bar: Empathy Warm Minimalism) */}
        <nav
          aria-label="하단 네비게이션 알약 바"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 select-none"
        >
          {isPreviewMode ? (
            <button
              type="button"
              onClick={() => setIsPreviewMode(false)}
              className="rounded-full bg-white/90 backdrop-blur-md px-5 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-200/60 flex items-center gap-2 text-stone-700 text-xs font-medium hover:bg-white hover:text-stone-900 transition-all active:scale-95 cursor-pointer"
            >
              <Edit3 size={14} className="text-stone-500" />
              <span>{lang === 'en' ? '✏️ Return to Edit' : '✏️ 편집하기'}</span>
            </button>
          ) : (
            <div className="rounded-full bg-white/85 backdrop-blur-md px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-200/50 flex items-center gap-6">
              {/* [✨ 추억 얹기] */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-1.5 text-stone-800 hover:text-stone-950 font-medium text-xs tracking-tight transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>✨</span>
                <span>{lang === 'en' ? 'Place Memory' : '추억 얹기'}</span>
              </button>

              <div className="w-px h-3.5 bg-stone-300/60" />

              {/* [🖼️ 배경] */}
              <button
                type="button"
                onClick={() => bgInputRef.current?.click()}
                className="flex items-center gap-1.5 text-stone-700 hover:text-stone-900 font-medium text-xs tracking-tight transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>🖼️</span>
                <span>{lang === 'en' ? 'Backdrop' : '배경'}</span>
              </button>

              <div className="w-px h-3.5 bg-stone-300/60" />

              {/* [👁️ 온전히 보기] */}
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null);
                  setIsPreviewMode(true);
                }}
                className="flex items-center gap-1.5 text-stone-700 hover:text-stone-900 font-medium text-xs tracking-tight transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Eye size={14} className="text-stone-500" />
                <span>{lang === 'en' ? 'Serene View' : '온전히 보기'}</span>
              </button>
            </div>
          )}
        </nav>

        {/* 3. 에셋 추가 드로어 (Empathy Card Drawer: [✨ 추억 얹기] 탭 시 아래에서 스무스하게 올라옴) */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end select-none">
            {/* 배경 딤드 오버레이 */}
            <div
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-stone-900/35 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            />

            {/* 바텀시트 컨테이너 */}
            <section
              role="dialog"
              aria-modal="true"
              className="relative z-10 w-full max-w-md mx-auto rounded-t-[32px] bg-[#FAF8F5] p-6 shadow-2xl border-t border-stone-200/60 flex flex-col max-h-[82vh] overflow-hidden animate-in slide-in-from-bottom duration-300"
            >
              {/* 상단 드래그 핸들 */}
              <div
                onClick={() => setIsDrawerOpen(false)}
                className="w-full pb-2 flex justify-center cursor-pointer"
              >
                <div className="w-10 h-1 rounded-full bg-stone-300 hover:bg-stone-400 transition-colors" />
              </div>

              {/* 드로어 헤더 */}
              <div className="pb-4 flex items-center justify-between border-b border-stone-200/50">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    {lang === 'en' ? 'Place a Memory' : '추억과 온기 얹기'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {lang === 'en'
                      ? 'Select everyday tokens or heartfelt notes for the sanctuary'
                      : '생전 아끼시던 일상의 소품과 따뜻한 메모를 전해보세요'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center border border-stone-200/60 shadow-2xs transition-colors active:scale-90 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* 스크롤 가능한 본문 영역 */}
              <div className="flex-1 overflow-y-auto pt-4 space-y-5 scrollbar-none">
                {/* 빠른 카드 액션 (부드러운 흰색 라운드 카드) */}
                <div>
                  <span className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2.5">
                    {lang === 'en' ? 'Ways to Remember' : '추억을 전하는 방법'}
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* 사진 / 조각 추가 카드 */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsDrawerOpen(false);
                        bgInputRef.current?.click();
                      }}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 hover:border-stone-300 hover:shadow-md transition-all flex flex-col items-start gap-2 text-left active:scale-[0.98] cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                        <ImagePlus size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-stone-800 block">
                          {lang === 'en' ? 'Photo / Keepsake' : '사진 & 추억 사진'}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {lang === 'en' ? 'Upload from device' : '기기에서 사진 올리기'}
                        </span>
                      </div>
                    </button>

                    {/* 손글씨 추모 카드 */}
                    <button
                      type="button"
                      onClick={() => {
                        const newCard: CanvasItemData = {
                          id: `card-${Date.now()}`,
                          mediaUrl: 'card-media',
                          name: '추모 카드',
                          x: 120,
                          y: 160,
                          scale: 1,
                          rotate: -2,
                          zIndex: 20,
                          isLocked: false,
                          type: 'card',
                          text: lang === 'en' ? 'Forever in our hearts.' : '늘 기억하고 사랑합니다.',
                          sender: '가족 일동',
                          cardTheme: 'cream'
                        };
                        handleAddItem(newCard);
                      }}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 hover:border-stone-300 hover:shadow-md transition-all flex flex-col items-start gap-2 text-left active:scale-[0.98] cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                        <PenLine size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-stone-800 block">
                          {lang === 'en' ? 'Memorial Card' : '손글씨 카드'}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {lang === 'en' ? 'Leave a gentle word' : '따뜻한 마음 남기기'}
                        </span>
                      </div>
                    </button>

                    {/* AI 투명 스티커 */}
                    <button
                      type="button"
                      onClick={() => {
                        showToast(lang === 'en' ? '✨ Select a photo for transparent cutout' : '✨ 투명 스티커로 올릴 사진을 선택하세요');
                        bgInputRef.current?.click();
                      }}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 hover:border-stone-300 hover:shadow-md transition-all flex flex-col items-start gap-2 text-left active:scale-[0.98] cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                        <Wand2 size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-stone-800 block">
                          {lang === 'en' ? 'AI Cutout Sticker' : 'AI 누끼 스티커'}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {lang === 'en' ? 'Transparent background' : '투명 배경 소품 생성'}
                        </span>
                      </div>
                    </button>

                    {/* 사운드 메모 */}
                    <button
                      type="button"
                      onClick={() => {
                        showToast(lang === 'en' ? '🎙️ Voice note mapped' : '🎙️ 고인의 음성 메모리가 연결되었습니다');
                        setIsDrawerOpen(false);
                      }}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 hover:border-stone-300 hover:shadow-md transition-all flex flex-col items-start gap-2 text-left active:scale-[0.98] cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                        <Mic size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-stone-800 block">
                          {lang === 'en' ? 'Voice & Sound' : '사운드 메모'}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {lang === 'en' ? 'Attach voice memory' : '고인의 음성 연결'}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 생전 취향 스티커 보관함 그리드 */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      {lang === 'en' ? 'Life & Hobby Presets' : '생전 취향 스티커'}
                    </span>
                    <span className="text-xs text-stone-400">
                      {PRESET_STICKERS.length}개
                    </span>
                  </div>

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
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                          selectedCategory === cat.id
                            ? 'bg-stone-900 text-white shadow-xs'
                            : 'bg-white text-stone-600 border border-stone-200/60 hover:bg-stone-50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* 스티커 그리드 (부드러운 흰색 라운드 카드) */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {filteredStickers.map((preset) => {
                      const isPlaced = items.some(
                        (it) => it.name === preset.name.ko || it.name === preset.name.en || it.mediaUrl === preset.mediaUrl
                      );
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPresetSticker(preset)}
                          className={`bg-white rounded-2xl p-3 shadow-sm border flex flex-col items-center justify-between text-center gap-1.5 transition-all active:scale-95 group cursor-pointer ${
                            isPlaced
                              ? 'border-amber-400 bg-amber-50/20'
                              : 'border-stone-100 hover:border-stone-300 hover:shadow-md'
                          }`}
                        >
                          <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                            {preset.mediaUrl}
                          </div>
                          <span className="text-[11px] font-medium text-stone-800 line-clamp-1 leading-tight">
                            {preset.name[lang]}
                          </span>
                          <span
                            className={`text-[9px] font-medium px-1.5 py-0.2 rounded-full ${
                              isPlaced ? 'text-amber-800 bg-amber-100/70' : 'text-stone-400'
                            }`}
                          >
                            {isPlaced ? (lang === 'en' ? 'Placed' : '배치됨') : (lang === 'en' ? 'Add' : '추가')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 하단 팁 */}
                <div className="p-3.5 bg-white rounded-2xl border border-stone-100 flex items-center gap-2.5">
                  <Lightbulb size={16} className="text-amber-600 shrink-0" />
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {lang === 'en'
                      ? 'Tap any item on the canvas to freely rotate, resize, or reposition.'
                      : '캔버스의 소품을 터치하면 상단 알약 핸들을 통해 자유롭게 회전하고 크기를 조절할 수 있습니다.'}
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

