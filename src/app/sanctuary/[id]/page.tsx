import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CanvasItemProps,
  CanvasItemData,
  SanctuaryCanvas
} from '@/components/canvas';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Sun,
  Sunset,
  Moon,
  Share2,
  Edit3,
  Check,
  X,
  Heart,
  Send,
  Sparkles,
  Flower2
} from 'lucide-react';
import { sanctuaryAudio } from '@/utils/sanctuaryAudio';
import { getSanctuary, saveSanctuary, SanctuaryData, GuestTribute } from '@/utils/sanctuaryStore';

// 헌화 가능한 꽃/상징 프리셋
const FLOWER_PRESETS = [
  { id: 'lily', emoji: '💐', name: '순백의 백합', desc: '영원한 안식' },
  { id: 'candle', emoji: '🕯️', name: '영원의 불꽃', desc: '마음의 평화' },
  { id: 'cherry', emoji: '🌸', name: '봄날 벚꽃', desc: '아름다운 기억' },
  { id: 'clover', emoji: '🍀', name: '행운의 클로버', desc: '감사의 마음' },
  { id: 'tea', emoji: '🍵', name: '따뜻한 온기 차', desc: '편안한 쉼' }
];

export default function SanctuaryVisitorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const sanctuaryId = id || 'arthur';
  const [sanctuary, setSanctuary] = useState<SanctuaryData>(() => getSanctuary(sanctuaryId));
  const [items, setItems] = useState<CanvasItemProps['item'][]>(sanctuary.items);
  const [mood, setMood] = useState<'morning' | 'sunset' | 'night'>(sanctuary.mood);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 모달 상태 (헌화 모달 / 메시지 작성 모달)
  const [isFlowerModalOpen, setIsFlowerModalOpen] = useState<boolean>(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState<boolean>(false);

  // 방명록 폼 상태
  const [guestName, setGuestName] = useState<string>('');
  const [guestMessage, setGuestMessage] = useState<string>('');

  useEffect(() => {
    const loaded = getSanctuary(sanctuaryId);
    setSanctuary(loaded);
    setItems(loaded.items);
    setMood(loaded.mood);
  }, [sanctuaryId]);

  // 토스트 헬퍼
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  // 앰비언트 BGM 토글
  const handleToggleBgm = useCallback(() => {
    const isPlaying = sanctuaryAudio.toggleVinylBgm((playing) => {
      setIsAudioPlaying(playing);
    });
    if (isPlaying) {
      showToast('🎵 평화로운 추모 선율이 공간에 흐릅니다.');
    } else {
      showToast('🔇 배경 음악이 음소거되었습니다.');
    }
  }, [showToast]);

  // 링크 공유
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('✨ 추모 공간 링크가 복사되었습니다. 소중한 분들에게 전해보세요.');
    } else {
      showToast('✨ 링크를 복사했습니다.');
    }
  };

  // 헌화하기 제출
  const handleTributeFlower = (flower: typeof FLOWER_PRESETS[0]) => {
    sanctuaryAudio.playSoftClick();

    const highestZ = items.reduce((max, it) => Math.max(max, it.zIndex), 10);
    const randomOffset = Math.floor(Math.random() * 50) - 25;

    const newFlowerItem: CanvasItemData = {
      id: `tribute-${flower.id}-${Date.now()}`,
      mediaUrl: flower.emoji,
      name: `${flower.name}`,
      x: 135 + randomOffset,
      y: 240 + Math.floor(Math.random() * 30),
      scale: 1,
      rotate: Math.floor(Math.random() * 20) - 10,
      zIndex: highestZ + 1,
      isLocked: true,
      type: 'media'
    };

    const updated = [...items, newFlowerItem];
    setItems(updated);

    saveSanctuary({
      ...sanctuary,
      items: updated
    });

    setIsFlowerModalOpen(false);
    showToast(`🕊️ ${flower.name}을(를) 정성스레 바쳤습니다.`);
  };

  // 추모 메시지 남기기 제출
  const handleTributeMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = guestMessage.trim();
    if (!trimmed) return;

    sanctuaryAudio.playSoftClick();

    const highestZ = items.reduce((max, it) => Math.max(max, it.zIndex), 10);
    const sender = guestName.trim() || '추모객';

    const newCardItem: CanvasItemData = {
      id: `card-guest-${Date.now()}`,
      mediaUrl: 'card-media',
      name: `추모 편지 (${sender})`,
      x: 70 + Math.floor(Math.random() * 60) - 30,
      y: 180 + Math.floor(Math.random() * 40) - 20,
      scale: 0.95,
      rotate: Math.floor(Math.random() * 8) - 4,
      zIndex: highestZ + 1,
      isLocked: true,
      type: 'card',
      text: trimmed,
      sender: sender,
      cardTheme: 'cream'
    };

    const updated = [...items, newCardItem];
    setItems(updated);

    saveSanctuary({
      ...sanctuary,
      items: updated
    });

    setGuestMessage('');
    setGuestName('');
    setIsNoteModalOpen(false);
    showToast(`💌 ${sender} 님의 따뜻한 마음이 공간에 남겨졌습니다.`);
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#FAF8F5] select-none flex justify-center items-center">
      {/* 게스트 뷰포트 시뮬레이터 쉘 */}
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

        {/* 상단 헤더 바 (방문객용 미니멀 헤더) */}
        <header className="absolute top-0 left-0 right-0 z-30 pt-4 px-4 flex items-center justify-between pointer-events-auto">
          {/* 좌측: 홈 버튼 + 고인 정보 배지 */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="p-1.5 rounded-full bg-white/85 text-stone-600 hover:text-stone-900 hover:bg-white backdrop-blur-md border border-stone-200/60 shadow-xs transition-all active:scale-95 cursor-pointer"
              title="홈으로 돌아가기"
            >
              <ArrowLeft size={14} />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 text-stone-800 backdrop-blur-md border border-stone-200/60 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-semibold">{sanctuary.name}</span>
              <span className="text-[10px] text-stone-400">· {sanctuary.years}</span>
            </div>
          </div>

          {/* 우측 도구: 무드 스위처 + BGM + 편집기 가기 */}
          <div className="flex items-center gap-1.5">
            {/* 무드 스위처 */}
            <div className="flex items-center p-0.5 bg-white/85 backdrop-blur-md rounded-full border border-stone-200/60 shadow-xs">
              <button
                type="button"
                onClick={() => {
                  setMood('morning');
                  showToast('☀️ 아침 햇살이 공간을 비춥니다.');
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
                  showToast('🌅 황금빛 노을이 깃듭니다.');
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
                  showToast('🌌 고요한 별빛 밤이 찾아옵니다.');
                }}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  mood === 'night' ? 'bg-amber-100 text-amber-900 shadow-2xs font-semibold' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="고요한 밤"
              >
                <Moon size={13} />
              </button>
            </div>

            {/* BGM */}
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

            {/* 편집기로 가기 버튼 */}
            <button
              type="button"
              onClick={() => navigate('/studio')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/85 text-stone-700 hover:text-stone-900 hover:bg-white backdrop-blur-md border border-stone-200/60 shadow-xs text-[11px] font-medium transition-all active:scale-95 cursor-pointer"
              title="추모관 편집기로 이동"
            >
              <Edit3 size={12} className="text-stone-500" />
              <span className="hidden sm:inline">편집</span>
            </button>
          </div>
        </header>

        {/* 1. 순수한 결과물 캔버스 (편집 도구 일체 배제, 터치 감상 가능) */}
        <section className="relative w-full h-full flex-1 overflow-hidden select-none bg-[#FAF8F5]">
          <SanctuaryCanvas
            items={items}
            selectedId={null}
            background={sanctuary.background}
            mood={mood}
            onSelectId={(targetId) => {
              if (!targetId) return;
              const target = items.find((it) => it.id === targetId);
              if (target) {
                if (target.mediaUrl === '☕' || target.name?.includes('커피')) {
                  sanctuaryAudio.playSoftClick();
                  showToast('☕ 생전에 즐겨 드시던 달달한 믹스커피의 온기입니다.');
                } else if (target.mediaUrl === '🎮' || target.name?.includes('게임')) {
                  sanctuaryAudio.playSoftClick();
                  showToast('🎮 아이들과 함께 웃으며 즐기시던 레트로 게임기입니다.');
                } else if (target.mediaUrl === '🕶️' || target.name?.includes('선글라스')) {
                  sanctuaryAudio.playSoftClick();
                  showToast('🕶️ 멋쟁이 스타일을 아끼시던 고인의 빈티지 선글라스입니다.');
                } else if (target.mediaUrl === '🐾' || target.name?.includes('발자국')) {
                  sanctuaryAudio.playSoftClick();
                  showToast('🐾 사랑스런 반려견이 남긴 따뜻한 발자국입니다.');
                } else if (target.type === 'card') {
                  sanctuaryAudio.playSoftClick();
                  showToast(`✉️ ${target.sender || '추모객'} 님의 메시지: "${target.text}"`);
                } else if (target.id.includes('portrait')) {
                  sanctuaryAudio.playSoftClick();
                  showToast('🕊️ 故 김아서 님의 따뜻한 미소를 가슴속 깊이 기립니다.');
                } else {
                  sanctuaryAudio.playSoftClick();
                  showToast(`✨ ${target.name || '소중한 추억'}에 마음을 전했습니다.`);
                }
              }
            }}
            className="w-full h-full pointer-events-auto"
          />
        </section>

        {/* 2. 게스트 인터랙션 바 (하단 Floating Glass Bar) */}
        <nav
          aria-label="게스트 추모 인터랙션 바"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 select-none"
        >
          <div className="rounded-full bg-white/85 backdrop-blur-md px-5 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-200/50 flex items-center gap-5">
            {/* [💐 헌화하기] */}
            <button
              type="button"
              onClick={() => setIsFlowerModalOpen(true)}
              className="flex items-center gap-1.5 text-stone-800 hover:text-stone-950 font-medium text-xs tracking-tight transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Flower2 size={14} className="text-amber-600" />
              <span>헌화하기</span>
            </button>

            <div className="w-px h-3.5 bg-stone-300/60" />

            {/* [💌 따뜻한 한마디] */}
            <button
              type="button"
              onClick={() => setIsNoteModalOpen(true)}
              className="flex items-center gap-1.5 text-stone-700 hover:text-stone-900 font-medium text-xs tracking-tight transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>💌</span>
              <span>한마디 남기기</span>
            </button>

            <div className="w-px h-3.5 bg-stone-300/60" />

            {/* [🔗 공유] */}
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-stone-700 hover:text-stone-900 font-medium text-xs tracking-tight transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              title="추모관 링크 복사"
            >
              <Share2 size={13} className="text-stone-500" />
              <span>공유</span>
            </button>
          </div>
        </nav>

        {/* 헌화 모달 (바텀시트) */}
        {isFlowerModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end select-none">
            <div
              onClick={() => setIsFlowerModalOpen(false)}
              className="fixed inset-0 bg-stone-900/35 backdrop-blur-xs transition-opacity"
            />
            <div className="relative z-10 w-full max-w-md mx-auto rounded-t-[32px] bg-[#FAF8F5] p-6 shadow-2xl border-t border-stone-200/60 animate-in slide-in-from-bottom duration-250">
              <div className="w-10 h-1 rounded-full bg-stone-300 mx-auto mb-3" />
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/50">
                <div>
                  <h3 className="text-base font-semibold text-stone-900">마음을 담은 헌화</h3>
                  <p className="text-xs text-stone-500 mt-0.5">고인에게 바치고 싶은 상징을 선택해 주세요</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFlowerModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white text-stone-500 hover:text-stone-800 flex items-center justify-center border border-stone-200/60 shadow-2xs"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-4">
                {FLOWER_PRESETS.map((flower) => (
                  <button
                    key={flower.id}
                    type="button"
                    onClick={() => handleTributeFlower(flower)}
                    className="bg-white rounded-2xl p-3.5 shadow-sm border border-stone-100 hover:border-stone-300 hover:shadow-md transition-all flex items-center gap-3 text-left active:scale-95 cursor-pointer"
                  >
                    <span className="text-2xl">{flower.emoji}</span>
                    <div>
                      <span className="text-xs font-semibold text-stone-800 block">{flower.name}</span>
                      <span className="text-[10px] text-stone-400">{flower.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 추모 메시지 작성 모달 */}
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end select-none">
            <div
              onClick={() => setIsNoteModalOpen(false)}
              className="fixed inset-0 bg-stone-900/35 backdrop-blur-xs transition-opacity"
            />
            <form
              onSubmit={handleTributeMessage}
              className="relative z-10 w-full max-w-md mx-auto rounded-t-[32px] bg-[#FAF8F5] p-6 shadow-2xl border-t border-stone-200/60 animate-in slide-in-from-bottom duration-250 flex flex-col gap-3"
            >
              <div className="w-10 h-1 rounded-full bg-stone-300 mx-auto mb-1" />
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/50">
                <div>
                  <h3 className="text-base font-semibold text-stone-900">따뜻한 한마디 남기기</h3>
                  <p className="text-xs text-stone-500 mt-0.5">남기신 메시지는 캔버스에 예쁜 카드로 놓여집니다</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white text-stone-500 hover:text-stone-800 flex items-center justify-center border border-stone-200/60 shadow-2xs"
                >
                  <X size={15} />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  남기시는 분 (이름 / 관계)
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="예: 후배 민준, 오랜 벗"
                  maxLength={20}
                  className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs text-stone-800 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  전하고 싶은 마음
                </label>
                <textarea
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  placeholder="따뜻한 기억과 감사의 마음을 편안하게 적어주세요..."
                  rows={3}
                  maxLength={120}
                  required
                  className="w-full bg-white rounded-xl p-3 text-xs text-stone-800 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!guestMessage.trim()}
                className="w-full mt-1 py-3 rounded-full bg-stone-900 text-white font-medium text-xs shadow-md hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send size={13} />
                <span>추모 카드 남기기</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

