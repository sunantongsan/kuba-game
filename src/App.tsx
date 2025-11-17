import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { GameCharacter } from './components/GameCharacter';
import { Actions } from './components/Actions';
import { MissionsModal } from './components/MissionsModal';
import { Notification } from './components/Notification';
import { useGameState } from './hooks/useGameState';
import { Notification as NotificationData, FloatingNumber } from './types';
// Fix: Import INVITE_REWARD_KUBA from constants to resolve reference error.
import { INVITE_REWARD_KUBA } from './constants';

export default function App() {
  const { gameState, isInitialized, handleHit, watchAd, completeMission } = useGameState();
  const [isHitting, setIsHitting] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);

  const addNotification = useCallback((message: string, type: NotificationData['type'] = 'info') => {
    const newNotif = { id: Date.now(), message, type };
    setNotifications(current => [...current, newNotif]);
  }, []);
  
  const dismissNotification = useCallback((id: number) => {
    setNotifications(current => current.filter(n => n.id !== id));
  }, []);

  const onHitCharacter = useCallback(() => {
    if (gameState.dailyHitsLeft <= 0 || isHitting) return;

    setIsHitting(true);
    const { amount, isGrandPrize } = handleHit();
    
    if (amount > 0) {
        const newFloatingNumber = { id: Date.now(), amount, isGrandPrize };
        setFloatingNumbers(current => [...current, newFloatingNumber]);
        setTimeout(() => {
            setFloatingNumbers(current => current.filter(fn => fn.id !== newFloatingNumber.id));
        }, 2000);
        
        if (isGrandPrize) {
          addNotification(`🎉 GRAND PRIZE! You won ${amount.toLocaleString()} KUBA! 🎉`, 'special');
        } else {
          // Do not show notification for every hit to avoid spam
          // addNotification(`You got ${amount} KUBA!`, 'success');
        }
    }

    setTimeout(() => setIsHitting(false), 200);
  }, [gameState.dailyHitsLeft, isHitting, handleHit, addNotification]);

  useEffect(() => {
    if (isInitialized && gameState.dailyHitsLeft <= 0) {
      addNotification('No hits left! Watch an ad for more.', 'error');
    }
  }, [isInitialized, gameState.dailyHitsLeft, addNotification]);
  
  useEffect(() => {
    if (isInitialized && gameState.isReferred) {
        addNotification(`Welcome! You received ${INVITE_REWARD_KUBA.toLocaleString()} KUBA from a referral!`, 'success');
    }
  }, [isInitialized, gameState.isReferred, addNotification]);


  const onWatchAd = useCallback(() => {
    setIsAdLoading(true);
    const adFunction = (window as any).show_10111635;

    if (typeof adFunction === 'function') {
      adFunction().then(() => {
        // User reward function, executed after a successful ad view.
        watchAd();
        addNotification('+1 Hit Added!', 'success');
      }).catch((error: any) => {
        console.error("Ad failed to show:", error);
        addNotification('Ad failed to load. Please try again.', 'error');
      }).finally(() => {
        setIsAdLoading(false);
      });
    } else {
      console.error("Ad function show_10111635 is not available.");
      addNotification('Ad feature is currently unavailable.', 'error');
      setIsAdLoading(false);
    }
  }, [watchAd, addNotification]);
  
  const handleCompleteMission = useCallback((rewardKuba: number, rewardHits: number, missionId: string) => {
    if (gameState.completedMissions.includes(missionId)) {
        addNotification('Mission already completed!', 'info');
        return;
    }
    completeMission(rewardKuba, rewardHits, missionId);
    addNotification(`Mission Complete! +${rewardKuba} KUBA, +${rewardHits} Hits`, 'success');
  }, [completeMission, addNotification, gameState.completedMissions]);

  if (!isInitialized) {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white font-bold text-2xl">
            Loading Game...
        </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-gray-900 to-indigo-900 flex flex-col font-sans overflow-hidden">
      {notifications.map(n => <Notification key={n.id} notification={n} onDismiss={dismissNotification} />)}
      
      <Header kubaBalance={gameState.kubaBalance} dailyHitsLeft={gameState.dailyHitsLeft} />

      <main className="flex-grow flex flex-col items-center justify-center relative w-full px-4">
        <GameCharacter 
          onHit={onHitCharacter} 
          isHitting={isHitting} 
          canHit={gameState.dailyHitsLeft > 0}
          floatingNumbers={floatingNumbers}
        />
      </main>

      <footer className="w-full">
        <Actions onWatchAd={onWatchAd} onOpenMissions={() => setShowMissions(true)} isAdLoading={isAdLoading} />
      </footer>
      
      <MissionsModal 
        isOpen={showMissions} 
        onClose={() => setShowMissions(false)}
        completedMissions={gameState.completedMissions}
        onCompleteMission={handleCompleteMission}
        userId={gameState.userId}
      />
    </div>
  );
}
