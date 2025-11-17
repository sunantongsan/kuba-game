export interface Mission {
  id: string;
  title: string;
  description: string;
  rewardKuba: number;
  rewardHits: number;
  link: string;
}

export interface GameState {
  kubaBalance: number;
  dailyHitsLeft: number;
  lastPlayDate: string | null;
  adsWatchedToday: number;
  completedMissions: string[];
  userId: string;
  isReferred: boolean;
}

export type NotificationType = 'success' | 'error' | 'info' | 'special';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export interface FloatingNumber {
  id: number;
  amount: number;
  isGrandPrize: boolean;
}
