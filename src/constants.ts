import { Mission } from './types';

export const MISSIONS: Mission[] = [
  { id: 'follow-twitter', title: 'Follow on X', description: 'Follow our X account for updates.', rewardKuba: 500, rewardHits: 2, link: 'https://x.com/KubacoinAirdrop' },
  { id: 'retweet-pinned', title: 'Retweet Pinned Post', description: 'Help spread the word on X.', rewardKuba: 500, rewardHits: 2, link: 'https://x.com/KubacoinAirdrop/status/1987437597522866263?s=20' },
  { id: 'join-telegram', title: 'Join Telegram Group', description: 'Join our community on Telegram.', rewardKuba: 500, rewardHits: 2, link: 'https://t.me/+gzmYsT0sBjRmMzg1' },
];

export const DAILY_HITS_LIMIT = 5;
export const GRAND_PRIZE_KUBA = 10000;
export const ADS_FOR_GRAND_PRIZE_ELIGIBILITY = 20;
export const INVITE_REWARD_KUBA = 5000;
export const GRAND_PRIZE_CHANCE = 0.005; // 0.5% chance

export const CHARACTER_IMAGE_URL = 'https://i.imgur.com/gReL3s2.png'; // A friendly monster character
