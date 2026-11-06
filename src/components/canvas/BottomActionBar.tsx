import React, { useRef } from 'react';
import { ImagePlus, Wallpaper, Eye, EyeOff, Share2 } from 'lucide-react';
import { SanctuaryLang, SANCTUARY_TRANSLATIONS } from '@/constants/sanctuaryI18n';

export interface BottomActionBarProps {
  /** 에셋 추가 바텀시트 열기 */
  onOpenAddDrawer: () => void;
  /** 배경 이미지 파일 선택 시 콜백 */
  onChangeBackgroundFile?: (file: File) => void;
  /** 미리보기 모드 토글 콜백 */
  onTogglePreview?: () => void;
  /** 현재 미리보기 모드 활성화 여부 */
  isPreviewMode?: boolean;
  /** 공유 버튼 클릭 시 콜백 */
  onShare?: () => void;
  /** 커스텀 클래스 */
  className?: string;
  /** 글로벌 언어 ('ko' | 'en') */
  lang?: SanctuaryLang;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  onOpenAddDrawer,
  onChangeBackgroundFile,
  onTogglePreview,
  isPreviewMode = false,
  onShare,
  className = '',
  lang = 'ko'
}) => {
  const t = SANCTUARY_TRANSLATIONS[lang];
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onChangeBackgroundFile) {
      onChangeBackgroundFile(file);
    }
    // 동일한 파일 재선택 허용
    e.target.value = '';
  };

  return (
    <>
      {/* 숨겨진 배경 이미지 업로드 input */}
      <input
        ref={bgInputRef}
        type="file"
        accept="image/*"
        onChange={handleBgFileChange}
        className="hidden"
      />

      {/* 모바일 하단 중앙 플로팅 머티리얼 3 알약 바 */}
      <nav
        aria-label="캔버스 플로팅 툴바"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[94vw] sm:max-w-md w-max bg-[#153328]/90 text-white backdrop-blur-xl rounded-full p-1.5 shadow-[0_12px_36px_-6px_rgba(21,51,40,0.45)] border border-white/20 flex items-center gap-1 sm:gap-2 select-none animate-in fade-in slide-in-from-bottom-4 duration-200 ${className}`}
      >
        {/* 1. [📷 에셋 추가] 버튼 */}
        <button
          type="button"
          onClick={onOpenAddDrawer}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F59E0B] text-[#153328] font-semibold text-[13px] shadow-sm hover:bg-[#fbbf24] active:scale-95 transition-all cursor-pointer"
          title={t.btnAddAsset}
        >
          <ImagePlus size={16} strokeWidth={2.5} />
          <span>{t.btnAddAsset}</span>
        </button>

        <div className="w-px h-4 bg-white/20 my-auto" />

        {/* 2. [🖼️ 배경 변경] 버튼 */}
        <button
          type="button"
          onClick={() => bgInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 text-[13px] font-medium active:scale-95 transition-all cursor-pointer"
          title={t.btnChangeBg}
        >
          <Wallpaper size={16} />
          <span>{t.btnChangeBg}</span>
        </button>

        <div className="w-px h-4 bg-white/20 my-auto" />

        {/* 3. [👁️ 미리보기 / 편집] 버튼 */}
        {onTogglePreview && (
          <button
            type="button"
            onClick={onTogglePreview}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-medium transition-all active:scale-95 cursor-pointer ${
              isPreviewMode
                ? 'bg-white/20 text-[#F59E0B] font-semibold'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
            title={isPreviewMode ? t.modeEdit : t.modePreview}
          >
            {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{isPreviewMode ? (lang === 'en' ? 'Edit' : '편집') : (lang === 'en' ? 'Visit' : '미리보기')}</span>
          </button>
        )}

        {/* 4. [공유] 버튼 */}
        {onShare && (
          <button
            type="button"
            onClick={onShare}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
            title={t.btnShare}
          >
            <Share2 size={16} />
          </button>
        )}
      </nav>
    </>
  );
};

export default BottomActionBar;
