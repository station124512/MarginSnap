import React, { useState, useCallback, useRef } from 'react';
import { CanvasItem, CanvasItemProps, CanvasItemData } from './CanvasItem';

export type { CanvasItemData };

export type SanctuaryMood = 'morning' | 'sunset' | 'night';

export interface SanctuaryCanvasProps {
  /** 캔버스에 배치된 전체 아이템 목록 (제공되지 않으면 내부 상태로 관리) */
  items?: CanvasItemData[];
  /** 현재 선택된 아이템 ID */
  selectedId?: string | null;
  /** 배경 이미지/GIF URL 또는 배경 스타일 */
  background?: string;
  /** 앰비언스 시간대/무드 (아침 햇살 / 황금빛 노을 / 별빛 밤하늘) */
  mood?: SanctuaryMood;
  /** 아이템 목록 변경 콜백 */
  onItemsChange?: (newItems: CanvasItemData[]) => void;
  /** 아이템 선택 변경 콜백 */
  onSelectId?: (id: string | null) => void;
  /** 소리 추가 모달 열기 등의 콜백 */
  onAttachSound?: (item: CanvasItemData) => void;
  /** 자식 요소 (상단 네비바, 하단 바텀시트, 플로팅 툴바 등) */
  children?: React.ReactNode;
  /** 커스텀 클래스 */
  className?: string;
}

// 기본 2.5D 포레스트 배경 (Stitch Serene Sanctuary 기본 에셋)
const DEFAULT_SANCTUARY_BACKGROUND =
  'https://lh3.googleusercontent.com/aida/AEtjO1UaGhtCRXLcXxhjEVbgvd74QYkPDCqHTVzx1uGFZWapAueYXBMCs4Xi8q8bscXeG67FE66D8qR4LNhiyrgrql5f5Q-CYn4u51BA7RwbIU1ctb-Yzjqn3o4-ycR2K42f-vS21r_zSKA7TUuvWBVtXzR-FGUy9TCDgfKudsZuK9xi6MGGFwa1APcrcAA0Hcuzj0bLi0k5PoUTtwnUqzO_mdEt-i3SqJ6ZpAy70eeDeHsAxoAke3yKJXYst7U';

// 기본 초기 데모 아이템 목록
const DEFAULT_INITIAL_ITEMS: CanvasItemData[] = [
  {
    id: 'portrait-arthur',
    mediaUrl:
      'https://lh3.googleusercontent.com/aida/AEtjO1XyPbtNeqagFkUpL34OugiSp80sJiOYTjtERJg10btrUF01-Y_yXoQO06oqycgqbIqCemFdmDefW_fCqoMuKot1rrXd29yxOxSUSZeeyQiX8qmx4oOBIuueJSpX1oDzptRmynQ6mubfmRZePSFf6MwW5UYYwn00n_-OBhKd8P9ptzkUa4igcValGSDoEWJL1VBpDTFRQJ0fdEG1Sd7qCdys7JdFxNLKtGUXESOGhsMG7u4bkh_YxtxcgEA',
    name: '故 김아서 님',
    x: 140,
    y: 85,
    scale: 1,
    rotate: 0,
    zIndex: 10,
    isLocked: false
  },
  {
    id: 'sticker-coffee',
    mediaUrl: '☕',
    name: '따뜻한 모닝 커피',
    x: 155,
    y: 220,
    scale: 1,
    rotate: 0,
    zIndex: 11,
    isLocked: false
  },
  {
    id: 'sticker-lilies',
    mediaUrl: '💐',
    name: '순백의 백합 꽃다발',
    x: 45,
    y: 250,
    scale: 1,
    rotate: -8,
    zIndex: 8,
    isLocked: false
  },
  {
    id: 'sticker-vinyl-lp',
    mediaUrl: '🎵',
    name: '턴테이블 클래식 LP',
    x: 270,
    y: 250,
    scale: 1,
    rotate: 15,
    zIndex: 9,
    isLocked: false
  }
];

