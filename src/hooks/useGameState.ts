import { useState, useEffect, useCallback } from 'react';
import { GameState } from '../types';
import { DAILY_HITS_LIMIT, GRAND_PRIZE_KUBA, ADS_FOR_GRAND_PRIZE_ELIGIBILITY, GRAND_PRIZE_CHANCE, INVITE_REWARD_KUBA } from '../constants';

const GAME_STATE_KEY = 'kubaHitGameState';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    kubaBalance: 0,
    dailyHitsLeft: DAILY_HITS_LIMIT,
    lastPlayDate: null,
    adsWatchedToday: 0,
    completedMissions: [],
    userId: '',
    isReferred: false,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(GAME_STATE_KEY);
      const today = getTodayDateString();
      if (savedState) {
        const parsedState: GameState = JSON.parse(savedState);

        if (parsedState.lastPlayDate !== today) {
          // New day, reset daily stats
          parsedState.lastPlayDate = today;
          parsedState.dailyHitsLeft = DAILY_HITS_LIMIT;
          parsedState.adsWatchedToday = 0;
        }
        setGameState(parsedState);
      } else {
        // First time playing
        const newUserId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        let initialKuba = 0;
        let referred = false;

        const urlParams = new URLSearchParams(window.location.search);
        const refId = urlParams.get('ref');
        
        if (refId) {
          initialKuba = INVITE_REWARD_KUBA;
          referred = true;
        }

        setGameState(prevState => ({
          ...prevState,
          lastPlayDate: today,
          userId: newUserId,
          kubaBalance: initialKuba,
          isReferred: referred,
        }));
      }
    } catch (error) {
      console.error("Failed to load game state:", error);
      // Fallback to default state
      const newUserId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      setGameState(prevState => ({
        ...prevState,
        lastPlayDate: getTodayDateString(),
        userId: newUserId,
      }));
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
        try {
            localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
        } catch (error) {
            console.error("Failed to save game state:", error);
        }
    }
  }, [gameState, isInitialized]);
  
  const handleHit = useCallback(() => {
    if (gameState.dailyHitsLeft <= 0) {
      return { amount: 0, isGrandPrize: false };
    }

    let isGrandPrize = false;
    // Reward is random, up to 1000. Let's do 100-1000.
    let rewardAmount = Math.floor(Math.random() * 901) + 100;

    // Check for grand prize eligibility and chance
    // User must watch MORE than 20 ads.
    if (gameState.adsWatchedToday > ADS_FOR_GRAND_PRIZE_ELIGIBILITY && Math.random() < GRAND_PRIZE_CHANCE) {
      isGrandPrize = true;
      rewardAmount = GRAND_PRIZE_KUBA;
    }

    setGameState(prevState => ({
      ...prevState,
      dailyHitsLeft: prevState.dailyHitsLeft - 1,
      kubaBalance: prevState.kubaBalance + rewardAmount,
    }));
    
    return { amount: rewardAmount, isGrandPrize };
  }, [gameState]);

  const watchAd = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      dailyHitsLeft: prevState.dailyHitsLeft + 1,
      adsWatchedToday: prevState.adsWatchedToday + 1,
    }));
  }, []);

  const completeMission = useCallback((rewardKuba: number, rewardHits: number, missionId: string) => {
    if (gameState.completedMissions.includes(missionId)) return;

    setGameState(prevState => ({
      ...prevState,
      kubaBalance: prevState.kubaBalance + rewardKuba,
      dailyHitsLeft: prevState.dailyHitsLeft + rewardHits,
      completedMissions: [...prevState.completedMissions, missionId],
    }));
  }, [gameState.completedMissions]);

  return {
    gameState,
    isInitialized,
    handleHit,
    watchAd,
    completeMission,
  };
};
