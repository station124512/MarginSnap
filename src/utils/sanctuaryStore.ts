import { CanvasItemData } from '@/components/canvas';

// 기본 2.5D 자연 숲속 앰비언스 배경
export const DEFAULT_SANCTUARY_BACKGROUND =
  'https://lh3.googleusercontent.com/aida/AEtjO1UaGhtCRXLcXxhjEVbgvd74QYkPDCqHTVzx1uGFZWapAueYXBMCs4Xi8q8bscXeG67FE66D8qR4LNhiyrgrql5f5Q-CYn4u51BA7RwbIU1ctb-Yzjqn3o4-ycR2K42f-vS21r_zSKA7TUuvWBVtXzR-FGUy9TCDgfKudsZuK9xi6MGGFwa1APcrcAA0Hcuzj0bLi0k5PoUTtwnUqzO_mdEt-i3SqJ6ZpAy70eeDeHsAxoAke3yKJXYst7U';

// 故 김아서 님 메인 초상화 에셋
export const ARTHUR_PORTRAIT_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1XyPbtNeqagFkUpL34OugiSp80sJiOYTjtERJg10btrUF01-Y_yXoQO06oqycgqbIqCemFdmDefW_fCqoMuKot1rrXd29yxOxSUSZeeyQiX8qmx4oOBIuueJSpX1oDzptRmynQ6mubfmRZePSFf6MwW5UYYwn00n_-OBhKd8P9ptzkUa4igcValGSDoEWJL1VBpDTFRQJ0fdEG1Sd7qCdys7JdFxNLKtGUXESOGhsMG7u4bkh_YxtxcgEA';

export const INITIAL_PRESET_ITEMS: CanvasItemData[] = [
  {
    id: 'portrait-arthur',
    mediaUrl: ARTHUR_PORTRAIT_URL,
    name: '故 김아서 님',
    x: 135,
    y: 80,
    scale: 1.05,
    rotate: 0,
    zIndex: 10,
    isLocked: false,
    soundUrl: 'memorial-voice'
  },
  {
    id: 'card-memory',
    mediaUrl: 'card-sample',
    name: '추모 카드',
    x: 25,
    y: 40,
    scale: 0.95,
    rotate: -4,
    zIndex: 12,
    isLocked: false,
    type: 'card',
    text: '늘 기억합니다. 편히 쉬세요 — 민준',
    sender: '민준',
    cardTheme: 'cream'
  },
  {
    id: 'sticker-coffee',
    mediaUrl: '☕',
    name: '달달한 믹스커피',
    x: 45,
    y: 220,
    scale: 1,
    rotate: -6,
    zIndex: 11,
    isLocked: false
  },
  {
    id: 'sticker-sunglasses',
    mediaUrl: '🕶️',
    name: '멋쟁이 선글라스',
    x: 235,
    y: 110,
    scale: 0.95,
    rotate: 8,
    zIndex: 13,
    isLocked: false
  },
  {
    id: 'sticker-game',
    mediaUrl: '🎮',
    name: '레트로 게임기',
    x: 225,
    y: 230,
    scale: 1.05,
    rotate: 10,
    zIndex: 9,
    isLocked: false
  },
  {
    id: 'sticker-paw',
    mediaUrl: '🐾',
    name: '사랑스런 발자국',
    x: 140,
    y: 260,
    scale: 0.9,
    rotate: -12,
    zIndex: 8,
    isLocked: false
  }
];

export interface GuestTribute {
  id: string;
  sender: string;
  text: string;
  flowerEmoji?: string;
  createdAt: string;
}

export interface SanctuaryData {
  id: string;
  name: string;
  years: string;
  description: string;
  background: string;
  mood: 'morning' | 'sunset' | 'night';
  items: CanvasItemData[];
  guestTributes: GuestTribute[];
}

const STORAGE_KEY_PREFIX = 'sanctuary_space_';

export const getSanctuary = (id: string = 'arthur'): SanctuaryData => {
  if (typeof window === 'undefined') {
    return getDefaultSanctuary(id);
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load sanctuary from storage:', e);
  }
  return getDefaultSanctuary(id);
};

export const saveSanctuary = (data: SanctuaryData): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${data.id}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save sanctuary to storage:', e);
  }
};

export const getDefaultSanctuary = (id: string): SanctuaryData => {
  if (id === 'bori') {
    return {
      id: 'bori',
      name: '사랑하는 반려견 보리',
      years: '2012 — 2023',
      description: '언제나 꼬리를 흔들며 따뜻한 온기로 우리 가족을 안아주던 소중한 막내 보리.',
      background: DEFAULT_SANCTUARY_BACKGROUND,
      mood: 'sunset',
      items: [
        {
          id: 'portrait-bori',
          mediaUrl: '🐕',
          name: '보리',
          x: 140,
          y: 90,
          scale: 1.1,
          rotate: 0,
          zIndex: 10,
          isLocked: false
        },
        {
          id: 'sticker-paw-1',
          mediaUrl: '🐾',
          name: '작은 발자국',
          x: 70,
          y: 200,
          scale: 1,
          rotate: -10,
          zIndex: 9,
          isLocked: false
        },
        {
          id: 'sticker-tennis',
          mediaUrl: '🎾',
          name: '제일 좋아하던 테니스공',
          x: 230,
          y: 210,
          scale: 1.05,
          rotate: 15,
          zIndex: 8,
          isLocked: false
        },
        {
          id: 'card-bori',
          mediaUrl: 'card-media',
          name: '언니가',
          x: 40,
          y: 50,
          scale: 0.95,
          rotate: -3,
          zIndex: 12,
          isLocked: false,
          type: 'card',
          text: '보리야, 무지개다리 너머에서 마음껏 뛰어놀고 있어. 영원히 사랑해.',
          sender: '언니가',
          cardTheme: 'rose'
        }
      ],
      guestTributes: [
        {
          id: 'trib-1',
          sender: '이웃 삼촌',
          text: '산책길에 항상 꼬리 흔들어주던 모습 잊지 못할 거야.',
          flowerEmoji: '🌸',
          createdAt: '2024.10.15'
        }
      ]
    };
  }

  // 기본 김아서 님
  return {
    id: 'arthur',
    name: '故 김아서 님',
    years: '1952 — 2024',
    description: '따뜻한 믹스커피와 옛 노래, 그리고 가족들의 웃음을 가장 아끼셨던 분.',
    background: DEFAULT_SANCTUARY_BACKGROUND,
    mood: 'morning',
    items: INITIAL_PRESET_ITEMS,
    guestTributes: [
      {
        id: 'trib-arthur-1',
        sender: '오랜 친구 상호',
        text: '아서야, 그곳에서도 좋아하던 옛 가요 들으며 편히 쉬게나.',
        flowerEmoji: '💐',
        createdAt: '2024.10.20'
      }
    ]
  };
};