export const SanctuaryCanvas: React.FC<SanctuaryCanvasProps> = ({
  items: controlledItems,
  selectedId: controlledSelectedId,
  background = DEFAULT_SANCTUARY_BACKGROUND,
  mood = 'morning',
  onItemsChange,
  onSelectId,
  onAttachSound,
  children,
  className = ''
}) => {
  // 내부 상태 (외부에서 props로 제어하지 않을 때의 fallback)
  const [internalItems, setInternalItems] = useState<CanvasItemData[]>(DEFAULT_INITIAL_ITEMS);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // 제어/비제어 통합
  const isControlledItems = controlledItems !== undefined;
  const isControlledSelect = controlledSelectedId !== undefined;

  const currentItems = isControlledItems ? controlledItems : internalItems;
  const currentSelectedId = isControlledSelect ? controlledSelectedId : internalSelectedId;

  // 아이템 업데이트 전파
  const updateItems = useCallback(
    (updater: (prev: CanvasItemData[]) => CanvasItemData[]) => {
      if (isControlledItems) {
        onItemsChange?.(updater(controlledItems));
      } else {
        setInternalItems((prev) => {
          const next = updater(prev);
          onItemsChange?.(next);
          return next;
        });
      }
    },
    [isControlledItems, controlledItems, onItemsChange]
  );

  // 선택 ID 변경 전파
  const setSelectedId = useCallback(
    (id: string | null) => {
      if (!isControlledSelect) {
        setInternalSelectedId(id);
      }
      onSelectId?.(id);
    },
    [isControlledSelect, onSelectId]
  );

  // 1. 캔버스 빈 영역 클릭/터치 시 선택 해제
  const handleCanvasBackgroundPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // 캔버스 자체를 직접 클릭했을 때만 선택 해제
    if (e.target === canvasRef.current || (e.target as HTMLElement).hasAttribute('data-canvas-stage')) {
      setSelectedId(null);
    }
  };

  // 2. 개별 아이템 Transform (x, y, scale, rotate, isLocked) 업데이트
  const handleUpdateTransform = useCallback(
    (id: string, newTransform: Partial<CanvasItemData>) => {
      updateItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, ...newTransform } : it))
      );
    },
    [updateItems]
  );

  // 3. 레이어 한 단계 앞으로 (Bring Forward)
  const handleBringForward = useCallback(
    (id: string) => {
      updateItems((prev) => {
        const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
        const index = sorted.findIndex((it) => it.id === id);
        if (index === -1 || index === sorted.length - 1) return prev;

        const currentItem = sorted[index];
        const nextItem = sorted[index + 1];

        // zIndex 스왑 및 증분 보장
        const tempZ = currentItem.zIndex;
        currentItem.zIndex = nextItem.zIndex;
        nextItem.zIndex = tempZ;

        if (currentItem.zIndex <= nextItem.zIndex) {
          currentItem.zIndex = nextItem.zIndex + 1;
        }

        return [...prev];
      });
    },
    [updateItems]
  );

  // 4. 레이어 한 단계 뒤로 (Send Backward)
  const handleSendBackward = useCallback(
    (id: string) => {
      updateItems((prev) => {
        const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
        const index = sorted.findIndex((it) => it.id === id);
        if (index <= 0) return prev;

        const currentItem = sorted[index];
        const prevItem = sorted[index - 1];

        // zIndex 스왑 및 감분 보장
        const tempZ = currentItem.zIndex;
        currentItem.zIndex = prevItem.zIndex;
        prevItem.zIndex = tempZ;

        if (currentItem.zIndex >= prevItem.zIndex) {
          currentItem.zIndex = Math.max(1, prevItem.zIndex - 1);
        }

        return [...prev];
      });
    },
    [updateItems]
  );

  // 5. 아이템 삭제 (Delete)
  const handleDeleteItem = useCallback(
    (id: string) => {
      updateItems((prev) => prev.filter((it) => it.id !== id));
      if (currentSelectedId === id) {
        setSelectedId(null);
      }
    },
    [updateItems, currentSelectedId, setSelectedId]
  );

  // 6. 새로운 에셋 추가 (Add Item helper)
  const handleAddItem = useCallback(
    (newItem: Omit<CanvasItemData, 'id' | 'zIndex'> & { id?: string }) => {
      const highestZ = currentItems.reduce((max, it) => Math.max(max, it.zIndex), 0);
      const generatedItem: CanvasItemData = {
        ...newItem,
        id: newItem.id || `asset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        zIndex: highestZ + 1,
        isLocked: newItem.isLocked ?? false
      };

      updateItems((prev) => [...prev, generatedItem]);
      setSelectedId(generatedItem.id);
    },
    [currentItems, updateItems, setSelectedId]
  );

  return (
    <div
      ref={canvasRef}
      data-canvas-stage
      onPointerDown={handleCanvasBackgroundPointerDown}
      style={{
        touchAction: 'none',
        overscrollBehavior: 'none'
      }}
      className={`relative w-full h-full min-h-[50vh] overflow-hidden select-none bg-[#FAF8F5] ${className}`}
    >
      {/* 1. 배경 이미지/GIF 레이어 */}
      {background && (
        <img
          src={background}
          alt=""
          role="presentation"
          aria-hidden="true"
          draggable={false}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none scale-105 transition-all duration-1000 ${
            mood === 'sunset'
              ? 'sepia-[0.35] brightness-90 saturate-125'
              : mood === 'night'
              ? 'brightness-[0.45] saturate-75 contrast-125 hue-rotate-15'
              : 'brightness-95 saturate-105'
          }`}
        />
      )}

      {/* 2. 앰비언트 시간대/무드별 시네마틱 라이팅 오버레이 (Empathy Warm Minimalism) */}
      {mood === 'morning' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/10 via-transparent to-amber-950/20 pointer-events-none transition-opacity duration-700" />
          <div className="absolute inset-0 bg-radial from-amber-100/20 via-transparent to-stone-900/15 pointer-events-none" />
        </>
      )}

      {mood === 'sunset' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-rose-950/10 to-orange-950/40 pointer-events-none transition-opacity duration-700" />
          <div className="absolute inset-0 bg-radial from-amber-400/20 via-rose-500/10 to-stone-900/40 pointer-events-none" />
        </>
      )}

      {mood === 'night' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-indigo-950/35 to-slate-950/75 pointer-events-none transition-opacity duration-700" />
          <div className="absolute inset-0 bg-radial from-indigo-300/10 via-transparent to-black/60 pointer-events-none" />
          {/* 반짝이는 별빛 파티클 12개 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              { top: '15%', left: '20%', delay: '0s', size: '2px' },
              { top: '25%', left: '75%', delay: '0.7s', size: '3px' },
              { top: '35%', left: '45%', delay: '1.4s', size: '2px' },
              { top: '18%', left: '60%', delay: '2.1s', size: '2.5px' },
              { top: '40%', left: '15%', delay: '1.0s', size: '3px' },
              { top: '12%', left: '85%', delay: '0.4s', size: '2px' },
              { top: '48%', left: '80%', delay: '1.8s', size: '2px' },
              { top: '30%', left: '30%', delay: '2.5s', size: '3px' }
            ].map((star, idx) => (
              <span
                key={idx}
                style={{
                  top: star.top,
                  left: star.left,
                  width: star.size,
                  height: star.size,
                  animationDelay: star.delay
                }}
                className="absolute rounded-full bg-white shadow-[0_0_6px_#fff] animate-pulse"
              />
            ))}
          </div>
        </>
      )}

      {/* 3. 2.5D 인터랙티브 에셋 아이템 렌더링 스테이지 */}
      <div
        data-canvas-stage
        className="relative w-full h-full inset-0 overflow-hidden"
      >
        {currentItems.map((item) => (
          <CanvasItem
            key={item.id}
            item={item}
            isSelected={currentSelectedId === item.id}
            onSelect={() => setSelectedId(item.id)}
            onUpdateTransform={(newTransform) => handleUpdateTransform(item.id, newTransform)}
            onBringForward={() => handleBringForward(item.id)}
            onSendBackward={() => handleSendBackward(item.id)}
            onDelete={() => handleDeleteItem(item.id)}
            onAttachSound={() => onAttachSound?.(item)}
          />
        ))}
      </div>

      {/* 4. 자식 레이어 (상단 헤더, 하단 바텀 드로어, 툴바 등 오버레이) */}
      {children}
    </div>
  );
};

export default SanctuaryCanvas;
