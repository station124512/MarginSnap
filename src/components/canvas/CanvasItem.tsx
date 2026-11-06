import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  Volume2,
  Trash2,
  RotateCw,
  Maximize2,
  PenLine
} from 'lucide-react';

export type CanvasCardTheme = 'cream' | 'sage' | 'rose' | 'parchment';

export type CanvasItemData = {
  id: string;
  mediaUrl: string;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  zIndex: number;
  isLocked: boolean;
  name?: string;
  soundUrl?: string;
  // 추모 카드/메모 확장 속성
  type?: 'media' | 'card';
  text?: string;
  sender?: string;
  cardTheme?: CanvasCardTheme;
};

export const CARD_THEME_STYLES: Record<
  CanvasCardTheme,
  {
    bg: string;
    border: string;
    title: string;
    text: string;
    badge: string;
    iconColor: string;
  }
> = {
  cream: {
    bg: 'bg-[#FFFDF9]/95',
    border: 'border-amber-200/80',
    title: 'text-amber-900',
    text: 'text-stone-800',
    badge: 'bg-amber-100/90 text-amber-900',
    iconColor: '#b45309'
  },
  sage: {
    bg: 'bg-[#F4F7F4]/95',
    border: 'border-emerald-300/80',
    title: 'text-emerald-950',
    text: 'text-stone-800',
    badge: 'bg-emerald-100/90 text-emerald-900',
    iconColor: '#065f46'
  },
  rose: {
    bg: 'bg-[#FFF5F6]/95',
    border: 'border-rose-200/80',
    title: 'text-rose-950',
    text: 'text-stone-800',
    badge: 'bg-rose-100/90 text-rose-900',
    iconColor: '#9f1239'
  },
  parchment: {
    bg: 'bg-[#FBF6EE]/95',
    border: 'border-[#D5C29D]/85',
    title: 'text-[#5A3F1A]',
    text: 'text-[#352715]',
    badge: 'bg-[#EBDDC3]/90 text-[#4D3616]',
    iconColor: '#78350f'
  }
};

export interface CanvasItemProps {
  item: CanvasItemData;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateTransform: (newTransform: Partial<CanvasItemData>) => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onDelete?: () => void;
  onAttachSound?: () => void;
}

export const CanvasItem: React.FC<CanvasItemProps> = ({
  item,
  isSelected,
  onSelect,
  onUpdateTransform,
  onBringForward,
  onSendBackward,
  onDelete,
  onAttachSound
}) => {
  const itemRef = useRef<HTMLDivElement>(null);

  // 드래그(이동), 리사이즈(크기), 회전 상태 추적
  const [dragMode, setDragMode] = useState<'move' | 'scale' | 'rotate' | null>(null);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    initialScale: number;
    initialRotate: number;
    centerX: number;
    centerY: number;
    initialDist: number;
    initialAngle: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    initialX: item.x,
    initialY: item.y,
    initialScale: item.scale,
    initialRotate: item.rotate,
    centerX: 0,
    centerY: 0,
    initialDist: 100,
    initialAngle: 0,
    hasMoved: false
  });

  // 전역 윈도우 포인터 이벤트 리스너 등록 (마우스/터치가 핸들 밖으로 나가도 완벽 동작)
  useEffect(() => {
    if (!dragMode) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      const start = dragStartRef.current;
      start.hasMoved = true;

      if (dragMode === 'move') {
        const deltaX = e.clientX - start.startX;
        const deltaY = e.clientY - start.startY;
        onUpdateTransform({
          x: Math.round(start.initialX + deltaX),
          y: Math.round(start.initialY + deltaY)
        });
      } else if (dragMode === 'scale') {
        const { centerX, centerY, initialScale, initialDist } = start;
        const currentDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        const scaleFactor = currentDist / (initialDist || 1);
        const newScale = Math.max(0.3, Math.min(3.5, Number((initialScale * scaleFactor).toFixed(2))));
        onUpdateTransform({ scale: newScale });
      } else if (dragMode === 'rotate') {
        const { centerX, centerY, initialRotate, initialAngle } = start;
        const currentAngle = (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI;
        const deltaAngle = currentAngle - initialAngle;
        let newRotate = Math.round((initialRotate + deltaAngle) % 360);
        if (newRotate < 0) newRotate += 360;

        // 15도 단위 근처 스냅
        if (Math.abs(newRotate % 15) < 3) {
          newRotate = Math.round(newRotate / 15) * 15;
        }

        onUpdateTransform({ rotate: newRotate });
      }
    };

    const handleWindowPointerUp = (e: PointerEvent) => {
      const start = dragStartRef.current;
      // 회전 버튼을 클릭만 하고 드래그하지 않았을 때는 15도씩 간편 회전
      if (dragMode === 'rotate' && !start.hasMoved) {
        const nextRotate = (item.rotate + 15) % 360;
        onUpdateTransform({ rotate: nextRotate });
      }

      setDragMode(null);
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [dragMode, item.rotate, onUpdateTransform]);

  // 1. 아이템 본체 드래그 시작 (이동)
  const handlePointerDownMove = (e: React.PointerEvent) => {
    // 툴팁이나 조절 핸들 클릭 시 이동 방지
    if ((e.target as HTMLElement).closest('[data-control-handle]')) return;

    onSelect();
    if (item.isLocked) return;

    e.stopPropagation();
    setDragMode('move');
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: item.x,
      initialY: item.y,
      initialScale: item.scale,
      initialRotate: item.rotate,
      centerX: 0,
      centerY: 0,
      initialDist: 100,
      initialAngle: 0,
      hasMoved: false
    };
  };

  // 2. 크기 조절 시작 (Scale Handle)
  const handlePointerDownScale = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (item.isLocked) return;

    setDragMode('scale');

    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const initialDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      dragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: item.x,
        initialY: item.y,
        initialScale: item.scale,
        initialRotate: item.rotate,
        centerX,
        centerY,
        initialDist: initialDist || 1,
        initialAngle: 0,
        hasMoved: false
      };
    }
  };

  // 3. 회전 조절 시작 (Rotate Handle)
  const handlePointerDownRotate = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (item.isLocked) return;

    setDragMode('rotate');

    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const initialAngle = (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI;

      dragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: item.x,
        initialY: item.y,
        initialScale: item.scale,
        initialRotate: item.rotate,
        centerX,
        centerY,
        initialDist: 100,
        initialAngle,
        hasMoved: false
      };
    }
  };

  // 자물쇠 토글
  const toggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateTransform({ isLocked: !item.isLocked });
  };

  return (
    <div
      ref={itemRef}
      onPointerDown={handlePointerDownMove}
      style={{
        transform: `translate3d(${item.x}px, ${item.y}px, 0px) rotate(${item.rotate}deg) scale(${item.scale})`,
        zIndex: item.zIndex,
        touchAction: 'none'
      }}
      className={`absolute top-0 left-0 select-none group cursor-grab active:cursor-grabbing transition-shadow ${
        item.isLocked ? 'cursor-default' : ''
      }`}
    >
      {/* 1. 선택 상태 시 테두리 바운딩 박스 & 앵커 (Warm Minimalism Highlight) */}
      {isSelected && (
        <div
          data-control-handle
          className="absolute -inset-2.5 rounded-2xl border-2 border-stone-400/60 bg-stone-500/5 pointer-events-none"
        >
          {/* 네 모서리 앵커 포인트 */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-white border border-stone-300 shadow-xs" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white border border-stone-300 shadow-xs" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-white border border-stone-300 shadow-xs" />

          {/* 우측 하단: 크기 조절 핸들 (Scale Handle) */}
          {!item.isLocked && (
            <div
              data-control-handle
              onPointerDown={handlePointerDownScale}
              className="absolute -bottom-3 -right-3 z-40 w-7 h-7 rounded-full bg-white text-stone-700 border border-stone-200 shadow-md flex items-center justify-center cursor-se-resize pointer-events-auto hover:bg-stone-50 hover:scale-110 active:scale-95 transition-all"
              title="대각선으로 드래그하여 크기 조절"
            >
              <Maximize2 size={13} strokeWidth={2.2} />
            </div>
          )}

          {/* 상단 중앙: Warm Minimalism 회전 조절 알약 핸들 (Rotate Pill) */}
          {!item.isLocked && (
            <div
              data-control-handle
              onPointerDown={handlePointerDownRotate}
              className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 bg-white/95 text-stone-700 text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-stone-200/90 cursor-grab active:cursor-grabbing hover:bg-stone-50 transition-all select-none whitespace-nowrap active:scale-95 backdrop-blur-md"
              title="클릭 시 15° 회전 / 드래그 시 자유 360° 회전"
            >
              <RotateCw size={11} className="text-amber-600" strokeWidth={2.2} />
              <span>회전 {item.rotate || 0}°</span>
            </div>
          )}
        </div>
      )}

      {/* 2. 아이템 바로 위 Empathy 스타일 부드러운 스톤/화이트 미니멀 툴팁 (Floating Tooltip) */}
      {isSelected && (
        <div
          data-control-handle
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 bg-white/95 text-stone-700 backdrop-blur-md px-2 py-1 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-stone-200/90 flex items-center gap-1 whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
        >
          {/* 레이어 순서: 앞으로 / 뒤로 */}
          <div className="flex items-center bg-stone-100/80 rounded-full px-1 py-0.5">
            <button
              type="button"
              onClick={onBringForward}
              className="p-1 hover:text-stone-900 hover:bg-stone-200/70 rounded-full transition-colors active:scale-90 text-stone-600"
              title="한 단계 앞으로"
            >
              <ArrowUp size={12} strokeWidth={2.2} />
            </button>
            <span className="text-[10px] text-stone-300 px-0.5">/</span>
            <button
              type="button"
              onClick={onSendBackward}
              className="p-1 hover:text-stone-900 hover:bg-stone-200/70 rounded-full transition-colors active:scale-90 text-stone-600"
              title="한 단계 뒤로"
            >
              <ArrowDown size={12} strokeWidth={2.2} />
            </button>
          </div>

          <div className="w-px h-3 bg-stone-200" />

          {/* 자물쇠(잠금) 버튼 */}
          <button
            type="button"
            onClick={toggleLock}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all active:scale-95 ${
              item.isLocked
                ? 'bg-amber-100 text-amber-900 font-semibold shadow-2xs'
                : 'hover:bg-stone-100 text-stone-600'
            }`}
            title={item.isLocked ? '잠금 해제' : '위치 고정 (잠금)'}
          >
            {item.isLocked ? <Lock size={12} strokeWidth={2.2} /> : <Unlock size={12} strokeWidth={2.2} />}
            <span>{item.isLocked ? '잠김' : '잠금'}</span>
          </button>

          <div className="w-px h-3 bg-stone-200" />

          {/* 소리 추가 버튼 */}
          <button
            type="button"
            onClick={onAttachSound}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium hover:bg-stone-100 transition-colors active:scale-95 ${
              item.soundUrl ? 'text-amber-600 font-semibold' : 'text-stone-600'
            }`}
            title="소리/음성 노트 매핑"
          >
            <Volume2 size={12} strokeWidth={2.2} />
            <span>소리</span>
          </button>

          {onDelete && (
            <>
              <div className="w-px h-3 bg-stone-200" />
              {/* 삭제 버튼 */}
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[11px] font-medium text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors active:scale-95"
                title="삭제"
              >
                <Trash2 size={12} strokeWidth={2.2} />
                <span>삭제</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* 3. 실제 미디어 콘텐츠 (추모 카드, 영정 사진, 또는 스티커) */}
      <div className="relative">
        {item.type === 'card' || Boolean(item.text) ? (
          /* 추모 카드 / 감성 메모 스티커 */
          (() => {
            const themeKey = item.cardTheme && CARD_THEME_STYLES[item.cardTheme] ? item.cardTheme : 'cream';
            const theme = CARD_THEME_STYLES[themeKey];
            return (
              <div
                className={`min-w-[140px] max-w-[190px] p-3.5 rounded-2xl ${theme.bg} ${theme.border} border shadow-md backdrop-blur-md flex flex-col gap-1.5 transition-transform text-left pointer-events-none select-none`}
              >
                {/* 카드 상단 헤더: 아이콘 + 라벨 + 작성자 */}
                <div className="flex items-center justify-between gap-1.5 border-b border-black/5 pb-1">
                  <div className="flex items-center gap-1">
                    <PenLine size={11} color={theme.iconColor} strokeWidth={2.2} />
                    <span className={`text-[10px] font-bold tracking-tight ${theme.title}`}>
                      {item.name || '추모 카드'}
                    </span>
                  </div>
                  {item.sender && (
                    <span
                      className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${theme.badge} truncate max-w-[80px] shadow-2xs`}
                    >
                      {item.sender}
                    </span>
                  )}
                </div>

                {/* 카드 본문 메시지 */}
                <p
                  className={`text-[11px] leading-relaxed italic ${theme.text} font-serif whitespace-pre-wrap break-keep`}
                >
                  “{item.text || '늘 기억합니다'}”
                </p>
              </div>
            );
          })()
        ) : item.id.includes('portrait') || item.mediaUrl.includes('AEtjO1XyPbt') ? (
          /* 故 김아서 님 메인 초상화 (Warm Minimalism Halo) */
          <div className="relative group flex flex-col items-center">
            {/* 은은하게 빛나는 웜 후광 */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-amber-200/40 via-white/50 to-amber-100/40 blur-md animate-pulse pointer-events-none" />
            <div className="relative w-20 h-20 rounded-full p-1 bg-white/95 backdrop-blur-md shadow-md ring-2 ring-stone-200/80 overflow-hidden flex items-center justify-center">
              <img
                src={item.mediaUrl}
                alt={item.name || '故 김아서 님'}
                draggable={false}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* 1952 - 2024 영원한 안식 배지 */}
            <div className="relative z-10 -mt-2.5 bg-white/95 text-stone-700 backdrop-blur-md border border-stone-200/80 rounded-full px-2.5 py-0.5 whitespace-nowrap text-[10px] font-medium shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>1952 — 2024</span>
            </div>
          </div>
        ) : item.mediaUrl === '🕯️' || item.id.includes('candle') ? (
          /* 촛불 램프 (Flickering Candle) */
          <div className="relative flex flex-col items-center select-none">
            <div className="absolute -top-4 w-14 h-14 rounded-full bg-amber-400/25 blur-md animate-pulse pointer-events-none" />
            <div className="relative -mb-1 w-3 h-4 rounded-full bg-gradient-to-t from-orange-400 via-amber-300 to-yellow-100 shadow-[0_0_8px_#f59e0b] animate-bounce duration-700" />
            <div className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-md border border-stone-100 shadow-md flex items-center justify-center text-3xl">
              🕯️
            </div>
          </div>
        ) : item.mediaUrl === '🎵' || item.id.includes('vinyl') ? (
          /* 클래식 턴테이블 바이닐 LP (Spinning Vinyl) */
          <div className="relative flex items-center justify-center select-none group">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-850 shadow-md border-2 border-stone-600 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-1 rounded-full border border-white/10" />
              <div className="absolute inset-2.5 rounded-full border border-white/10" />
              <div className="absolute inset-4 rounded-full border border-white/15" />
              <div className="w-6 h-6 rounded-full bg-amber-100 border border-stone-200 flex items-center justify-center text-[10px] text-stone-800 font-bold shadow-xs">
                🎵
              </div>
            </div>
          </div>
        ) : item.mediaUrl === '☕' || item.id.includes('coffee') ? (
          /* 따뜻한 모닝 커피 (Steaming Coffee) */
          <div className="relative flex flex-col items-center select-none">
            <div className="absolute -top-3 flex gap-1 opacity-70 animate-pulse pointer-events-none">
              <span className="text-[10px] text-amber-500">~</span>
              <span className="text-[10px] text-amber-400 -mt-1">~</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-md border border-stone-100 shadow-md flex items-center justify-center text-3xl">
              ☕
            </div>
          </div>
        ) : item.mediaUrl.startsWith('http') || item.mediaUrl.startsWith('/') ? (
          <img
            src={item.mediaUrl}
            alt={item.name || '추모 에셋'}
            draggable={false}
            className="w-24 h-24 object-contain pointer-events-none shadow-md drop-shadow-sm rounded-xl transition-transform"
          />
        ) : (
          /* 프리미엄 이모지 카드 토큰 */
          <div className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-3xl shadow-md border border-stone-100 pointer-events-none hover:shadow-lg transition-shadow">
            {item.mediaUrl}
          </div>
        )}

        {/* 잠금 상태 표시 뱃지 */}
        {item.isLocked && (
          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#153328]/85 text-[#F59E0B] flex items-center justify-center shadow">
            <Lock size={10} strokeWidth={2.5} />
          </div>
        )}

        {/* 소리 연결 표시 뱃지 */}
        {item.soundUrl && (
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#F59E0B] text-[#153328] flex items-center justify-center shadow animate-pulse">
            <Volume2 size={10} strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasItem;
